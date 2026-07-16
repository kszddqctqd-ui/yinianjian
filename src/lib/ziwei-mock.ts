// 紫微斗数模拟计算（基于八字结果生成模拟数据）
import { calculateBaZi, type BaZiResult } from './bazi';

// ZiweiResult 类型定义
interface ZiweiPalace {
  name: string;
  heavenlyStem: string;
  earthlyBranch: string;
  majorStars: { name: string; type: string; brightness: string }[];
  minorStars: { name: string; type: string; brightness: string }[];
  adjStars: { name: string; type: string }[];
  decadalRange: number[];
  sanFangSiZheng: string[];
  isBodyPalace: boolean;
  changsheng12: string;
}

interface ZiweiResult {
  solarDate: string;
  lunarDate: string;
  fourPillars: { year: { gan: string; zhi: string }; month: { gan: string; zhi: string }; day: { gan: string; zhi: string }; hour: { gan: string; zhi: string } };
  soul: string;
  body: string;
  fiveElement: string;
  zodiac: string;
  sign: string;
  palaces: ZiweiPalace[];
}

// 紫微斗数十二宫位名称
const PALACE_NAMES = [
  '命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄',
  '迁移', '仆役', '官禄', '田宅', '福德', '父母'
];

// 主星列表
const MAJOR_STARS = [
  { name: '紫微', type: '主星', brightness: '庙' },
  { name: '天机', type: '主星', brightness: '庙' },
  { name: '太阳', type: '主星', brightness: '旺' },
  { name: '武曲', type: '主星', brightness: '庙' },
  { name: '天同', type: '主星', brightness: '庙' },
  { name: '廉贞', type: '主星', brightness: '平' },
  { name: '天府', type: '主星', brightness: '庙' },
  { name: '太阴', type: '主星', brightness: '旺' },
  { name: '贪狼', type: '主星', brightness: '庙' },
  { name: '巨门', type: '主星', brightness: '庙' },
  { name: '天相', type: '主星', brightness: '庙' },
  { name: '天梁', type: '主星', brightness: '庙' },
  { name: '七杀', type: '主星', brightness: '庙' },
  { name: '破军', type: '主星', brightness: '旺' },
  { name: '廉贞', type: '主星', brightness: '平' },
];

// 辅星列表
const MINOR_STARS = [
  { name: '文昌', type: '吉星', brightness: '庙' },
  { name: '文曲', type: '吉星', brightness: '庙' },
  { name: '左辅', type: '吉星', brightness: '庙' },
  { name: '右弼', type: '吉星', brightness: '庙' },
  { name: '天魁', type: '吉星', brightness: '庙' },
  { name: '天钺', type: '吉星', brightness: '庙' },
  { name: '禄存', type: '吉星', brightness: '庙' },
  { name: '天马', type: '吉星', brightness: '庙' },
  { name: '火星', type: '煞星', brightness: '庙' },
  { name: '铃星', type: '煞星', brightness: '庙' },
  { name: '擎羊', type: '煞星', brightness: '庙' },
  { name: '陀罗', type: '煞星', brightness: '庙' },
];

// 根据八字结果生成紫微斗数结果
export function generateZiweiFromBaZi(baZiResult: BaZiResult): ZiweiResult {
  // 使用八字结果的某些属性作为种子
  const seed = baZiResult.weekDay.charCodeAt(0) + baZiResult.xingzuo.charCodeAt(0);
  
  // 生成十二宫位
  const palaces = PALACE_NAMES.map((name, i) => {
    // 随机分配主星
    const majorStarCount = (seed + i) % 3; // 0-2颗主星
    const majorStars = [];
    for (let j = 0; j < majorStarCount; j++) {
      const starIndex = (seed + i + j * 7) % MAJOR_STARS.length;
      majorStars.push(MAJOR_STARS[starIndex]);
    }
    
    // 随机分配辅星
    const minorStarCount = (seed + i) % 5; // 0-4颗辅星
    const minorStars = [];
    for (let j = 0; j < minorStarCount; j++) {
      const starIndex = (seed + i + j * 11) % MINOR_STARS.length;
      minorStars.push(MINOR_STARS[starIndex]);
    }
    
    // 随机分配相邻星
    const adjStarCount = (seed + i) % 3; // 0-2颗
    const adjStars = [];
    for (let j = 0; j < adjStarCount; j++) {
      const starName = ['天刑', '天姚', '天月', '天哭', '天虚', '红鸾', '天喜', '天德'][j % 8];
      adjStars.push({ name: starName, type: '杂曜' });
    }
    
    return {
      name,
      heavenlyStem: ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'][(i + seed) % 10],
      earthlyBranch: ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'][(i + seed) % 12],
      majorStars,
      minorStars,
      adjStars,
      decadalRange: [(i * 10 + 2), (i * 10 + 11)],
      sanFangSiZheng: [PALACE_NAMES[(i + 1) % 12], PALACE_NAMES[(i + 4) % 12], PALACE_NAMES[(i + 7) % 12]],
      isBodyPalace: i === (seed % 12),
      changsheng12: ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'][i % 12],
    };
  });
  
  // 确定命宫和身宫
  const mingGongIndex = seed % 12;
  const shenGongIndex = (seed + 6) % 12;
  
  // 五行局
  const fiveElements = ['金二局', '木三局', '水四局', '火五局', '土六局'];
  
  // 生肖
  const zodiac = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
  
  return {
    solarDate: '2026年7月16日',
    lunarDate: '二〇二六年六月廿三',
    fourPillars: {
      year: baZiResult.year,
      month: baZiResult.month,
      day: baZiResult.day,
      hour: baZiResult.hour,
    },
    soul: palaces[mingGongIndex].majorStars[0]?.name || '无主星',
    body: palaces[shenGongIndex].majorStars[0]?.name || '无主星',
    fiveElement: fiveElements[(seed + mingGongIndex) % fiveElements.length],
    zodiac: zodiac[(seed + mingGongIndex) % zodiac.length],
    sign: baZiResult.xingzuo || '未知',
    palaces,
  };
}
