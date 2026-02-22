import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
    const body = await req.text();
    const headerList = await headers();
    const signature = headerList.get('Stripe-Signature') as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (error: any) {
        console.error('Webhook signature verification failed:', error.message);
        return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    try {
        if (event.type === 'checkout.session.completed') {
            const clerkUserId = session.client_reference_id;
            const customerId = session.customer as string;
            const subscriptionId = session.subscription as string;

            if (!clerkUserId) {
                console.error('No client_reference_id in Stripe session');
                return new NextResponse('Missing client_reference_id', { status: 400 });
            }

            // 1. You can fetch specific plan details from stripe using the subscription ID
            // For MVP, we'll assume it's the premium plan and update the Supabase users table

            const { error } = await supabaseAdmin
                .from('users')
                .update({
                    stripe_customer_id: customerId,
                    stripe_subscription_id: subscriptionId,
                    plan: 'premium', // or 'pro'/'ultra' depending on the price ID
                    credits: 9999, // Unlocks agent features
                })
                .eq('id', clerkUserId);

            if (error) {
                console.error('Supabase DB Update Error:', error);
                throw new Error('Failed to update user subscription status in DB');
            }

            console.log(`Successfully upgraded user ${clerkUserId} to premium.`);
        }

        if (event.type === 'invoice.payment_succeeded') {
            // Handle recurring payments (grant monthly credits, etc.)
        }

        if (event.type === 'customer.subscription.deleted') {
            // Downgrade user back to free plan
            const subscription = event.data.object as Stripe.Subscription;

            const { error } = await supabaseAdmin
                .from('users')
                .update({
                    plan: 'free',
                    stripe_subscription_id: null,
                })
                .eq('stripe_subscription_id', subscription.id);

            if (error) console.error('Error downgrading user:', error);
        }
    } catch (error: any) {
        console.error('Error processing Stripe webhook:', error);
        return new NextResponse('Webhook processing failed', { status: 500 });
    }

    return new NextResponse(null, { status: 200 });
}
