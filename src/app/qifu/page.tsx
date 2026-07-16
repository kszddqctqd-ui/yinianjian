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

// 灯笼摇摆动画注入（仅在客户端执行）
function injectLanternAnimations() {
  if (typeof document === 'undefined') return;
  if (document.querySelector('#lantern-animations')) return;
  const style = document.createElement('style');
  style.id = 'lantern-animations';
  style.textContent = `
    @keyframes lamp-sway {
      0%, 100% { transform: rotate(-2deg); }
      50% { transform: rotate(2deg); }
    }
    @keyframes lamp-glow-pulse {
      0%, 100% { opacity: 0.85; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.06); }
    }
    @keyframes inner-flame {
      0%, 100% { opacity: 0.45; transform: scaleY(0.98) scaleX(0.96); }
      50% { opacity: 0.75; transform: scaleY(1.06) scaleX(1.04); }
    }
    @keyframes tassel-sway {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    .lantern-svg {
      animation: lamp-sway 8s ease-in-out infinite;
      transform-origin: 120px 28px;
      animation-delay: var(--dl, 0s);
    }
    .lantern-glow {
      animation: lamp-glow-pulse 4s ease-in-out infinite;
      transform-origin: 120px 150px;
      animation-delay: var(--dl, 0s);
    }
    .lantern-flame {
      animation: inner-flame 2.4s ease-in-out infinite;
      transform-origin: 120px 150px;
      animation-delay: var(--dl, 0s);
    }
    .lantern-tassel line,
    .lantern-tassel circle {
      animation: tassel-sway 3.5s ease-in-out infinite;
      transform-origin: 120px 252px;
      animation-delay: var(--dl, 0s);
    }
  `;
  document.head.appendChild(style);
}

// 单个灯笼组件
function WallLantern({ giver, receiver, index, lanternType }: { giver: string; receiver: string; index: number; lanternType?: string }) {
  const delay = (index * 0.5) % 3;
  const displayName = receiver.length > 2 ? receiver.slice(0, 2) : receiver;
  const color = LANTERN_COLORS[index % 5];
  const colorName = color.name;

  return (
    <div className="flex flex-col items-center gap-2">
      <svg
        width="130"
        height="180"
        viewBox="0 0 240 320"
        className="lantern-svg drop-shadow-[0_0_24px_rgba(255,180,80,0.4)]"
        style={{ '--dl': `${delay}s` } as React.CSSProperties}
      >
        <circle className="lantern-glow" cx="120" cy="150" r="130" fill={`url(#glow-${colorName})`} />
        <ellipse className="lantern-flame" cx="120" cy="150" rx="68" ry="92" fill={`url(#body-${colorName})`} stroke={color.body} strokeWidth="2" />
        <ellipse className="lantern-flame" cx="120" cy="150" rx="50" ry="70" fill={`url(#flame-${colorName})`} opacity="0.6" />
        <line x1="120" y1="0" x2="120" y2="20" stroke="#fde68a" strokeWidth="2" />
        <ellipse cx="120" cy="20" rx="8" ry="4" fill="#fde68a" stroke="#7c4f1a" strokeWidth="0.5" />
        <rect x="108" y="22" width="24" height="6" rx="2" fill="#fde68a" stroke="#7c4f1a" strokeWidth="0.5" />
        <path d="M 60 38 Q 120 24 180 38 L 170 50 Q 120 42 70 50 Z" fill="#fde68a" stroke="#7c4f1a" strokeWidth="0.5" />
        <path d="M 70 50 Q 120 42 170 50 L 165 56 Q 120 50 75 56 Z" fill="#7c4f1a" />
        {[1, 3, 5, 7, 9, 11].map(i => (
          <line key={i} x1={90 + i * 5} y1="60" x2={90 + i * 5} y2="240" stroke="rgba(0,0,0,0.18)" strokeWidth="1" />
        ))}
        {[85, 115, 150, 185, 215].map((y, i) => {
          const w = Math.sqrt(1 - Math.pow((y - 150) / 92, 2)) * 68;
          return <line key={i} x1={120 - w} y1={y} x2={120 + w} y2={y} stroke="rgba(0,0,0,0.12)" strokeWidth="1" />;
        })}
        <ellipse cx="102" cy="120" rx="28" ry="36" fill="url(#highlight)" />
        <ellipse cx="120" cy="240" rx="8" ry="4" fill="#fde68a" stroke="#7c4f1a" strokeWidth="0.5" />
        <rect x="108" y="232" width="24" height="6" rx="2" fill="#fde68a" stroke="#7c4f1a" strokeWidth="0.5" />
        <g className="lantern-tassel">
          <line x1="110" y1="238" x2="105" y2="275" stroke="#dc2626" strokeWidth="1.5" />
          <line x1="115" y1="238" x2="112" y2="280" stroke="#dc2626" strokeWidth="1.5" />
          <line x1="120" y1="238" x2="120" y2="282" stroke="#dc2626" strokeWidth="1.5" />
          <line x1="125" y1="238" x2="128" y2="280" stroke="#dc2626" strokeWidth="1.5" />
          <line x1="130" y1="238" x2="135" y2="275" stroke="#dc2626" strokeWidth="1.5" />
          <circle cx="120" cy="286" r="4" fill="#dc2626" />
          <circle cx="120" cy="286" r="2" fill="#fde68a" opacity="0.5" />
        </g>
        <text x="120" y="155" textAnchor="middle" fontFamily="'STKaiti', 'KaiTi', 楷体, serif" fontWeight="bold" fontSize="20" fill="#3a1f0a" style={{ filter: 'drop-shadow(0 0 4px rgba(255,220,140,0.95))' }}>
          {displayName}
        </text>
      </svg>
      <div className="text-center">
        <div className="text-[14.875px]" style={{ color: 'rgba(212,197,169,0.65)' }}>
          {giver} 为 {receiver} 敬奉
        </div>
        {lanternType && (
          <div className="mt-1 text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>
            {t(lanternType)}
          </div>
        )}
      </div>
    </div>
  );
}

// 关系选项（菩提苑源码顺序）
const RELATION_KEYS = ['qifu.relation.0', 'qifu.relation.1', 'qifu.relation.2', 'qifu.relation.3', 'qifu.relation.4', 'qifu.relation.5', 'qifu.relation.6'];

// 五种灯笼颜色
const LANTERN_COLORS = [
  { body: '#ff6b35', glow: '#ff8c5a', flame: '#ff4500', name: '橙红' },
  { body: '#e63946', glow: '#ff6b6b', flame: '#c1121f', name: '朱红' },
  { body: '#2d6a4f', glow: '#52b788', flame: '#1b4332', name: '翠绿' },
  { body: '#457b9d', glow: '#a8dadc', flame: '#1d3557', name: '靛蓝' },
  { body: '#c9a96e', glow: '#f5e6b8', flame: '#8b6914', name: '金色' },
] as const;

const COLOR_NAME_MAP: Record<string, { body: string; glow: string; flame: string; name: string }> = {
  '橙红': LANTERN_COLORS[0],
  '朱红': LANTERN_COLORS[1],
  '翠绿': LANTERN_COLORS[2],
  '靛蓝': LANTERN_COLORS[3],
  '金色': LANTERN_COLORS[4],
};

// 灯墙数据（24个，对标菩提苑 6行×4列）
const WALL_LANTERN_KEYS = [
  { giver: '善**', receiver: '周*', type: 'qifu.lamp.2.name' },
  { giver: '善**', receiver: '朴*', type: 'qifu.lamp.3.name' },
  { giver: '善**', receiver: '董*', type: 'qifu.lamp.4.name' },
  { giver: '善**', receiver: '吉', type: 'qifu.lamp.3.name' },
  { giver: '善**', receiver: '武*', type: 'qifu.lamp.3.name' },
  { giver: '1**', receiver: 'w*', type: 'qifu.lamp.1.name' },
  { giver: '善**', receiver: '赵*', type: 'qifu.lamp.2.name' },
  { giver: '善**', receiver: '杜*', type: 'qifu.lamp.3.name' },
  { giver: '善**', receiver: '刘*', type: 'qifu.lamp.4.name' },
  { giver: '善**', receiver: '林*', type: 'qifu.lamp.1.name' },
  { giver: '善**', receiver: '周*', type: 'qifu.lamp.2.name' },
  { giver: '善**', receiver: '朴*', type: 'qifu.lamp.3.name' },
  { giver: '善**', receiver: '董*', type: 'qifu.lamp.4.name' },
  { giver: '善**', receiver: '吉', type: 'qifu.lamp.3.name' },
  { giver: '善**', receiver: '武*', type: 'qifu.lamp.3.name' },
  { giver: '1**', receiver: 'w*', type: 'qifu.lamp.1.name' },
  { giver: '善**', receiver: '赵*', type: 'qifu.lamp.2.name' },
  { giver: '善**', receiver: '杜*', type: 'qifu.lamp.3.name' },
  { giver: '善**', receiver: '刘*', type: 'qifu.lamp.4.name' },
  { giver: '善**', receiver: '林*', type: 'qifu.lamp.1.name' },
  { giver: '周**', receiver: '周*', type: 'qifu.lamp.2.name' },
  { giver: '善**', receiver: '何*', type: 'qifu.lamp.0.name' },
  { giver: '善**', receiver: '童*', type: 'qifu.lamp.3.name' },
  { giver: '善**', receiver: '孙*', type: 'qifu.lamp.5.name' },
];

export default function QifuPage() {
  const [familyName, setFamilyName] = useState('');
  const [relation, setRelation] = useState('');
  const [wish, setWish] = useState('');
  const [yourName, setYourName] = useState('');
  const [lanternType, setLanternType] = useState('pingan');
  const [plan, setPlan] = useState('monthly');
  const [showPayment, setShowPayment] = useState(false);
  const [totalLights, setTotalLights] = useState(51);
  const [wallScroll, setWallScroll] = useState(WALL_LANTERN_KEYS);
  const [lang, setLang] = useState<SupportedLang>(getLocale());

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  useEffect(() => { injectLanternAnimations(); }, []);

  // 灯墙实时更新
  useEffect(() => {
    const givers = ['善*', '黄*', '林*', '何*', '高*', '罗*', '梁*', '谢*', '宋*', '唐*'];
    const receivers = ['周*', '朴*', '董*', '吉*', '武*', '赵*', '杜*', '刘*', '林*', '何*'];
    const lampTypeKeys = ['qifu.lamp.3.name', 'qifu.lamp.4.name', 'qifu.lamp.1.name', 'qifu.lamp.2.name', 'qifu.lamp.5.name', 'qifu.lamp.0.name'];
    const timer = setInterval(() => {
      const newEntry = {
        giver: givers[Math.floor(Math.random() * givers.length)],
        receiver: receivers[Math.floor(Math.random() * receivers.length)],
        type: lampTypeKeys[Math.floor(Math.random() * lampTypeKeys.length)],
      };
      setWallScroll(prev => [newEntry, ...prev.slice(0, 15)]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const handleLight = () => {
    if (!familyName.trim()) return;
    setTotalLights(l => l + 1);
  };

  return (
    <>
      {/* 全局共享渐变 defs — 所有灯笼复用 */}
      <svg className="absolute -left-[9999px] top-0" width="0" height="0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {Object.entries(COLOR_NAME_MAP).map(([name, c]) => (
            <g key={name}>
              <radialGradient id={`body-${name}`} cx="50%" cy="40%" r="60%">
                <stop offset="0%" stopColor="#fff5d8" stopOpacity="0.95" />
                <stop offset="100%" stopColor={c.body} stopOpacity="0.3" />
              </radialGradient>
              <radialGradient id={`glow-${name}`} cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={c.glow} stopOpacity="0.6" />
                <stop offset="60%" stopColor={c.glow} stopOpacity="0.25" />
                <stop offset="100%" stopColor={c.glow} stopOpacity="0" />
              </radialGradient>
              <radialGradient id={`flame-${name}`} cx="50%" cy="60%" r="50%">
                <stop offset="0%" stopColor="#fff7c0" />
                <stop offset="40%" stopColor="#ffd97a" />
                <stop offset="70%" stopColor="#ff8b3d" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#ff5a14" stopOpacity="0" />
              </radialGradient>
            </g>
          ))}
          <radialGradient id="highlight" cx="35%" cy="30%" r="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>

      <div className="min-h-screen bg-xuan relative overflow-hidden">
        <GoldenLotusBg />
        <FloatingParticles />
        <Header />
        <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-6 px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-vermillion/30 bg-vermillion/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-10 text-vermillion" aria-hidden="true">
                <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
              </svg>
            </div>
            <h1 className="text-4xl tracking-widest text-gold">{resolve('qifu.title')}</h1>
            <p className="mx-auto max-w-md text-base text-paper-dark/85">
              {resolve('qifu.subtitle')}
            </p>
          </section>

          {/* 灯墙统计 + 滚动条 */}
          <div className="flex justify-center">
            <div className="mx-auto inline-flex items-center gap-4 rounded-full border border-gold/30 bg-xuan-card/70 px-6 py-2 text-sm text-paper-dark/85">
              <span>{resolve('qifu.stats.lit')} <span className="font-display text-lg text-gold">{totalLights}</span> {resolve('qifu.stats.unit')}</span>
              <span className="h-4 w-px bg-gold/30" />
              <span>{resolve('qifu.stats.today')} <span className="font-display text-lg text-vermillion">0</span> {resolve('qifu.stats.unit')}</span>
            </div>
          </div>
          <div className="relative mx-auto mt-3 max-w-lg overflow-hidden rounded-full border border-gold/20 bg-xuan-card/50 px-4 py-2">
            <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap gap-8">
              {wallScroll.map((wl, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-xs text-paper-dark/75">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame size-3 text-vermillion/70" aria-hidden="true">
                    <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
                  </svg>
                  <span className="text-gold/85">{wl.giver}</span>
                  <span>{resolve('qifu.wall.marquee.offering')}</span>
                  <span className="text-gold/85">{resolve('qifu.wall.marquee.guest')}</span>
                  <span>{resolve('qifu.wall.marquee.lit')}</span>
                  <span className="text-gold/85">{resolve(wl.type)}</span>
                </span>
              ))}
            </div>
          </div>

          {/* 表单标题 */}
          <h2 className="font-display text-2xl text-gold">为谁点灯</h2>

          {/* Form */}
          <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-4">
            {/* 家人姓名 + 关系 */}
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-base text-paper-dark/85">家人姓名</span>
                <input
                  type="text"
                  value={familyName}
                  onChange={(e) => setFamilyName(e.target.value)}
                  placeholder="例如：王秀英"
                  maxLength={16}
                  className="h-10 rounded-md border border-gold/20 bg-xuan-surface px-3 text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 text-lg w-full"
                />
              </label>
              <label className="space-y-2">
                <span className="text-base text-paper-dark/85">与您的关系</span>
                <select
                  value={relation}
                  onChange={(e) => setRelation(e.target.value)}
                  className="h-12 w-full rounded-md border border-gold/20 bg-xuan-surface px-3 text-lg text-paper-dark focus:border-gold focus:outline-none"
                >
                  <option value="">请选择</option>
                  {RELATION_KEYS.map(r => <option key={r} value={r}>{resolve(r)}</option>)}
                </select>
              </label>
            </div>

            {/* 心愿 */}
            <label className="block space-y-2">
              <span className="text-base text-paper-dark/85">心愿（可选，最多 80 字）</span>
              <textarea
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                placeholder="例如：愿父亲身体康健、烦恼消解"
                maxLength={80}
                rows={3}
                className="w-full rounded-md border border-gold/20 bg-xuan-surface px-4 py-3 text-base text-paper-dark focus:border-gold focus:outline-none"
              />
            </label>

            {/* 您的称呼 */}
            <label className="block space-y-2">
              <span className="text-base text-paper-dark/85">您的称呼（可选，会显示在灯墙）</span>
              <input
                type="text"
                value={yourName}
                onChange={(e) => setYourName(e.target.value)}
                placeholder="例如：李小华"
                maxLength={16}
                className="h-10 rounded-md border border-gold/20 bg-xuan-surface px-3 text-base text-paper-dark placeholder:text-ink-muted transition-all duration-fast focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 w-full"
              />
            </label>
          </div>

          {/* 灯型选择 */}
          <h2 className="font-display text-2xl text-gold">灯型选择</h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { key: 'qingxin', label: resolve('qifu.lamp.0.name'), desc: resolve('qifu.lamp.0.desc') },
              { key: 'caiyun', label: resolve('qifu.lamp.1.desc'), desc: resolve('qifu.lamp.1.desc') },
              { key: 'changming', label: resolve('qifu.lamp.2.label'), desc: resolve('qifu.lamp.2.desc') },
              { key: 'shiyi', label: resolve('qifu.lamp.3.label'), desc: resolve('qifu.lamp.3.desc') },
              { key: 'yinyuan', label: resolve('qifu.lamp.4.name'), desc: resolve('qifu.lamp.4.desc') },
              { key: 'jiankang', label: resolve('qifu.lamp.5.label'), desc: resolve('qifu.lamp.5.desc') },
            ].map(lamp => (
              <button
                key={lamp.key}
                type="button"
                onClick={() => setLanternType(lamp.key)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  lanternType === lamp.key
                    ? 'border-gold bg-gold/10 shadow-gold'
                    : 'border-gold/20 bg-xuan-surface/40 hover:border-gold/40'
                }`}
              >
                <p className="font-display text-base text-gold">{lamp.label}</p>
                <p className="mt-1 text-xs text-paper-dark/80">{lamp.desc}</p>
              </button>
            ))}
          </div>

          {/* 供奉套餐 */}
          <h2 className="font-display text-2xl text-gold">供奉套餐</h2>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'monthly', label: resolve('payment.monthly'), price: '¥3.9', period: '/月' },
              { key: 'quarterly', label: resolve('payment.quarterly'), price: '¥5.9', period: '/百日' },
              { key: 'yearly', label: resolve('payment.yearly'), price: '¥9.9', period: '/年' },
              { key: 'permanent', label: resolve('payment.perpetual'), price: '¥19.9', period: '永久' },
            ].map(p => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPlan(p.key)}
                className={`rounded-lg border-2 p-4 text-center transition-all ${
                  plan === p.key
                    ? 'border-gold bg-gold/10 shadow-lg shadow-gold/10'
                    : 'border-gold/20 bg-xuan-card hover:border-gold/40'
                }`}
              >
                <div className="text-sm font-display text-gold">{p.label}</div>
                <div className="mt-1 text-2xl font-display text-vermillion">{p.price}</div>
                <div className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{p.period}</div>
              </button>
            ))}
          </div>

          {/* 底部按钮 */}
          <div className="flex justify-center">
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg"
              onClick={() => setShowPayment(true)}
            >
              点亮此灯
            </button>
          </div>

          {/* 支付弹窗 */}
          {showPayment && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowPayment(false)}>
              <div className="rounded-2xl border-2 border-gold/40 bg-xuan-card p-6 max-w-sm w-full text-center space-y-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-xl text-gold font-display">{resolve('payment.title')}</h3>
                <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('payment.desc')}</p>
                <div className="rounded-lg border border-gold/20 bg-xuan-surface p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'rgba(212,197,169,0.7)' }}>灯型</span>
                    <span className="text-gold">{resolve(`payment.lantern.${lanternType}`)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span style={{ color: 'rgba(212,197,169,0.7)' }}>套餐</span>
                    <span className="text-gold">{resolve(`payment.plan.${plan}`)}</span>
                  </div>
                  <div className="flex justify-between text-base font-display">
                    <span style={{ color: 'rgba(212,197,169,0.7)' }}>金额</span>
                    <span className="text-vermillion text-2xl">
                      {plan === 'monthly' ? '¥3.9' : plan === 'quarterly' ? '¥5.9' : plan === 'yearly' ? '¥9.9' : '¥19.9'}
                    </span>
                  </div>
                </div>
                <img src="/zfb-payment.png" alt="支付宝收款码" className="mx-auto rounded-lg border-2 border-gold/30 w-48 h-48 object-cover" />
                <p className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('payment.confirm')}</p>
                <button
                  type="button"
                  onClick={() => setShowPayment(false)}
                  className="w-full rounded-md border border-gold/30 py-2 text-sm text-paper-dark/80 hover:text-gold transition-colors"
                >
                  {resolve('payment.close')}
                </button>
              </div>
            </div>
          )}

          {/* 心愿灯墙 */}
          <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-4">
            <h2 className="font-display text-2xl text-gold">心愿灯墙</h2>
            <p className="text-sm" style={{ color: 'rgba(212,197,169,0.65)' }}>
              {resolve('qifu.wall.note')}
            </p>
            <div className="relative overflow-hidden" style={{ maxHeight: '1100px' }}>
              <div className="grid grid-cols-4 gap-3">
                {WALL_LANTERN_KEYS.map((wl, i) => (
                  <WallLantern key={i} giver={wl.giver} receiver={wl.receiver} index={i} lanternType={wl.type} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="qifu" />
      </div>
    </>
  );
}
