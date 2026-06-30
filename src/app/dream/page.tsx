'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

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

  const searchDream = () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const found = DREAMS.find(d => d.keyword.includes(keyword) || keyword.includes(d.keyword));
      setResult(found || { id: 0, keyword, result: '暂无此梦境记录，百梦皆有意，古今相参证。' });
      setLoading(false);
    }, 500);
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
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">周公解梦</h1>
            <p className="text-base text-paper-dark/85">
              百梦皆有意，古今相参证。80 余条经典梦境，直接告诉您吉凶。
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
                  placeholder="输入梦境关键词，如：蛇、鱼、飞..."
                  className="flex-1 h-12 rounded-lg border border-gold/30 bg-xuan-surface px-4 text-sm text-paper-dark focus:border-gold focus:outline-none"
                />
                <button
                  type="button"
                  onClick={searchDream}
                  disabled={loading || !keyword.trim()}
                  className="rounded-lg bg-vermillion px-6 text-sm text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all disabled:opacity-50"
                >
                  {loading ? '查询中...' : '解梦'}
                </button>
              </div>

              {/* Quick keywords */}
              <div className="flex flex-wrap gap-2">
                {['蛇', '鱼', '火', '水', '飞', '龙', '牙齿掉落', '迷路', '考试', '棺材'].map(kw => (
                  <button key={kw} type="button" onClick={() => { setKeyword(kw); }} className="rounded-full border border-gold/20 px-3 py-1 text-xs text-paper-dark/70 hover:border-gold/40 hover:text-gold transition-colors">
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
                <span className="text-xs text-gold/80 tracking-wider">解梦结果</span>
              </div>
              <p className="text-lg text-gold text-center font-display">"{result.keyword}"</p>
              <p className="text-sm text-paper-dark/85 text-center leading-7">{result.result}</p>
            </div>
          )}

          {/* Disclaimer */}
          <p className="text-center text-xs text-paper-dark/60">仅作传统文化参考，请结合现实情况判断</p>
        </div>
      </main>

      <BottomNav active="dream" />
    </div>
  );
}
