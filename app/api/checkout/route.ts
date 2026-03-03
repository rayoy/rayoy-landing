import { NextResponse } from 'next/server';
import { createCheckout } from '@/lib/lemonsqueezy';
import { currentUser } from '@clerk/nextjs/server';

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const body = await req.json();
        const { variantId } = body;

        if (!variantId) {
            return new NextResponse('Variant ID is required', { status: 400 });
        }

        const storeId = process.env.LEMONSQUEEZY_STORE_ID;

        const host = req.headers.get('host');
        const protocol = req.headers.get('x-forwarded-proto') || (host?.includes('localhost') ? 'http' : 'https');
        const origin = `${protocol}://${host}`;

        // Mock mode for development
        if (!process.env.LEMONSQUEEZY_API_KEY || !storeId) {
            console.log('--- MOCK LEMONSQUEEZY CHECKOUT ---');
            console.log('Variant ID:', variantId);
            return NextResponse.json({
                url: `${origin}/success`,
            });
        }

        const checkoutUrl = await createCheckout({
            storeId,
            variantId,
            userEmail: user.emailAddresses[0].emailAddress,
            userId: user.id,
            redirectUrl: `${origin}/success`,
        });

        return NextResponse.json({ url: checkoutUrl });
    } catch (error) {
        console.error('LemonSqueezy Checkout Error:', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
