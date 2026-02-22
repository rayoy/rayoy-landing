import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const user = await currentUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { priceId } = body;

        if (!priceId) {
            return new NextResponse('Price ID is required', { status: 400 });
        }

        // Usually you would lookup the user's stripe_customer_id in Supabase here.
        // For MVP, we will let Stripe create a new customer or match by email.

        // Mocking Stripe for development if no real key is provided
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('placeholder')) {
            console.log('--- MOCK STRIPE CHECKOUT ---');
            console.log('Price ID:', priceId);
            return NextResponse.json({ url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true` });
        }

        const session = await stripe.checkout.sessions.create({
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=true`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?canceled=true`,
            customer_email: user.emailAddresses[0].emailAddress,
            client_reference_id: user.id, // Very important to associate the checkout with the Clerk User ID
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription', // or 'payment' for one-time
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
