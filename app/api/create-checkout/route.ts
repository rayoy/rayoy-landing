import { NextResponse } from 'next/server';
import Stripe from 'stripe';

// Helper to get Stripe instance lazily to avoid build-time errors
// when environment variables might not be populated
const getStripe = () => {
    if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('STRIPE_SECRET_KEY is not set');
    }
    return new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: '2026-01-28.clover',
    });
};

export async function POST(request: Request) {
    try {
        // Determine the base URL for success/cancel redirects
        // Fallback to localhost if NEXT_PUBLIC_BASE_URL is not set
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

        // Parse the request body (optional, for passing dynamic data like locale)
        let body = {};
        try {
            body = await request.json();
        } catch (e) {
            // Ignore empty body
        }

        // Create Stripe Checkout Session
        const stripe = getStripe();
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Rayoy 3-Year Decision Report',
                            description: 'Complete cycle intelligence analysis including Phase Identification, 3-Year Trend, Risk Signals, and Action Recommendations.',
                            // Optional: Add logo image URL here if available
                            // images: ['https://yourdomain.com/logo.png'],
                        },
                        unit_amount: 4900, // $49.00 in cents
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${baseUrl}/analysis`, // Redirect to analysis page if cancelled
        });

        // Return the session URL to the client
        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Checkout Error:', error);
        return NextResponse.json(
            { error: error.message || 'An error occurred during checkout initialization.' },
            { status: 500 }
        );
    }
}
