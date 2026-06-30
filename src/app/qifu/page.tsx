'use client';

import { useState, useEffect, useRef } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

export default function QifuPage() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [lights, setLights] = useState(0);
  const [merit, setMerit] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    wish: '',
    amount: 6.6,
    familyName: '',
  });

  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Intersection observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-section'));
            setVisibleSections((prev) => new Set([...prev, idx]));
          }
        });
      },
      { threshold: 0.1 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addSectionRef = () => {
    sectionRefs.current.push(null);
  };

  const relations = ['自己', '父亲', '母亲', '丈夫', '妻子', '儿子', '女儿', '兄弟', '姐妹', '朋友', '同事', '恩师', '长辈', '祖先', '冤亲债主', '孤魂野鬼', '堕胎婴灵', '其他'];

  const handleLight = () => {
    if (!formData.name.trim()) {
      alert('请输入姓名');
      return;
    }
    setLights(l => l + 1);
    setMerit(m => m + formData.amount);
    alert('供灯成功！愿灯光照亮前路，福泽绵长。');
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
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div
              ref={(el) => { sectionRefs.current[0] = el; }}
              data-section="0"
              className="transition-all duration-base"
              style={{ opacity: visibleSections.has(0) ? 1 : 0, transform: visibleSections.has(0) ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '0ms' }}
            >
              <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-vermillion/30 bg-vermillion/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-10 text-vermillion" aria-hidden="true">
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
                </svg>
              </div>
              <h1 className="text-4xl tracking-wider text-gold">为家人祈福</h1>
              <p className="mx-auto max-w-md text-base text-paper-dark/85">
                心愿供灯 · 传统签谱 · 看八字
              </p>
            </div>

            {/* Stats */}
            <div
              ref={(el) => { sectionRefs.current[1] = el; }}
              data-section="1"
              className="transition-all duration-base"
              style={{ opacity: visibleSections.has(1) ? 1 : 0, transform: visibleSections.has(1) ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '100ms' }}
            >
              <div className="mx-auto inline-flex items-center gap-4 rounded-full border border-gold/30 bg-xuan-card/70 px-6 py-2 text-sm text-paper-dark/85">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame size-4 text-gold" aria-hidden="true">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                  <span className="font-display text-lg text-gold">{lights}</span>
                </span>
                <span className="h-4 w-px bg-gold/30" />
                <span className="flex items-center gap-1">
                  <span className="font-display text-lg text-vermillion">{merit}</span>
                </span>
              </div>
            </div>
          </section>

          {/* Form */}
          <div
            ref={(el) => { sectionRefs.current[2] = el; }}
            data-section="2"
            className="transition-all duration-base"
            style={{ opacity: visibleSections.has(2) ? 1 : 0, transform: visibleSections.has(2) ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '200ms' }}
          >
            <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-6">
              <h2 className="font-display text-2xl text-gold">心愿供灯</h2>

              {/* Name & Relation */}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-base text-paper-dark/85">姓名</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    maxLength={16}
                    className="h-10 w-full rounded-md border border-gold/20 bg-xuan-surface px-3 text-lg text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                    placeholder="请输入姓名"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-base text-paper-dark/85">关系</span>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="h-12 w-full rounded-md border border-gold/20 bg-xuan-surface px-3 text-lg text-paper-dark focus:border-gold focus:outline-none"
                  >
                    <option value="">请选择</option>
                    {relations.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </label>
              </div>

              {/* Quick relations */}
              <div className="space-y-3">
                <p className="text-base text-paper-dark/85">快速选择</p>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {['自己', '父亲', '母亲', '丈夫', '妻子', '儿女'].map(r => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setFormData({ ...formData, name: '', relation: r })}
                      className={`rounded-lg border p-3 text-center text-sm transition-all ${
                        formData.relation === r
                          ? 'border-gold/60 bg-gold/10 text-gold'
                          : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Wish */}
              <label className="block space-y-2">
                <span className="text-base text-paper-dark/85">心愿描述 <span className="text-xs text-paper-dark/50">（最多80字）</span></span>
                <textarea
                  value={formData.wish}
                  onChange={(e) => setFormData({ ...formData, wish: e.target.value })}
                  maxLength={80}
                  rows={3}
                  className="w-full rounded-md border border-gold/20 bg-xuan-surface px-4 py-3 text-base text-paper-dark focus:border-gold focus:outline-none"
                  placeholder="写下你的心愿..."
                />
              </label>

              {/* Amount */}
              <label className="block space-y-2">
                <span className="text-base text-paper-dark/85">供灯金额</span>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
                  className="h-10 w-full rounded-md border border-gold/20 bg-xuan-surface px-3 text-base text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30"
                  placeholder="输入金额"
                  min={6.6}
                  step={0.1}
                />
              </label>

              {/* Price summary */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-paper-dark/65">每盏灯 ¥</p>
                  <p className="font-display text-3xl text-gold">6.6</p>
                </div>
                <button
                  type="button"
                  onClick={handleLight}
                  className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50 min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg"
                  tabIndex={0}
                >
                  <span className="contents">供灯祈福</span>
                </button>
              </div>
            </div>
          </div>

          {/* Merit board */}
          <div
            ref={(el) => { sectionRefs.current[3] = el; }}
            data-section="3"
            className="transition-all duration-base"
            style={{ opacity: visibleSections.has(3) ? 1 : 0, transform: visibleSections.has(3) ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '300ms' }}
          >
            <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-4">
              <h2 className="font-display text-2xl text-gold">功德榜</h2>
              <p className="text-sm text-paper-dark/65">向诸佛菩萨祈愿，愿一切众生离苦得乐，福慧增长。</p>
              <p className="text-center text-paper-dark/65">功德榜开发中...</p>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="qifu" />
    </div>
  );
}
