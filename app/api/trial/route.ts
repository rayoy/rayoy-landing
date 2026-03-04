import { generateTextWithFallback, proxyGenerateImage } from '@/lib/ai-provider';
import { calculateFusionChart } from '@/lib/fusion';
import { supabaseAdmin } from '@/lib/supabase';

export interface ReportSection {
    title: string;
    professional: string;
    plain: string;
}

export interface StructuredReport {
    identity: ReportSection;
    currentCycle: ReportSection;
    riskAssessment: {
        level: 'low' | 'medium' | 'high';
        title: string;
        professional: string;
        plain: string;
    };
    // Locked sections (premium)
    actions?: {
        title: string;
        items: Array<{
            label: string;
            professional: string;
            plain: string;
        }>;
    };
    timing?: {
        title: string;
        windows: Array<{
            period: string;
            focus: string;
            detail: string;
        }>;
    };
    elementStrategy?: ReportSection;
    decisionAnalysis?: ReportSection;
}

export async function POST(req: Request) {
    const body = await req.json();
    const { birthDate, birthTime, birthCity, currentConcern, locale } = body;

    if (!birthDate) {
        return new Response('Birth date is required', { status: 400 });
    }

    let fusionChart;
    try {
        fusionChart = calculateFusionChart(birthDate, birthTime || undefined, 'M');
    } catch (e) {
        console.error('Fusion calculation error:', e);
        return new Response('Invalid birth date/time', { status: 400 });
    }

    const chart = fusionChart.bazi;

    const chartResponse = {
        fourPillars: `${chart.yearPillar.stem}${chart.yearPillar.branch} ${chart.monthPillar.stem}${chart.monthPillar.branch} ${chart.dayPillar.stem}${chart.dayPillar.branch}${chart.hourPillar ? ` ${chart.hourPillar.stem}${chart.hourPillar.branch}` : ''}`,
        dayMaster: `${chart.dayMaster.stem} ${chart.dayMaster.stemEn} (${chart.dayMaster.elementEn} ${chart.dayMaster.polarity})`,
        zodiac: `${chart.zodiac.zh} ${chart.zodiac.en}`,
        dominantElement: chart.dominantElement,
        weakestElement: chart.weakestElement,
    };

    let freeReport: Pick<StructuredReport, 'identity' | 'currentCycle' | 'riskAssessment'> | null = null;
    let lockedReport: Pick<StructuredReport, 'actions' | 'timing' | 'elementStrategy' | 'decisionAnalysis'> | null = null;
    let imageUrl: string | null = null;

    try {
        const strategicContext = fusionChart.fusionContext;

        const isZh = locale?.startsWith('zh');
        const languageInstruction = isZh
            ? 'You MUST respond ONLY in Chinese (简体中文). All title, professional, plain fields must be in Chinese.'
            : 'You MUST respond ONLY in English. All title, professional, plain fields must be in English.';

        const personalContext = [
            birthCity ? `Birth City: ${birthCity}` : null,
            currentConcern ? `Current Decision/Concern: ${currentConcern}` : null,
        ].filter(Boolean).join('\n');

        const exampleJson = isZh ? `{
  "identity": {
    "title": "甲木命主 · 阳木之力",
    "professional": "日主甲木，阳干，五行属木。甲木为栋梁之木，性刚毅而上进，具备领导力与开拓精神。在命局中...",
    "plain": "你的核心能量就像一棵参天大树——正直、有生命力、天生就有向上生长的力量。你适合做引领者，不适合被框住。"
  },
  "currentCycle": {
    "title": "2026丙午年 · 火旺周期",
    "professional": "流年丙午，天干丙火为食神，地支午火为正午之火。食神泄秀，主才华外露...",
    "plain": "简单说，今年火的能量特别旺。对你来说就像春天树木开花——内在的才华会自然展现出来，是个适合表达和创造的年份。"
  },
  "riskAssessment": {
    "level": "medium",
    "title": "中等风险 · 木火过旺需防燥",
    "professional": "木火两旺有泄秀过度之象，需防肝胆系统及心血管压力。情绪上可能过于激进...",
    "plain": "运势虽好，但要注意别太冲动。就像火太旺会把木烧掉一样，适当给自己降降温、多休息。"
  }
}` : `{
  "identity": {
    "title": "Yang Wood · The Pioneer",
    "professional": "Day Master is Jia Wood (Yang). In Chinese metaphysics, Jia Wood represents tall timber — upright, ambitious, and leadership-oriented...",
    "plain": "Your core energy is like a tall, strong tree — you're naturally drawn to growth, leadership, and blazing new trails."
  },
  "currentCycle": {
    "title": "2026 Bing Wu Year · Fire Dominant Cycle",
    "professional": "The annual pillar Bing Wu brings strong Fire energy. Bing Fire as Eating God (食神) to Wood suggests talent expression...",
    "plain": "In simple terms, this year's energy is like spring sunshine on a tree — your talents naturally bloom. It's a year to create and express yourself."
  },
  "riskAssessment": {
    "level": "medium",
    "title": "Medium Risk · Overactive Fire",
    "professional": "Excessive Wood-Fire combination may lead to over-extension. Watch for cardiovascular and liver strain...",
    "plain": "The momentum is good, but don't overdo it. Like a fire that's too hot, you need to pace yourself and rest."
  }
}`;

        const lockedExampleJson = isZh ? `{
  "actions": {
    "title": "行动建议",
    "items": [
      {
        "label": "事业发展",
        "professional": "食神旺相，宜从事创意、教育、新媒体等泄秀类工作...",
        "plain": "今年适合做需要创意和表达的工作，比如写作、教学、内容创作等。"
      }
    ]
  },
  "timing": {
    "title": "最佳时机窗口",
    "windows": [
      {
        "period": "2026年3月-4月",
        "focus": "启动新项目",
        "detail": "木旺之月，与日主甲木同气相求，行动力最强。"
      }
    ]
  },
  "elementStrategy": {
    "title": "五行调节策略",
    "professional": "命局木火过旺，需以土金来泄火生财、平衡五行...",
    "plain": "多接触金属、白色系的东西可以帮你降降火。工作中多注重实际回报而非空想。"
  }
}` : `{
  "actions": {
    "title": "Action Recommendations",
    "items": [
      {
        "label": "Career Development",
        "professional": "Eating God is prominent, favoring creative roles, education, media...",
        "plain": "This year favors creative and expressive work — writing, teaching, content creation."
      }
    ]
  },
  "timing": {
    "title": "Optimal Timing Windows",
    "windows": [
      {
        "period": "March - April 2026",
        "focus": "Launch New Projects",
        "detail": "Wood is at peak strength, aligning with your Day Master for maximum momentum."
      }
    ]
  },
  "elementStrategy": {
    "title": "Element Balancing Strategy",
    "professional": "Excessive Wood-Fire needs Earth and Metal to ground and redirect energy...",
    "plain": "Incorporate metal colors (white, silver) and grounding activities to balance your energy."
  }
}`;

        const result = await generateTextWithFallback({
            system: `You are the Rayoy AI cycle intelligence engine. You generate structured analysis reports.

CRITICAL: You MUST return ONLY valid JSON. No markdown, no code fences, no extra text. Just the JSON object.

You will generate TWO JSON objects separated by the exact delimiter "---LOCKED---" on its own line.

SECTION 1 (FREE — shown to all users):
Return a JSON object with exactly these fields: identity, currentCycle, riskAssessment.
Each has "title", "professional" (technical metaphysics explanation, 2-3 sentences), and "plain" (simple everyday language explanation for non-experts, 1-2 sentences).
riskAssessment also has a "level" field: "low", "medium", or "high".

Example format for Section 1:
${exampleJson}

---LOCKED---

SECTION 2 (PREMIUM — behind paywall):
Return a JSON object with: actions, timing, elementStrategy${currentConcern ? ', decisionAnalysis' : ''}.
- actions: has "title" and "items" array, each item has "label", "professional", "plain"
- timing: has "title" and "windows" array, each window has "period", "focus", "detail"
- elementStrategy: has "title", "professional", "plain"
${currentConcern ? '- decisionAnalysis: has "title", "professional", "plain" — address the user\'s specific concern' : ''}

Example format for Section 2:
${lockedExampleJson}

Keep Section 1 concise (each field 1-3 sentences). Section 2 can be more detailed.
Be specific — reference their actual elements, stars, and cycle data. No generic fluff.
${languageInstruction}`,
            prompt: `Generate a cycle analysis report for this user:
${strategicContext}
Birth Date: ${birthDate}
${birthTime ? `Birth Time: ${birthTime}` : 'Birth time not provided'}
${personalContext}
Current Date: ${new Date().toLocaleDateString()}.`,
        });

        const fullText = result.text;

        // Parse the two JSON sections
        const parts = fullText.split('---LOCKED---');
        const freeText = parts[0]?.trim() || '';
        const lockedText = parts[1]?.trim() || '';

        // Clean potential markdown code fences from AI response
        const cleanJson = (text: string): string => {
            return text
                .replace(/^```json\s*/i, '')
                .replace(/^```\s*/i, '')
                .replace(/\s*```$/i, '')
                .trim();
        };

        try {
            freeReport = JSON.parse(cleanJson(freeText));
        } catch (parseErr) {
            console.error('Failed to parse free report JSON, falling back:', parseErr);
            // Fallback: wrap raw text as identity
            freeReport = {
                identity: {
                    title: isZh ? '命理分析' : 'Cycle Analysis',
                    professional: freeText.slice(0, 200),
                    plain: freeText.slice(0, 200),
                },
                currentCycle: {
                    title: isZh ? '当前周期' : 'Current Cycle',
                    professional: '',
                    plain: '',
                },
                riskAssessment: {
                    level: 'medium' as const,
                    title: isZh ? '风险评估' : 'Risk Assessment',
                    professional: '',
                    plain: '',
                },
            };
        }

        try {
            if (lockedText) {
                lockedReport = JSON.parse(cleanJson(lockedText));
            }
        } catch (parseErr) {
            console.error('Failed to parse locked report JSON:', parseErr);
            lockedReport = null;
        }

        // Generate illustration in parallel
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
            ai_preview: freeReport ? JSON.stringify(freeReport) : null,
        })
        .then(({ error }) => {
            if (error) console.error('Failed to save trial submission:', error);
        });

    return Response.json({
        freeReport,
        lockedReport,
        chart: chartResponse,
        imageUrl,
    });
}
