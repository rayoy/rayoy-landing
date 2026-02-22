import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { verifyWebhookSignature } from '@/lib/lemonsqueezy';

/**
 * LemonSqueezy webhook handler.
 * Listens for subscription and order events.
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
            case 'subscription_created':
            case 'order_created': {
                // Determine plan from variant name or product name
                const variantName = (attrs.variant_name || attrs.first_order_item?.variant_name || '').toLowerCase();
                let plan = 'plus';
                let credits = 10;

                if (variantName.includes('pro')) {
                    plan = 'pro';
                    credits = 9999;
                } else if (variantName.includes('ultra')) {
                    plan = 'ultra';
                    credits = 9999;
                }

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

                console.log(`User ${userId} upgraded to ${plan}`);
                break;
            }

            case 'subscription_updated': {
                // Handle plan changes or renewals
                const status = attrs.status;
                if (status === 'active') {
                    // Renew credits on recurring payment
                    const variantName = (attrs.variant_name || '').toLowerCase();
                    let credits = 10;
                    if (variantName.includes('pro') || variantName.includes('ultra')) {
                        credits = 9999;
                    }

                    await supabaseAdmin
                        .from('users')
                        .update({ credits })
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
