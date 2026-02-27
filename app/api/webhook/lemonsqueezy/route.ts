import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyWebhookSignature } from '@/lib/lemonsqueezy';

// Known variant IDs
const VARIANT_REPORT_UNLOCK = '1347035';
const VARIANT_PLUS = '1347044';
const VARIANT_PRO = '1347053';
const VARIANT_ULTRA = '1347056';

/**
 * LemonSqueezy webhook handler.
 * Handles subscription events + one-time report purchases.
 */
export async function POST(req: Request) {
    const rawBody = await req.text();
    const signature = req.headers.get('x-signature') || '';

    // Verify signature
    try {
        const isValid = await verifyWebhookSignature(rawBody, signature);
        if (!isValid) {
            console.error('Invalid LemonSqueezy webhook signature');
            return new NextResponse('Invalid signature', { status: 401 });
        }
    } catch (error) {
        console.error('Webhook verification error:', error);
        return new NextResponse('Verification failed', { status: 500 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;
    const customData = payload.meta?.custom_data;
    const userId = customData?.user_id;

    if (!userId) {
        console.error('No user_id in webhook custom_data');
        return new NextResponse('Missing user_id', { status: 400 });
    }

    const attrs = payload.data?.attributes || {};

    try {
        switch (eventName) {
            case 'order_created': {
                // Check variant to distinguish one-time report vs subscription order
                const variantId = String(
                    attrs.first_order_item?.variant_id || attrs.variant_id || ''
                );

                if (variantId === VARIANT_REPORT_UNLOCK) {
                    // One-time report unlock
                    const { error } = await supabaseAdmin
                        .from('users')
                        .update({ report_unlocked: true })
                        .eq('id', userId);

                    if (error) {
                        console.error('Report unlock DB error:', error);
                        throw error;
                    }
                    console.log(`User ${userId} unlocked premium report`);
                } else {
                    // Subscription-tied order — determine plan
                    const plan = getPlanFromVariant(variantId);
                    const credits = getCreditsForPlan(plan);

                    const { error } = await supabaseAdmin
                        .from('users')
                        .update({
                            plan,
                            credits,
                            ls_customer_id: String(attrs.customer_id || ''),
                        })
                        .eq('id', userId);

                    if (error) {
                        console.error('DB update error:', error);
                        throw error;
                    }
                    console.log(`User ${userId} upgraded to ${plan} via order`);
                }
                break;
            }

            case 'subscription_created': {
                const variantId = String(attrs.variant_id || '');
                const plan = getPlanFromVariant(variantId);
                const credits = getCreditsForPlan(plan);

                const { error } = await supabaseAdmin
                    .from('users')
                    .update({
                        plan,
                        credits,
                        ls_customer_id: String(attrs.customer_id || ''),
                        ls_subscription_id: String(payload.data?.id || ''),
                    })
                    .eq('id', userId);

                if (error) {
                    console.error('DB update error:', error);
                    throw error;
                }

                console.log(`User ${userId} subscribed to ${plan}`);
                break;
            }

            case 'subscription_updated': {
                const status = attrs.status;
                if (status === 'active') {
                    const variantId = String(attrs.variant_id || '');
                    const plan = getPlanFromVariant(variantId);
                    const credits = getCreditsForPlan(plan);

                    await supabaseAdmin
                        .from('users')
                        .update({ credits, plan })
                        .eq('id', userId);
                }
                break;
            }

            case 'subscription_cancelled':
            case 'subscription_expired': {
                const { error } = await supabaseAdmin
                    .from('users')
                    .update({
                        plan: 'free',
                        credits: 0,
                        ls_subscription_id: null,
                    })
                    .eq('id', userId);

                if (error) console.error('Downgrade error:', error);
                console.log(`User ${userId} downgraded to free`);
                break;
            }

            default:
                console.log(`Unhandled LemonSqueezy event: ${eventName}`);
        }
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new NextResponse('Processing failed', { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}

function getPlanFromVariant(variantId: string): string {
    switch (variantId) {
        case VARIANT_PLUS:
            return 'plus';
        case VARIANT_PRO:
            return 'pro';
        case VARIANT_ULTRA:
            return 'ultra';
        default:
            return 'plus'; // fallback
    }
}

function getCreditsForPlan(plan: string): number {
    switch (plan) {
        case 'plus':
            return 10;
        case 'pro':
        case 'ultra':
            return 9999;
        default:
            return 0;
    }
}
