import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { calculateBaziChart, getStrategicContext } from '@/lib/bazi';

export async function POST(req: Request) {
    try {
        const { birthDate, birthTime, locale } = await req.json();

        if (!birthDate) {
            return new Response('Birth date is required', { status: 400 });
        }

        // Calculate real Bazi chart
        const chart = calculateBaziChart(birthDate, birthTime || undefined);
        const strategicContext = getStrategicContext(chart);

        const languageInstruction = locale?.startsWith('zh')
            ? 'Respond ONLY in Chinese (简体中文). Use a professional yet engaging tone.'
            : 'Respond ONLY in English. Use a professional yet engaging tone.';

        // Generate a compelling preview with Gemini
        const result = await generateText({
            model: google('gemini-2.0-flash'),
            system: `You are the Rayoy AI trial preview engine. Generate a SHORT, compelling cycle analysis preview.

FORMAT (use exactly this structure):
1. One-sentence Day Master identity statement (who they are at their core)
2. Current cycle phase (1 sentence)
3. One specific actionable insight for this quarter
4. A teaser: "Unlock your full 4-pillar analysis, monthly tactical windows, and AI strategic advisor..."

Keep the TOTAL response under 150 words. Be specific, not vague. Reference their actual element balance.
${languageInstruction}`,
            prompt: `Generate a free trial preview for this user:
${strategicContext}
Birth Date: ${birthDate}
${birthTime ? `Birth Time: ${birthTime}` : 'Birth time not provided'}
Current Date: ${new Date().toLocaleDateString()}`,
        });

        return Response.json({
            preview: result.text,
            chart: {
                fourPillars: `${chart.yearPillar.stem}${chart.yearPillar.branch} ${chart.monthPillar.stem}${chart.monthPillar.branch} ${chart.dayPillar.stem}${chart.dayPillar.branch}${chart.hourPillar ? ` ${chart.hourPillar.stem}${chart.hourPillar.branch}` : ''}`,
                dayMaster: `${chart.dayMaster.stem} ${chart.dayMaster.stemEn} (${chart.dayMaster.elementEn} ${chart.dayMaster.polarity})`,
                zodiac: `${chart.zodiac.zh} ${chart.zodiac.en}`,
                dominantElement: chart.dominantElement,
                weakestElement: chart.weakestElement,
            },
        });
    } catch (error) {
        console.error('Trial generation error:', error);

        // Fallback: return just the Bazi chart without AI interpretation
        try {
            const { birthDate, birthTime } = await req.json().catch(() => ({ birthDate: null, birthTime: null }));
            if (birthDate) {
                const chart = calculateBaziChart(birthDate, birthTime || undefined);
                return Response.json({
                    preview: null,
                    chart: {
                        fourPillars: `${chart.yearPillar.stem}${chart.yearPillar.branch} ${chart.monthPillar.stem}${chart.monthPillar.branch} ${chart.dayPillar.stem}${chart.dayPillar.branch}`,
                        dayMaster: `${chart.dayMaster.stem} ${chart.dayMaster.stemEn}`,
                        zodiac: `${chart.zodiac.zh} ${chart.zodiac.en}`,
                        dominantElement: chart.dominantElement,
                        weakestElement: chart.weakestElement,
                    },
                });
            }
        } catch { /* ignore */ }

        return new Response('Analysis failed', { status: 500 });
    }
}
