import { google } from '@ai-sdk/google';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    const user = await currentUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    // 1. Check user credits and profile from Supabase
    const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('credits, plan, birth_date, birth_time, birth_location')
        .eq('id', user.id)
        .single();

    if (!dbUser || dbUser.credits <= 0) {
        return new Response('Insufficient credits', { status: 403 });
    }

    // Deduct 1 credit (For MVP we do it upfront, in prod do it after stream completes)
    if (dbUser.plan !== 'ultra') {
        await supabaseAdmin
            .from('users')
            .update({ credits: dbUser.credits - 1 })
            .eq('id', user.id);
    }

    const { messages } = await req.json();

    const userContext = `
    User Profile:
    - Name: ${user.firstName}
    - Birth Date: ${dbUser.birth_date || 'Unknown'}
    - Birth Time: ${dbUser.birth_time || 'Unknown'}
    - Birth Location: ${dbUser.birth_location || 'Unknown'}
    - Subscription Plan: ${dbUser.plan}
  `;

    // Start the text stream with Gemini
    const result = await streamText({
        model: google('gemini-2.0-flash'), // or gemini-1.5-pro for reasoning
        system: `
      You are the Rayoy AI, a top-tier Strategic Advisor specializing in cycle timing. 
      You combine Western structured strategic thinking with Eastern astrological/cycle concepts (Bazi, Astrology).
      You speak precisely, professionally, and directly. No fluff. 
      Use the provided tools to calculate structural cycle data BEFORE you give advice.
      ${userContext}
    `,
        messages,
        tools: {
            drawTarot: tool({
                description: 'Draw esoteric archetype cards to determine short-term tactical advantages or warnings.',
                parameters: z.object({
                    spreadType: z.enum(['single_card', 'past_present_future']),
                }),
                execute: async ({ spreadType }) => {
                    // Dummy data for MVP. We would connect this to a real logic/RAG.
                    return {
                        cards: spreadType === 'single_card' ? ['The Emperor (Upright)'] : ['The Fool (Reversed)', 'Wheel of Fortune', 'Nine of Wands'],
                        insight: 'The cycle heavily favors structural authority. It is not a time for reckless pivots.'
                    };
                },
            }),
            calculateBazi: tool({
                description: 'Calculate the fundamental energy structure of the user based on their birth data to determine long-term cycle alignment.',
                parameters: z.object({
                    date: z.string(),
                    time: z.string(),
                }),
                execute: async ({ date, time }) => {
                    return {
                        bazi_pillars: 'Jia Zi / Bing Yin / Wu Chen / Geng Shen',
                        elemental_balance: 'Strong Wood/Fire, missing Water.',
                        current_decade_luck: 'Entering a 10-year wealth cycle (Water/Metal)'
                    };
                },
            }),
            generateDailyForecast: tool({
                description: 'Get today\'s specific cycle action recommendation.',
                parameters: z.object({
                    metric: z.enum(['business', 'personal', 'investment']),
                }),
                execute: async ({ metric }) => {
                    return { score: '82/100', phase: 'Ascending', action: 'Execute planned expansion.' };
                },
            }),
        },
    });

    return result.toAIStreamResponse();
}
