'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

const ZEN_MODES = [
  { id: 'bell', name: '钟磬古乐', icon: '🔔', desc: '禅钟声远，涤荡心灵' },
  { id: 'chant', name: '佛号梵音', icon: '🙏', desc: '南无阿弥陀佛，清净自在' },
  { id: 'nature', name: '深山溪水', icon: '🏔️', desc: '溪水潺潺，松涛阵阵' },
];

export default function MeditationPage() {
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startSession = (mode: string) => {
    setActiveMode(mode);
    setTimer(0);
    setIsRunning(true);
  };

  // Simple timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
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
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">静心禅坐</h1>
            <p className="text-base text-paper-dark/85">
              钟磬古乐、佛号梵音、深山溪水。日日一坐，让自己慢下来。
            </p>
          </section>

          {/* Mode selection */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
            <div className="text-center">
              <span className="text-xs text-gold/80 tracking-wider">选择禅修模式</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {ZEN_MODES.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => startSession(mode.id)}
                  className={`rounded-xl border p-4 text-center transition-all ${
                    activeMode === mode.id
                      ? 'border-gold/60 bg-gold/10 shadow-gold'
                      : 'border-gold/20 bg-xuan-surface/40 hover:border-gold/40 hover:bg-xuan-surface/70'
                  }`}
                >
                  <span className="text-3xl">{mode.icon}</span>
                  <p className="text-sm text-gold mt-2 font-display">{mode.name}</p>
                  <p className="text-[10px] text-on-dark-muted mt-1">{mode.desc}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Timer */}
          {activeMode && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4 text-center">
              <div>
                <span className="text-xs text-gold/80 tracking-wider">禅修计时</span>
              </div>
              <div className="text-5xl text-gold font-number tracking-wider">{formatTime(timer)}</div>
              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className="rounded-lg bg-vermillion px-6 py-2 text-sm text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all"
                >
                  {isRunning ? '暂停' : '开始'}
                </button>
                <button
                  type="button"
                  onClick={() => { setTimer(0); setIsRunning(false); }}
                  className="rounded-lg border border-gold/30 px-6 py-2 text-sm text-on-dark-muted hover:text-gold transition-colors"
                >
                  重置
                </button>
              </div>
              <p className="text-xs text-on-dark-muted">建议每次禅坐 15-30 分钟</p>
            </div>
          )}

          {/* Daily quote */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
            <div className="text-center space-y-2">
              <p className="text-sm text-paper-dark/85 leading-loose">
                "菩提本无树，明镜亦非台。<br />本来无一物，何处惹尘埃。"
              </p>
              <p className="text-xs text-on-dark-muted">—— 六祖惠能</p>
            </div>
          </div>

          <p className="text-center text-xs text-on-dark-muted">仅作传统文化参考，请结合现实情况判断</p>
        </div>
      </main>

      <BottomNav active="meditation" />
    </div>
  );
}
