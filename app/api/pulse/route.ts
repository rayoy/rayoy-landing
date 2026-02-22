
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
    const user = await currentUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    // Fetch user data
    const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    const result = await generateText({
        model: google('gemini-2.0-flash'),
        system: `You are the Daily Strategic Pulse engine for Rayoy. 
        Your goal is to provide a single, punchy, 2-sentence maximum strategic insight for today.
        Use a professional, visionary, yet grounding tone. 
        If user data is missing, base it on general collective cycle trends (e.g., current moon phase or season).`,
        prompt: `Generate today's pulse for user: ${user.firstName || 'Strategist'}. 
        User Data: ${JSON.stringify(dbUser || {})}.
        Current Date: ${new Date().toLocaleDateString()}.
        Format: One inspiring sentence followed by one actionable tactical advice.`,
    });

    return Response.json({ text: result.text });
}
