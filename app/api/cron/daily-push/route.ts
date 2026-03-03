import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { generateTextWithFallback } from '@/lib/ai-provider';
import { calculateBaziChart } from '@/lib/bazi';

// Vercel Cron syntax: Add to vercel.json -> "crons": [{ "path": "/api/cron/daily-push", "schedule": "0 8 * * *" }]
export async function GET(req: Request) {
    try {
        // Authenticate the cron job (Optional for simple testing, but good for production)
        const authHeader = req.headers.get('authorization');
        if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 1. Get today's cosmic transit for global context
        const todayStr = new Date().toISOString().split('T')[0];
        let globalTransit = 'General Transit Phase';
        try {
            const todayChart = calculateBaziChart(todayStr);
            globalTransit = `Today is ${todayChart.dayPillar.stemEn} ${todayChart.dayPillar.branchEn} (${todayChart.dayPillar.elementEn}).`;
        } catch { }

        // 2. Fetch users who have extended profiles (cached charts)
        // In a real app, you'd batch this. For MVP, we process all available.
        const { data: profiles, error } = await supabaseAdmin
            .from('user_profiles_extended')
            .select('user_id, fusion_context, personality_tags');

        if (error || !profiles) {
            throw error || new Error('No profiles found');
        }

        const generatedNotifications = [];

        // 3. Generate actionable insights per user
        for (const profile of profiles) {
            try {
                const systemPrompt = `You are RAYOY AI, an elite strategic advisor.
Analyze today's energy against the user's structural map and personality tags.
Provide a hyper-personalized, punchy daily push notification (max 2 short sentences).
Tone: Authoritative, predictive, actionable. NO fluff.`;

                const userPrompt = `
USER MAP SUMMARY:
${profile.fusion_context ? profile.fusion_context.substring(0, 1000) : 'No specific map provided.'}
TAGS: ${profile.personality_tags?.join(', ') || 'General'}

TODAY'S TRANSIT:
${globalTransit}

Task: Generate today's specific push notification text.`;

                const result = await generateTextWithFallback({
                    system: systemPrompt,
                    prompt: userPrompt,
                });

                // Insert the generated text into notifications
                const notif = {
                    user_id: profile.user_id,
                    title: 'Your Daily Tactical Window',
                    message: result.text.replace(/["*]/g, '').trim(), // clean up formatting
                    insight_type: 'daily',
                    action_url: '/dashboard',
                };

                generatedNotifications.push(notif);

            } catch (err) {
                console.error(`Failed to generate push for user ${profile.user_id}:`, err);
            }
        }

        // 4. Batch insert notifications
        if (generatedNotifications.length > 0) {
            await supabaseAdmin.from('agentic_notifications').insert(generatedNotifications);
        }

        return NextResponse.json({
            success: true,
            processed: profiles.length,
            generated: generatedNotifications.length
        });

    } catch (e: any) {
        console.error('Cron Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
