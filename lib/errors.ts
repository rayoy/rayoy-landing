/** Narrow errors from SDKs, fetch, and non-Error throws without trusting their shape. */
export function asRecord(value: unknown): Record<string, unknown> | undefined {
    return value !== null && typeof value === 'object' ? value as Record<string, unknown> : undefined;
}

export function getErrorMessage(error: unknown): string {
    const message = asRecord(error)?.message;
    return typeof message === 'string' && message ? message : String(error);
}
