
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateBaziChart } from '@/lib/bazi';

export async function GET(req: Request) {
    const user = await currentUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const locale = searchParams.get('locale') || 'en';

    // Fetch user data
    const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

    // Get today's transit data
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    let transitContext = '';
    try {
        const todayChart = calculateBaziChart(todayStr);
        transitContext = `Today's Day Pillar: ${todayChart.dayPillar.stem}${todayChart.dayPillar.branch} (${todayChart.dayPillar.stemEn} ${todayChart.dayPillar.branchEn}), Element: ${todayChart.dayPillar.element} (${todayChart.dayPillar.elementEn})`;
    } catch {
        // ignore
    }

    const languageInstruction = locale.startsWith('zh')
        ? 'Respond ONLY in Chinese (简体中文).'
        : 'Respond ONLY in English.';

    const result = await generateText({
        model: google('gemini-2.0-flash'),
        system: `You are the Daily Strategic Pulse engine for Rayoy.
Your goal is to provide a single, punchy, 2-sentence maximum strategic insight for today.
Use a professional, visionary, yet grounding tone. No mystical fluff.
Frame as structural cycle analysis, not fortune-telling.
If user data is missing, base it on today's cosmic transit patterns.
${languageInstruction}`,
        prompt: `Generate today's pulse for user: ${user.firstName || 'Strategist'}.
User Data: ${JSON.stringify(dbUser || {})}.
${transitContext}
Current Date: ${today.toLocaleDateString()}.
Format: One inspiring sentence followed by one actionable tactical advice.`,
    });

    return Response.json({ text: result.text });
}
