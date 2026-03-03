/**
 * Ziwei Dou Shu (紫微斗數) Calculation Engine
 *
 * This version uses the professional `iztro` package for accurate
 * calculation of the 12 palaces, 14 major stars, minor stars, and transformations.
 */

import { astro } from 'iztro';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface Star {
    name: string;
    nameEn: string;
    type: 'major' | 'minor' | 'auxiliary' | 'transformation';
    brightness?: 'bright' | 'dim' | 'neutral';
}

export interface Palace {
    index: number;           // 0-11
    name: string;            // 命宫、兄弟宫...
    nameEn: string;
    branch: string;          // 地支
    stem: string;            // 天干
    majorStars: Star[];      // 主星
    minorStars: Star[];      // 辅星
    transformations?: {      // 四化
        lu?: Star;           // 化禄
        quan?: Star;         // 化权
        ke?: Star;           // 化科
        ji?: Star;           // 化忌
    };
    isLifePalace?: boolean;
    isBodyPalace?: boolean;
    decadal?: { start: number; end: number }; // 大限范围
}

export interface ZiweiChart {
    birthYear: number;
    birthMonth: number;
    birthDay: number;
    birthHour: number;
    lifePalace: Palace;
    bodyPalace: Palace;
    fiveElementCode: string; // 五行局
    mingJu: number;          // 几局（2-6）
    palaces: Palace[];       // 十二宫
    ziWeiPosition: number;   // 紫微所在宫位index
    transformations: Record<string, string>; // 四化映射
}

// ─── Translations ──────────────────────────────────────────────────────────────

const PALACE_EN: Record<string, string> = {
    '命宫': 'Life Palace',
    '兄弟': 'Siblings Palace',
    '夫妻': 'Marriage Palace',
    '子女': 'Children Palace',
    '财帛': 'Wealth Palace',
    '疾厄': 'Health Palace',
    '迁移': 'Travel Palace',
    '交友': 'Friends/Servants Palace',
    '仆役': 'Friends/Servants Palace',
    '官禄': 'Career Palace',
    '田宅': 'Property Palace',
    '福德': 'Fortune Palace',
    '父母': 'Parents Palace',
};

const STAR_EN: Record<string, string> = {
    '紫微': 'Zi Wei (Emperor)',
    '天机': 'Tian Ji (Advisor)',
    '太阳': 'Tai Yang (Sun)',
    '武曲': 'Wu Qu (Finance)',
    '天同': 'Tian Tong (Blessing)',
    '廉贞': 'Lian Zhen (Justice)',
    '天府': 'Tian Fu (Treasury)',
    '太阴': 'Tai Yin (Moon)',
    '贪狼': 'Tan Lang (Greedy Wolf)',
    '巨门': 'Ju Men (Giant Gate)',
    '天相': 'Tian Xiang (Chancellor)',
    '天梁': 'Tian Liang (Support)',
    '七杀': 'Qi Sha (Seven Killings)',
    '破军': 'Po Jun (Army Breaker)',

    // Minor stars
    '文昌': 'Wen Chang (Intellect)',
    '文曲': 'Wen Qu (Arts)',
    '左辅': 'Zuo Fu (Left Deputy)',
    '右弼': 'You Bi (Right Deputy)',
    '天魁': 'Tian Kui (Heavenly Chief)',
    '天钺': 'Tian Yue (Heavenly Halberd)',
    '禄存': 'Lu Cun (Stored Wealth)',
    '天马': 'Tian Ma (Heavenly Steed)',

    // Tough stars
    '擎羊': 'Qing Yang (Lance)',
    '陀罗': 'Tuo Luo (Armor)',
    '火星': 'Huo Xing (Fire)',
    '铃星': 'Ling Xing (Bell)',
    '地空': 'Di Kong (Earthly Empty)',
    '地劫': 'Di Jie (Earthly Robbery)',
};

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Calculate a complete Ziwei Dou Shu chart using iztro.
 *
 * @param year  - Birth year
 * @param month - Birth month (1-12)
 * @param day   - Birth day
 * @param hour  - Birth hour (0-23)
 * @param gender - 'M' or 'F'
 */
export function calculateZiweiChart(
    year: number,
    month: number,
    day: number,
    hour: number,
    gender: 'M' | 'F' = 'M'
): ZiweiChart {
    // Format date specifically for iztro
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    // timeIndex calculation: 子时=0, 丑时=1, ..., 亥时=11
    // iztro handles 0-12 where 12 is late-night Zi (晚子), but here we map hour to 0-11
    const timeIndex = Math.floor(((hour + 1) % 24) / 2);

    const sex = gender === 'M' ? '男' : '女';

    // Generate the astrolabe
    const astrolabe = astro.bySolar(dateStr, timeIndex, sex, true, 'zh-CN');

    // Map iztro format to our internal representations
    const palaces: Palace[] = astrolabe.palaces.map((p) => {
        const majorStars: Star[] = p.majorStars.map(s => ({
            name: s.name,
            nameEn: STAR_EN[s.name] || s.name,
            type: 'major',
            brightness: typeof s.brightness === 'string' ? (s.brightness === '庙' || s.brightness === '旺' ? 'bright' : s.brightness === '陷' ? 'dim' : 'neutral') : undefined
        }));

        const minorStars: Star[] = p.minorStars.map(s => ({
            name: s.name,
            nameEn: STAR_EN[s.name] || s.name,
            type: 'minor',
            brightness: typeof s.brightness === 'string' ? (s.brightness === '庙' || s.brightness === '旺' ? 'bright' : s.brightness === '陷' ? 'dim' : 'neutral') : undefined
        }));

        // Locate transformation stars in this palace
        const transformations: Palace['transformations'] = {};
        const checkTrans = (starList: any[]) => {
            starList.forEach(s => {
                if (s.mutagen) {
                    const transStar: Star = { name: s.name, nameEn: STAR_EN[s.name] || s.name, type: 'transformation' };
                    if (s.mutagen === '禄') transformations.lu = transStar;
                    if (s.mutagen === '权') transformations.quan = transStar;
                    if (s.mutagen === '科') transformations.ke = transStar;
                    if (s.mutagen === '忌') transformations.ji = transStar;
                }
            });
        };

        checkTrans(p.majorStars);
        checkTrans(p.minorStars);

        return {
            index: p.index,
            name: p.name,
            nameEn: PALACE_EN[p.name] || p.name,
            branch: p.earthlyBranch,
            stem: p.heavenlyStem,
            majorStars,
            minorStars,
            transformations: Object.keys(transformations).length > 0 ? transformations : undefined,
            isLifePalace: p.isOriginalPalace,
            isBodyPalace: p.isBodyPalace,
            decadal: p.decadal ? { start: p.decadal.range[0], end: p.decadal.range[1] } : undefined
        };
    });

    // Fix mingJu since iztro might format it slightly differently (e.g., '水二局')
    const juCode = astrolabe.fiveElementsClass;
    let mingJu = 2; // default
    if (juCode.includes('二')) mingJu = 2;
    if (juCode.includes('三')) mingJu = 3;
    if (juCode.includes('四')) mingJu = 4;
    if (juCode.includes('五')) mingJu = 5;
    if (juCode.includes('六')) mingJu = 6;

    const lifePalace = palaces.find(p => p.isLifePalace) || palaces[0];
    const bodyPalace = palaces.find(p => p.isBodyPalace) || palaces[0];

    // Find ZiWei location
    const zPalace = palaces.find(p => p.majorStars.some(s => s.name === '紫微'));
    const ziWeiPosition = zPalace ? zPalace.index : 0;

    // Build a nice map for transformations based on iztro's mutagens list or by scanning
    const transMap: Record<string, string> = {
        '化禄': '',
        '化权': '',
        '化科': '',
        '化忌': ''
    };

    palaces.forEach(p => {
        if (p.transformations?.lu) transMap['化禄'] = p.transformations.lu.name;
        if (p.transformations?.quan) transMap['化权'] = p.transformations.quan.name;
        if (p.transformations?.ke) transMap['化科'] = p.transformations.ke.name;
        if (p.transformations?.ji) transMap['化忌'] = p.transformations.ji.name;
    });

    return {
        birthYear: year,
        birthMonth: month,
        birthDay: day,
        birthHour: hour,
        lifePalace,
        bodyPalace,
        fiveElementCode: juCode,
        mingJu,
        palaces,
        ziWeiPosition,
        transformations: transMap,
    };
}

/**
 * Get strategic interpretation context for AI
 */
export function getZiweiStrategicContext(chart: ZiweiChart): string {
    const lifePalace = chart.lifePalace;
    const bodyPalace = chart.bodyPalace;

    // Get life and body stars (Major + Minor)
    const getStars = (p: Palace) => [...p.majorStars, ...p.minorStars].map(s => s.name).join('、') || '无主要星曜';

    const lifeStars = getStars(lifePalace);
    const bodyStars = getStars(bodyPalace);

    const trans = chart.transformations;

    return `
ZIWEI DOU SHU STRUCTURAL ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
命宫 (${lifePalace.stem}${lifePalace.branch}):
- 星曜: ${lifeStars}
- 五行局: ${chart.fiveElementCode}
- 本命四化: 禄(${trans['化禄']}) 权(${trans['化权']}) 科(${trans['化科']}) 忌(${trans['化忌']})

身宫 (${bodyPalace.name}):
- 星曜: ${bodyStars}

KEY INTERPRETATION POINTS:
1. 命宫星耀（含六吉六煞）决定先天格局和人生主线
2. 三方四正（命-财-官-迁）需同时分析
3. 四化指示当前大限的重点领域和因果关系
4. 身宫影响后天发展和中年运势
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

/** 获取三方四正宫位索引 */
export function getSanFangSiZheng(lifePalaceIndex: number): number[] {
    // 三方：命宫 + 财帛宫(4位后) + 官禄宫(8位后)
    // 四正：加上迁移宫(6位后)
    const wealth = (lifePalaceIndex + 4) % 12;      // 财帛
    const career = (lifePalaceIndex + 8) % 12;      // 官禄
    const travel = (lifePalaceIndex + 6) % 12;      // 迁移
    return [lifePalaceIndex, wealth, career, travel];
}

/** 获取大限范围 */
export function getDaXianRanges(chart: ZiweiChart): Array<{ palace: number; startAge: number; endAge: number }> {
    return chart.palaces.map(p => ({
        palace: p.index,
        startAge: p.decadal?.start || 0,
        endAge: p.decadal?.end || 0
    }));
}
