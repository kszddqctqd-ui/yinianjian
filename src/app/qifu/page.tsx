'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

const RELATIONS = ['自己', '父亲', '母亲', '丈夫', '妻子', '儿子', '女儿', '兄弟', '姐妹', '朋友', '同事', '恩师', '长辈', '祖先', '冤亲债主', '孤魂野鬼', '堕胎婴灵', '其他'];

const LIGHT_AMOUNTS = [
  { value: 6.6, label: '一盏', desc: '一心虔诚' },
  { value: 16.6, label: '三盏', desc: '三宝加持' },
  { value: 36.6, label: '七盏', desc: '七宝庄严' },
  { value: 66, label: '二十四盏', desc: '二十四诸天' },
  { value: 108, label: '一百零八盏', desc: '破除一百零八烦恼' },
  { value: 999, label: '九百九十九盏', desc: '九九归一，功德圆满' },
];

// Lantern component with breathing glow effect
function Lantern({ selected, onClick, count }: { selected: boolean; onClick: () => void; count: number }) {
  // Random delay for asynchronous breathing effect
  const delay = useMemo(() => `${(count * 0.7) % 4}s`, [count]);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center rounded-2xl border p-4 transition-all duration-500 ${
        selected
          ? 'border-[#c9a05c]/60 bg-gradient-to-b from-[#3d2e1a] to-[#2d2216] shadow-[0_0_20px_rgba(201,160,92,0.4)]'
          : 'border-[#c9a05c]/20 bg-[#1a1510]/80 hover:border-[#c9a05c]/40'
      }`}
      style={selected ? {
        boxShadow: `0 0 20px rgba(201,160,92,0.3), 0 0 40px rgba(201,160,92,0.15)`,
        animation: `lantern-glow 3s ease-in-out infinite`,
        animationDelay: delay,
      } : {}}
    >
      {/* Lantern shape */}
      <div className={`relative mb-2 flex size-14 items-center justify-center rounded-full border transition-all duration-500 ${
        selected
          ? 'border-[#c9a05c]/80 bg-gradient-to-b from-[#c9a05c]/30 to-[#8b6914]/20'
          : 'border-[#c9a05c]/20 bg-[#2d2216]/60'
      }`}
        style={selected ? {
          boxShadow: '0 0 15px rgba(201,160,92,0.5), inset 0 0 10px rgba(201,160,92,0.2)',
          animation: `lantern-glow 3s ease-in-out infinite`,
          animationDelay: delay,
        } : {}}
      >
        {/* Lantern string */}
        <div className="absolute -top-2 h-2 w-px bg-[#c9a05c]/40" />
        {/* Inner glow */}
        <div className={`size-8 rounded-full transition-all duration-500 ${
          selected ? 'bg-gradient-to-b from-[#f5e6b8] to-[#c9a05c] shadow-[0_0_12px_rgba(245,230,184,0.6)]' : 'bg-[#c9a05c]/10'
        }`} />
      </div>

      {/* Label */}
      <div className="text-center">
        <div className={`text-sm font-display transition-colors duration-300 ${
          selected ? 'text-[#f5e6b8]' : 'text-[#dfc59f]/70'
        }`}>
          {count}盏
        </div>
        <div className={`text-xs transition-colors duration-300 ${
          selected ? 'text-[#dfc59f]/90' : 'text-[#dfc59f]/45'
        }`}>
          {LIGHT_AMOUNTS[count]?.label || ''}
        </div>
        <div className={`text-[10px] mt-0.5 transition-colors duration-300 ${
          selected ? 'text-[#dfc59f]/70' : 'text-[#dfc59f]/30'
        }`}>
          {LIGHT_AMOUNTS[count]?.desc || ''}
        </div>
      </div>

      {/* Selected indicator */}
      {selected && (
        <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-[#c9a05c] shadow-lg">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a1510" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      )}
    </button>
  );
}

// Wish lantern for the wall
function WishLantern({ name, merit, index }: { name: string; merit: number; index: number }) {
  const delay = (index * 0.5) % 3;
  const masked = name.length > 1 ? name[0] + '*'.repeat(name.length - 1) : name;

  return (
    <div
      className="group relative flex flex-col items-center rounded-xl border border-[#c9a05c]/15 bg-[#1a1510]/60 p-3 transition-all duration-300 hover:border-[#c9a05c]/30"
      style={{
        animation: `lantern-glow ${3 + (index % 3)}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      {/* Small lantern icon */}
      <div className="relative mb-1 flex size-8 items-center justify-center rounded-full border border-[#c9a05c]/30 bg-[#2d2216]/80">
        <div className="size-3 rounded-full bg-gradient-to-b from-[#f5e6b8]/60 to-[#c9a05c]/30" />
      </div>
      <div className="text-xs text-[#dfc59f]/70">{masked}</div>
      <div className="text-[10px] text-[#dfc59f]/40">功德 {merit}</div>
    </div>
  );
}

export default function QifuPage() {
  const [visibleSections, setVisibleSections] = useState<Set<number>>(new Set());
  const [lights, setLights] = useState(126);
  const [merit, setMerit] = useState(834.6);
  const [selectedLantern, setSelectedLantern] = useState(0);
  const [showPayment, setShowPayment] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    relation: '',
    wish: '',
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

  const handleLight = () => {
    if (!formData.name.trim()) {
      alert('请输入姓名');
      return;
    }
    const amount = LIGHT_AMOUNTS[selectedLantern]?.value || 6.6;
    setLights(l => l + 1);
    setMerit(m => m + amount);
    alert('供灯成功！愿灯光照亮前路，福泽绵长。');
  };

  // Mock wish lanterns
  const wishLanterns = useMemo(() => [
    { name: '张*', merit: 6.6 },
    { name: '李*', merit: 16.6 },
    { name: '王*', merit: 36.6 },
    { name: '赵*', merit: 6.6 },
    { name: '陈*', merit: 108 },
    { name: '刘*', merit: 6.6 },
    { name: '杨*', merit: 66 },
    { name: '周*', merit: 6.6 },
    { name: '吴*', merit: 16.6 },
  ], []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1510 0%, #2d2216 50%, #1a1510 100%)' }}>
      {/* Side feather masks */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a0a0c] to-transparent" />
      <div className="pointer-events-none fixed inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0a0c] to-transparent" />

      {/* Background layers */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]" style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,160,92,0.06) 0%, transparent 60%)' }} />
      <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-[#c9a05c]/10 to-transparent" />
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
              className="transition-all duration-700"
              style={{ opacity: visibleSections.has(0) ? 1 : 0, transform: visibleSections.has(0) ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '0ms' }}
            >
              <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-[#c9a05c]/30 bg-[#c9a05c]/10">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a05c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame size-10 text-[#c9a05c]" aria-hidden="true">
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
              </div>
              <h1 className="text-4xl tracking-[0.2em] font-display" style={{ color: '#f5e6b8' }}>为家人祈福</h1>
              <p className="mx-auto max-w-md text-base mt-2" style={{ color: '#dfc59f/cc' }}>
                心愿供灯 · 传统签谱 · 看八字
              </p>
            </div>

            {/* Stats */}
            <div
              ref={(el) => { sectionRefs.current[1] = el; }}
              data-section="1"
              className="transition-all duration-700"
              style={{ opacity: visibleSections.has(1) ? 1 : 0, transform: visibleSections.has(1) ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '150ms' }}
            >
              <div className="mx-auto inline-flex items-center gap-4 rounded-full border border-[#c9a05c]/30 bg-[#1a1510]/80 px-6 py-2 text-sm backdrop-blur-sm">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a05c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame size-4" aria-hidden="true">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                  </svg>
                  <span className="font-display text-lg" style={{ color: '#f5e6b8' }}>{lights}</span>
                </span>
                <span className="h-4 w-px bg-[#c9a05c]/30" />
                <span className="flex items-center gap-1">
                  <span className="font-display text-lg" style={{ color: '#e0b97a' }}>{merit}</span>
                </span>
              </div>
            </div>
          </section>

          {/* Form */}
          <div
            ref={(el) => { sectionRefs.current[2] = el; }}
            data-section="2"
            className="transition-all duration-700"
            style={{ opacity: visibleSections.has(2) ? 1 : 0, transform: visibleSections.has(2) ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '300ms' }}
          >
            <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md space-y-6">
              <h2 className="font-display text-2xl tracking-wider" style={{ color: '#f5e6b8' }}>心愿供灯</h2>

              {/* Name & Relation */}
              <div className="grid gap-4 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-base" style={{ color: '#dfc59f' }}>姓名</span>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    maxLength={16}
                    className="h-10 w-full rounded-lg border border-[#c9a05c]/20 bg-[#2d2216]/60 px-3 text-lg transition-all duration-fast focus:border-[#c9a05c] focus:outline-none focus:ring-1 focus:ring-[#c9a05c]/30"
                    style={{ color: '#dfc59f' }}
                    placeholder="请输入姓名"
                  />
                </label>
                <label className="space-y-2">
                  <span className="text-base" style={{ color: '#dfc59f' }}>关系</span>
                  <select
                    value={formData.relation}
                    onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                    className="h-12 w-full rounded-lg border border-[#c9a05c]/20 bg-[#2d2216]/60 px-3 text-lg focus:border-[#c9a05c] focus:outline-none"
                    style={{ color: '#dfc59f' }}
                  >
                    <option value="" style={{ color: '#dfc59f' }}>请选择</option>
                    {RELATIONS.map(r => <option key={r} value={r} style={{ color: '#dfc59f' }}>{r}</option>)}
                  </select>
                </label>
              </div>

              {/* Lantern selection */}
              <div className="space-y-3">
                <p className="text-base" style={{ color: '#dfc59f' }}>选择一盏灯</p>
                <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
                  {LIGHT_AMOUNTS.map((lamp, i) => (
                    <Lantern
                      key={i}
                      count={i}
                      selected={selectedLantern === i}
                      onClick={() => setSelectedLantern(i)}
                    />
                  ))}
                </div>
              </div>

              {/* Wish */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#dfc59f' }}>心愿描述 <span className="text-xs" style={{ color: '#dfc59f/50' }}>（最多80字）</span></span>
                <textarea
                  value={formData.wish}
                  onChange={(e) => setFormData({ ...formData, wish: e.target.value })}
                  maxLength={80}
                  rows={3}
                  className="w-full rounded-lg border border-[#c9a05c]/20 bg-[#2d2216]/60 px-4 py-3 text-base transition-all duration-fast focus:border-[#c9a05c] focus:outline-none"
                  style={{ color: '#dfc59f' }}
                  placeholder="写下你的心愿..."
                />
              </label>

              {/* Price summary */}
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm" style={{ color: '#dfc59f/60' }}>每盏灯 ¥</p>
                  <p className="font-display text-3xl" style={{ color: '#f5e6b8' }}>{LIGHT_AMOUNTS[selectedLantern]?.value}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setShowPayment(true)}
                  className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50 min-w-[180px] rounded-lg tracking-wider h-12 px-8 text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #c0392b, #e74c3c)',
                    color: '#fff',
                    boxShadow: '0 4px 16px rgba(192,57,43,0.3)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 20px rgba(231,76,60,0.5)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 4px 16px rgba(192,57,43,0.3)'; }}
                  tabIndex={0}
                >
                  <span className="contents">供灯祈福</span>
                </button>
              </div>
            </div>
          </div>

          {/* Wish lantern wall */}
          <div
            ref={(el) => { sectionRefs.current[3] = el; }}
            data-section="3"
            className="transition-all duration-700"
            style={{ opacity: visibleSections.has(3) ? 1 : 0, transform: visibleSections.has(3) ? 'translateY(0)' : 'translateY(24px)', transitionDelay: '450ms' }}
          >
            <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md space-y-4">
              <h2 className="font-display text-2xl tracking-wider" style={{ color: '#f5e6b8' }}>心愿灯墙</h2>
              <p className="text-sm" style={{ color: '#dfc59f/60' }}>
                向诸佛菩萨祈愿，愿一切众生离苦得乐，福慧增长。
              </p>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-9">
                {wishLanterns.map((wl, i) => (
                  <WishLantern key={i} name={wl.name} merit={wl.merit} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="qifu" />
      <PaymentModal show={showPayment} onClose={() => setShowPayment(false)} />
    </div>
  );
}

function PaymentModal({ show, onClose }: { show: boolean; onClose: () => void }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="rounded-2xl border border-gold/30 bg-xuan-card p-6 max-w-sm w-full text-center space-y-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-xl text-gold font-display">心愿供灯</h3>
        <p className="text-sm text-paper-dark/70">请扫描下方二维码完成供灯</p>
        <img src="/zfb-payment.png" alt="支付宝收款码" className="mx-auto rounded-lg border-2 border-gold/30" />
        <p className="text-xs text-paper-dark/50">供灯完成后请截图发送给我们确认</p>
        <button
          type="button"
          onClick={onClose}
          className="w-full rounded-lg border border-gold/30 py-2 text-sm text-paper-dark/70 hover:text-gold transition-colors"
        >
          关闭
        </button>
      </div>
    </div>
  );
}
