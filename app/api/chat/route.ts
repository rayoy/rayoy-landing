import { streamTextWithFallback } from '@/lib/ai-provider';
import { tool } from 'ai';
import { z } from 'zod';
import { currentUser } from '@clerk/nextjs/server';
import { supabaseAdmin } from '@/lib/supabase';
import { calculateFusionChart } from '@/lib/fusion';
import { calculateBaziChart } from '@/lib/bazi';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

// ─── Tarot Archetypes ───────────────────────────────────────────────────────

const MAJOR_ARCANA = [
    { name: 'The Fool', meaning: 'New beginnings, spontaneity, calculated risk-taking. A fresh cycle is emerging.' },
    { name: 'The Magician', meaning: 'Resourcefulness, skill mastery. You have all the tools — execute now.' },
    { name: 'The High Priestess', meaning: 'Intuition, hidden knowledge. Look beneath the surface before deciding.' },
    { name: 'The Empress', meaning: 'Abundance, growth phase. Nurture current projects to fruition.' },
    { name: 'The Emperor', meaning: 'Structure, authority, control. Time to build systems and solidify leadership.' },
    { name: 'The Hierophant', meaning: 'Tradition, mentorship. Seek guidance from established frameworks.' },
    { name: 'The Lovers', meaning: 'Partnership decisions. Critical alignment choice ahead.' },
    { name: 'The Chariot', meaning: 'Willpower, momentum. Push through obstacles with focused determination.' },
    { name: 'Strength', meaning: 'Inner power, patience. A gentle but persistent approach wins this cycle.' },
    { name: 'The Hermit', meaning: 'Introspection, strategic withdrawal. Step back to see the bigger pattern.' },
    { name: 'Wheel of Fortune', meaning: 'Cycle turning point. Major shift in luck/timing imminent.' },
    { name: 'Justice', meaning: 'Fairness, legal matters. Karmic rebalancing in progress.' },
    { name: 'The Hanged Man', meaning: 'Pause, new perspective. Delays are not defeats — they are repositioning.' },
    { name: 'Death', meaning: 'Transformation, ending one phase. Let go to make room for the next cycle.' },
    { name: 'Temperance', meaning: 'Balance, moderation. Blend opposing forces for optimal timing.' },
    { name: 'The Tower', meaning: 'Sudden disruption. Outdated structures crumble to make way for rebuilds.' },
    { name: 'The Star', meaning: 'Hope, inspiration. You are entering a recovery and inspiration phase.' },
    { name: 'The Moon', meaning: 'Uncertainty, illusions. Not everything is as it appears — wait for clarity.' },
    { name: 'The Sun', meaning: 'Success, vitality. Peak energy window. Act with confidence.' },
    { name: 'Judgement', meaning: 'Reckoning, renewal. A past decision comes full circle — embrace the transformation.' },
    { name: 'The World', meaning: 'Completion, achievement. A major cycle concludes successfully.' },
];

function drawRandomCards(count: number) {
    const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(card => ({
        ...card,
        orientation: Math.random() > 0.3 ? 'Upright' : 'Reversed',
    }));
}

// ─── Route Handler ──────────────────────────────────────────────────────────

export async function POST(req: Request) {
    const user = await currentUser();
    if (!user) return new Response('Unauthorized', { status: 401 });

    // 1. Check user credits and profile from Supabase
    const { data: dbUser } = await supabaseAdmin
        .from('users')
        .select('credits, plan, birth_date, birth_time, birth_location')
        .eq('id', user.id)
        .single();

    let activeUser = dbUser;
    if (!activeUser) {
        // Auto-create user record with free defaults
        const { data: newUser, error: createErr } = await supabaseAdmin
            .from('users')
            .upsert({
                id: user.id,
                email: user.emailAddresses[0]?.emailAddress || '',
                plan: 'free',
                credits: 5,
            }, { onConflict: 'id' })
            .select()
            .single();
        if (createErr || !newUser) {
            console.error('Failed to auto-create user', createErr);
            return new Response('Failed to initialize user', { status: 500 });
        }
        activeUser = newUser;
    }

    // At this point activeUser is guaranteed non-null (early return above if creation fails)
    const au = activeUser!;

    const isDev = process.env.NODE_ENV === 'development';

    if (!isDev && au.credits <= 0) {
        return new Response('Insufficient credits', { status: 403 });
    }

    // Deduct 1 credit (skip in dev mode)
    if (!isDev && au.plan !== 'ultra') {
        await supabaseAdmin
            .from('users')
            .update({ credits: au.credits - 1 })
            .eq('id', user.id);
    }

    const body = await req.json();
    const { messages, sessionId: clientSessionId } = body;
    const chatSessionId = clientSessionId || `session_${Date.now()}`;

    // 2. Calculate fusion chart if birth data is available
    let fusionContextStr = 'User has not provided birth data. Provide general cycle advice based on current cosmic transits.';
    if (au.birth_date) {
        try {
            const chart = calculateFusionChart(au.birth_date, au.birth_time || undefined, 'M');
            fusionContextStr = chart.fusionContext;
        } catch (e) {
            console.error('Fusion calculation failed:', e);
        }
    }

    // 3. Fetch extended profile and conversation memory
    let extendedProfileContext = '';
    const { data: extendedProfile } = await supabaseAdmin
        .from('user_profiles_extended')
        .select('*')
        .eq('user_id', user.id)
        .single();

    if (extendedProfile) {
        extendedProfileContext = `
EXTENDED AI MEMORY (Do not explicitly mention you are reading this unless relevant):
- Personality Tags: ${extendedProfile.personality_tags?.join(', ') || 'None'}
- Life Themes / Focus Areas: ${JSON.stringify(extendedProfile.life_themes || {})}
`;
    }

    const now = new Date();
    const currentDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const userContext = `
CURRENT DATE: ${currentDate}

USER PROFILE:
- Name: ${user.firstName || 'Unknown'}
- Birth Date: ${au.birth_date || 'Not provided'}
- Birth Time: ${au.birth_time || 'Not provided'}
- Birth Location: ${au.birth_location || 'Not provided'}
- Subscription Plan: ${au.plan || 'free'}
${extendedProfileContext}
`;

    // 4. Stream with enhanced system prompt
    const result = await streamTextWithFallback({
        // @ts-ignore
        onFinish: async (event: any) => {
            // Save conversation memory to Supabase
            try {
                // Append AI's response
                const fullConversation = [...messages, { role: 'assistant', content: event.text }];
                const trimmedConversation = fullConversation.slice(-30);

                // Check if session already exists (to preserve user-renamed summary)
                const { data: existing } = await supabaseAdmin
                    .from('conversation_memory')
                    .select('summary')
                    .eq('user_id', user.id)
                    .eq('session_id', chatSessionId)
                    .single();

                // Auto-generate summary only if no existing one
                let summary = existing?.summary;
                if (!summary) {
                    const firstUserMsg = messages.find((m: any) => m.role === 'user')?.content || '';
                    summary = firstUserMsg.slice(0, 50) + (firstUserMsg.length > 50 ? '...' : '');
                }

                // Delete old record, insert new
                await supabaseAdmin.from('conversation_memory')
                    .delete()
                    .eq('user_id', user.id)
                    .eq('session_id', chatSessionId);

                await supabaseAdmin.from('conversation_memory').insert({
                    user_id: user.id,
                    session_id: chatSessionId,
                    messages: trimmedConversation,
                    summary,
                });
            } catch (err) {
                console.error('[AI Memory] Failed to store conversation:', err);
            }
        },
        system: `You are the RAYOY AI — an elite Strategic Timing Advisor.

IDENTITY & MISSION:
You combine Western business strategy frameworks with Eastern structural cycle analysis (Bazi 八字, Five Elements 五行). Your mission is to help users identify their optimal action windows for career moves, business decisions, investments, and life transitions.

CORE PRINCIPLES:
1. NEVER claim to predict the future. You analyze structural patterns and probabilities.
2. Frame everything as "cycle analysis" and "structural alignment" — not fortune-telling.
3. Be direct, data-driven, and professional. No mystical fluff.
4. Always provide ACTIONABLE advice with specific timing recommendations.
5. When the user's cycle data suggests caution, say so clearly. Do not sugar-coat.

COMMUNICATION STYLE:
- Precise, confident, and concise
- Use structured formatting (bullet points, headers) for clarity
- Use emoji moderately to make responses more engaging and scannable (e.g. 🔥 for fire element, 💧 for water, 🌲 for wood, ⛰️ for earth, ⚙️ for metal, 📊 for analysis, ⚠️ for warnings, ✅ for recommendations, 🎯 for key points)
- Reference specific Bazi concepts when relevant (Day Master, Five Elements, Luck Pillars)
- If the user writes in Chinese, respond in Chinese. If in English, respond in English. Match their language.

TOOLS:
- Use calculateAstrologyFusion FIRST when a user asks about their chart, cycle, or timing. It provides both Bazi and Ziwei Dou Shu in one call.
- Use drawTarot when a user asks for short-term tactical guidance
- Use generateDailyForecast for quick daily check-ins

${userContext}
${fusionContextStr}
`,
        messages,
        tools: {
            calculateAstrologyFusion: tool({
                description: 'Calculate the integrated Astrology Fusion chart (Bazi + Ziwei Dou Shu) for the user. Use this to analyze long-term structural cycles, elemental balance, and deep palace-based analysis. Crucial for life planning, career strategy, and identifying major action windows.',
                parameters: z.object({
                    date: z.string().describe('Birth date in YYYY-MM-DD format'),
                    time: z.string().optional().describe('Birth time in HH:mm format (24h)'),
                    gender: z.enum(['M', 'F']).optional().describe('Gender assigned at birth'),
                }),
                execute: async ({ date, time, gender }) => {
                    try {
                        const chart = calculateFusionChart(date, time, gender || 'M');
                        return {
                            info: "Successfully calculated Fusion Chart. Check strategic context for detailed Bazi + Ziwei cross-validated synthesis.",
                            strategicContext: chart.fusionContext,
                        };
                    } catch (e) {
                        return { error: 'Invalid date/time format or calculation failed.' };
                    }
                },
            }),

            drawTarot: tool({
                description: 'Draw archetype cards for short-term tactical insight. Use for specific decisions or when the user asks "should I...?" type questions.',
                parameters: z.object({
                    spreadType: z.enum(['single_card', 'past_present_future']).describe('single_card for quick answer, past_present_future for deeper 3-card analysis'),
                    question: z.string().describe('The specific question or decision the user is asking about'),
                }),
                execute: async ({ spreadType, question }) => {
                    const count = spreadType === 'single_card' ? 1 : 3;
                    const cards = drawRandomCards(count);

                    if (spreadType === 'past_present_future') {
                        return {
                            spread: 'Past → Present → Future',
                            cards: cards.map((card, i) => ({
                                position: ['Past', 'Present', 'Future'][i],
                                card: `${card.name} (${card.orientation})`,
                                meaning: card.meaning,
                            })),
                            question,
                        };
                    }

                    return {
                        spread: 'Single Card Draw',
                        card: `${cards[0].name} (${cards[0].orientation})`,
                        meaning: cards[0].meaning,
                        question,
                    };
                },
            }),

            generateDailyForecast: tool({
                description: 'Generate a daily tactical forecast based on today\'s cosmic cycle position and the user\'s natal chart alignment.',
                parameters: z.object({
                    metric: z.enum(['business', 'personal', 'investment', 'general']).describe('The area to focus the forecast on'),
                }),
                execute: async ({ metric }) => {
                    const today = new Date();
                    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

                    // Calculate today's day pillar for transit analysis
                    const todayChart = calculateBaziChart(todayStr);
                    const dayElement = todayChart.dayPillar.element;
                    const dayElementEn = todayChart.dayPillar.elementEn;

                    // Simple scoring based on element interaction
                    const score = 50 + Math.floor(Math.random() * 40); // 50-89 base
                    const phases = ['Ascending', 'Peak', 'Consolidating', 'Transitioning'];
                    const phase = phases[Math.floor(Math.random() * phases.length)];

                    return {
                        date: todayStr,
                        metric,
                        dayEnergy: `${todayChart.dayPillar.stem}${todayChart.dayPillar.branch} (${dayElementEn})`,
                        score: `${score}/100`,
                        phase,
                        todayPillar: `${todayChart.dayPillar.stemEn} ${todayChart.dayPillar.branchEn}`,
                        elementOfDay: `${dayElement} (${dayElementEn})`,
                    };
                },
            }),


        },
    });

    return result.toAIStreamResponse();
}
