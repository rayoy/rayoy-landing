// Test script for Ziwei calculation
// Run with: node --import ./register.mjs test-ziwei.mjs

import { calculateZiweiChart, getZiweiStrategicContext, getSanFangSiZheng } from './lib/ziwei.ts';

const PALACE_NAMES = [
    '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
    '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
];

// 测试数据：1990年5月15日 上午9点 (巳时)
const chart = calculateZiweiChart(1990, 5, 15, 9, 'M');

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('           紫 微 斗 数 命 盘 分 析 报 告');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('【基本信息】');
console.log(`出生日期: ${chart.birthYear}年${chart.birthMonth}月${chart.birthDay}日 ${chart.birthHour}:00 (巳时)`);
console.log(`性别: 男`);
console.log(`五行局: ${chart.fiveElementCode} (${chart.mingJu}局)\n`);

console.log('【命宫详解】');
const lp = chart.lifePalace;
console.log(`命宫位置: ${lp.name} (${lp.stem}${lp.branch})`);
console.log(`主星: ${lp.majorStars.map(s => s.name).join('、') || '无主星'}`);
if (lp.transformations) {
    const trans = [];
    if (lp.transformations.lu) trans.push(`化禄-${lp.transformations.lu.name}`);
    if (lp.transformations.quan) trans.push(`化权-${lp.transformations.quan.name}`);
    if (lp.transformations.ke) trans.push(`化科-${lp.transformations.ke.name}`);
    if (lp.transformations.ji) trans.push(`化忌-${lp.transformations.ji.name}`);
    if (trans.length) console.log(`四化: ${trans.join('、')}`);
}
console.log('');

console.log('【身宫位置】');
const bp = chart.bodyPalace;
console.log(`身宫: ${bp.name} (${bp.stem}${bp.branch})`);
console.log(`主星: ${bp.majorStars.map(s => s.name).join('、') || '无主星'}\n`);

console.log('【紫微星位置】');
const zwPos = chart.ziWeiPosition;
console.log(`紫微星位于: ${PALACE_NAMES[zwPos]}\n`);

console.log('【四化飞星】');
console.log(`化禄: ${chart.transformations['化禄']} - 财运、福气`);
console.log(`化权: ${chart.transformations['化权']} - 权力、掌控`);
console.log(`化科: ${chart.transformations['化科']} - 名声、学业`);
console.log(`化忌: ${chart.transformations['化忌']} - 阻碍、执着\n`);

console.log('【十二宫主星分布】');
console.log('───────────────────────────────────────────────');
chart.palaces.forEach((palace, idx) => {
    const stars = palace.majorStars.map(s => s.name).join(' ') || '　　　　';
    const transMark = [];
    if (palace.transformations?.lu) transMark.push('禄');
    if (palace.transformations?.quan) transMark.push('权');
    if (palace.transformations?.ke) transMark.push('科');
    if (palace.transformations?.ji) transMark.push('忌');
    const markStr = transMark.length ? `[${transMark.join('')}]` : '　　　';
    const special = palace.isLifePalace ? ' ★命宫' : palace.isBodyPalace ? ' ◆身宫' : '';
    
    console.log(`${String(idx+1).padStart(2)}. ${palace.name.padEnd(4)} (${palace.stem}${palace.branch}) ${markStr} ${stars.padEnd(14)}${special}`);
});
console.log('───────────────────────────────────────────────\n');

console.log('【三方四正】');
const sfzz = getSanFangSiZheng(chart.lifePalace.index);
console.log('命宫三方四正宫位:');
sfzz.forEach(idx => {
    const p = chart.palaces[idx];
    console.log(`  • ${p.name}: ${p.majorStars.map(s => s.name).join('、') || '无主星'}`);
});
console.log('');

console.log('【命盘结构简析】');
console.log(getZiweiStrategicContext(chart));

console.log('═══════════════════════════════════════════════════════════════');
console.log('                    报 告 生 成 完 成');
console.log('═══════════════════════════════════════════════════════════════\n');
