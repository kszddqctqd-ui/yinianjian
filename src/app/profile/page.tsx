'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { getRecords, getTotalRecordCount } from '@/lib/records';

export default function ProfilePage() {
  const [totalReadings, setTotalReadings] = useState(0);

  useEffect(() => {
    setTotalReadings(getTotalRecordCount());
  }, []);

  const handleClearCache = () => {
    if (confirm('确定要清除本地缓存吗？这将删除所有记录和设置。')) {
      localStorage.clear();
      setTotalReadings(0);
      alert('缓存已清除');
    }
  };

  return (
    <div className="min-h-screen bg-deep relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]" style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)' }} />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 pb-24">
          {/* Title */}
          <div className="pt-8 text-center space-y-3">
            <h1 className="text-3xl text-gold font-display tracking-[0.15em]">个人中心</h1>
          </div>

          {/* Avatar card */}
          <div className="mt-6 rounded-lg border border-gold/20 bg-xuan-card/95 p-6 text-center">
            <div className="mx-auto size-20 rounded-full border-2 border-gold/40 bg-gold/10 flex items-center justify-center">
              <span className="text-4xl">🪷</span>
            </div>
            <p className="mt-3 text-gold font-display text-lg">一念间施主</p>
            <p className="text-xs text-paper-dark/50 mt-1">心诚则灵</p>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-3">
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-4 text-center">
              <div className="text-2xl text-gold font-display">{totalReadings}</div>
              <div className="text-xs text-paper-dark/50 mt-1">总查询</div>
            </div>
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-4 text-center">
              <div className="text-2xl text-gold font-display">
                {getRecords().filter(r => r.type === 'bazi').length}
              </div>
              <div className="text-xs text-paper-dark/50 mt-1">八字</div>
            </div>
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-4 text-center">
              <div className="text-2xl text-gold font-display">
                {getRecords().filter(r => r.type === 'lottery').length}
              </div>
              <div className="text-xs text-paper-dark/50 mt-1">灵签</div>
            </div>
          </div>

          {/* Settings */}
          <div className="mt-4 space-y-3">
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-4">
              <h3 className="text-gold font-display text-base mb-3">设置</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/records'}
                  className="w-full flex items-center justify-between rounded-lg border border-gold/20 bg-xuan-surface/50 px-4 py-3 text-sm text-paper-dark/80 hover:text-gold hover:border-gold/30 transition-all"
                >
                  <span>查看记录</span>
                  <svg className="w-4 h-4 text-paper-dark/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </button>
                <button
                  onClick={handleClearCache}
                  className="w-full flex items-center justify-between rounded-lg border border-gold/20 bg-xuan-surface/50 px-4 py-3 text-sm text-paper-dark/80 hover:text-vermillion hover:border-vermillion/30 transition-all"
                >
                  <span>清除缓存</span>
                  <svg className="w-4 h-4 text-paper-dark/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
                </button>
              </div>
            </div>

            {/* About */}
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-4">
              <h3 className="text-gold font-display text-base mb-3">关于</h3>
              <div className="space-y-2 text-sm text-paper-dark/70">
                <div className="flex justify-between">
                  <span>版本</span>
                  <span className="text-paper-dark/50">4.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span>版权</span>
                  <span className="text-paper-dark/50">© 2026 一念间</span>
                </div>
                <div className="flex justify-between">
                  <span>理念</span>
                  <span className="text-paper-dark/50">心诚则灵</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
