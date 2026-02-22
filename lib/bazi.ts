/**
 * Bazi (四柱八字) Four Pillars Calculation Engine
 *
 * Pure TypeScript implementation using the Chinese Sexagenary Cycle.
 * Calculates Year, Month, Day, and Hour pillars from a Gregorian birth date/time.
 */

// ─── Constants ──────────────────────────────────────────────────────────────

/** 十天干 — Ten Heavenly Stems */
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'] as const;
export const STEMS_EN = ['Jia', 'Yi', 'Bing', 'Ding', 'Wu', 'Ji', 'Geng', 'Xin', 'Ren', 'Gui'] as const;

/** 十二地支 — Twelve Earthly Branches */
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'] as const;
export const BRANCHES_EN = ['Zi', 'Chou', 'Yin', 'Mao', 'Chen', 'Si', 'Wu', 'Wei', 'Shen', 'You', 'Xu', 'Hai'] as const;

/** 五行 — Five Elements */
export const FIVE_ELEMENTS = ['木', '火', '土', '金', '水'] as const;
export const ELEMENTS_EN = ['Wood', 'Fire', 'Earth', 'Metal', 'Water'] as const;

/** Stem → Element mapping (each element has a Yang and Yin stem) */
const STEM_ELEMENT: Record<string, { element: string; elementEn: string; polarity: 'Yang' | 'Yin' }> = {
    '甲': { element: '木', elementEn: 'Wood', polarity: 'Yang' },
    '乙': { element: '木', elementEn: 'Wood', polarity: 'Yin' },
    '丙': { element: '火', elementEn: 'Fire', polarity: 'Yang' },
    '丁': { element: '火', elementEn: 'Fire', polarity: 'Yin' },
    '戊': { element: '土', elementEn: 'Earth', polarity: 'Yang' },
    '己': { element: '土', elementEn: 'Earth', polarity: 'Yin' },
    '庚': { element: '金', elementEn: 'Metal', polarity: 'Yang' },
    '辛': { element: '金', elementEn: 'Metal', polarity: 'Yin' },
    '壬': { element: '水', elementEn: 'Water', polarity: 'Yang' },
    '癸': { element: '水', elementEn: 'Water', polarity: 'Yin' },
};

/** Branch → Element mapping (main qi 本气) */
const BRANCH_ELEMENT: Record<string, { element: string; elementEn: string }> = {
    '子': { element: '水', elementEn: 'Water' },
    '丑': { element: '土', elementEn: 'Earth' },
    '寅': { element: '木', elementEn: 'Wood' },
    '卯': { element: '木', elementEn: 'Wood' },
    '辰': { element: '土', elementEn: 'Earth' },
    '巳': { element: '火', elementEn: 'Fire' },
    '午': { element: '火', elementEn: 'Fire' },
    '未': { element: '土', elementEn: 'Earth' },
    '申': { element: '金', elementEn: 'Metal' },
    '酉': { element: '金', elementEn: 'Metal' },
    '戌': { element: '土', elementEn: 'Earth' },
    '亥': { element: '水', elementEn: 'Water' },
};

/** Branch → Chinese Zodiac animal */
const BRANCH_ANIMAL: Record<string, { zh: string; en: string }> = {
    '子': { zh: '鼠', en: 'Rat' },
    '丑': { zh: '牛', en: 'Ox' },
    '寅': { zh: '虎', en: 'Tiger' },
    '卯': { zh: '兔', en: 'Rabbit' },
    '辰': { zh: '龙', en: 'Dragon' },
    '巳': { zh: '蛇', en: 'Snake' },
    '午': { zh: '马', en: 'Horse' },
    '未': { zh: '羊', en: 'Goat' },
    '申': { zh: '猴', en: 'Monkey' },
    '酉': { zh: '鸡', en: 'Rooster' },
    '戌': { zh: '狗', en: 'Dog' },
    '亥': { zh: '猪', en: 'Pig' },
};

/**
 * Solar term boundaries (节气) for month pillar determination.
 * Each entry: [month, approximate start day]
 * The Chinese month starts at the 节 (Jie) term, not the 气 (Qi) term.
 */
const SOLAR_TERMS: [number, number][] = [
    [2, 4],   // 立春 Start of Spring → Month 1 (寅)
    [3, 6],   // 惊蛰 → Month 2 (卯)
    [4, 5],   // 清明 → Month 3 (辰)
    [5, 6],   // 立夏 → Month 4 (巳)
    [6, 6],   // 芒种 → Month 5 (午)
    [7, 7],   // 小暑 → Month 6 (未)
    [8, 7],   // 立秋 → Month 7 (申)
    [9, 8],   // 白露 → Month 8 (酉)
    [10, 8],  // 寒露 → Month 9 (戌)
    [11, 7],  // 立冬 → Month 10 (亥)
    [12, 7],  // 大雪 → Month 11 (子)
    [1, 6],   // 小寒 → Month 12 (丑)
];

// ─── Pillar Calculations ────────────────────────────────────────────────────

export interface Pillar {
    stem: string;
    stemEn: string;
    branch: string;
    branchEn: string;
    element: string;
    elementEn: string;
    polarity: 'Yang' | 'Yin';
    branchElement: string;
    branchElementEn: string;
}

export interface BaziChart {
    yearPillar: Pillar;
    monthPillar: Pillar;
    dayPillar: Pillar;
    hourPillar: Pillar | null;
    zodiac: { zh: string; en: string };
    dayMaster: { stem: string; stemEn: string; element: string; elementEn: string; polarity: 'Yang' | 'Yin' };
    elementBalance: Record<string, number>;
    dominantElement: { zh: string; en: string };
    weakestElement: { zh: string; en: string };
    currentYearTransit: Pillar;
    summary: string;
}

function makePillar(stemIdx: number, branchIdx: number): Pillar {
    const stem = HEAVENLY_STEMS[stemIdx % 10];
    const branch = EARTHLY_BRANCHES[branchIdx % 12];
    const stemInfo = STEM_ELEMENT[stem];
    const branchInfo = BRANCH_ELEMENT[branch];
    return {
        stem,
        stemEn: STEMS_EN[stemIdx % 10],
        branch,
        branchEn: BRANCHES_EN[branchIdx % 12],
        element: stemInfo.element,
        elementEn: stemInfo.elementEn,
        polarity: stemInfo.polarity,
        branchElement: branchInfo.element,
        branchElementEn: branchInfo.elementEn,
    };
}

/**
 * Calculate the Year Pillar.
 * The Chinese year starts at 立春 (Start of Spring, ~Feb 4).
 * Uses the sexagenary cycle with 甲子 = Year 4 in the common era cycle.
 */
function yearPillar(year: number, month: number, day: number): Pillar {
    // If before 立春 (~Feb 4), use previous year
    let adjustedYear = year;
    if (month < 2 || (month === 2 && day < 4)) {
        adjustedYear -= 1;
    }
    // Sexagenary cycle: Year 4 CE = 甲子 (index 0)
    const stemIdx = (adjustedYear - 4) % 10;
    const branchIdx = (adjustedYear - 4) % 12;
    return makePillar((stemIdx + 10) % 10, (branchIdx + 12) % 12);
}

/**
 * Calculate the Month Pillar.
 * Month is determined by solar terms (节气), not Gregorian months.
 * The month stem is derived from the year stem using the 五虎遁月 formula.
 */
function monthPillar(year: number, month: number, day: number): Pillar {
    // Determine Chinese month index (0-11, where 0 = 寅月)
    let chineseMonth = 0;
    for (let i = 0; i < SOLAR_TERMS.length; i++) {
        const [m, d] = SOLAR_TERMS[i];
        if (month > m || (month === m && day >= d)) {
            chineseMonth = i;
        }
    }
    // Handle wrap-around: January before 小寒 belongs to previous year's month 12
    if (month === 1 && day < SOLAR_TERMS[11][1]) {
        chineseMonth = 10; // 亥月 (month 10 of previous cycle)
    }

    // Branch: 寅 is index 2, so month branch = (chineseMonth + 2) % 12
    const branchIdx = (chineseMonth + 2) % 12;

    // Stem: determined by year stem using 五虎遁月 (Five Tiger Formula)
    let adjustedYear = year;
    if (month < 2 || (month === 2 && day < 4)) {
        adjustedYear -= 1;
    }
    const yearStemIdx = ((adjustedYear - 4) % 10 + 10) % 10;
    // Formula: monthStem = (yearStem % 5) * 2 + monthIndex
    const monthStemStart = (yearStemIdx % 5) * 2;
    const stemIdx = (monthStemStart + chineseMonth) % 10;

    return makePillar(stemIdx, branchIdx);
}

/**
 * Calculate the Day Pillar.
 * Uses the continuous sexagenary count from a known reference date.
 * Reference: Jan 1, 1900 = 甲戌 (Stem 0, Branch 10) → sexagenary index 10
 */
function dayPillar(year: number, month: number, day: number): Pillar {
    // Julian Day Number calculation (simplified Gregorian)
    const a = Math.floor((14 - month) / 12);
    const y = year + 4800 - a;
    const m = month + 12 * a - 3;
    const jdn = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045;

    // Reference: JDN of Jan 1, 1900 = 2415021, which is 甲戌 day
    // 甲 = stem 0, 戌 = branch 10, sexagenary index = 10
    const refJdn = 2415021;
    const refStemIdx = 0;
    const refBranchIdx = 10;

    const diff = jdn - refJdn;
    const stemIdx = ((refStemIdx + diff) % 10 + 10) % 10;
    const branchIdx = ((refBranchIdx + diff) % 12 + 12) % 12;

    return makePillar(stemIdx, branchIdx);
}

/**
 * Calculate the Hour Pillar.
 * Each Chinese "hour" (时辰) = 2 Western hours.
 * 子时 = 23:00-01:00, 丑时 = 01:00-03:00, etc.
 * Hour stem derived from day stem using 五鼠遁时 formula.
 */
function hourPillar(dayStemIdx: number, hour: number): Pillar {
    // Convert 24h to Chinese hour index (0-11)
    // 子时 starts at 23:00
    let branchIdx: number;
    if (hour >= 23 || hour < 1) branchIdx = 0;       // 子
    else if (hour < 3) branchIdx = 1;                  // 丑
    else if (hour < 5) branchIdx = 2;                  // 寅
    else if (hour < 7) branchIdx = 3;                  // 卯
    else if (hour < 9) branchIdx = 4;                  // 辰
    else if (hour < 11) branchIdx = 5;                 // 巳
    else if (hour < 13) branchIdx = 6;                 // 午
    else if (hour < 15) branchIdx = 7;                 // 未
    else if (hour < 17) branchIdx = 8;                 // 申
    else if (hour < 19) branchIdx = 9;                 // 酉
    else if (hour < 21) branchIdx = 10;                // 戌
    else branchIdx = 11;                                // 亥

    // 五鼠遁时 (Five Rat Formula): hourStemStart = (dayStem % 5) * 2
    const hourStemStart = (dayStemIdx % 5) * 2;
    const stemIdx = (hourStemStart + branchIdx) % 10;

    return makePillar(stemIdx, branchIdx);
}

// ─── Element Balance ────────────────────────────────────────────────────────

function calculateElementBalance(pillars: Pillar[]): Record<string, number> {
    const balance: Record<string, number> = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };

    for (const p of pillars) {
        balance[p.element] += 2;         // Stem contributes 2 points
        balance[p.branchElement] += 1.5; // Branch main qi contributes 1.5
    }

    return balance;
}

// ─── Main Export ─────────────────────────────────────────────────────────────

/**
 * Calculate a complete Bazi (Four Pillars) chart.
 *
 * @param birthDate  - ISO date string "YYYY-MM-DD"
 * @param birthTime  - Optional time string "HH:mm" (24h format)
 */
export function calculateBaziChart(birthDate: string, birthTime?: string): BaziChart {
    const [year, month, day] = birthDate.split('-').map(Number);

    const yp = yearPillar(year, month, day);
    const mp = monthPillar(year, month, day);
    const dp = dayPillar(year, month, day);

    let hp: Pillar | null = null;
    if (birthTime) {
        const [h] = birthTime.split(':').map(Number);
        const dayStemIdx = HEAVENLY_STEMS.indexOf(dp.stem as typeof HEAVENLY_STEMS[number]);
        hp = hourPillar(dayStemIdx, h);
    }

    // Zodiac from year branch
    const zodiac = BRANCH_ANIMAL[yp.branch];

    // Day Master (日主) — the day stem
    const dayStemInfo = STEM_ELEMENT[dp.stem];
    const dayMaster = {
        stem: dp.stem,
        stemEn: dp.stemEn,
        element: dayStemInfo.element,
        elementEn: dayStemInfo.elementEn,
        polarity: dayStemInfo.polarity,
    };

    // Element balance
    const allPillars = [yp, mp, dp, ...(hp ? [hp] : [])];
    const elementBalance = calculateElementBalance(allPillars);

    // Find dominant and weakest
    const entries = Object.entries(elementBalance);
    entries.sort((a, b) => b[1] - a[1]);
    const dominantEl = entries[0][0];
    const weakestEl = entries[entries.length - 1][0];

    const elIdx = FIVE_ELEMENTS.indexOf(dominantEl as any);
    const weakIdx = FIVE_ELEMENTS.indexOf(weakestEl as any);

    // Current year transit
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();
    const transit = yearPillar(currentYear, currentMonth, currentDay);

    // Generate summary
    const summary = [
        `四柱: ${yp.stem}${yp.branch} ${mp.stem}${mp.branch} ${dp.stem}${dp.branch}${hp ? ` ${hp.stem}${hp.branch}` : ''}`,
        `日主: ${dp.stem}${dp.stemEn} (${dayStemInfo.elementEn} ${dayStemInfo.polarity})`,
        `生肖: ${zodiac.zh} (${zodiac.en})`,
        `五行强弱: ${entries.map(([el, score]) => `${el}=${score.toFixed(1)}`).join(', ')}`,
        `最强: ${dominantEl}(${ELEMENTS_EN[elIdx]}) | 最弱: ${weakestEl}(${ELEMENTS_EN[weakIdx]})`,
        `流年: ${transit.stem}${transit.branch} (${transit.stemEn} ${transit.branchEn})`,
    ].join('\n');

    return {
        yearPillar: yp,
        monthPillar: mp,
        dayPillar: dp,
        hourPillar: hp,
        zodiac,
        dayMaster,
        elementBalance,
        dominantElement: { zh: dominantEl, en: ELEMENTS_EN[elIdx] },
        weakestElement: { zh: weakestEl, en: ELEMENTS_EN[weakIdx] },
        currentYearTransit: transit,
        summary,
    };
}

/**
 * Get a strategic interpretation hint for the AI based on the chart.
 */
export function getStrategicContext(chart: BaziChart): string {
    const dm = chart.dayMaster;
    const dominant = chart.dominantElement;
    const weakest = chart.weakestElement;
    const transit = chart.currentYearTransit;

    // Element interaction analysis
    const transitElement = STEM_ELEMENT[transit.stem].elementEn;

    return `
BAZI STRUCTURAL ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━
Day Master: ${dm.stemEn} (${dm.elementEn} ${dm.polarity})
- This person's core energy is ${dm.elementEn}. ${dm.polarity === 'Yang' ? 'They are action-oriented, decisive, and externally driven.' : 'They are strategic, adaptive, and internally driven.'}

Four Pillars: ${chart.yearPillar.stemEn}${chart.yearPillar.branchEn} | ${chart.monthPillar.stemEn}${chart.monthPillar.branchEn} | ${chart.dayPillar.stemEn}${chart.dayPillar.branchEn}${chart.hourPillar ? ` | ${chart.hourPillar.stemEn}${chart.hourPillar.branchEn}` : ''}

Zodiac: ${chart.zodiac.en} (${chart.zodiac.zh})

Element Balance:
- Dominant: ${dominant.en} (${dominant.zh}) — This person has excess ${dominant.en} energy
- Weakest: ${weakest.en} (${weakest.zh}) — They need more ${weakest.en} to balance
- ${Object.entries(chart.elementBalance).map(([el, s]) => `${el}=${s.toFixed(1)}`).join(' | ')}

Current Year Transit: ${transit.stemEn} ${transit.branchEn} (${transitElement})
- The ${transitElement} energy of this year ${transitElement === dm.elementEn ? 'SUPPORTS the Day Master directly — a strong personal year' : `interacts with ${dm.elementEn} Day Master — analyze the productive/destructive cycle`}

STRATEGIC IMPLICATIONS:
- If ${dominant.en} is overpowering: recommend activities aligned with its controller (${getController(dominant.en)})
- If ${weakest.en} is critically low: suggest incorporating ${weakest.en} energy (${getElementAdvice(weakest.en)})
━━━━━━━━━━━━━━━━━━━━━━━━━
`;
}

function getController(element: string): string {
    const controls: Record<string, string> = {
        'Wood': 'Metal (structure, systems, discipline)',
        'Fire': 'Water (calm analysis, patience, strategy)',
        'Earth': 'Wood (growth, innovation, expansion)',
        'Metal': 'Fire (passion, marketing, visibility)',
        'Water': 'Earth (stability, process, grounding)',
    };
    return controls[element] || element;
}

function getElementAdvice(element: string): string {
    const advice: Record<string, string> = {
        'Wood': 'growth initiatives, education, creative projects, starting new ventures',
        'Fire': 'networking, marketing, public speaking, raising visibility',
        'Earth': 'building processes, consolidation, real estate, team stability',
        'Metal': 'financial planning, technology, legal structures, optimization',
        'Water': 'research, reflection, travel, building connections behind the scenes',
    };
    return advice[element] || element;
}
