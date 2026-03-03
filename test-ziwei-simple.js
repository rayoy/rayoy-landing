// 紫微斗数测试 - 纯 JS 实现

const HEAVENLY_STEMS = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
const EARTHLY_BRANCHES = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];

const PALACE_NAMES = [
    '命宫', '兄弟宫', '夫妻宫', '子女宫', '财帛宫', '疾厄宫',
    '迁移宫', '交友宫', '官禄宫', '田宅宫', '福德宫', '父母宫'
];

const MAJOR_STARS = ['紫微','天机','太阳','武曲','天同','廉贞','天府','太阴','贪狼','巨门','天相','天梁','七杀','破军'];

const FIVE_ELEMENT_CODES = {
    // 水二局
    '丙子':'水二局', '丁丑':'水二局', '甲寅':'水二局', '乙卯':'水二局', '壬辰':'水二局', '癸巳':'水二局',
    '丙午':'水二局', '丁未':'水二局', '甲申':'水二局', '乙酉':'水二局', '壬戌':'水二局', '癸亥':'水二局',
    // 木三局
    '戊子':'木三局', '己丑':'木三局', '丙寅':'木三局', '丁卯':'木三局', '甲辰':'木三局', '乙巳':'木三局',
    '戊午':'木三局', '己未':'木三局', '丙申':'木三局', '丁酉':'木三局', '甲戌':'木三局', '乙亥':'木三局',
    // 金四局
    '庚子':'金四局', '辛丑':'金四局', '戊寅':'金四局', '己卯':'金四局', '丙辰':'金四局', '丁巳':'金四局',
    '庚午':'金四局', '辛未':'金四局', '戊申':'金四局', '己酉':'金四局', '丙戌':'金四局', '丁亥':'金四局',
    // 土五局
    '壬子':'土五局', '癸丑':'土五局', '庚寅':'土五局', '辛卯':'土五局', '戊辰':'土五局', '己巳':'土五局',
    '壬午':'土五局', '癸未':'土五局', '庚申':'土五局', '辛酉':'土五局', '戊戌':'土五局', '己亥':'土五局',
    // 火六局
    '甲子':'火六局', '乙丑':'火六局', '壬寅':'火六局', '癸卯':'火六局', '庚辰':'火六局', '辛巳':'火六局',
    '甲午':'火六局', '乙未':'火六局', '壬申':'火六局', '癸酉':'火六局', '庚戌':'火六局', '辛亥':'火六局',
};

const FIVE_ELEMENT_JU = {'水二局':2, '木三局':3, '金四局':4, '土五局':5, '火六局':6};

const TRANSFORMATIONS = {
    '甲': { lu: '廉贞', quan: '破军', ke: '武曲', ji: '太阳' },
    '乙': { lu: '天机', quan: '天梁', ke: '紫微', ji: '太阴' },
    '丙': { lu: '天同', quan: '天机', ke: '文昌', ji: '廉贞' },
    '丁': { lu: '太阴', quan: '天同', ke: '天机', ji: '巨门' },
    '戊': { lu: '贪狼', quan: '太阴', ke: '右弼', ji: '天机' },
    '己': { lu: '武曲', quan: '贪狼', ke: '天梁', ji: '文曲' },
    '庚': { lu: '太阳', quan: '武曲', ke: '太阴', ji: '天同' },
    '辛': { lu: '巨门', quan: '太阳', ke: '文曲', ji: '文昌' },
    '壬': { lu: '天梁', quan: '紫微', ke: '左辅', ji: '武曲' },
    '癸': { lu: '破军', quan: '巨门', ke: '太阴', ji: '贪狼' },
};

function getYearStemIndex(year) {
    return (year - 4) % 10;
}

function calculateLifePalaceBranch(month, hour) {
    const startBranch = 2; // 寅
    const afterMonth = (startBranch + (month - 1)) % 12;
    const hourIndex = Math.floor(((hour + 1) % 24) / 2);
    return (afterMonth - hourIndex + 12) % 12;
}

function calculateBodyPalaceBranch(month, hour) {
    const startBranch = 2; // 寅
    const afterMonth = (startBranch + (month - 1)) % 12;
    const hourIndex = Math.floor(((hour + 1) % 24) / 2);
    return (afterMonth + hourIndex) % 12;
}

function getPalaceStem(palaceBranchIndex, yearStemIndex) {
    const stemIndex = (yearStemIndex + palaceBranchIndex - 2 + 10) % 10;
    return HEAVENLY_STEMS[stemIndex];
}

function placeMajorStars(ziWeiPos) {
    const positions = {};
    positions['紫微'] = ziWeiPos;
    positions['天机'] = (ziWeiPos + 11) % 12;
    positions['太阳'] = (ziWeiPos + 3) % 12;
    positions['武曲'] = (ziWeiPos + 4) % 12;
    positions['天同'] = (ziWeiPos + 5) % 12;
    positions['廉贞'] = (ziWeiPos + 8) % 12;
    
    const tianFuPos = (ziWeiPos + 6) % 12;
    positions['天府'] = tianFuPos;
    positions['太阴'] = (tianFuPos + 1) % 12;
    positions['贪狼'] = (tianFuPos + 2) % 12;
    positions['巨门'] = (tianFuPos + 3) % 12;
    positions['天相'] = (tianFuPos + 4) % 12;
    positions['天梁'] = (tianFuPos + 5) % 12;
    positions['七杀'] = (tianFuPos + 6) % 12;
    positions['破军'] = (tianFuPos + 10) % 12;
    
    return positions;
}

function calculateZiweiChart(year, month, day, hour) {
    const lifePalaceBranchIdx = calculateLifePalaceBranch(month, hour);
    const bodyPalaceBranchIdx = calculateBodyPalaceBranch(month, hour);
    const yearStemIdx = getYearStemIndex(year);
    const lifePalaceStem = getPalaceStem(lifePalaceBranchIdx, yearStemIdx);
    const lifePalaceGanZhi = lifePalaceStem + EARTHLY_BRANCHES[lifePalaceBranchIdx];
    const fiveElementCode = FIVE_ELEMENT_CODES[lifePalaceGanZhi];
    
    if (!fiveElementCode) {
        console.error('Unknown palace:', lifePalaceGanZhi);
        throw new Error(`Unknown palace: ${lifePalaceGanZhi}`);
    }
    
    const mingJu = FIVE_ELEMENT_JU[fiveElementCode];
    
    const quotient = Math.floor((day - 1) / mingJu);
    const ziWeiPos = (2 + quotient) % 12;
    
    const starPositions = placeMajorStars(ziWeiPos);
    const yearStem = HEAVENLY_STEMS[yearStemIdx];
    const trans = TRANSFORMATIONS[yearStem];
    
    const palaces = [];
    for (let i = 0; i < 12; i++) {
        const branch = EARTHLY_BRANCHES[i];
        const stem = getPalaceStem(i, yearStemIdx);
        const majorStars = [];
        
        for (const [star, pos] of Object.entries(starPositions)) {
            if (pos === i) majorStars.push(star);
        }
        
        const transformations = {};
        majorStars.forEach(star => {
            if (trans.lu === star) transformations.lu = star;
            if (trans.quan === star) transformations.quan = star;
            if (trans.ke === star) transformations.ke = star;
            if (trans.ji === star) transformations.ji = star;
        });
        
        palaces.push({
            index: i,
            name: PALACE_NAMES[i],
            branch,
            stem,
            majorStars,
            transformations: Object.keys(transformations).length > 0 ? transformations : null,
            isLifePalace: i === lifePalaceBranchIdx,
            isBodyPalace: i === bodyPalaceBranchIdx,
        });
    }
    
    return {
        birthYear: year,
        birthMonth: month,
        birthDay: day,
        birthHour: hour,
        lifePalace: palaces[lifePalaceBranchIdx],
        bodyPalace: palaces[bodyPalaceBranchIdx],
        fiveElementCode,
        mingJu,
        palaces,
        ziWeiPosition: ziWeiPos,
        transformations: trans,
        yearStem,
        lifePalaceGanZhi,
    };
}

// 生成报告
const chart = calculateZiweiChart(1990, 5, 15, 9);

console.log('\n═══════════════════════════════════════════════════════════════');
console.log('           紫 微 斗 数 命 盘 分 析 报 告');
console.log('═══════════════════════════════════════════════════════════════\n');

console.log('【基本信息】');
console.log(`出生日期: ${chart.birthYear}年${chart.birthMonth}月${chart.birthDay}日 ${chart.birthHour}:00 (巳时)`);
console.log(`性别: 男`);
console.log(`年干: ${chart.yearStem}`);
console.log(`命宫干支: ${chart.lifePalaceGanZhi}`);
console.log(`五行局: ${chart.fiveElementCode} (${chart.mingJu}局)\n`);

console.log('【命宫详解】');
const lp = chart.lifePalace;
console.log(`命宫位置: ${lp.name} (${lp.stem}${lp.branch})`);
console.log(`主星: ${lp.majorStars.join('、') || '无主星'}`);
if (lp.transformations) {
    const trans = [];
    if (lp.transformations.lu) trans.push(`化禄-${lp.transformations.lu}`);
    if (lp.transformations.quan) trans.push(`化权-${lp.transformations.quan}`);
    if (lp.transformations.ke) trans.push(`化科-${lp.transformations.ke}`);
    if (lp.transformations.ji) trans.push(`化忌-${lp.transformations.ji}`);
    if (trans.length) console.log(`四化: ${trans.join('、')}`);
}
console.log('');

console.log('【身宫位置】');
const bp = chart.bodyPalace;
console.log(`身宫: ${bp.name} (${bp.stem}${bp.branch})`);
console.log(`主星: ${bp.majorStars.join('、') || '无主星'}\n`);

console.log('【紫微星位置】');
console.log(`紫微星位于: ${PALACE_NAMES[chart.ziWeiPosition]}\n`);

console.log('【四化飞星 (年干: ' + chart.yearStem + ')】');
console.log(`化禄: ${chart.transformations.lu} - 财运、福气`);
console.log(`化权: ${chart.transformations.quan} - 权力、掌控`);
console.log(`化科: ${chart.transformations.ke} - 名声、学业`);
console.log(`化忌: ${chart.transformations.ji} - 阻碍、执着\n`);

console.log('【十二宫主星分布】');
console.log('───────────────────────────────────────────────');
chart.palaces.forEach((palace, idx) => {
    const stars = palace.majorStars.join('、').padEnd(12) || '　　　　　　';
    const transMark = [];
    if (palace.transformations?.lu) transMark.push('禄');
    if (palace.transformations?.quan) transMark.push('权');
    if (palace.transformations?.ke) transMark.push('科');
    if (palace.transformations?.ji) transMark.push('忌');
    const markStr = transMark.length ? `[${transMark.join('')}]` : '　　　';
    const special = palace.isLifePalace ? ' ★命宫' : palace.isBodyPalace ? ' ◆身宫' : '';
    
    const line = `${String(idx+1).padStart(2)}. ${palace.name} (${palace.stem}${palace.branch}) ${markStr} ${stars}${special}`;
    console.log(line);
});
console.log('───────────────────────────────────────────────\n');

console.log('【三方四正】');
const lifeIdx = chart.lifePalace.index;
const wealth = (lifeIdx + 4) % 12;
const career = (lifeIdx + 8) % 12;
const travel = (lifeIdx + 6) % 12;
console.log('命宫三方四正宫位:');
console.log(`  • ${chart.palaces[lifeIdx].name}: ${chart.palaces[lifeIdx].majorStars.join('、') || '无主星'}`);
console.log(`  • ${chart.palaces[wealth].name}: ${chart.palaces[wealth].majorStars.join('、') || '无主星'}`);
console.log(`  • ${chart.palaces[career].name}: ${chart.palaces[career].majorStars.join('、') || '无主星'}`);
console.log(`  • ${chart.palaces[travel].name}: ${chart.palaces[travel].majorStars.join('、') || '无主星'}`);
console.log('');

console.log('【结构简析】');
console.log('───────────────────────────────────────────────');
console.log(`• 命宫主星: ${lp.majorStars.join('、') || '无'}`);
console.log(`• 五行局数: ${chart.mingJu}局 - 影响大限起始年龄`);
console.log(`• 紫微位置: ${PALACE_NAMES[chart.ziWeiPosition]} - 帝星所在，格局高低关键`);
console.log(`• 身宫位置: ${bp.name} - 后天发展、中年运势`);
console.log(`• 四化重点: ${chart.transformations.lu}化禄(财)、${chart.transformations.quan}化权(权)、${chart.transformations.ke}化科(名)、${chart.transformations.ji}化忌(滞)`);
console.log('───────────────────────────────────────────────\n');

console.log('═══════════════════════════════════════════════════════════════');
console.log('                    报 告 生 成 完 成');
console.log('═══════════════════════════════════════════════════════════════\n');
