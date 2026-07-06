'use client';

import { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

const RELATIONS = ['qifu.relations.0', 'qifu.relations.1', 'qifu.relations.2', 'qifu.relations.3', 'qifu.relations.4', 'qifu.relations.5', 'qifu.relations.6', 'qifu.relations.7', 'qifu.relations.8', 'qifu.relations.9', 'qifu.relations.10', 'qifu.relations.11', 'qifu.relations.12', 'qifu.relations.13', 'qifu.relations.14'];

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
  `;
  document.head.appendChild(style);
}

const LIGHT_AMOUNTS = [
  { value: 6.6, label: 'qifu.lamp.0.label', desc: 'qifu.lamp.0.desc' },
  { value: 16.6, label: 'qifu.lamp.1.label', desc: 'qifu.lamp.1.desc' },
  { value: 36.6, label: 'qifu.lamp.2.label', desc: 'qifu.lamp.2.desc' },
  { value: 66, label: 'qifu.lamp.3.label', desc: 'qifu.lamp.3.desc' },
  { value: 108, label: 'qifu.lamp.4.label', desc: 'qifu.lamp.4.desc' },
  { value: 999, label: 'qifu.lamp.5.label', desc: 'qifu.lamp.5.desc' },
];

function Lantern({ selected, onClick, count }: { selected: boolean; onClick: () => void; count: number }) {
  const delay = `${(count * 0.7) % 4}s`;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-center rounded-xl border p-4 transition-all duration-200 ${
        selected
          ? 'border-gold/60 bg-gold/10 shadow-gold'
          : 'border-gold/20 bg-xuan-card/60 hover:border-gold/40 hover:bg-xuan-surface/70'
      }`}
    >
      <div className="text-center">
        <div className={`font-display text-lg ${selected ? 'text-paper' : 'text-paper-dark/70'}`}>
          {count}{resolve('common.lampUnit').trim()}
        </div>
        <div className={`text-xs ${selected ? 'text-paper-dark/90' : 'text-paper-dark/50'}`}>
          {resolve(LIGHT_AMOUNTS[count]?.label || '')}
        </div>
        <div className={`text-[10px] mt-0.5 ${selected ? 'text-paper-dark/70' : 'text-paper-dark/30'}`}>
          {resolve(LIGHT_AMOUNTS[count]?.desc || '')}
        </div>
      </div>

      {selected && (
        <div className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-gold shadow-lg">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#1a1410" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
      )}
    </button>
  );
}

function WishLantern({ name, merit, index }: { name: string; merit: number; index: number }) {
  const delay = (index * 0.5) % 3;
  // 脱敏：只显示前2个字符
  const displayName = name.length > 2 ? name.slice(0, 2) : name;

  // 五种灯笼颜色循环（对齐菩提苑）
  const lanternColors = [
    { body: '#ff6b35', glow: '#ff8c5a', flame: '#ff4500', name: '橙红' },   // 橙
    { body: '#e63946', glow: '#ff6b6b', flame: '#c1121f', name: '朱红' },   // 红
    { body: '#2d6a4f', glow: '#52b788', flame: '#1b4332', name: '翠绿' },   // 绿
    { body: '#457b9d', glow: '#a8dadc', flame: '#1d3557', name: '靛蓝' },   // 蓝
    { body: '#c9a96e', glow: '#f5e6b8', flame: '#8b6914', name: '金色' },   // 金
  ];
  const color = lanternColors[index % 5];

  return (
    <div className="flex flex-col items-center gap-2" style={{ animationDelay: `${delay}s` }}>
      {/* 传统纸灯笼 SVG */}
      <svg
        width="130"
        height="180"
        viewBox="0 0 240 320"
        className="drop-shadow-[0_0_24px_rgba(255,180,80,0.4)]"
        style={{
          animation: `lamp-sway 8s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transformOrigin: '120px 28px',
        }}
      >
        <defs>
          {/* 金属渐变 */}
          <linearGradient id={`metal-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#fde68a">
              <animate attributeName="stop-color" values="#fde68a;#ffffff;#fde68a" dur="3s" repeatCount="indefinite" />
            </stop>
            <stop offset="50%" stopColor={color.body} />
            <stop offset="100%" stopColor={color.flame} />
          </linearGradient>

          {/* 灯笼体径向渐变 */}
          <radialGradient id={`body-${index}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#fff5d8" stopOpacity="0.95" />
            <stop offset="100%" stopColor={color.body} stopOpacity="0.3" />
          </radialGradient>

          {/* 外发光 */}
          <radialGradient id={`glow-${index}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={color.glow} stopOpacity="0.6" />
            <stop offset="60%" stopColor={color.glow} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color.glow} stopOpacity="0" />
          </radialGradient>

          {/* 高光 */}
          <radialGradient id={`highlight-${index}`} cx="35%" cy="30%" r="35%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </radialGradient>

          {/* 内部火焰 */}
          <radialGradient id={`flame-${index}`} cx="50%" cy="60%" r="50%">
            <stop offset="0%" stopColor="#fff7c0" />
            <stop offset="40%" stopColor="#ffd97a" />
            <stop offset="70%" stopColor="#ff8b3d" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff5a14" stopOpacity="0" />
          </radialGradient>

          {/* 流苏渐变 */}
          <linearGradient id={`tassel-${index}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#dc2626" />
            <stop offset="100%" stopColor="#7f1d1d" />
          </linearGradient>
        </defs>

        {/* 挂绳 */}
        <line x1="120" y1="0" x2="120" y2="20" stroke={`url(#metal-${index})`} strokeWidth="2" />

        {/* 顶部金属帽 */}
        <ellipse cx="120" cy="20" rx="8" ry="4" fill={`url(#metal-${index})`} stroke="#7c4f1a" strokeWidth="0.5" />
        <rect x="108" y="22" width="24" height="6" rx="2" fill={`url(#metal-${index})`} stroke="#7c4f1a" strokeWidth="0.5" />

        {/* 金属顶盖穹顶 */}
        <path d="M 60 38 Q 120 24 180 38 L 170 50 Q 120 42 70 50 Z" fill={`url(#metal-${index})`} stroke="#7c4f1a" strokeWidth="0.5" />

        {/* 金属装饰环 */}
        <path d="M 70 50 Q 120 42 170 50 L 165 56 Q 120 50 75 56 Z" fill="#7c4f1a" />

        {/* 外发光圆 */}
        <circle
          cx="120"
          cy="150"
          r="130"
          fill={`url(#glow-${index})`}
          style={{
            animation: `lamp-glow-pulse 4s ease-in-out infinite`,
            animationDelay: `${delay}s`,
          }}
        />

        {/* 灯笼主体椭圆 */}
        <ellipse
          cx="120"
          cy="150"
          rx="68"
          ry="92"
          fill={`url(#body-${index})`}
          stroke={color.body}
          strokeWidth="2"
        />

        {/* 内部火焰 */}
        <ellipse
          cx="120"
          cy="150"
          rx="50"
          ry="70"
          fill={`url(#flame-${index})`}
          opacity="0.6"
          style={{
            animation: `inner-flame 2.4s ease-in-out infinite`,
            animationDelay: `${delay}s`,
            transformOrigin: '120px 150px',
          }}
        />

        {/* 6条垂直纹理线 */}
        {[1, 3, 5, 7, 9, 11].map(i => (
          <line
            key={`v-${i}`}
            x1={90 + i * 5}
            y1="60"
            x2={90 + i * 5}
            y2="240"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1"
          />
        ))}

        {/* 5条水平纹理线 */}
        {[85, 115, 150, 185, 215].map((y, i) => {
          const widthAtY = Math.sqrt(1 - Math.pow((y - 150) / 92, 2)) * 68;
          return (
            <line
              key={`h-${i}`}
              x1={120 - widthAtY}
              y1={y}
              x2={120 + widthAtY}
              y2={y}
              stroke="rgba(0,0,0,0.12)"
              strokeWidth="1"
            />
          );
        })}

        {/* 高光椭圆 */}
        <ellipse
          cx="102"
          cy="120"
          rx="28"
          ry="36"
          fill={`url(#highlight-${index})`}
        />

        {/* 底部金属帽 */}
        <ellipse cx="120" cy="240" rx="8" ry="4" fill={`url(#metal-${index})`} stroke="#7c4f1a" strokeWidth="0.5" />
        <rect x="108" y="232" width="24" height="6" rx="2" fill={`url(#metal-${index})`} stroke="#7c4f1a" strokeWidth="0.5" />

        {/* 红色流苏 */}
        <g style={{
          animation: `tassel-sway 3.5s ease-in-out infinite`,
          animationDelay: `${delay}s`,
          transformOrigin: '120px 252px',
        }}>
          <line x1="110" y1="238" x2="105" y2="275" stroke={`url(#tassel-${index})`} strokeWidth="1.5" />
          <line x1="115" y1="238" x2="112" y2="280" stroke={`url(#tassel-${index})`} strokeWidth="1.5" />
          <line x1="120" y1="238" x2="120" y2="282" stroke={`url(#tassel-${index})`} strokeWidth="1.5" />
          <line x1="125" y1="238" x2="128" y2="280" stroke={`url(#tassel-${index})`} strokeWidth="1.5" />
          <line x1="130" y1="238" x2="135" y2="275" stroke={`url(#tassel-${index})`} strokeWidth="1.5" />
          {/* 底部珠子 */}
          <circle cx="120" cy="286" r="4" fill="#dc2626" />
          <circle cx="120" cy="286" r="2" fill="#fde68a" opacity="0.5" />
        </g>

        {/* 名字文字 - 楷体 + 金色内发光 */}
        <text
          x="120"
          y="155"
          textAnchor="middle"
          fontFamily="'STKaiti', 'KaiTi', 楷体, serif"
          fontWeight="bold"
          fontSize="20"
          fill="#3a1f0a"
          style={{ filter: 'drop-shadow(0 0 4px rgba(255,220,140,0.95))' }}
        >
          {displayName}
        </text>
      </svg>

      {/* 底部小字 */}
      <div className="text-center">
        <div className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>
          {resolve('qifu.wall.lantern.offering')} {name}
        </div>
        <div className="text-[10px]" style={{ color: 'rgba(212,197,169,0.4)' }}>
          {resolve('qifu.wall.lantern.merit')} {merit}
        </div>
      </div>
    </div>
  );
}

export default function QifuPage() {
  const [selectedLantern, setSelectedLantern] = useState(0);
  const [formData, setFormData] = useState({ name: '', relation: '', wish: '' });
  const [showPayment, setShowPayment] = useState(false);
  const [lights, setLights] = useState(126);
  const [merit, setMerit] = useState(834.6);

  const [lang, setLang] = useState<SupportedLang>(getLocale());

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  useEffect(() => { injectLanternAnimations(); }, []);

  const handleLight = () => {
    if (!formData.name.trim()) {
      alert(resolve('qifu.form.name.placeholder'));
      return;
    }
    const amount = LIGHT_AMOUNTS[selectedLantern]?.value || 6.6;
    setLights(l => l + 1);
    setMerit(m => m + amount);
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-vermillion/30 bg-vermillion/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-[2.6875rem] text-vermillion" aria-hidden="true">
                <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
              </svg>
            </div>
            <h1 className="text-4xl tracking-[0.15em] font-display" style={{ color: '#C9A96E' }}>{resolve('qifu.title')}</h1>
            <p className="mx-auto max-w-md text-base" style={{ color: '#D4C5A9' }}>
              {resolve('qifu.subtitle')}
            </p>
          </section>

          {/* Form */}
          <div>
            <div className="card-standard space-y-6">
              <h2 className="font-display text-[1.5rem]" style={{ color: '#C9A96E' }}>{resolve('qifu.section.who')}</h2>

              {/* Name */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('qifu.form.name')}</span>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  maxLength={16}
                  className="input-standard h-10 w-full px-3 text-lg"
                  style={{ color: '#D4C5A9' }}
                  placeholder={resolve('qifu.form.name.placeholder')}
                />
              </label>

              {/* Relation */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('qifu.form.relation')}</span>
                <select
                  value={formData.relation}
                  onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                  className="h-12 w-full rounded-md border border-gold/20 bg-xuan-surface px-3 text-lg text-paper-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                  style={{ backgroundColor: 'rgba(61,52,40,0.4)', color: '#D4C5A9' }}
                >
                  <option value="">{resolve('qifu.form.relation.placeholder')}</option>
                  {RELATIONS.map(r => <option key={r} value={resolve(r)}>{resolve(r)}</option>)}
                </select>
              </label>
            </div>
          </div>

          {/* Lantern Selection */}
          <div>
            <div className="card-standard space-y-4">
              <h2 className="font-display text-[1.5rem]" style={{ color: '#C9A96E' }}>{resolve('qifu.section.lamp')}</h2>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
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
          </div>

          {/* Wish */}
          <div>
            <div className="card-standard space-y-4">
              <h2 className="font-display text-[1.5rem]" style={{ color: '#C9A96E' }}>{resolve('qifu.section.wish')}</h2>
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('qifu.section.wish')} <span className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>({resolve('qifu.wish.charLimit')})</span></span>
                <textarea
                  value={formData.wish}
                  onChange={(e) => setFormData({ ...formData, wish: e.target.value })}
                  maxLength={80}
                  rows={3}
                  className="w-full rounded-md border border-gold/20 bg-xuan-surface/40 px-4 py-3 text-base focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all"
                  style={{ color: '#D4C5A9', backgroundColor: 'rgba(61,52,40,0.4)' }}
                  placeholder={resolve('qifu.wish.placeholder')}
                />
              </label>

              {/* Price */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <div>
                  <p className="text-sm" style={{ color: 'rgba(212,197,169,0.6)' }}>{resolve('qifu.perLamp')} ¥</p>
                  <p className="font-display text-[1.875rem]" style={{ color: '#C9A96E' }}>{LIGHT_AMOUNTS[selectedLantern]?.value}</p>
                </div>
                <button type="button" className="btn-primary" onClick={handleLight}>
                  {resolve('qifu.btn.light')}
                </button>
              </div>
            </div>
          </div>

          {/* 灯墙 */}
          <div>
            <div className="card-standard space-y-4">
              <h2 className="font-display text-[1.5rem]" style={{ color: '#C9A96E' }}>{resolve('qifu.section.wall')}</h2>
              <p className="text-sm" style={{ color: 'rgba(212,197,169,0.65)' }}>
                {resolve('qifu.wall.note')}
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {[
                  { name: '张*', merit: 6.6 },
                  { name: '李*', merit: 16.6 },
                  { name: '王*', merit: 36.6 },
                  { name: '赵*', merit: 6.6 },
                  { name: '陈*', merit: 108 },
                  { name: '刘*', merit: 6.6 },
                  { name: '杨*', merit: 66 },
                  { name: '周*', merit: 6.6 },
                  { name: '吴*', merit: 16.6 },
                ].map((wl, i) => (
                  <WishLantern key={i} name={wl.name} merit={wl.merit} index={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BottomNav active="qifu" />
      {showPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowPayment(false)}>
          <div className="rounded-2xl border border-gold/30 bg-xuan-card p-6 max-w-sm w-full text-center space-y-4 animate-slide-up" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[1.25rem] text-gold font-display">{resolve('qifu.payment.title')}</h3>
            <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('qifu.payment.desc')}</p>
            <img src="/zfb-payment.png" alt="支付宝收款码" className="mx-auto rounded-lg border-2 border-gold/30" />
            <p className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('qifu.payment.confirm')}</p>
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="w-full rounded-lg border border-gold/30 py-2 text-sm text-paper-dark/80 hover:text-gold transition-colors"
            >
              {resolve('common.close')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
