/**
 * LemonSqueezy API helper.
 * Docs: https://docs.lemonsqueezy.com/api
 */

const LS_API_BASE = 'https://api.lemonsqueezy.com/v1';

function getHeaders() {
    const apiKey = process.env.LEMONSQUEEZY_API_KEY;
    if (!apiKey) throw new Error('LEMONSQUEEZY_API_KEY not set');
    return {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${apiKey}`,
    };
}

/**
 * Create a LemonSqueezy checkout session.
 * Returns the checkout URL to redirect the user to.
 */
export async function createCheckout({
    storeId,
    variantId,
    userEmail,
    userId,
    redirectUrl,
}: {
    storeId: string;
    variantId: string;
    userEmail: string;
    userId: string;
    redirectUrl?: string;
}) {
    const res = await fetch(`${LS_API_BASE}/checkouts`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({
            data: {
                type: 'checkouts',
                attributes: {
                    checkout_data: {
                        email: userEmail,
                        custom: {
                            user_id: userId,
                        },
                    },
                    checkout_options: {
                        embed: false,
                        media: false,
                    },
                    product_options: {
                        redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
                    },
                },
                relationships: {
                    store: {
                        data: {
                            type: 'stores',
                            id: storeId,
                        },
                    },
                    variant: {
                        data: {
                            type: 'variants',
                            id: variantId,
                        },
                    },
                },
            },
        }),
    });

    if (!res.ok) {
        const err = await res.text();
        console.error('LemonSqueezy checkout error:', err);
        throw new Error(`LemonSqueezy API error: ${res.status}`);
    }

    const json = await res.json();
    return json.data.attributes.url as string;
}

/**
 * Verify a LemonSqueezy webhook signature.
 */
export async function verifyWebhookSignature(
    rawBody: string,
    signature: string,
): Promise<boolean> {
    const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;
    if (!secret) throw new Error('LEMONSQUEEZY_WEBHOOK_SECRET not set');

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(rawBody));
    const digest = Array.from(new Uint8Array(sig))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    return digest === signature;
}
