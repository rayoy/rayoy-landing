import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { loadSource, root } from './load-source.mjs';

const env = { DEEPSEEK_API_KEY: 'offline-test', VECTOR_PROXY_API_KEY: 'offline-test', GEMINI_PROXY_API_KEY: 'offline-test' };
function aiSubject(sdk = {}, fetch = () => { throw new Error('Unexpected fetch'); }) {
    return loadSource('lib/ai-provider.ts', {
        mocks: {
            '@ai-sdk/google': { google: name => ({ name }) },
            ai: { generateText: () => { throw new Error('Unexpected generation'); }, streamText: () => { throw new Error('Unexpected streaming'); }, ...sdk },
            '@/lib/langfuse': { createTrace: () => null },
        },
        globals: { process: { env }, fetch },
    });
}

test('Google success uses the installed model and never invokes a proxy', async () => {
    const subject = aiSubject({ generateText: async options => {
        assert.equal(options.model.name, 'models/gemini-2.0-flash');
        assert.equal(options.maxRetries, 0);
        assert.equal(options.prompt, 'offline fixture');
        return { text: 'google answer' };
    } });
    assert.equal((await subject.generateTextWithFallback({ prompt: 'offline fixture' })).text, 'google answer');
});

test('quota fallback keeps DeepSeek → VectorEngine → Xiaochi order and request shapes', async () => {
    const calls = [];
    const subject = aiSubject({ generateText: async () => { throw { statusCode: 429 }; } }, async (url, options) => {
        calls.push({ url, body: JSON.parse(options.body) });
        if (calls.length < 3) return new Response('offline failure', { status: 503 });
        return Response.json({ choices: [{ message: { content: 'fallback answer' } }] });
    });
    assert.equal((await subject.generateTextWithFallback({ system: 'rules', prompt: 'question' })).text, 'fallback answer');
    assert.deepEqual(calls.map(call => new URL(call.url).hostname), ['api.deepseek.com', 'api.vectorengine.ai', 'llm.xiaochisaas.com']);
    assert.deepEqual(calls[0].body.messages, [{ role: 'system', content: 'rules' }, { role: 'user', content: 'question' }]);
    assert.equal(calls[1].body.contents[0].parts[0].text, 'question');
    assert.equal(calls[2].body.temperature, 0);
});

test('non-quota errors are rethrown, including non-Error throws', async () => {
    for (const failure of [new Error('ordinary failure'), 'ordinary failure', null]) {
        const subject = aiSubject({ generateText: async () => { throw failure; } });
        let thrown = false;
        try { await subject.generateTextWithFallback({ prompt: 'fixture' }); }
        catch (error) { thrown = true; assert.equal(error, failure); }
        assert.equal(thrown, true);
    }
});

test('quota classifications preserve SDK and nested retry shapes', () => {
    const { isQuotaError } = aiSubject();
    for (const error of [{ statusCode: 429 }, { statusCode: 403 }, { data: { error: { code: 429 } } }, { lastError: { message: 'RESOURCE_EXHAUSTED' } }, { name: 'AI_APICallError' }, { message: 'ECONNRESET' }]) assert.equal(isQuotaError(error), true);
    for (const error of [null, undefined, 'unrelated', { statusCode: 500 }]) assert.equal(isQuotaError(error), false);
});

test('stream fallback preserves AI SDK v4 framing and completion callback', async () => {
    const answer = 'offline 中文 response with more than twenty characters';
    let finish;
    const subject = aiSubject({ streamText: () => { throw new Error('quota exhausted'); } }, async (url, options) => {
        assert.equal(new URL(url).hostname, 'api.deepseek.com');
        assert.equal(JSON.parse(options.body).messages[1].content, 'latest question');
        return Response.json({ choices: [{ message: { content: answer } }] });
    });
    const stream = await subject.streamTextWithFallback({ messages: [{ role: 'user', content: 'older' }, { role: 'user', content: 'latest question' }], onFinish: event => { finish = event; } });
    const response = stream.toDataStreamResponse();
    assert.equal(response.headers.get('X-Vercel-AI-Data-Stream'), 'v1');
    const frames = (await response.text()).trim().split('\n');
    assert.ok(frames.every(frame => frame.startsWith('0:')));
    assert.equal(frames.map(frame => JSON.parse(frame.slice(2))).join(''), answer);
    assert.equal(finish.text, answer);
    assert.equal(finish.finishReason, 'stop');
    assert.equal(finish.usage.totalTokens, 0);
});

test('image response selection preserves inline image data without a real request', async () => {
    const subject = aiSubject({}, async () => Response.json({ candidates: [{ content: { parts: [{ text: 'caption' }, { inlineData: { mimeType: 'image/png', data: 'fixture' } }] } }] }));
    assert.equal(await subject.proxyGenerateImage('offline'), 'data:image/png;base64,fixture');
});

test('locale store preserves default, all saved languages, notification and unsubscribe', () => {
    let cookie = '';
    let cookieWrite = '';
    const document = {
        get cookie() { return cookie; },
        set cookie(value) { cookieWrite = value; cookie = value.split(';')[0]; },
    };
    const window = new EventTarget();
    const store = loadSource('lib/locale-store.ts', { globals: { document, window } });
    assert.equal(store.getServerLocaleSnapshot(), 'zh-CN');
    assert.equal(store.getLocaleSnapshot(), 'zh-CN');
    let updates = 0;
    const unsubscribe = store.subscribeLocale(() => { updates++; });
    for (const locale of ['en', 'zh-TW', 'zh-CN']) {
        store.setLocaleCookie(locale);
        assert.equal(store.getLocaleSnapshot(), locale);
        assert.match(cookieWrite, /;path=\/;max-age=31536000$/);
    }
    assert.equal(updates, 3);
    unsubscribe();
    store.setLocaleCookie('en');
    assert.equal(updates, 3);
    assert.equal(store.localeFromCookie('other=value; locale=zh-TW; another=x'), 'zh-TW');
    assert.equal(store.localeFromCookie('locale=invalid'), 'zh-CN');
});

test('Bazi and Ziwei output matches the pre-fix baseline at a fixed date', () => {
    const { calculateFusionChart } = loadSource('lib/fusion.ts');
    const fixtures = JSON.parse(fs.readFileSync(path.join(root, 'tests/chart-baseline.json'), 'utf8'));
    for (const fixture of fixtures) {
        const chart = calculateFusionChart(...fixture.input);
        const digest = createHash('sha256').update(JSON.stringify(chart)).digest('hex');
        assert.equal(digest, fixture.sha256, JSON.stringify(fixture.input));
    }
});

test('Langfuse without credentials does not send and compiles fallback templates', async () => {
    const subject = loadSource('lib/langfuse.ts', { mocks: { '@langfuse/client': { LangfuseClient: class { constructor() { throw new Error('Unexpected client creation'); } } } } });
    assert.equal(subject.createTrace('offline', { input: 'fixture' }), null);
    assert.equal(await subject.getPrompt('offline', { name: 'reader' }, 'Hello {{name}} {{missing}}'), 'Hello reader ');
});

test('production build stops before later stages whenever a mandatory check fails', () => {
    const { scripts } = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
    assert.equal(scripts.lint, 'eslint --max-warnings=0');
    const stages = ['run lint', 'run typecheck', 'test'];
    // Substitute local shell functions, so this exercises the real command chain
    // without launching builds, package managers, or external services.
    const shell = `npm() { printf '%s\\n' "$*"; test "$*" != "$FAIL_STAGE"; }; next() { echo next-build; }; ${scripts.build}`;
    for (const [index, failed] of stages.entries()) {
        const result = spawnSync('/bin/sh', ['-c', shell], { encoding: 'utf8', env: { FAIL_STAGE: failed } });
        assert.notEqual(result.status, 0);
        assert.deepEqual(result.stdout.trim().split('\n'), stages.slice(0, index + 1));
    }
    const success = spawnSync('/bin/sh', ['-c', shell], { encoding: 'utf8', env: { FAIL_STAGE: '' } });
    assert.equal(success.status, 0);
    assert.deepEqual(success.stdout.trim().split('\n'), [...stages, 'next-build']);
});
