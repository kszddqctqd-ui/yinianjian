'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { saveRecord } from '@/lib/records';
import { calculateBaZi, type BaZiResult } from '@/lib/bazi';

const LOTTERIES = [
  { num: 1, title: '上上签', text: '春风得意马蹄疾，一日看尽长安花。', desc: '万事如意，心想事成。', fortune: '大吉' },
  { num: 2, title: '上上签', text: '大鹏一日同风起，扶摇直上九万里。', desc: '事业腾飞，前程似锦。', fortune: '大吉' },
  { num: 3, title: '上签', text: '山重水复疑无路，柳暗花明又一村。', desc: '绝处逢生，另有转机。', fortune: '吉' },
  { num: 4, title: '上签', text: '长风破浪会有时，直挂云帆济沧海。', desc: '坚持信念，终能成功。', fortune: '吉' },
  { num: 5, title: '中签', text: '行到水穷处，坐看云起时。', desc: '顺其自然，随缘自在。', fortune: '平' },
  { num: 6, title: '中签', text: '沉舟侧畔千帆过，病树前头万木春。', desc: '新旧交替，未来可期。', fortune: '平' },
  { num: 7, title: '中签', text: '欲穷千里目，更上一层楼。', desc: '继续努力，步步高升。', fortune: '平' },
  { num: 8, title: '下签', text: '夕阳无限好，只是近黄昏。', desc: '盛极而衰，宜守不宜进。', fortune: '凶' },
  { num: 9, title: '下签', text: '抽刀断水水更流，举杯消愁愁更愁。', desc: '烦恼缠身，静心化解。', fortune: '凶' },
  { num: 10, title: '下下签', text: '山雨欲来风满楼。', desc: '危机将至，谨慎应对。', fortune: '大凶' },
];

export default function LotteryPage() {
  const [shakeCount, setShakeCount] = useState(0);
  const [lottery, setLottery] = useState<typeof LOTTERIES[0] | null>(null);
  const [showLottery, setShowLottery] = useState(false);
  const [selectedMaster, setSelectedMaster] = useState<number | null>(0);
  const [loading, setLoading] = useState(false);

  const masters = [
    { icon: '🧘', title: '慧明长老', subtitle: '古寺住持', desc: '庄重持重，引经据典' },
    { icon: '🙏', title: '明心师父', subtitle: '尼众法师', desc: '慈悲温柔，劝人向善' },
    { icon: '☯️', title: '玄真道长', subtitle: '山中道人', desc: '直爽通透，说大白话' },
  ];

  const shakeLottery = useCallback(() => {
    if (selectedMaster === null) {
      alert('请先选择一位师父');
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
      saveRecord('lottery', { num: lot.num, title: lot.title, text: lot.text, desc: lot.desc, fortune: lot.fortune }, `${lot.title} 第${lot.num}签`);
    }, 1500);
  }, [selectedMaster]);

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
                <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                <line x1="4" y1="22" x2="4" y2="15" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">求灵签</h1>
            <p className="text-base text-paper-dark/85">
              心诚则灵。一签一事，为当前事项提供一版文化参考。
            </p>
          </section>

          {/* Master selector */}
          <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
            <div className="space-y-3">
              <p className="text-base text-paper-dark/80">请选一位师父为您开示</p>
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
                      <span className="text-3xl">{m.icon}</span>
                      <div>
                        <p className={`font-display text-lg ${selectedMaster === i ? 'text-gold' : 'text-paper-dark'}`}>{m.title}</p>
                        <p className="text-xs text-on-dark-muted">{m.subtitle}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gold/85">{m.desc}</p>
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
              <p className="text-sm text-paper-dark/80 mb-4">摇动签筒，诚心求签</p>
              <button
                type="button"
                onClick={shakeLottery}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50 min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg"
              >
                {loading ? '求签中...' : '求签'}
              </button>
              {shakeCount > 0 && (
                <p className="mt-2 text-xs text-on-dark-muted">已求签 {shakeCount} 次</p>
              )}
            </div>
          </div>

          {/* Result */}
          {showLottery && lottery && (
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm space-y-4 animate-slide-up">
              <div className="text-center">
                <span className="text-xs text-gold/80 tracking-wider">第 {lottery.num} 签</span>
              </div>
              <div className="text-center space-y-2">
                <p className="text-3xl text-gold font-display">{lottery.title}</p>
                <p className="text-xl text-paper-dark/85 italic">{lottery.text}</p>
                <p className="text-sm text-label">{lottery.desc}</p>
                <div className={`inline-block rounded-full px-4 py-1 text-sm font-medium ${
                  lottery.fortune === '大吉' ? 'bg-gold/20 text-gold' :
                  lottery.fortune === '吉' ? 'bg-gold/10 text-gold/80' :
                  lottery.fortune === '平' ? 'bg-paper-dark/10 text-on-dark-muted' :
                  lottery.fortune === '凶' ? 'bg-vermillion/10 text-vermillion' :
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
