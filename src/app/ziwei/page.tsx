'use client';

import { useState, useEffect } from 'react';
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

const SHICHEN_KEYS = ['zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai'];

function getShichenOptions(lang: SupportedLang) {
  return SHICHEN_KEYS.map(key => {
    const label = shichenLabels[key]?.[lang === 'zh-CN' ? 'zh' : 'en'] || shichenLabels[key]?.zh || key;
    return { label, value: key };
  });
}

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

export default function ZiweiPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [shichen, setShichen] = useState('wei');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [result, setResult] = useState<ZiweiResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const handleCalculate = async () => {
    setLoading(true);
    setError('');
    try {
      const shichenHour = getShichenOptions(lang).find(s => s.value === shichen)?.label.split('(')[1]?.replace(')', '').split('-')[0] || '0';
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
      setError(resolve('ziwei.requestFailed'));
    }
    setLoading(false);
  };

  const getPalace = (name: string) => result?.palaces.find(p => p.name === name);
  const shichenOptions = getShichenOptions(lang);

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />

      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl space-y-section px-4 pb-24">
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-[3.1875rem] items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <span className="text-[1.875rem]">🏯</span>
            </div>
            <h1 className="text-4xl text-gold">{resolve('ziwei.title')}</h1>
            <p className="text-base text-paper-dark/85">
              {resolve('ziwei.subtitle')}
            </p>
          </section>

          {/* Input */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-5">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-2">
                <p className="text-sm text-label">{resolve('bazi.form.year')}</p>
                <div className="relative flex h-16 items-stretch overflow-visible rounded-xl border border-gold/30 bg-xuan-surface">
                  <button type="button" onClick={() => setYear(y => Math.max(1900, y - 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">−</button>
                  <button type="button" className="flex flex-1 flex-col items-center justify-center hover:bg-gold/5">
                    <span className="font-number text-[1.5rem] text-gold">{year}年</span>
                  </button>
                  <button type="button" onClick={() => setYear(y => Math.min(2100, y + 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">+</button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-label">{resolve('bazi.form.month')}</p>
                <div className="relative flex h-16 items-stretch overflow-visible rounded-xl border border-gold/30 bg-xuan-surface">
                  <button type="button" onClick={() => setMonth(m => Math.max(1, m - 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">−</button>
                  <button type="button" className="flex flex-1 flex-col items-center justify-center hover:bg-gold/5">
                    <span className="font-number text-[1.5rem] text-gold">{month}月</span>
                  </button>
                  <button type="button" onClick={() => setMonth(m => Math.min(12, m + 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">+</button>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-label">{resolve('bazi.form.day')}</p>
                <div className="relative flex h-16 items-stretch overflow-visible rounded-xl border border-gold/30 bg-xuan-surface">
                  <button type="button" onClick={() => setDay(d => Math.max(1, d - 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">−</button>
                  <button type="button" className="flex flex-1 flex-col items-center justify-center hover:bg-gold/5">
                    <span className="font-number text-[1.5rem] text-gold">{day}日</span>
                  </button>
                  <button type="button" onClick={() => setDay(d => Math.min(31, d + 1))} className="flex w-12 items-center justify-center text-paper-dark hover:bg-gold/10">+</button>
                </div>
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm text-label">{resolve('bazi.form.shichen')}</span>
                <select value={shichen} onChange={(e) => setShichen(e.target.value)}
                  className="h-16 w-full rounded-xl border border-gold/30 bg-xuan-surface px-4 text-lg text-paper-dark focus:border-gold focus:outline-none">
                  {shichenOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </label>
              <div className="space-y-2">
                <p className="text-sm text-label">{resolve('bazi.form.gender')}</p>
                <div className="flex h-16 items-stretch overflow-hidden rounded-xl border border-gold/30 bg-xuan-surface">
                  <button type="button" onClick={() => setGender('男')}
                    className={`flex flex-1 items-center justify-center text-lg transition-colors ${gender === '男' ? 'bg-gold/15 text-gold' : 'hover:bg-gold/5'}`}>{resolve('bazi.form.male')}</button>
                  <button type="button" onClick={() => setGender('女')}
                    className={`flex flex-1 items-center justify-center text-lg transition-colors ${gender === '女' ? 'bg-gold/15 text-gold' : 'hover:bg-gold/5'}`}>{resolve('bazi.form.female')}</button>
                </div>
              </div>
            </div>
            {error && <p className="text-center text-sm text-vermillion">{error}</p>}
            <div className="flex justify-center">
              <button type="button" onClick={handleCalculate} disabled={loading}
                className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg disabled:opacity-50">
                <span className="contents">{loading ? resolve('ziwei.calculating') : resolve('ziwei.btn.calculate')}</span>
              </button>
            </div>
          </div>

          {/* Results */}
          {showResult && result && (
            <div className="space-y-4 animate-slide-up">
              {/* Basic info */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
                <div className="text-center mb-3"><span className="text-xs text-gold/80 tracking-wider">{resolve('ziwei.basicInfo')}</span></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div><span className="text-gold">{resolve('ziwei.solarDate')}：</span>{result.solarDate}</div>
                  <div><span className="text-gold">{resolve('ziwei.lunarDate')}：</span>{result.lunarDate}</div>
                  <div><span className="text-gold">{resolve('ziwei.zodiacLabel')}：</span>{result.zodiac}</div>
                  <div><span className="text-gold">{resolve('ziwei.constellation')}：</span>{result.sign}</div>
                  <div><span className="text-gold">{resolve('ziwei.lifePalaceMainStar')}：</span>{getPalace('命宫')?.majorStars.map(s => s.name).join(',') || resolve('ziwei.noMainStar')}</div>
                  <div><span className="text-gold">{resolve('ziwei.bodyPalace')}：</span>{getPalace('身宫')?.majorStars.map(s => s.name).join(',') || resolve('ziwei.noMainStar')}</div>
                  <div><span className="text-gold">{resolve('ziwei.fiveElement')}：</span>{result.fiveElement}</div>
                  <div><span className="text-gold">{resolve('ziwei.soul')}：</span>{result.soul}{resolve('ziwei.suffix')} {result.body}{resolve('ziwei.bodySuffix')}</div>
                </div>
              </div>

              {/* Four pillars */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
                <div className="text-center mb-3"><span className="text-xs text-gold/80 tracking-wider">{resolve('ziwei.fourPillars')}</span></div>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { label: resolve('ziwei.yearPillar'), ...result.fourPillars.year },
                    { label: resolve('ziwei.monthPillar'), ...result.fourPillars.month },
                    { label: resolve('ziwei.dayPillar'), ...result.fourPillars.day },
                    { label: resolve('ziwei.hourPillar'), ...result.fourPillars.hour },
                  ].map((p: any, i) => (
                    <div key={i} className="rounded-lg bg-xuan-surface/50 p-3">
                      <div className="text-xs text-on-dark-muted mb-1">{p.label}</div>
                      <div className="text-[1.25rem] text-gold font-display">{p.gan}{p.zhi}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 12 Palaces */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
                <div className="text-center mb-3"><span className="text-xs text-gold/80 tracking-wider">{resolve('ziwei.twelvePalaces')}</span></div>
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
                          {palace.isBodyPalace && <span className="text-[10px] text-gold">{resolve('ziwei.bodySuffix')}</span>}
                        </div>
                        {majorNames ? (
                          <div className="text-gold text-sm mb-1">{majorNames}</div>
                        ) : (
                          <div className="text-paper-dark/40 text-xs mb-1">{resolve('ziwei.noMainStar')}</div>
                        )}
                        {minorNames && <div className="text-[10px] text-paper-dark/50">{minorNames}</div>}
                        <div className="text-[10px] text-paper-dark/40 mt-1">
                          {resolve('ziwei.decadeRange').replace('{range}', String(palace.decadalRange[0]))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* San Fang Si Zheng */}
              <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
                <div className="text-center mb-3"><span className="text-xs text-gold/80 tracking-wider">{resolve('ziwei.sanFangSiZheng')}</span></div>
                <p className="text-sm text-paper-dark/85">
                  {resolve('ziwei.sanFangSiZheng')}{getPalace('命宫')?.sanFangSiZheng.join('、')}
                </p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-on-dark-muted">{resolve('common.disclaimer')}</p>
        </div>
      </main>

      <BottomNav active="more" />
    </div>
  );
}
