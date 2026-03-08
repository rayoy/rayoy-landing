import { google } from '@ai-sdk/google';
import { generateText, streamText } from 'ai';

// Text Models
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const googleModel = () => google('models/gemini-2.0-flash') as any;
const KIMI_MODEL = 'kimi-k2.5';
const XIAOCHI_MODEL = 'gemini-3-flash';
const VECTOR_TEXT_MODEL = 'gemini-3-flash-preview';
const VECTOR_IMAGE_MODEL = 'gemini-3.1-flash-image-preview';

// Proxy Configurations
const KIMI_URL = 'https://api.kimi.com/coding/v1/chat/completions';
const KIMI_KEY = () => process.env.KIMI_API_KEY || '';

const XIAOCHI_URL = 'https://llm.xiaochisaas.com/v1/chat/completions';
const XIAOCHI_KEY = () => process.env.GEMINI_PROXY_API_KEY || '';

const VECTOR_TEXT_URL = `https://api.vectorengine.ai/v1beta/models/${VECTOR_TEXT_MODEL}:generateContent`;
const VECTOR_IMAGE_URL = `https://api.vectorengine.ai/v1beta/models/${VECTOR_IMAGE_MODEL}:generateContent`;
const VECTOR_KEY = () => process.env.VECTOR_PROXY_API_KEY || '';

function isQuotaError(err: any): boolean {
    const msg = String(err?.message || err?.lastError?.message || '');
    const status = err?.statusCode || err?.data?.error?.code;
    return (
        status === 429 ||
        status === 403 ||
        msg.includes('quota') ||
        msg.includes('RESOURCE_EXHAUSTED') ||
        msg.includes('maxRetriesExceeded') ||
        msg.includes('ECONNRESET') ||
        err?.name === 'AI_APICallError'
    );
}

/**
 * Raw fetch to Kimi / Moonshot AI (OpenAI-compatible format)
 */
async function proxyGenerateTextKimi(system: string, prompt: string): Promise<string> {
    const res = await fetch(KIMI_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${KIMI_KEY()}`,
        },
        body: JSON.stringify({
            model: KIMI_MODEL,
            messages: [
                { role: 'system', content: system },
                { role: 'user', content: prompt },
            ],
            temperature: 0,
        }),
    });

    if (!res.ok) throw new Error(`Kimi error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
}

/**
 * Raw fetch to Xiaochi proxy (OpenAI format)
 */
async function proxyGenerateTextXiaochi(system: string, prompt: string): Promise<string> {
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

    if (!res.ok) throw new Error(`Xiaochi error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.choices?.[0]?.message?.content || '';
}

/**
 * Raw fetch to VectorEngine proxy (Native Gemini REST format)
 */
async function proxyGenerateTextVector(system: string, prompt: string): Promise<string> {
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

    if (!res.ok) throw new Error(`Vector error ${res.status}: ${await res.text()}`);
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
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
        const parts = data.candidates?.[0]?.content?.parts || [];
        // Gemini image models return inlineData with mimeType 'image/png' or 'image/jpeg'
        const imagePart = parts.find((p: any) => p.inlineData?.mimeType?.startsWith('image/'));
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
 * Fallback orchestrator: Kimi → VectorEngine → Xiaochi
 */
async function generateTextProxyCascade(system: string, prompt: string): Promise<string> {
    // 1. Try Kimi first (OpenAI-compatible)
    if (KIMI_KEY()) {
        try {
            console.warn('[AI Fallback] Trying Kimi (Moonshot)...');
            return await proxyGenerateTextKimi(system, prompt);
        } catch (e) {
            console.error('[AI Fallback] Kimi failed:', e);
        }
    }

    // 2. Try VectorEngine (Native Gemini format)
    if (VECTOR_KEY()) {
        try {
            console.warn('[AI Fallback] Trying VectorEngine Proxy text model...');
            return await proxyGenerateTextVector(system, prompt);
        } catch (e) {
            console.error('[AI Fallback] VectorEngine failed:', e);
        }
    }

    // 3. Fallback to Xiaochi (OpenAI format)
    if (XIAOCHI_KEY()) {
        console.warn('[AI Fallback] Trying Xiaochi Proxy text model...');
        return await proxyGenerateTextXiaochi(system, prompt);
    }

    throw new Error('All AI proxies failed or not configured');
}


/**
 * generateText: Google first → Kimi → VectorEngine → Xiaochi
 * maxRetries: 0 on Google so we fail fast to fallback
 */
export async function generateTextWithFallback(
    opts: Omit<Parameters<typeof generateText>[0], 'model'>
) {
    try {
        return await generateText({ ...opts, model: googleModel(), maxRetries: 0 });
    } catch (err: any) {
        if (isQuotaError(err) || err.name === 'AI_RetryError') {
            console.warn('[AI] Google quota exceeded, initializing proxy cascade');
            const text = await generateTextProxyCascade(
                String(opts.system || ''),
                String(opts.prompt || ''),
            );
            return { text } as any;
        }
        throw err;
    }
}

/**
 * streamText: Google first → Kimi → VectorEngine → Xiaochi
 * Note: proxy fallback for stream is non-streaming (returns full text)
 */
export async function streamTextWithFallback(
    opts: Omit<Parameters<typeof streamText>[0], 'model'>
) {
    try {
        return await streamText({ ...opts, model: googleModel(), maxRetries: 0 });
    } catch (err: any) {
        if (isQuotaError(err) || err.name === 'AI_RetryError') {
            console.warn('[AI] Google quota exceeded, initializing proxy cascade (non-stream)');
            const text = await generateTextProxyCascade(
                String(opts.system || ''),
                String(opts.prompt || (opts as any).messages?.filter((m: any) => m.role === 'user').pop()?.content || ''),
            );

            // Build AI SDK Data Stream Protocol response
            // Format: text delta lines as `0:"chunk"\n`, then finish events
            const encoder = new TextEncoder();
            const chunks: string[] = [];
            // Split text into small chunks to simulate streaming
            const chunkSize = 20;
            for (let i = 0; i < text.length; i += chunkSize) {
                const chunk = text.slice(i, i + chunkSize);
                // Escape the chunk for JSON string
                const escaped = JSON.stringify(chunk);
                chunks.push(`0:${escaped}\n`);
            }
            // Finish reason event
            chunks.push(`e:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0},"isContinued":false}\n`);
            // Final data message
            chunks.push(`d:{"finishReason":"stop","usage":{"promptTokens":0,"completionTokens":0}}\n`);

            const stream = new ReadableStream({
                async start(controller) {
                    for (const chunk of chunks) {
                        controller.enqueue(encoder.encode(chunk));
                        // Small delay between chunks for visual streaming effect
                        await new Promise(r => setTimeout(r, 15));
                    }
                    controller.close();
                    // Invoke onFinish callback for conversation memory
                    if ((opts as any).onFinish) {
                        (opts as any).onFinish({
                            text,
                            finishReason: 'stop',
                            usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 },
                        });
                    }
                },
            });

            return {
                textStream: stream,
                text: Promise.resolve(text),
                toAIStreamResponse: () => new Response(stream, {
                    headers: {
                        'Content-Type': 'text/plain; charset=utf-8',
                        'X-Vercel-AI-Data-Stream': 'v1',
                    },
                }),
            } as any;
        }
        throw err;
    }
}
