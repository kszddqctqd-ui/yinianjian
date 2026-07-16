'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

function resolve(key: string): string {
  return t(key);
}

// 天干地支数据
const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHICHEN_NAMES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHICHEN_TIMES = ['23:00-01:00', '01:00-03:00', '03:00-05:00', '05:00-07:00', '07:00-09:00', '09:00-11:00', '11:00-13:00', '13:00-15:00', '15:00-17:00', '17:00-19:00', '19:00-21:00', '21:00-23:00'];

// 生肖
const ZODIAC = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];

// 星座
const XINGZUO = ['摩羯座', '水瓶座', '双鱼座', '白羊座', '金牛座', '双子座', '巨蟹座', '狮子座', '处女座', '天秤座', '天蝎座', '射手座'];

// 五行
const WUXING = ['金', '木', '水', '火', '土'];

// 十神
const SHISHEN = ['比肩', '劫财', '食神', '伤官', '偏财', '正财', '七杀', '正官', '偏印', '正印'];

// 十二长生
const CHANGSHENG12 = ['长生', '沐浴', '冠带', '临官', '帝旺', '衰', '病', '死', '墓', '绝', '胎', '养'];

// 大运
const DAYUN_STEPS = ['建', '承', '启', '运', '化', '联', '旋', '成'];

// 计算天干
function getTianGan(year: number): string {
  return TIAN_GAN[(year - 4) % 10];
}

// 计算地支
function getDiZhi(year: number): string {
  return DI_ZHI[(year - 4) % 12];
}

// 计算生肖
function getZodiac(year: number): string {
  return ZODIAC[(year - 4) % 12];
}

// 计算星座
function getXingzuo(month: number, day: number): string {
  const dates = [20, 19, 21, 20, 21, 22, 23, 23, 23, 24, 22, 22];
  if (day < dates[month - 1]) {
    return XINGZUO[month - 1];
  } else {
    return XINGZUO[month % 12];
  }
}

// 计算时辰
function getShichen(hour: number): string {
  return SHICHEN_NAMES[Math.floor((hour + 1) / 2) % 12];
}

// 计算时辰对应的天干
function getShichenGan(shichen: string, dayGanIndex: number): string {
  const shichenIndex = SHICHEN_NAMES.indexOf(shichen);
  const dayGan = TIAN_GAN[dayGanIndex];
  const dayGanOffsets: Record<string, number> = { '甲': 0, '乙': 1, '丙': 2, '丁': 3, '戊': 4, '己': 5, '庚': 6, '辛': 7, '壬': 8, '癸': 9 };
  const offset = dayGanOffsets[dayGan] || 0;
  return TIAN_GAN[(offset + shichenIndex * 2) % 10];
}

// 模拟紫微斗数星曜
function generateStars(): { name: string; type: string; brightness: string }[] {
  return [
    { name: '紫微', type: 'major', brightness: '庙' },
    { name: '天机', type: 'major', brightness: '庙' },
    { name: '太阳', type: 'major', brightness: '旺' },
    { name: '武曲', type: 'major', brightness: '庙' },
    { name: '天同', type: 'major', brightness: '庙' },
    { name: '廉贞', type: 'major', brightness: '平' },
    { name: '天府', type: 'major', brightness: '庙' },
    { name: '太阴', type: 'major', brightness: '旺' },
    { name: '贪狼', type: 'major', brightness: '庙' },
    { name: '巨门', type: 'major', brightness: '旺' },
    { name: '天相', type: 'major', brightness: '庙' },
    { name: '天梁', type: 'major', brightness: '庙' },
    { name: '七杀', type: 'major', brightness: '庙' },
    { name: '破军', type: 'major', brightness: '旺' },
    { name: '禄存', type: 'minor', brightness: '庙' },
    { name: '天马', type: 'minor', brightness: '旺' },
  ];
}

// 模拟十二宫位
function generatePalaces(fourPillars: any, gender: string): any[] {
  const palaceNames = ['命宫', '兄弟', '夫妻', '子女', '财帛', '疾厄', '迁移', '仆役', '官禄', '田宅', '福德', '父母'];
  const stars = generateStars();
  
  return palaceNames.map((name, index) => ({
    name,
    heavenlyStem: TIAN_GAN[index % 10],
    earthlyBranch: DI_ZHI[index % 12],
    majorStars: stars.filter(s => s.type === 'major' && Math.random() > 0.5).slice(0, 3),
    minorStars: stars.filter(s => s.type === 'minor' && Math.random() > 0.3).slice(0, 2),
    adjStars: [],
    decadalRange: [index * 10 + 2, (index + 1) * 10 + 1],
    sanFangSiZheng: [],
    isBodyPalace: index === 2,
    changsheng12: CHANGSHENG12[index % 12],
  }));
}

// 主计算函数
function calculateZiwei(year: number, month: number, day: number, shichen: string, gender: string): any {
  const yearGan = getTianGan(year);
  const yearZhi = getDiZhi(year);
  const zodiac = getZodiac(year);
  const xingzuo = getXingzuo(month, day);
  
  // 简化八字计算
  const monthGan = TIAN_GAN[(year - 4 + month - 1) % 10];
  const monthZhi = DI_ZHI[(year - 4 + month - 1) % 12];
  const dayGan = TIAN_GAN[(year - 4 + month + day - 2) % 10];
  const dayZhi = DI_ZHI[(year - 4 + month + day - 2) % 12];
  
  const shichenIndex = SHICHEN_NAMES.indexOf(shichen);
  const hour = shichenIndex * 2 + 1;
  const hourGan = getShichenGan(shichen, TIAN_GAN.indexOf(dayGan));
  const hourZhi = shichen;
  
  const fourPillars = {
    year: { gan: yearGan, zhi: yearZhi },
    month: { gan: monthGan, zhi: monthZhi },
    day: { gan: dayGan, zhi: dayZhi },
    hour: { gan: hourGan, zhi: hourZhi },
  };
  
  const palaces = generatePalaces(fourPillars, gender);
  
  return {
    solarDate: `${year}年${month}月${day}日`,
    lunarDate: `${yearGan}${yearZhi}年${month}月${day}日`,
    fourPillars,
    soul: '贪狼',
    body: '文昌',
    fiveElement: WUXING[Math.floor(Math.random() * 5)],
    zodiac,
    sign: xingzuo,
    palaces,
  };
}

export default function ZiweiPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [shichen, setShichen] = useState('wei');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [result, setResult] = useState<any>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const handleCalculate = () => {
    console.log('[TEST] Button clicked!');
    setLoading(true);
    setError('');
    setShowResult(false);
    
    setTimeout(() => {
      try {
        console.log('[TEST] Calculating...');
        
        // Find shichen index from the selected value
        const shichenIndex = SHICHEN_NAMES.indexOf(shichen);
        const shichenName = shichenIndex >= 0 ? shichen : 'wei';
        console.log('[TEST] Shichen:', shichenName);
        
        const calculatedResult = calculateZiwei(year, month, day, shichenName, gender);
        console.log('[TEST] Result calculated:', calculatedResult);
        setResult(calculatedResult);
        setShowResult(true);
      } catch (e) {
        console.error('[TEST] Error:', e);
        setError('排盘失败：' + (e instanceof Error ? e.message : String(e)));
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const getShichenOptions = () => {
    return SHICHEN_NAMES.map((name, index) => ({
      label: `${name}时 (${SHICHEN_TIMES[index]})`,
      value: name,
    }));
  };

  const shichenOptions = getShichenOptions();

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />

      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-20">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-4xl text-gold">紫微斗数</h1>
            <p className="text-paper-dark/80">中华第一命理术数，十二宫位看一生运势。</p>
          </div>

          {/* Input Form */}
          <div className="rounded-xl border border-gold/20 bg-xuan-card/80 p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gold mb-1">出生年</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setYear(y => y - 1)} className="px-2 py-1 bg-gold/20 rounded">−</button>
                  <span className="flex-1 text-center">{year}年</span>
                  <button type="button" onClick={() => setYear(y => y + 1)} className="px-2 py-1 bg-gold/20 rounded">+</button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gold mb-1">出生月</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setMonth(m => Math.max(1, m - 1))} className="px-2 py-1 bg-gold/20 rounded">−</button>
                  <span className="flex-1 text-center">{month}月</span>
                  <button type="button" onClick={() => setMonth(m => Math.min(12, m + 1))} className="px-2 py-1 bg-gold/20 rounded">+</button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gold mb-1">出生日</label>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setDay(d => Math.max(1, d - 1))} className="px-2 py-1 bg-gold/20 rounded">−</button>
                  <span className="flex-1 text-center">{day}日</span>
                  <button type="button" onClick={() => setDay(d => Math.min(31, d + 1))} className="px-2 py-1 bg-gold/20 rounded">+</button>
                </div>
              </div>
              
              <div>
                <label className="block text-sm text-gold mb-1">{resolve('bazi.form.shichen')}</label>
                <select 
                  value={shichen} 
                  onChange={(e) => setShichen(e.target.value)}
                  className="w-full p-2 rounded border border-gold/30 bg-xuan text-paper"
                >
                  {shichenOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setGender('男')}
                className={`flex-1 py-2 rounded ${gender === '男' ? 'bg-gold/20 text-gold' : 'bg-xuan/50'}`}
              >
                {resolve('bazi.form.male')}
              </button>
              <button 
                type="button" 
                onClick={() => setGender('女')}
                className={`flex-1 py-2 rounded ${gender === '女' ? 'bg-gold/20 text-gold' : 'bg-xuan/50'}`}
              >
                {resolve('bazi.form.female')}
              </button>
            </div>
            
            <div className="flex justify-center">
              <button 
                type="button" 
                onClick={handleCalculate} 
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg disabled:opacity-50"
              >
                <span className="contents">{loading ? resolve('ziwei.calculating') : resolve('ziwei.btn.calculate')}</span>
              </button>
            </div>
            
            {error && <p className="text-center text-sm text-vermillion">{error}</p>}
          </div>

          {/* Results */}
          {showResult && result && (
            <div className="space-y-4 animate-slide-up">
              {/* Basic Info */}
              <div className="rounded-xl border border-gold/20 bg-xuan-card/80 p-6">
                <h2 className="text-xl text-gold mb-4">基本信息</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gold/80">生肖</p>
                    <p className="text-lg text-paper">{result.zodiac}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gold/80">星座</p>
                    <p className="text-lg text-paper">{result.sign}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gold/80">五行</p>
                    <p className="text-lg text-paper">{result.fiveElement}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gold/80">命宫</p>
                    <p className="text-lg text-paper">{result.soul}</p>
                  </div>
                </div>
              </div>

              {/* Four Pillars */}
              <div className="rounded-xl border border-gold/20 bg-xuan-card/80 p-6">
                <h2 className="text-xl text-gold mb-4">四柱八字</h2>
                <div className="grid grid-cols-4 gap-4 text-center">
                  {Object.entries(result.fourPillars).map(([pillar, data]: [string, any]) => (
                    <div key={pillar}>
                      <p className="text-sm text-gold/80">{pillar === 'year' ? '年柱' : pillar === 'month' ? '月柱' : pillar === 'day' ? '日柱' : '时柱'}</p>
                      <p className="text-2xl text-gold font-bold">{data.gan}{data.zhi}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Twelve Palaces */}
              <div className="rounded-xl border border-gold/20 bg-xuan-card/80 p-6">
                <h2 className="text-xl text-gold mb-4">十二宫位</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.palaces.map((palace: any, index: number) => (
                    <div key={index} className="rounded-lg border border-gold/10 bg-xuan/50 p-4">
                      <h3 className="text-gold font-semibold mb-2">{palace.name}</h3>
                      <div className="space-y-1 text-sm">
                        <p><span className="text-gold/60">天干:</span> {palace.heavenlyStem}{palace.earthlyBranch}</p>
                        <p><span className="text-gold/60">主星:</span> {palace.majorStars.map((s: any) => s.name).join(', ') || '-'}</p>
                        <p><span className="text-gold/60">辅星:</span> {palace.minorStars.map((s: any) => s.name).join(', ') || '-'}</p>
                        <p><span className="text-gold/60">长生十二神:</span> {palace.changsheng12}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
