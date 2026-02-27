import { generateTextWithFallback, proxyGenerateImage } from '@/lib/ai-provider';
import { calculateBaziChart, getStrategicContext } from '@/lib/bazi';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
    // Parse body first so it's available in both try and catch
    const body = await req.json();
    const { birthDate, birthTime, birthCity, currentConcern, locale } = body;

    if (!birthDate) {
        return new Response('Birth date is required', { status: 400 });
    }

    // Calculate real Bazi chart (always, regardless of AI success)
    let chart;
    try {
        chart = calculateBaziChart(birthDate, birthTime || undefined);
    } catch (e) {
        console.error('Bazi calculation error:', e);
        return new Response('Invalid birth date', { status: 400 });
    }

    const chartResponse = {
        fourPillars: `${chart.yearPillar.stem}${chart.yearPillar.branch} ${chart.monthPillar.stem}${chart.monthPillar.branch} ${chart.dayPillar.stem}${chart.dayPillar.branch}${chart.hourPillar ? ` ${chart.hourPillar.stem}${chart.hourPillar.branch}` : ''}`,
        dayMaster: `${chart.dayMaster.stem} ${chart.dayMaster.stemEn} (${chart.dayMaster.elementEn} ${chart.dayMaster.polarity})`,
        zodiac: `${chart.zodiac.zh} ${chart.zodiac.en}`,
        dominantElement: chart.dominantElement,
        weakestElement: chart.weakestElement,
    };

    // Try generating AI preview — split into free and locked sections
    let freePreview: string | null = null;
    let lockedPreview: string | null = null;
    let imageUrl: string | null = null;
    try {
        const strategicContext = getStrategicContext(chart);

        const languageInstruction = locale?.startsWith('zh')
            ? 'Respond ONLY in Chinese (简体中文). Use a professional yet engaging tone.'
            : 'Respond ONLY in English. Use a professional yet engaging tone.';

        const personalContext = [
            birthCity ? `Birth City: ${birthCity}` : null,
            currentConcern ? `Current Decision/Concern: ${currentConcern}` : null,
        ].filter(Boolean).join('\n');

        const result = await generateTextWithFallback({
            system: `You are the Rayoy AI cycle intelligence engine. Generate a cycle analysis report in TWO clearly separated sections.

Use EXACTLY this format with the delimiter "---LOCKED---" on its own line to separate sections:

SECTION 1 (FREE PREVIEW - shown to all users):
1. One-sentence Day Master identity statement (who they are at their core)
2. Current cycle phase description (2-3 sentences, be specific about the phase)
3. Risk level assessment with brief explanation (1-2 sentences)

---LOCKED---

SECTION 2 (PREMIUM - locked behind paywall):
1. **Actionable Recommendations**: 3-4 specific, tactical recommendations based on their cycle. Be concrete — mention timing, what to do, what to avoid.
${currentConcern ? '2. **Decision Analysis**: Address their specific concern with cycle-based timing advice (3-4 sentences). Give a clear go/no-go assessment.' : ''}
3. **Optimal Timing Windows**: Identify the best 2-3 windows in the next 6 months for major actions. Be specific about months and what each window is ideal for.
4. **Element Balancing Strategy**: Based on their element imbalance, suggest specific adjustments they can make (career, environment, habits).

Keep Section 1 under 100 words. Keep Section 2 under 250 words. Be specific, not vague. Reference their actual element balance.
${languageInstruction}`,
            prompt: `Generate a cycle analysis report for this user:
${strategicContext}
Birth Date: ${birthDate}
${birthTime ? `Birth Time: ${birthTime}` : 'Birth time not provided'}
${personalContext}
Current Date: ${new Date().toLocaleDateString()}`,
        });

        const fullText = result.text;
        const parts = fullText.split('---LOCKED---');
        freePreview = parts[0]?.trim() || null;
        lockedPreview = parts[1]?.trim() || null;
        // Generate an illustration in parallel
        const imagePrompt = `A highly professional, elegant, minimalist vector illustration representing the Chinese element of ${chart.dominantElement.en}, balanced with ${chart.weakestElement.en}, subtle cosmic energy, dark background, premium ui aesthetic, concept art, high quality.`;
        imageUrl = await proxyGenerateImage(imagePrompt);

    } catch (error) {
        console.error('AI generation failed (returning chart without AI preview):', error);
    }

    // Save to Supabase (fire-and-forget)
    supabaseAdmin
        .from('trial_submissions')
        .insert({
            birth_date: birthDate,
            birth_time: birthTime || null,
            birth_city: birthCity || null,
            current_concern: currentConcern || null,
            locale: locale || 'en',
            chart_data: chartResponse,
            ai_preview: freePreview,
        })
        .then(({ error }) => {
            if (error) console.error('Failed to save trial submission:', error);
        });

    return Response.json({
        freePreview,
        lockedPreview,
        chart: chartResponse,
        imageUrl,
    });
}
