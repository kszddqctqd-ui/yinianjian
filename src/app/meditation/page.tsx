'use client';

import { useState, useEffect, useRef } from 'react';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';
import { sanitizeHTML } from '@/lib/sanitize';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';

function resolve(key: string): string {
  return t(key);
}

const ZEN_MODES = [
  { id: 'bell', nameKey: 'meditation.modes.0.name', icon: '🔔', descKey: 'meditation.modes.0.desc', audio: '/temple/bell.mp3' },
  { id: 'chant', nameKey: 'meditation.modes.1.name', icon: '🙏', descKey: 'meditation.modes.1.desc', audio: '/temple/chant.mp3' },
  { id: 'nature', nameKey: 'meditation.modes.2.name', icon: '🏔️', descKey: 'meditation.modes.2.desc', audio: '/temple/stream.mp3' },
];

export default function MeditationPage() {
  const [lang, setLang] = useState<SupportedLang>('zh-CN');
  const [activeMode, setActiveMode] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const startSession = (mode: string) => {
    // Stop previous audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setActiveMode(mode);
    setTimer(0);
    setIsRunning(true);
    setAudioPlaying(true);

    // Start audio
    const modeData = ZEN_MODES.find(m => m.id === mode);
    if (modeData?.audio) {
      const audio = new Audio(modeData.audio);
      audio.loop = true;
      audio.volume = 0.5;
      audio.play().catch(() => setAudioPlaying(false));
      audioRef.current = audio;
    }
  };

  // Timer
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => setTimer(t => t + 1), 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRunning]);

  // Pause/resume audio with timer
  useEffect(() => {
    if (audioRef.current) {
      if (isRunning) audioRef.current.play().catch(() => {});
      else audioRef.current.pause();
    }
  }, [isRunning]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const currentMode = activeMode ? ZEN_MODES.find(m => m.id === activeMode) : null;

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl space-y-section px-4 pb-24">
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-2 flex size-[3.1875rem] items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame size-[2.25rem] text-gold" aria-hidden="true">
                <path d="M8.5 14.1A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl tracking-widest" style={{ color: '#C9A96E' }}>{resolve('meditation.title')}</h1>
            <p className="text-base" style={{ color: '#D4C5A9' }}>
              {resolve('meditation.subtitle')}
            </p>
          </section>

          {/* Mode selection */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4">
            <div className="text-center">
              <span className="text-xs text-gold/80 tracking-wider">{resolve('meditation.modeTitle')}</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {ZEN_MODES.map(mode => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => startSession(mode.id)}
                  className={`rounded-[12.75px] border p-[12.75px] text-center transition-all ${
                    activeMode === mode.id
                      ? 'border-gold/60 bg-gold/10 shadow-gold'
                      : 'border-gold/15 bg-xuan-surface/40 hover:border-gold/30 hover:bg-xuan-surface/70'
                  }`}
                  style={{ minHeight: '89.25px' }}
                >
                  <span className="text-[1.875rem]">{mode.icon}</span>
                  <p className="text-sm text-gold mt-2 font-display">{resolve(mode.nameKey)}</p>
                  <p className="text-[10px] text-on-dark-muted mt-1">{resolve(mode.descKey)}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Timer + Audio Player */}
          {activeMode && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4 text-center">
              <div>
                <span className="text-xs text-gold/80 tracking-wider">{resolve('meditation.timerTitle')}</span>
              </div>
              <div className="text-[25.5px] text-gold font-number tracking-wider">{formatTime(timer)}</div>

              {/* Audio player */}
              {currentMode && (
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (audioRef.current) {
                        if (audioPlaying) {
                          audioRef.current.pause();
                          setAudioPlaying(false);
                        } else {
                          audioRef.current.play().catch(() => setAudioPlaying(false));
                          setAudioPlaying(true);
                        }
                      }
                    }}
                    className="flex items-center gap-2 rounded-lg border border-gold/30 px-4 py-2 text-sm text-gold hover:bg-gold/10 transition-all"
                  >
                    <span className="text-lg">{audioPlaying ? '🔇' : '🔊'}</span>
                    <span>{currentMode.icon} {resolve(currentMode.nameKey)}</span>
                    {audioPlaying && <span className="animate-pulse">●</span>}
                  </button>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <button
                  type="button"
                  onClick={() => setIsRunning(!isRunning)}
                  className="rounded-lg bg-vermillion px-6 py-2 text-sm text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all"
                >
                  {isRunning ? resolve('meditation.btn.pause') : resolve('meditation.btn.start')}
                </button>
                <button
                  type="button"
                  onClick={() => { setTimer(0); setIsRunning(false); }}
                  className="rounded-lg border border-gold/30 px-6 py-2 text-sm text-on-dark-muted hover:text-gold transition-colors"
                >
                  {resolve('meditation.btn.reset')}
                </button>
              </div>
              <p className="text-xs text-on-dark-muted">{resolve('meditation.tip')}</p>
            </div>
          )}

          {/* Daily quote */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
            <div className="text-center space-y-2">
              <p className="text-sm text-paper-dark/85 leading-loose" dangerouslySetInnerHTML={{ __html: sanitizeHTML(resolve('meditation.quote').replace(/\n/g, '<br />')) }} />
            </div>
          </div>

          <p className="text-center text-xs text-on-dark-muted">{resolve('common.disclaimer')}</p>
        </div>
      </main>

      <BottomNav active="meditation" />
    </div>
  );
}
