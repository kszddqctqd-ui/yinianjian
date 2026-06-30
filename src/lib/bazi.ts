// 使用 lunar-javascript 权威库进行八字排盘
import { Solar } from 'lunar-javascript';

export interface BaZiResult {
  year: { gan: string; zhi: string; naYin: string; shiShen: string; hideGan: string[] };
  month: { gan: string; zhi: string; naYin: string; shiShen: string; hideGan: string[] };
  day: { gan: string; zhi: string; naYin: string; shiShen: string; hideGan: string[] };
  hour: { gan: string; zhi: string; naYin: string; shiShen: string; hideGan: string[] };
  wuXingCount: Record<string, number>;
  riZhu: string;
  xunKong: string[];
  daYun: { startAge: number; endAge: number; ganZhi: string }[];
  qiYunAge: number;
  qiYunMonths: number;
  qiYunDays: number;
  isForward: boolean;
  weekDay: string;
  xingzuo: string;
  chong: string;
  chongDesc: string;
  jiShen: string[];
  xiongSha: string;
}

export function calculateBaZi(
  year: number,
  month: number,
  day: number,
  hour: number,
): BaZiResult {
  const solar = Solar.fromYmdHms(year, month, day, hour, 0, 0);
  const lunar = solar.getLunar();
  const ef = lunar.getEightChar();

  const yearGan = ef.getYearGan();
  const yearZhi = ef.getYearZhi();
  const monthGan = ef.getMonthGan();
  const monthZhi = ef.getMonthZhi();
  const dayGan = ef.getDayGan();
  const dayZhi = ef.getDayZhi();
  const hourGan = ef.getTimeGan();
  const hourZhi = ef.getTimeZhi();

  const yearNaYin = ef.getYearNaYin();
  const monthNaYin = ef.getMonthNaYin();
  const dayNaYin = ef.getDayNaYin();
  const hourNaYin = ef.getTimeNaYin();

  const yearShiShen = ef.getYearShiShenGan();
  const monthShiShen = ef.getMonthShiShenGan();
  const dayShiShen = ef.getDayShiShenGan();
  const hourShiShen = ef.getTimeShiShenGan();

  const yearHideGan = ef.getYearHideGan();
  const monthHideGan = ef.getMonthHideGan();
  const dayHideGan = ef.getDayHideGan();
  const hourHideGan = ef.getTimeHideGan();

  const xunKong = ef.getDayXunKong() || [];

  const wuXingMap: Record<string, string> = {
    '甲': '木', '乙': '木',
    '丙': '火', '丁': '火',
    '戊': '土', '己': '土',
    '庚': '金', '辛': '金',
    '壬': '水', '癸': '水',
    '子': '水', '丑': '土', '寅': '木', '卯': '木',
    '辰': '土', '巳': '火', '午': '火', '未': '土',
    '申': '金', '酉': '金', '戌': '土', '亥': '水',
  };

  const wuXingCount: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
  [yearGan, yearZhi, monthGan, monthZhi, dayGan, dayZhi, hourGan, hourZhi].forEach((v) => {
    if (wuXingMap[v]) wuXingCount[wuXingMap[v]]++;
  });

  const yun = ef.getYun();
  const qiYunAge = yun.getStartYear();
  const qiYunMonths = yun.getStartMonth();
  const qiYunDays = yun.getStartDay();
  const isForward = yun.isForward();

  const daYunArr = yun.getDaYun();
  const birthYear = solar.getYear();
  const daYun = daYunArr.slice(1).map((item: any) => ({
    startAge: item.getStartYear() - birthYear,
    endAge: item.getStartYear() - birthYear + 10,
    ganZhi: item.getGanZhi(),
  }));

  const weekDay = solar.getWeekInChinese();
  const xingzuo = solar.getXingzuo();
  const chong = lunar.getChong();
  const chongDesc = lunar.getChongDesc();
  const yiArr = lunar.getDayYi() || [];
  const jiArr = lunar.getDayJi() || [];
  const xiongSha = lunar.getDayXiongSha() || '';

  return {
    year: { gan: yearGan, zhi: yearZhi, naYin: yearNaYin, shiShen: yearShiShen, hideGan: yearHideGan },
    month: { gan: monthGan, zhi: monthZhi, naYin: monthNaYin, shiShen: monthShiShen, hideGan: monthHideGan },
    day: { gan: dayGan, zhi: dayZhi, naYin: dayNaYin, shiShen: dayShiShen, hideGan: dayHideGan },
    hour: { gan: hourGan, zhi: hourZhi, naYin: hourNaYin, shiShen: hourShiShen, hideGan: hourHideGan },
    wuXingCount,
    riZhu: `${dayGan}${dayZhi}`,
    xunKong: Array.isArray(xunKong) ? xunKong : [],
    daYun,
    qiYunAge,
    qiYunMonths,
    qiYunDays,
    isForward,
    weekDay,
    xingzuo,
    chong,
    chongDesc,
    jiShen: [...(Array.isArray(yiArr) ? yiArr : [])],
    xiongSha,
  };
}

export const TIAN_GAN_WUXING: Record<string, string> = {
  '甲': '木', '乙': '木',
  '丙': '火', '丁': '火',
  '戊': '土', '己': '土',
  '庚': '金', '辛': '金',
  '壬': '水', '癸': '水',
};

export const DI_ZHI_WUXING: Record<string, string> = {
  '子': '水', '丑': '土', '寅': '木', '卯': '木',
  '辰': '土', '巳': '火', '午': '火', '未': '土',
  '申': '金', '酉': '金', '戌': '土', '亥': '水',
};

export function getShiShen(gan: string, riGan: string): string {
  const woWuXing = TIAN_GAN_WUXING[riGan];
  const taWuXing = TIAN_GAN_WUXING[gan];

  if (woWuXing === taWuXing) {
    return '比肩';
  }

  const shengCycle = ['木', '火', '土', '金', '水'];
  const woIdx = shengCycle.indexOf(woWuXing);
  const taIdx = shengCycle.indexOf(taWuXing);

  if ((taIdx - woIdx + 5) % 5 === 1) return '食神';
  if ((taIdx - woIdx + 5) % 5 === 4) return '正印';
  if ((taIdx - woIdx + 5) % 5 === 2) return '七杀';
  if ((taIdx - woIdx + 5) % 5 === 3) return '正财';
  return '?';
}
