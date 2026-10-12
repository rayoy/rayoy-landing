import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';
import { asRecord, getErrorMessage } from '@/lib/errors';
import { createTrace, type LfTrace } from '@/lib/langfuse';

// Both the SDK and proxy fallback provide this completion data to callers.
type StreamFinish = Pick<Parameters<NonNullable<Parameters<typeof streamText>[0]['onFinish']>>[0], 'text' | 'finishReason' | 'usage'>;
type FallbackStreamOptions = Omit<Parameters<typeof streamText>[0], 'model' | 'onFinish'> & {
    onFinish?: (event: StreamFinish) => void | Promise<void>;
};

// Text Models
const googleModel = () => google('models/gemini-2.0-flash');
const DEEPSEEK_MODEL = 'deepseek-chat';
const XIAOCHI_MODEL = 'gemini-3-flash';
const VECTOR_TEXT_MODEL = 'gemini-3-flash-preview';
const VECTOR_IMAGE_MODEL = 'gemini-3.1-flash-image-preview';

// Proxy Configurations
const DEEPSEEK_URL = 'https://api.deepseek.com/chat/completions';
const DEEPSEEK_KEY = () => process.env.DEEPSEEK_API_KEY || '';

const XIAOCHI_URL = 'https://llm.xiaochisaas.com/v1/chat/completions';
const XIAOCHI_KEY = () => process.env.GEMINI_PROXY_API_KEY || '';

const VECTOR_TEXT_URL = `https://api.vectorengine.ai/v1beta/models/${VECTOR_TEXT_MODEL}:generateContent`;
const VECTOR_IMAGE_URL = `https://api.vectorengine.ai/v1beta/models/${VECTOR_IMAGE_MODEL}:generateContent`;
const VECTOR_KEY = () => process.env.VECTOR_PROXY_API_KEY || '';

export function isQuotaError(err: unknown): boolean {
    const error = asRecord(err);
    const msg = String(error?.message || asRecord(error?.lastError)?.message || '');
    const status = error?.statusCode || asRecord(asRecord(error?.data)?.error)?.code;
    return (
        status === 429 ||
        status === 403 ||
        msg.includes('quota') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('maxRetriesExceeded') ||
        msg.includes('ECONNRESET') ||
        error?.name === 'AI_APICallError'
    );
}

/**
 * Raw fetch to DeepSeek (OpenAI-compatible format)
 */
async function proxyGenerateTextDeepSeek(system: string, prompt: string, parentTrace?: LfTrace | null): Promise<string> {
    const span = parentTrace?.generation({
        name: 'deepseek',
        model: DEEPSEEK_MODEL,
        input: { system, prompt },
    });
    const res = await fetch(DEEPSEEK_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${DEEPSEEK_KEY()}`,
        },
        body: JSON.stringify({
            model: DEEPSEEK_MODEL,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt },
            ],
            temperature: 0,
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        span?.end({ output: errText, level: 'ERROR' });
        throw new Error(`DeepSeek error ${res.status}: ${errText}`);
    }
    const data = await res.json();
    const output = data.choices?.[0]?.message?.content || '';
    span?.end({
        output,
        usage: {
            promptTokens: data.usage?.prompt_tokens,
            completionTokens: data.usage?.completion_tokens,
        },
    });
    return output;
}

/**
 * Raw fetch to Xiaochi proxy (OpenAI format)
 */
async function proxyGenerateTextXiaochi(system: string, prompt: string, parentTrace?: LfTrace | null): Promise<string> {
    const span = parentTrace?.generation({
        name: 'xiaochi',
        model: XIAOCHI_MODEL,
        input: { system, prompt },
    });
    const res = await fetch(XIAOCHI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${XIAOCHI_KEY()}`,
        },
        body: JSON.stringify({
            model: XIAOCHI_MODEL,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt },
            ],
            temperature: 0,
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        span?.end({ output: errText, level: 'ERROR' });
        throw new Error(`Xiaochi error ${res.status}: ${errText}`);
    }
    const data = await res.json();
    const output = data.choices?.[0]?.message?.content || '';
    span?.end({
        output,
        usage: {
            promptTokens: data.usage?.prompt_tokens,
            completionTokens: data.usage?.completion_tokens,
        },
    });
    return output;
}

/**
 * Raw fetch to VectorEngine proxy (Native Gemini REST format)
 */
async function proxyGenerateTextVector(system: string, prompt: string, parentTrace?: LfTrace | null): Promise<string> {
    const span = parentTrace?.generation({
        name: 'vectorengine',
        model: VECTOR_TEXT_MODEL,
        input: { system, prompt },
    });
    const res = await fetch(VECTOR_TEXT_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${VECTOR_KEY()}`,
        },
        body: JSON.stringify({
            systemInstruction: {
                parts: [{ text: system }]
            },
            contents: [{
                parts: [{ text: prompt }]
            }],
            generationConfig: {
                temperature: 0,
            }
        }),
    });

    if (!res.ok) {
        const errText = await res.text();
        span?.end({ output: errText, level: 'ERROR' });
        throw new Error(`Vector error ${res.status}: ${errText}`);
    }
    const data = await res.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    span?.end({ output });
    return output;
}

/**
 * Image generation via VectorEngine (Native Gemini format)
 */
export async function proxyGenerateImage(prompt: string): Promise<string | null> {
    if (!VECTOR_KEY()) return null;
    try {
        const res = await fetch(VECTOR_IMAGE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${VECTOR_KEY()}`,
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            }),
        });

        if (!res.ok) {
            console.error('[AI Image] VectorEngine error:', await res.text());
            return null;
        }

        const data = await res.json();
        const parts: Array<{ inlineData?: { mimeType: string; data: string } }> = data.candidates?.[0]?.content?.parts || [];
        // Gemini image models return inlineData with mimeType 'image/png' or 'image/jpeg'
        const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith('image/'));
        if (imagePart?.inlineData) {
            return `data:${imagePart.inlineData.mimeType};base64,${imagePart.inlineData.data}`;
        }
        return null;
    } catch (e) {
        console.error('[AI Image] Generation failed:', e);
        return null;
    }
}

/**
 * Fallback orchestrator: DeepSeek → VectorEngine → Xiaochi
 */
async function generateTextProxyCascade(system: string, prompt: string, parentTrace?: LfTrace | null): Promise<string> {
    // 1. Try DeepSeek first (OpenAI-compatible)
    if (DEEPSEEK_KEY()) {
        try {
            console.warn('[AI Fallback] Trying DeepSeek...');
            return await proxyGenerateTextDeepSeek(system, prompt, parentTrace);
        } catch (e) {
            console.error('[AI Fallback] DeepSeek failed:', e);
        }
    }

    // 2. Try VectorEngine (Native Gemini format)
    if (VECTOR_KEY()) {
        try {
            console.warn('[AI Fallback] Trying VectorEngine Proxy text model...');
            return await proxyGenerateTextVector(system, prompt, parentTrace);
        } catch (e) {
            console.error('[AI Fallback] VectorEngine failed:', e);
        }
    }

    // 3. Fallback to Xiaochi (OpenAI format)
    if (XIAOCHI_KEY()) {
        console.warn('[AI Fallback] Trying Xiaochi Proxy text model...');
        return await proxyGenerateTextXiaochi(system, prompt, parentTrace);
    }

    throw new Error('All AI proxies failed or not configured');
}


/**
 * generateText: Google first → DeepSeek → VectorEngine → Xiaochi
 * maxRetries: 0 on Google so we fail fast to fallback
 */
export async function generateTextWithFallback(
    opts: Omit<Parameters<typeof generateText>[0], 'model'>
) {
    try {
        return await generateText({
            ...opts,
            model: googleModel(),
            maxRetries: 0,
        });
    } catch (err) {
        if (isQuotaError(err) || asRecord(err)?.name === 'AI_RetryError') {
            console.warn('[AI] Google quota exceeded, initializing proxy cascade');
            const trace = createTrace('generateText-fallback', {
                system: String(opts.system || '').slice(0, 200),
                prompt: String(opts.prompt || '').slice(0, 200),
                reason: getErrorMessage(err),
            });
            const text = await generateTextProxyCascade(
                String(opts.system || ''),
                String(opts.prompt || ''),
                trace,
            );
            trace?.end(text);
            return { text };
        }
        throw err;
    }
}

/**
 * streamText: Google first → DeepSeek → VectorEngine → Xiaochi
 * Note: proxy fallback for stream is non-streaming (returns full text)
 */
export async function streamTextWithFallback(
    opts: FallbackStreamOptions
): Promise<Pick<ReturnType<typeof streamText>, 'toDataStreamResponse'>> {
    try {
        const result = await streamText({
            ...opts,
            model: googleModel(),
            maxRetries: 0,
        });
        
        const response = result.toDataStreamResponse({
            getErrorMessage: (err: unknown) => getErrorMessage(err)
        });

        // Peek at the first chunk to catch asynchronous API quota errors hidden in the stream
        const [peekStream, finalStream] = response.body!.tee();
        const reader = peekStream.getReader();
        const firstChunk = await reader.read();
        
        if (!firstChunk.done) {
            const textChunk = new TextDecoder().decode(firstChunk.value);
            if (textChunk.startsWith('3:') && textChunk.includes('quota')) {
                reader.releaseLock();
                throw new Error('Google Stream Quota Exceeded: ' + textChunk);
            }
        }
        
        // We do not await the rest of peekStream, but we do need to reconstruct the response
        // so we don't consume the finalStream's chunk that we just peeked at.
        reader.releaseLock();
        
        // Re-combine the chunk we read with the rest of the stream
        const passthroughStream = new ReadableStream({
            async start(controller) {
                if (!firstChunk.done) {
                    controller.enqueue(firstChunk.value);
                }
                const passthroughReader = finalStream.getReader();
                while (true) {
                    const { done, value } = await passthroughReader.read();
                    if (done) break;
                    controller.enqueue(value);
                }
                controller.close();
            }
        });

        const streamed = {
            ...result,
            toDataStreamResponse: () => new Response(passthroughStream, { headers: response.headers })
        };
        return streamed;
        
    } catch (err) {
        if (isQuotaError(err) || getErrorMessage(err).includes('quota') || getErrorMessage(err).includes('Quota')) {
            console.warn('[AI] Google quota exceeded, initializing proxy cascade (non-stream)');
            const trace = createTrace('streamText-fallback', {
                system: String(opts.system || '').slice(0, 200),
                reason: getErrorMessage(err),
            });
            const text = await generateTextProxyCascade(
                String(opts.system || ''),
                String(opts.prompt || opts.messages?.filter((m) => m.role === 'user').pop()?.content || ''),
                trace,
            );
            trace?.end(text);
            const fallback = {
                textStream: new ReadableStream(), // Dummy interface
                text: Promise.resolve(text),
                toDataStreamResponse: () => {
                    const encoder = new TextEncoder();
                    const stream = new ReadableStream({
                        async start(controller) {
                            try {
                                const chunkSize = 20;
                                for (let i = 0; i < text.length; i += chunkSize) {
                                    const chunk = text.slice(i, i + chunkSize);
                                    controller.enqueue(encoder.encode(`0:${JSON.stringify(chunk)}\n`));
                                    await new Promise(r => setTimeout(r, 15));
                                }
                                controller.close();

                                if (opts.onFinish) {
                                    opts.onFinish({
                                        text,
                                        finishReason: 'stop',
                                        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
                                    });
                                }
                            } catch (err) {
                                console.error('[Fallback Stream Error]', err);
                                controller.enqueue(encoder.encode(`3:"Stream error"\n`));
                                controller.close();
                            }
                        }
                    });

                    return new Response(stream, {
                        headers: {
                            'Content-Type': 'text/plain; charset=utf-8',
                            'X-Vercel-AI-Data-Stream': 'v1'
                        }
                    });
                }
            };
            return fallback;
        }
        throw err;
    }
}
