'use client';

import { useState, useCallback, useEffect } from 'react';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { LOTTERIES } from '@/lib/lotteries';
import { saveRecord } from '@/lib/records';
import { calculateBaZi, type BaZiResult } from '@/lib/bazi';

function resolve(key: string): string {
  return t(key);
}

const masters = [
  { icon: '🧘', nameKey: 'bazi.master.0.name', roleKey: 'bazi.master.0.role', featureKey: 'bazi.master.0.feature' },
  { icon: '🙏', nameKey: 'bazi.master.1.name', roleKey: 'bazi.master.1.role', featureKey: 'bazi.master.1.feature' },
  { icon: '☯️', nameKey: 'bazi.master.2.name', roleKey: 'bazi.master.2.role', featureKey: 'bazi.master.2.feature' },
];

export default function LotteryPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const [shakeCount, setShakeCount] = useState(0);
  const [lottery, setLottery] = useState<typeof LOTTERIES[0] | null>(null);
  const [showLottery, setShowLottery] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const shakeLottery = useCallback(() => {
    if (selectedMaster === null) {
      alert(resolve('lottery.alert.noMaster'));
      return;
    }
    setLoading(true);
    setShakeCount(prev => prev + 1);
    setTimeout(() => {
      const idx = Math.floor(Math.random() * LOTTERIES.length);
      const lot = LOTTERIES[idx];
      setLottery(lot);
      setShowLottery(true);
      setLoading(false);
      saveRecord('lottery', { num: lot.num, title: lot.title, poem: lot.poem, desc: lot.desc, fortune: lot.fortune }, `${resolve('lottery.signNumber').replace('{num}', lot.num.toString())}`);
    }, 1500);
  }, [selectedMaster]);

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
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles size-[2.25rem] text-gold" aria-hidden="true">
                <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl tracking-widest" style={{ color: '#C9A96E' }}>{resolve('lottery.title')}</h1>
            <p className="text-base" style={{ color: '#D4C5A9' }}>
              {resolve('lottery.subtitle')}
            </p>
          </section>

          {/* Master selector */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
            <div className="space-y-3">
              <p className="text-base text-paper-dark/80">{resolve('lottery.chooseMaster')}</p>
              <div className="grid gap-3 sm:grid-cols-3">
                {masters.map((m, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedMaster(i)}
                    className={`group rounded-xl border p-4 text-left transition-all duration-200 ${
                      selectedMaster === i
                        ? 'border-gold/60 bg-gold/10 shadow-gold'
                        : 'border-gold/20 bg-xuan-surface/40 hover:border-gold/40 hover:bg-xuan-surface/70'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-[1.875rem]">{m.icon}</span>
                      <div>
                        <p className={`font-display text-lg ${selectedMaster === i ? 'text-gold' : 'text-paper-dark'}`}>{resolve(m.nameKey)}</p>
                        <p className="text-xs text-on-dark-muted">{resolve(m.roleKey)}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gold/85">{resolve(m.featureKey)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shake lot */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
            <div className="text-center">
              <div className={`mb-4 flex items-center justify-center ${shakeCount > 0 ? 'animate-bounce' : ''}`}>
                <svg className="size-20 text-gold/40" viewBox="0 0 100 140" fill="none" stroke="currentColor" strokeWidth="2">
                  <ellipse cx="50" cy="120" rx="35" ry="10" />
                  <rect x="20" y="20" width="60" height="100" rx="5" />
                  <line x1="30" y1="35" x2="70" y2="35" />
                  <line x1="30" y1="50" x2="70" y2="50" />
                  <line x1="30" y1="65" x2="70" y2="65" />
                  <line x1="30" y1="80" x2="70" y2="80" />
                  <line x1="30" y1="95" x2="70" y2="95" />
                  <line x1="30" y1="110" x2="70" y2="110" />
                </svg>
              </div>
              <p className="text-sm text-paper-dark/80 mb-4">{resolve('lottery.shakeHint')}</p>
              <button
                type="button"
                onClick={shakeLottery}
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? resolve('lottery.loading') : resolve('lottery.btn.shake')}
              </button>
              {shakeCount > 0 && (
                <p className="mt-2 text-xs text-on-dark-muted">{resolve('lottery.count').replace('{count}', shakeCount.toString())}</p>
              )}
            </div>
          </div>

          {/* Result */}
          {showLottery && lottery && (
            <div className="rounded-[17px] border border-gold/30 bg-xuan-card/95 p-6 shadow-paper backdrop-blur-sm space-y-4 animate-slide-up">
              <div className="text-center">
                <span className="text-xs text-gold/80 tracking-wider">{resolve('lottery.signNumber').replace('{num}', lottery.num.toString())}</span>
              </div>
              <div className="text-center space-y-2">
                <p className="text-[1.875rem] text-gold font-display">{lottery.title}</p>
                {lottery.poem.map((line, i) => (
                  <p key={i} className="text-[1.25rem] text-paper-dark/85 italic">{line}</p>
                ))}
                <p className="text-sm text-paper-dark/80">{lottery.desc}</p>
                <div className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${
                  lottery.fortune === '大吉' ? 'bg-gold/20 text-gold' :
                  lottery.fortune === '上吉' ? 'bg-gold/10 text-gold/80' :
                  lottery.fortune === '中吉' ? 'bg-gold/10 text-gold/80' :
                  lottery.fortune === '中平' ? 'bg-paper-dark/10 text-on-dark-muted' :
                  lottery.fortune === '下吉' ? 'bg-paper-dark/10 text-on-dark-muted' :
                  lottery.fortune === '中凶' ? 'bg-vermillion/10 text-vermillion' :
                  'bg-vermillion/20 text-vermillion-light'
                }`}>
                  {lottery.fortune}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="lottery" />
    </div>
  );
}
