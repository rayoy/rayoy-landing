import { calculateBaziChart, getStrategicContext as getBaziContext, BaziChart } from './bazi';
import { calculateZiweiChart, getZiweiStrategicContext, ZiweiChart } from './ziwei';

export interface FusionChart {
    bazi: BaziChart;
    ziwei: ZiweiChart | null;
    fusionContext: string;
}

/**
 * Parses date and time strings into numbers
 * @param birthDate YYYY-MM-DD
 * @param birthTime HH:mm
 */
function parseDateTime(birthDate: string, birthTime?: string) {
    const [year, month, day] = birthDate.split('-').map(Number);
    let hour = 12; // default to noon if not provided for ziwei, though bazi handles it gracefully
    if (birthTime) {
        const [h] = birthTime.split(':').map(Number);
        hour = h;
    }
    return { year, month, day, hour };
}

/**
 * Calculates both Bazi and Ziwei charts and returns a unified context.
 * 
 * @param birthDate ISO date string "YYYY-MM-DD"
 * @param birthTime Optional time string "HH:mm" (24h format)
 * @param gender 'M' or 'F' (Defaults to 'M')
 */
export function calculateFusionChart(birthDate: string, birthTime?: string, gender: 'M' | 'F' = 'M'): FusionChart {
    // 1. Calculate Bazi (Primary engine, requires less precise time)
    const baziChart = calculateBaziChart(birthDate, birthTime);

    // 2. Calculate Ziwei (Secondary engine, requires time for accuracy)
    let ziweiChart: ZiweiChart | null = null;
    let crossValidationSection = '';

    if (birthTime) {
        try {
            const { year, month, day, hour } = parseDateTime(birthDate, birthTime);
            ziweiChart = calculateZiweiChart(year, month, day, hour, gender);

            // Generate Cross-Validation Insights
            const ziweiStars = ziweiChart.lifePalace.majorStars.map(s => s.name).join('、');
            const dayMasterEl = baziChart.dayMaster.elementEn;

            crossValidationSection = `
CROSS-ENGINE VALIDATION (CONFIDENCE SCORE: MODERATE TO HIGH):
- Path 1 (Bazi): Core identity is ${dayMasterEl} (${baziChart.dayMaster.polarity}). Dominant energy is ${baziChart.dominantElement.en}.
- Path 2 (Ziwei): Life Palace is characterized by ${ziweiStars || 'Empty Palace'}.
- Synthesis: Blend the elemental driver (${dayMasterEl}) with the behavioral archetype of (${ziweiStars}).
`;
        } catch (error) {
            console.error('Ziwei calculation failed during fusion:', error);
            crossValidationSection = '\nCROSS-ENGINE VALIDATION: Ziwei analysis unavailable due to calculation error.\n';
        }
    } else {
        crossValidationSection = `
CROSS-ENGINE VALIDATION (CONFIDENCE SCORE: LOW):
- Note: Exact birth time not provided. Ziwei Dou Shu analysis is skipped. Relying entirely on Bazi (Four Pillars).
`;
    }

    const baziCtx = getBaziContext(baziChart);
    const ziweiCtx = ziweiChart ? getZiweiStrategicContext(ziweiChart) : '';

    const fusionContext = `
=========================================
RAYOY MULTI-ENGINE FUSION ANALYSIS
=========================================
${baziCtx}
${ziweiCtx}
${crossValidationSection}
ACTIONABLE SYNTHESIS GUIDELINES:
1. Identify if the Bazi elemental weakness is compensated by Ziwei Life Palace traits.
2. Formulate strategic timing based on the current year's transit in Bazi and Transformations in Ziwei.
=========================================
`;

    return {
        bazi: baziChart,
        ziwei: ziweiChart,
        fusionContext
    };
}
