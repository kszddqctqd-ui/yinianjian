'use client';

import { useState, useEffect, useMemo } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { t, getLocale, shichenLabels } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

function resolve(key: string): string {
  return t(key);
}

// 时辰吉凶数据（基于传统黄历）
const SHICHEN_JIXIONG: Record<string, { ji: string[]; xiong: string[] }> = {
  zi:  { ji: ['求仙', '宴饮'], xiong: ['出行', '嫁娶'] },
  chou:{ ji: ['交易', '立券'], xiong: ['动土', '破土'] },
  yin: { ji: ['祭祀', '祈福'], xiong: ['安葬', '伐木'] },
  mao: { ji: ['出行', '嫁娶'], xiong: ['动土', '开仓'] },
  chen:{ ji: ['交易', '祭祀'], xiong: ['安床', '栽种'] },
  si:  { ji: ['祈福', '求嗣'], xiong: ['词讼', '远行'] },
  wu:  { ji: ['出行', '移徙'], xiong: ['安门', '服药'] },
  wei: { ji: ['嫁娶', '祭祀'], xiong: ['开市', '安葬'] },
  shen:{ ji: ['交易', '出行'], xiong: ['动土', '破土'] },
  you: { ji: ['祭祀', '祈福'], xiong: ['安床', '作灶'] },
  xu:  { ji: ['嫁娶', '开市'], xiong: ['词讼', '打劫'] },
  hai: { ji: ['出行', '求嗣'], xiong: ['安葬', '修造'] },
};

// 黄历单日数据接口
interface DayAlmanac {
  date: string;
  lunarDate: string;
  ganZhi: { year: string; month: string; day: string; hour: string };
  yi: string[];
  ji: string[];
  chong: string;
  chongGanZhi: string;
  xingzuo: string;
  weekDay: string;
  jieQi: string;
  solarDateObj: Date;
  jiXiongLevel: string;
  jiShen: string[];
  xiongShen: string[];
  taiShen: string;
  twentyEightXiu: string;
  twelveJianChu: string;
}

// 模拟黄历数据（不依赖 lunar-javascript）
function getDayAlmanac(date: Date, lang: SupportedLang): DayAlmanac {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 简单的干支计算（基于年份偏移）
  const ganZhiYear = ['庚子','辛丑','壬寅','癸卯','甲辰','乙巳','丙午','丁未','戊申','己酉','庚戌','辛亥'][year % 12];
  const ganZhiMonth = ['己丑','庚寅','辛卯','壬辰','癸巳','甲午','乙未','丙申','丁酉','戊戌','己亥','庚子'][month % 12];
  const ganZhiDay = `${['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][(year + month + day) % 10]}${['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][(year + month + day) % 12]}`;
  const ganZhiHour = `${['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][(year + month + day) % 10]}${['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][(year + month + day) % 12]}`;
  
  // 生肖
  const zodiacAnimals = ['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'];
  const chongAnimal = zodiacAnimals[(year - 4 + 6) % 12];
  const chongBranch = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'][(year - 4 + 6) % 12];
  const chongGan = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'][(year - 4) % 10];
  
  // 星座
  const xingzuo = day < 20 ? ['摩羯','水瓶','双鱼','白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手'][month - 1] : ['摩羯','水瓶','双鱼','白羊','金牛','双子','巨蟹','狮子','处女','天秤','天蝎','射手'][month % 12];
  
  // 星期
  const weekDays = lang === 'en' ? ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] : ['周日','周一','周二','周三','周四','周五','周六'];
  
  // 宜忌（模拟数据）
  const yiOptions = ['祭祀','祈福','求嗣','出行','嫁娶','安床','移徙','动土','破土','纳财','开市','立券','交易'];
  const jiOptions = ['安葬','词讼','远行','服食','开仓'];
  const seed = year * 10000 + month * 100 + day;
  const yi = yiOptions.filter((_, i) => (seed + i * 7) % 3 !== 0).slice(0, 5);
  const ji = jiOptions.filter((_, i) => (seed + i * 11) % 2 !== 0).slice(0, 2);
  
  return {
    date: lang === 'en' ? `${year}-${month}-${day}` : `${year}年${month}月${day}日`,
    lunarDate: `${ganZhiYear}年`,
    ganZhi: { year: ganZhiYear, month: ganZhiMonth, day: ganZhiDay, hour: ganZhiHour },
    yi,
    ji,
    chong: `${chongGan}${chongBranch} ${chongAnimal}`,
    chongGanZhi: `${chongGan}${chongBranch}`,
    xingzuo: xingzuo,
    weekDay: weekDays[date.getDay()],
    jieQi: '',
    solarDateObj: date,
    jiXiongLevel: yi.length >= 4 ? '上吉' : '中吉',
    jiShen: ['天德','月德','天恩','续世'],
    xiongShen: ['月煞','月虚','血支'],
    taiShen: `床${['东','西','南','北'][seed % 4]}`,
    twentyEightXiu: ['角','亢','氐','房','心','尾','箕','斗','牛','女','虚','危','室','壁','奎','娄','胃','昴','毕','觜','参','井','鬼','柳','星','张','翼','轸'][seed % 28],
    twelveJianChu: ['建','除','满','平','定','执','破','危','成','收','开','闭'][seed % 12],
  };
}

export default function AlmanacPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0); // 0=今天, 1=明天, ...6=后日
  const [almanacs, setAlmanacs] = useState<DayAlmanac[]>([]);

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  // 生成未来7天的黄历数据
  useEffect(() => {
    const days: DayAlmanac[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      days.push(getDayAlmanac(d, lang));
    }
    setAlmanacs(days);
    setLoading(false);
  }, [lang]);

  const current = almanacs[selectedIndex] || almanacs[0];

  // 获取时辰吉凶
  function getShichenJiXiong(key: string, hour: number): { isJi: boolean; isXiong: boolean } {
    const info = SHICHEN_JIXIONG[key];
    if (!info) return { isJi: false, isXiong: false };
    // 简单映射：子时=0, 丑时=2, ... 亥时=22
    const hourRanges: Record<string, [number, number]> = {
      zi: [23, 1], chou: [1, 3], yin: [3, 5], mao: [5, 7],
      chen: [7, 9], si: [9, 11], wu: [11, 13], wei: [13, 15],
      shen: [15, 17], you: [17, 19], xu: [19, 21], hai: [21, 23],
    };
    const [start, end] = hourRanges[key] || [0, 2];
    let isInRange = start <= end ? (hour >= start && hour < end) : (hour >= start || hour < end);
    return {
      isJi: isInRange && info.ji.length > 0,
      isXiong: isInRange && info.xiong.length > 0,
    };
  }

  const shichenList = Object.entries(shichenLabels).map(([key, val]) => ({
    name: val[lang === 'zh-CN' ? 'zh' : 'en'],
    key,
  }));

  // 日期选择 chips
  const dateChips = useMemo(() => {
    return almanacs.map((a, i) => {
      const d = a.solarDateObj;
      const label = i === 0 ? '今天' : i === 1 ? '明天' : `${d.getMonth() + 1}/${d.getDate()}`;
      return { label, index: i };
    });
  }, [almanacs]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--color-xuan)' }}>
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-[#c9a05c]/30 bg-[#c9a05c]/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a05c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days size-[2.6875rem]" aria-hidden="true">
                <path d="M8 2v4" /><path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
                <path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
              </svg>
            </div>
            <h1 className="text-4xl tracking-[0.2em] font-display" style={{ color: '#f5e6b8' }}>{resolve('almanac.title')}</h1>
            <p className="mx-auto max-w-md text-base" style={{ color: '#dfc59fcc' }}>
              {resolve('almanac.subtitle')}
            </p>
          </section>

          {/* 日期切换 chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {dateChips.map(chip => (
              <button
                key={chip.index}
                type="button"
                onClick={() => setSelectedIndex(chip.index)}
                className={`flex-shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all ${
                  selectedIndex === chip.index
                    ? 'border-gold/60 bg-gold/10 text-gold'
                    : 'border-gold/20 text-paper-dark/60 hover:border-gold/40 hover:text-gold'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex h-[60vh] items-center justify-center" style={{ color: '#dfc59f99' }}>
              {resolve('almanac.loading')}
            </div>
          ) : current ? (
            <div className="space-y-4">
              {/* Date card */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md space-y-2 text-center">
                {/* 吉凶等级 */}
                <div className="mb-2">
                  <span className="inline-block rounded-full border-2 px-4 py-1 text-sm font-display tracking-wider" style={{
                    borderColor: current.jiXiongLevel.includes('上') ? '#10b981' : current.jiXiongLevel.includes('下') ? '#ef4444' : '#c9a05c',
                    color: current.jiXiongLevel.includes('上') ? '#34d399' : current.jiXiongLevel.includes('下') ? '#f87171' : '#c9a05c',
                  }}>
                    今日 · {current.jiXiongLevel}
                  </span>
                </div>
                <div className="text-lg font-display" style={{ color: '#f5e6b8' }}>{current.date}</div>
                <div className="text-sm" style={{ color: '#dfc59f' }}>{current.weekDay}</div>
                <div className="text-xs" style={{ color: '#dfc59f99' }}>{current.lunarDate}</div>
                {current.jieQi && (
                  <div className="text-xs mt-1" style={{ color: '#c9a05c' }}>{resolve('almanac.solarTermPrefix')}{current.jieQi}</div>
                )}
                <div className="text-xs" style={{ color: '#dfc59f99' }}>{resolve('almanac.zodiac')}: {current.xingzuo}</div>
                {/* 12建除 + 28宿 */}
                <div className="flex justify-center gap-4 text-xs mt-2">
                  {current.twelveJianChu && (
                    <span style={{ color: '#c9a05c' }}>{resolve('almanac.jianChu')}: {current.twelveJianChu}</span>
                  )}
                  {current.twentyEightXiu && (
                    <span style={{ color: '#c9a05c' }}>{resolve('almanac.twentyEightXiu')}: {current.twentyEightXiu}</span>
                  )}
                </div>
              </div>

              {/* 吉神宜趋 / 凶神宜避 */}
              {(current.jiShen?.length > 0 || current.xiongShen?.length > 0) && (
                <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md space-y-3">
                  {current.jiShen?.length > 0 && (
                    <div>
                      <div className="text-xs tracking-wider mb-2 text-center" style={{ color: '#c9a05c' }}>{resolve('almanac.jiShen')}</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {current.jiShen.map((s, i) => (
                          <span key={i} className="rounded-full bg-gold/10 px-3 py-1 text-xs text-gold">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  {current.xiongShen?.length > 0 && (
                    <div>
                      <div className="text-xs tracking-wider mb-2 text-center" style={{ color: '#ef4444' }}>{resolve('almanac.xiongShen')}</div>
                      <div className="flex flex-wrap justify-center gap-2">
                        {current.xiongShen.map((s, i) => (
                          <span key={i} className="rounded-full bg-red-500/10 px-3 py-1 text-xs text-red-400">{s}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 胎神 */}
              {current.taiShen && (
                <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md text-center">
                  <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.taiShen')}</span>
                  <div className="mt-1 text-sm" style={{ color: '#dfc59f' }}>{current.taiShen}</div>
                </div>
              )}

              {/* GanZhi */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <div className="text-center mb-3">
                  <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.ganZhi')}</span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: resolve('almanac.ganZhi.year'), value: current.ganZhi.year },
                    { label: resolve('almanac.ganZhi.month'), value: current.ganZhi.month },
                    { label: resolve('almanac.ganZhi.day'), value: current.ganZhi.day },
                    { label: resolve('almanac.ganZhi.hour'), value: current.ganZhi.hour },
                  ].map((g, i) => (
                    <div key={i}>
                      <div className="text-xs mb-1" style={{ color: '#dfc59f99' }}>{g.label}</div>
                      <div className="text-[1.25rem] font-number font-display" style={{ color: '#f5e6b8' }}>{g.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yi / Ji */}
              <div className="grid grid-cols-1 gap-4">
                {/* 宜 — 绿色卡片 */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-900/20 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                  <div className="text-center mb-3">
                    <span className="text-xs tracking-wider text-emerald-400">{resolve('almanac.yi')}</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(current.yi.length > 0 ? current.yi : [resolve('almanac.neither')]).map((item, i) => (
                      <span key={i} className="rounded-full bg-emerald-500/15 px-3 py-1 text-sm text-emerald-300">{item}</span>
                    ))}
                  </div>
                </div>
                {/* 忌 — 红色卡片 */}
                <div className="rounded-2xl border border-vermillion/30 bg-vermillion/10 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                  <div className="text-center mb-3">
                    <span className="text-xs tracking-wider text-vermillion-light">{resolve('almanac.ji')}</span>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    {(current.ji.length > 0 ? current.ji : [resolve('almanac.neither')]).map((item, i) => (
                      <span key={i} className="rounded-full bg-vermillion/15 px-3 py-1 text-sm text-vermillion-light">{item}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Chong */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md text-center">
                <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.chong')}</span>
                <div className="mt-2 text-sm" style={{ color: '#dfc59f' }}>{current.chong || resolve('almanac.none')}</div>
              </div>

              {/* Twelve Hours with 吉凶标注 */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <div className="text-center mb-3">
                  <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.twelveHours')}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {shichenList.map((shichen, i) => {
                    const nowHour = new Date().getHours();
                    const timeMatch = shichen.name.match(/\((\d+):(\d+)-(\d+):(\d+)\)/);
                    const startHour = timeMatch ? parseInt(timeMatch[1]) : -1;
                    const isCurrent = startHour >= 0 && nowHour >= startHour && nowHour < (startHour + 2) % 24;
                    const { isJi, isXiong } = getShichenJiXiong(shichen.key, nowHour);
                    return (
                      <div
                        key={i}
                        className="rounded-lg border p-2 text-center text-xs transition-all relative"
                        style={{
                          borderColor: isCurrent ? '#c9a05c66' : isJi ? '#10b98166' : isXiong ? '#ef444466' : '#c9a05c1a',
                          backgroundColor: isCurrent ? 'rgba(201,160,92,0.1)' : isJi ? 'rgba(16,185,129,0.08)' : isXiong ? 'rgba(239,68,68,0.08)' : 'rgba(45,34,22,0.6)',
                          color: isCurrent ? '#f5e6b8' : isJi ? '#34d399' : isXiong ? '#f87171' : '#dfc59fb0',
                        }}
                      >
                        <div className="font-display">{shichen.name.split('(')[0].trim()}</div>
                        <div className="mt-0.5 flex gap-0.5 justify-center">
                          {isJi && <span className="text-[9px] rounded bg-emerald-500/20 px-1 text-emerald-400">宜</span>}
                          {isXiong && <span className="text-[9px] rounded bg-red-500/20 px-1 text-red-400">忌</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <BottomNav active="almanac" />
    </div>
  );
}
