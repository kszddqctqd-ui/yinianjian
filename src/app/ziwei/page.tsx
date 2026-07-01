'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

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

const SHICHEN_OPTIONS = [
  { label: '子时 (23:00-01:00)', value: 'zi' },
  { label: '丑时 (01:00-03:00)', value: 'chou' },
  { label: '寅时 (03:00-05:00)', value: 'yin' },
  { label: '卯时 (05:00-07:00)', value: 'mao' },
  { label: '辰时 (07:00-09:00)', value: 'chen' },
  { label: '巳时 (09:00-11:00)', value: 'si' },
  { label: '午时 (11:00-13:00)', value: 'wu' },
  { label: '未时 (13:00-15:00)', value: 'wei' },
  { label: '申时 (15:00-17:00)', value: 'shen' },
  { label: '酉时 (17:00-19:00)', value: 'you' },
  { label: '戌时 (19:00-21:00)', value: 'xu' },
  { label: '亥时 (21:00-23:00)', value: 'hai' },
];

export default function ZiweiPage() {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [shichen, setShichen] = useState('wei');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [result, setResult] = useState<ZiweiResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    try {
      const shichenHour = SHICHEN_OPTIONS.find(s => s.value === shichen)?.label.split('(')[1]?.replace(')', '').split('-')[0] || '0';
      const hour = parseInt(shichenHour) || 0;

      const res = await fetch('/api/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year, month, day, hour, gender, type: 'ziwei' }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.data);
        setShowResult(true);
      }
    } catch (e) {
      setError('请求失败，请重试');
    }
    setLoading(false);
  };

  const getPalace = (name: string) => result?.palaces.find(p => p.name === name);

  return (
    <div className="min-h-screen bg-deep relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]" style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)' }} />
      <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-gold/15 to-transparent" />
      <FloatingParticles />

      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl space-y-section px-4 pb-24">
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <span className="text-3xl">🏯</span>
            </div>
            <h1 className="text-4xl text-gold">紫微斗数</h1>
            <p className="text-base text-paper-dark/85">
              中华第一命理术数，十二宫位看一生运势。
            </p>
          </section>

          {/* Input */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-paper-dark/75">出生年</p>
                <div className="relative flex h-16 items-stretch overflow-visible rounded-xl border border-gold/30 bg-xuan-surface">
                  <button type="button" onClick={() => setYear(y => Math.max(1900, y - 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">−</button>
                  <button type="button" className="flex flex-1 flex-col items-center justify-center hover:bg-gold/5">
                    <span className="font-number text-2xl text-gold">{year}年</span>
                  </button>
                  <button type="button" onClick={() => setYear(y => Math.min(2100, y + 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">+</button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-paper-dark/75">出生月</p>
                <div className="relative flex h-16 items-stretch overflow-visible rounded-xl border border-gold/30 bg-xuan-surface">
                  <button type="button" onClick={() => setMonth(m => Math.max(1, m - 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">−</button>
                  <button type="button" className="flex flex-1 flex-col items-center justify-center hover:bg-gold/5">
                    <span className="font-number text-2xl text-gold">{month}月</span>
                  </button>
                  <button type="button" onClick={() => setMonth(m => Math.min(12, m + 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">+</button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-paper-dark/75">出生日</p>
                <div className="relative flex h-16 items-stretch overflow-visible rounded-xl border border-gold/30 bg-xuan-surface">
                  <button type="button" onClick={() => setDay(d => Math.max(1, d - 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">−</button>
                  <button type="button" className="flex flex-1 flex-col items-center justify-center hover:bg-gold/5">
                    <span className="font-number text-2xl text-gold">{day}日</span>
                  </button>
                  <button type="button" onClick={() => setDay(d => Math.min(31, d + 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">+</button>
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-paper-dark/75">出生时辰</span>
                <select value={shichen} onChange={(e) => setShichen(e.target.value)}
                  className="h-16 w-full rounded-xl border border-gold/30 bg-xuan-surface px-4 text-lg text-paper-dark focus:border-gold focus:outline-none">
                  {SHICHEN_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
              <div className="space-y-2">
                <p className="text-sm text-paper-dark/75">性别</p>
                <div className="flex h-16 items-stretch overflow-hidden rounded-xl border border-gold/30 bg-xuan-surface">
                  <button type="button" onClick={() => setGender('男')}
                    className={`flex flex-1 items-center justify-center text-lg transition-colors ${gender === '男' ? 'bg-gold/15 text-gold' : 'hover:bg-gold/5'}`}>男</button>
                  <button type="button" onClick={() => setGender('女')}
                    className={`flex flex-1 items-center justify-center text-lg transition-colors ${gender === '女' ? 'bg-gold/15 text-gold' : 'hover:bg-gold/5'}`}>女</button>
                </div>
              </div>
            </div>
            {error && <p className="text-center text-sm text-vermillion">{error}</p>}
            <div className="flex justify-center">
              <button type="button" onClick={handleCalculate} disabled={loading}
                className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg disabled:opacity-50">
                <span className="contents">{loading ? '排盘中...' : '紫微排盘'}</span>
              </button>
            </div>
          </div>

          {/* Results */}
          {showResult && result && (
            <div className="space-y-4 animate-slide-up">
              {/* Basic info */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
                <div className="text-center mb-3"><span className="text-xs text-gold/80 tracking-wider">基本信息</span></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-gold">公历：</span>{result.solarDate}</div>
                  <div><span className="text-gold">农历：</span>{result.lunarDate}</div>
                  <div><span className="text-gold">生肖：</span>{result.zodiac}</div>
                  <div><span className="text-gold">星座：</span>{result.sign}</div>
                  <div><span className="text-gold">命宫主星：</span>{getPalace('命宫')?.majorStars.map(s => s.name).join(',') || '无主星'}</div>
                  <div><span className="text-gold">身宫：</span>{getPalace('身宫')?.majorStars.map(s => s.name).join(',') || '无主星'}</div>
                  <div><span className="text-gold">五行局：</span>{result.fiveElement}</div>
                  <div><span className="text-gold">魂魄：</span>{result.soul}魂 {result.body}身</div>
                </div>
              </div>

              {/* Four pillars */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
                <div className="text-center mb-3"><span className="text-xs text-gold/80 tracking-wider">四柱</span></div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: '年柱', ...result.fourPillars.year },
                    { label: '月柱', ...result.fourPillars.month },
                    { label: '日柱', ...result.fourPillars.day },
                    { label: '时柱', ...result.fourPillars.hour },
                  ].map((p: any, i) => (
                    <div key={i} className="rounded-lg bg-xuan-surface/50 p-3">
                      <div className="text-xs text-paper-dark/60 mb-1">{p.label}</div>
                      <div className="text-xl text-gold font-display">{p.gan}{p.zhi}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 12 Palaces */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
                <div className="text-center mb-3"><span className="text-xs text-gold/80 tracking-wider">十二宫位</span></div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {result.palaces.map((palace, i) => {
                    const majorNames = palace.majorStars.map(s => s.name).join('');
                    const minorNames = palace.minorStars.map(s => s.name).join('');
                    return (
                      <div key={i} className={`rounded-lg border p-3 ${
                        palace.name === '命宫' ? 'border-gold/60 bg-gold/10' :
                        palace.name === '身宫' ? 'border-gold/40 bg-gold/5' :
                        'border-gold/20 bg-xuan-surface/40'
                      }`}>
                        <div className="flex items-center justify-between mb-1">
                          <span className={`text-sm font-display ${palace.name === '命宫' ? 'text-gold' : 'text-paper-dark/80'}`}>{palace.name}</span>
                          {palace.isBodyPalace && <span className="text-[10px] text-gold">身</span>}
                        </div>
                        {majorNames ? (
                          <div className="text-gold text-sm mb-1">{majorNames}</div>
                        ) : (
                          <div className="text-paper-dark/40 text-xs mb-1">无主星</div>
                        )}
                        {minorNames && <div className="text-[10px] text-paper-dark/50">{minorNames}</div>}
                        <div className="text-[10px] text-paper-dark/40 mt-1">
                          运程 {palace.decadalRange[0]}-{palace.decadalRange[1]}岁
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* San Fang Si Zheng */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
                <div className="text-center mb-3"><span className="text-xs text-gold/80 tracking-wider">三方四正</span></div>
                <p className="text-sm text-paper-dark/85">
                  命宫三方四正：{getPalace('命宫')?.sanFangSiZheng.join('、')}
                </p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-paper-dark/60">仅作传统文化参考，请结合现实情况判断</p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
