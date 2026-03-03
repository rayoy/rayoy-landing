import { astro } from 'iztro';

// 1990-05-15 09:00, 1=Male, true=solar, zh-CN=lang
const chart = astro.bySolar('1990-05-15', 9, '男', true, 'zh-CN');
console.log(JSON.stringify(chart, null, 2));
