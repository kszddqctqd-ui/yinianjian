'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { saveRecord } from '@/lib/records';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

function resolve(key: string): string {
  return t(key);
}

const DREAMS = [
  { id: 1, keyword: '蛇', result: '梦见蛇，主有财。若蛇缠身，主有贵人相助。' },
  { id: 2, keyword: '鱼', result: '梦见鱼，主有喜事。大鱼主大喜，小鱼主小喜。' },
  { id: 3, keyword: '火', result: '梦见火，主有口舌之争。若火烧屋，主有大灾。' },
  { id: 4, keyword: '水', result: '梦见水，主有财运。清水主吉，浑水主凶。' },
  { id: 5, keyword: '飞', result: '梦见飞，主有升迁之喜。若能飞翔，主前途无量。' },
  { id: 6, keyword: '牙齿掉落', result: '梦见牙齿掉落，主有亲人离世之忧。' },
  { id: 7, keyword: '考试', result: '梦见考试，主有压力。若能通过，主事事顺利。' },
  { id: 8, keyword: '迷路', result: '梦见迷路，主有迷茫之感。需静心思考方向。' },
  { id: 9, keyword: '龙', result: '梦见龙，主大吉。龙飞九天，主事业腾飞。' },
  { id: 10, keyword: '棺材', result: '梦见棺材，主升官发财。棺主官，材主财。' },
];

export default function DreamPage() {
  const [keyword, setKeyword] = useState('');
  const [result, setResult] = useState<typeof DREAMS[number] | null>(null);
  const [loading, setLoading] = useState(false);
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const searchDream = () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const found = DREAMS.find(d => d.keyword.includes(keyword) || keyword.includes(d.keyword));
      const res = found || { id: 0, keyword, result: resolve('dream.noResult') };
      setResult(res);
      setLoading(false);
      saveRecord('dream', { keyword, result: res.result }, `${resolve('dream.resultTitle')}：${keyword}`);
    }, 500);
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
            <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon size-8 text-gold" aria-hidden="true">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl tracking-widest" style={{ color: '#C9A96E' }}>{resolve('dream.title')}</h1>
            <p className="text-base" style={{ color: '#D4C5A9' }}>
              {resolve('dream.subtitle')}
            </p>
          </section>

          {/* Search */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && searchDream()}
                  placeholder={resolve('dream.searchPlaceholder')}
                  className="flex-1 h-12 rounded-lg border border-gold/30 bg-xuan-surface px-4 text-sm text-paper-dark focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={searchDream}
                  disabled={loading || !keyword.trim()}
                  className="rounded-lg bg-vermillion px-6 text-sm text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all disabled:opacity-50"
                >
                  {loading ? resolve('dream.loading') : resolve('dream.btn.search')}
                </button>
              </div>

              {/* Quick keywords */}
              <div className="flex flex-wrap gap-2">
                {['蛇', '鱼', '火', '水', '飞', '龙', '牙齿掉落', '迷路', '考试', '棺材'].map(kw => (
                  <button key={kw} type="button" onClick={() => { setKeyword(kw); }} className="rounded-full border border-gold/20 px-3 py-1 text-xs text-on-dark-muted hover:border-gold/40 hover:text-gold transition-colors">
                    {kw}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result */}
          {result && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-2 animate-slide-up">
              <div className="text-center">
                <span className="text-xs text-gold/80 tracking-wider">{resolve('dream.resultTitle')}</span>
              </div>
              <p className="text-lg text-gold text-center font-display">"{result.keyword}"</p>
              <p className="text-sm text-paper-dark/85 text-center leading-7">{result.result}</p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-center text-xs text-on-dark-muted">{resolve('common.disclaimer')}</p>
        </div>
      </main>

      <BottomNav active="dream" />
    </div>
  );
}
