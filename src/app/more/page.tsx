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

const FEATURES = [
  { icon: '☯', nameKey: 'more.features.0.title', descKey: 'more.features.0.desc', href: '/ziwei/' },
  { icon: '🪷', nameKey: 'more.features.1.title', descKey: 'more.features.1.desc', href: '/qifu/' },
  { icon: '📅', nameKey: 'more.features.2.title', descKey: 'more.features.2.desc', href: '/almanac/' },
  { icon: '🏮', nameKey: 'more.features.3.title', descKey: 'more.features.3.desc', href: '/lottery/' },
  { icon: '📖', nameKey: 'more.features.4.title', descKey: 'more.features.4.desc', href: '/dream/' },
  { icon: '🤚', nameKey: 'more.features.5.title', descKey: 'more.features.5.desc', href: '/palmistry/' },
  { icon: '✍', nameKey: 'more.features.6.title', descKey: 'more.features.6.desc', href: '/naming/' },
  { icon: '🪙', nameKey: 'more.features.7.title', descKey: 'more.features.7.desc', href: '/divination/' },
  { icon: '🧘', nameKey: 'more.features.8.title', descKey: 'more.features.8.desc', href: '/meditation/' },
  { icon: '📜', nameKey: 'more.features.9.title', descKey: 'more.features.9.desc', href: '/terms/' },
  { icon: '🔒', nameKey: 'more.features.10.title', descKey: 'more.features.10.desc', href: '/privacy/' },
  { icon: '🤖', nameKey: 'more.features.11.title', descKey: 'more.features.11.desc', href: '/ai-notice/' },
  { icon: '📋', nameKey: 'more.features.12.title', descKey: 'more.features.12.desc', href: '/records/' },
  { icon: '👤', nameKey: 'more.features.13.title', descKey: 'more.features.13.desc', href: '/profile/' },
];

export default function MorePage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 pb-24">
          <div className="pt-8 text-center space-y-3">
            <h1 className="text-[1.875rem] text-gold font-display tracking-[0.15em]">{resolve('more.title')}</h1>
            <p className="text-xs text-paper-dark/50">{resolve('more.subtitle')}</p>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3">
            {FEATURES.map((f, i) => (
              <a
                key={i}
                href={f.href}
                className="group rounded-lg border border-gold/20 bg-xuan-card/95 p-4 transition-all duration-300 hover:border-gold/40 hover:bg-xuan-card/97"
              >
                <div className="flex items-center gap-3">
                  <div className="flex size-[2.6875rem] shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/5 text-[1.25rem] transition-colors group-hover:border-gold/40 group-hover:bg-gold/10">
                    {f.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-gold group-hover:text-gold-light transition-colors truncate">{resolve(f.nameKey)}</div>
                    <div className="text-[10px] text-paper-dark/50 truncate">{resolve(f.descKey)}</div>
                  </div>
                </div>
                <svg className="w-4 h-4 text-paper-dark/20 ml-auto group-hover:text-gold/40 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m9 18 6-6-6-6"/>
                </svg>
              </a>
            ))}
          </div>
        </div>
      </main>

      <BottomNav active="more" />
    </div>
  );
}
