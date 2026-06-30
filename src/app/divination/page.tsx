'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

export default function DivinationPage() {
  const [method, setMethod] = useState<'coins' | 'time' | 'number'>('coins');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [coinResults, setCoinResults] = useState<number[]>([]);

  const tossCoins = () => {
    if (method !== 'coins') return;
    setLoading(true);
    setTimeout(() => {
      const toss = [Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2, Math.random() > 0.5 ? 3 : 2];
      const sum = toss.reduce((a, b) => a + b, 0);
      setCoinResults(prev => [...prev, sum]);
      setLoading(false);
    }, 500);
  };

  const castHexagram = useCallback(() => {
    // Generate a hexagram from 6 coin tosses (simulated)
    const lines: number[] = [];
    for (let i = 0; i < 6; i++) {
      lines.push(Math.random() > 0.5 ? 9 : 8); // 9 = yang, 8 = yin
    }
    const hexChars = ['乾', '坤', '震', '巽', '坎', '离', '艮', '兑'];
    const upper = hexChars[(lines[5] + lines[4]) % 8];
    const lower = hexChars[(lines[3] + lines[2] + lines[1]) % 8];
    return `${upper}${lower}卦`;
  }, []);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setResult(castHexagram());
      setLoading(false);
    }, 1000);
  };

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
              <svg className="size-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 12h8" />
                <path d="M12 8v8" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">六爻占卜</h1>
            <p className="text-base text-paper-dark/85">
              心起一念，三铜起卦，再看本卦、互卦、变卦，为当前事项补一版卦象参考。
            </p>
          </section>

          {/* Method selection */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
            <div className="text-center">
              <span className="text-xs text-gold/80 tracking-wider">起卦方式</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'coins' as const, label: '铜钱起卦', icon: '🪙' },
                { key: 'time' as const, label: '时间起卦', icon: '⏰' },
                { key: 'number' as const, label: '数字起卦', icon: '🔢' },
              ].map(m => (
                <button key={m.key} type="button" onClick={() => setMethod(m.key)} className={`rounded-lg border p-3 text-center transition-all ${method === m.key ? 'border-gold/60 bg-gold/10 text-gold' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                  <span className="text-2xl">{m.icon}</span>
                  <p className="text-xs mt-1">{m.label}</p>
                </button>
              ))}
            </div>

            {/* Coin toss */}
            {method === 'coins' && (
              <div className="space-y-3">
                <div className="flex justify-center gap-4">
                  {coinResults.slice(-6).map((r, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${r >= 7 ? 'bg-gold/20 border-gold/60 text-gold' : 'bg-xuan-surface/50 border-gold/20 text-paper-dark/60'}`}>
                        {r}
                      </div>
                      <span className="text-[10px] text-paper-dark/45 mt-1">第{i + 1}爻</span>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={tossCoins}
                  disabled={loading || coinResults.length >= 6}
                  className="w-full rounded-lg border border-gold/30 py-2 text-sm text-gold hover:bg-gold/10 transition-all disabled:opacity-50"
                >
                  {loading ? '投掷中...' : coinResults.length >= 6 ? '已投完六爻' : '投掷铜钱'}
                </button>
              </div>
            )}

            {/* Time/Number methods */}
            {(method === 'time' || method === 'number') && (
              <p className="text-sm text-paper-dark/70 text-center">
                {method === 'time' ? '以当前时间起卦' : '请输入三个数字'}
              </p>
            )}

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full rounded-lg bg-vermillion py-3 text-lg text-white tracking-wider font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all disabled:opacity-50"
            >
              {loading ? '起卦中...' : '起卦'}
            </button>
          </div>

          {/* Result */}
          {result && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-3 animate-slide-up">
              <div className="text-center">
                <span className="text-xs text-gold/80 tracking-wider">卦象结果</span>
              </div>
              <div className="text-center">
                <p className="text-4xl text-gold font-display">{result}</p>
                <p className="text-sm text-paper-dark/70 mt-2">（AI 卦象解读开发中）</p>
              </div>
            </div>
          )}

          <p className="text-center text-xs text-paper-dark/60">仅作传统文化参考，请结合现实情况判断</p>
        </div>
      </main>

      <BottomNav active="divination" />
    </div>
  );
}
