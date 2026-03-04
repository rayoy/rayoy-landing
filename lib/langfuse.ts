import { LangfuseClient } from '@langfuse/client';

// ─── Singleton ──────────────────────────────────────────────────────────

let _client: LangfuseClient | null = null;

export function getLangfuseClient(): LangfuseClient | null {
    if (!process.env.LANGFUSE_SECRET_KEY || !process.env.LANGFUSE_PUBLIC_KEY) {
        return null; // Graceful degradation — runs without LangFuse when keys are missing
    }

    if (!_client) {
        _client = new LangfuseClient({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_BASE_URL || 'https://cloud.langfuse.com',
        });
    }
    return _client;
}

// ─── Prompt Cache (60s TTL) ─────────────────────────────────────────────

interface CachedPrompt {
    compiledText: string;
    fetchedAt: number;
}

const CACHE_TTL_MS = 60_000;
const promptCache = new Map<string, CachedPrompt>();

/**
 * Fetch a prompt from LangFuse, compile it with the given variables,
 * and cache the result for 60 seconds.
 *
 * Falls back to `fallback` string if LangFuse is not configured or fails.
 */
export async function getPrompt(
    name: string,
    variables: Record<string, string>,
    fallback: string,
): Promise<string> {
    const cacheKey = `${name}:${JSON.stringify(variables)}`;

    // Check cache
    const cached = promptCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
        return cached.compiledText;
    }

    const client = getLangfuseClient();
    if (!client) {
        return compileFallback(fallback, variables);
    }

    try {
        const prompt = await client.prompt.get(name, { type: 'text' });
        const compiled = prompt.compile(variables);

        promptCache.set(cacheKey, { compiledText: compiled, fetchedAt: Date.now() });
        return compiled;
    } catch (err) {
        console.error(`[LangFuse] Failed to fetch prompt "${name}", using fallback:`, err);
        return compileFallback(fallback, variables);
    }
}

/**
 * Fetch a chat-type prompt (returns message array).
 * Falls back to a simple system+user message pair.
 */
export async function getChatPrompt(
    name: string,
    variables: Record<string, string>,
    fallbackSystem: string,
    fallbackUser?: string,
): Promise<Array<{ role: string; content: string }>> {
    const client = getLangfuseClient();
    if (!client) {
        const msgs: Array<{ role: string; content: string }> = [
            { role: 'system', content: compileFallback(fallbackSystem, variables) },
        ];
        if (fallbackUser) {
            msgs.push({ role: 'user', content: compileFallback(fallbackUser, variables) });
        }
        return msgs;
    }

    try {
        const prompt = await client.prompt.get(name, { type: 'chat' });
        return prompt.compile(variables) as Array<{ role: string; content: string }>;
    } catch (err) {
        console.error(`[LangFuse] Failed to fetch chat prompt "${name}", using fallback:`, err);
        const msgs: Array<{ role: string; content: string }> = [
            { role: 'system', content: compileFallback(fallbackSystem, variables) },
        ];
        if (fallbackUser) {
            msgs.push({ role: 'user', content: compileFallback(fallbackUser, variables) });
        }
        return msgs;
    }
}

// ─── Helpers ────────────────────────────────────────────────────────────

/**
 * Simple mustache-style variable replacement: {{varName}} → value
 */
function compileFallback(template: string, variables: Record<string, string>): string {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] ?? '');
}
