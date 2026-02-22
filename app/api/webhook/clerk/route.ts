import { Webhook } from 'svix';
import { headers } from 'next/headers';
import { WebhookEvent } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

    if (!WEBHOOK_SECRET) {
        throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local');
    }

    // Get the headers
    const headerPayload = await headers();
    const svix_id = headerPayload.get('svix-id');
    const svix_timestamp = headerPayload.get('svix-timestamp');
    const svix_signature = headerPayload.get('svix-signature');

    // If there are no headers, error out
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response('Error occured -- no svix headers', {
            status: 400,
        });
    }

    // Get the body
    const payload = await req.json();
    const body = JSON.stringify(payload);

    // Create a new Svix instance with your secret.
    const wh = new Webhook(WEBHOOK_SECRET);

    let evt: WebhookEvent;

    // Verify the payload with the headers
    try {
        evt = wh.verify(body, {
            'svix-id': svix_id,
            'svix-timestamp': svix_timestamp,
            'svix-signature': svix_signature,
        }) as WebhookEvent;
    } catch (err) {
        console.error('Error verifying webhook:', err);
        return new Response('Error occured', {
            status: 400,
        });
    }

    // Handle the webhook event
    const eventType = evt.type;

    if (eventType === 'user.created') {
        const { id, email_addresses, first_name, last_name, image_url } = evt.data;

        // Insert user into Supabase
        const { error } = await supabaseAdmin.from('users').insert({
            id: id,
            email: email_addresses[0]?.email_address,
            first_name: first_name,
            last_name: last_name,
            avatar_url: image_url,
            plan: 'free',
            credits: 3, // Give some free credits on signup
            created_at: new Date().toISOString(),
        });

        if (error) {
            console.error('Error inserting user to Supabase:', error);
            return new Response('Error inserting user to Supabase', { status: 500 });
        }
    }

    if (eventType === 'user.updated') {
        const { id, first_name, last_name, image_url } = evt.data;

        const { error } = await supabaseAdmin
            .from('users')
            .update({
                first_name: first_name,
                last_name: last_name,
                avatar_url: image_url,
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating user in Supabase:', error);
            return new Response('Error updating user in Supabase', { status: 500 });
        }
    }

    if (eventType === 'user.deleted') {
        const { id } = evt.data;
        const { error } = await supabaseAdmin.from('users').delete().eq('id', id);
        if (error) {
            console.error('Error deleting user in Supabase:', error);
            return new Response('Error deleting user in Supabase', { status: 500 });
        }
    }

    return new Response('', { status: 200 });
}
