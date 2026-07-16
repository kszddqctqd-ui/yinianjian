'use client';

import { useState, useEffect } from 'react';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { LOTTERIES } from '@/lib/lotteries';

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

  const shakeLottery = () => {
    console.log('[LOTTERY] shakeLottery called, selectedMaster=', selectedMaster);
    if (selectedMaster === null) {
      alert(t('lottery.alert.noMaster'));
      return;
    }
    
    // Force re-render by updating state
    setShakeCount(prev => prev + 1);
    setLoading(true);
    setShowLottery(false);
    setLottery(null);
    
    console.log('[LOTTERY] State updated, loading=true');
    
    setTimeout(() => {
      console.log('[LOTTERY] setTimeout fired, picking lottery');
      const idx = Math.floor(Math.random() * LOTTERIES.length);
      const lot = LOTTERIES[idx];
      console.log('[LOTTERY] picked lot #', lot.num, lot.title);
      setLottery(lot);
      setShowLottery(true);
      setLoading(false);
    }, 1500);
  };

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
            <h1 className="font-display text-4xl tracking-widest" style={{ color: '#C9A96E' }}>关帝灵签</h1>
            <p className="text-base" style={{ color: '#D4C5A9' }}>
              诚心祈祷，摇签问卦
            </p>
          </section>

          {/* Master selector */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
            <div className="space-y-3">
              <p className="text-base text-paper-dark/80">请选择一位大师为你解签</p>
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
                      <span className="text-2xl">{m.icon}</span>
                      <div>
                        <p className="font-semibold text-gold">{resolve(m.nameKey)}</p>
                        <p className="text-xs text-on-dark-muted">{resolve(m.roleKey)}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Shake button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={shakeLottery}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg disabled:opacity-50"
            >
              <span className="contents">{loading ? '摇签中...' : '求签'}</span>
            </button>
          </div>

          {/* Result */}
          {showLottery && lottery && (
            <div className="space-y-4 animate-slide-up">
              <div className="rounded-xl border border-gold/20 bg-xuan-card/80 p-6 text-center">
                <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-gold/10">
                  <span className="text-3xl">🎋</span>
                </div>
                <h2 className="text-2xl text-gold mb-2">
                  第{lottery.num}签 · {lottery.title}
                </h2>
                <p className="text-paper mb-4">{lottery.poem}</p>
                <div className="rounded-lg bg-xuan/50 p-4 text-left">
                  <h3 className="text-gold mb-2">签文解读</h3>
                  <p className="text-paper-dark/80">{lottery.desc}</p>
                </div>
                <div className="mt-4 rounded-lg bg-gold/10 p-4">
                  <h3 className="text-gold mb-2">运势指引</h3>
                  <p className="text-paper-dark/80">{lottery.fortune}</p>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {shakeCount > 0 && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-gold mb-3">求签记录</h3>
              <p className="text-paper-dark/80">共求签 {shakeCount} 次</p>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
