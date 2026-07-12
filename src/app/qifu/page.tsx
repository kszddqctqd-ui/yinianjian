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
function WallLantern({ name, merit, index, lanternType }: { name: string; merit: number; index: number; lanternType?: string }) {
  const delay = (index * 0.5) % 3;
  const displayName = name.length > 2 ? name.slice(0, 2) : name;
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
          {resolve('qifu.wall.lantern.offering')} {name} 的 {lanternType}
        </div>
        <div className="text-[11px]" style={{ color: 'rgba(212,197,169,0.4)' }}>
          功德 6.6
        </div>
      </div>
    </div>
  );
}

// 六种灯品种（菩提苑源码）
const LAMP_TYPES = [
  { name: '清心灯', desc: '祈愿身心安宁、烦恼消解', flameColor: 'rgb(122, 106, 74)' },
  { name: '智慧灯', desc: '祈愿学业精进、心智明朗', flameColor: 'rgb(122, 106, 74)' },
  { name: '长寿灯', desc: '祈愿身体康健、福寿绵长', flameColor: 'rgb(122, 106, 74)' },
  { name: '平安灯', desc: '祈愿出入平安、家宅安宁', flameColor: 'rgb(196, 61, 61)' },
  { name: '姻缘灯', desc: '祈愿良缘早至、感情和顺', flameColor: 'rgb(122, 106, 74)' },
  { name: '财福灯', desc: '祈愿财源广进、生意顺遂', flameColor: 'rgb(122, 106, 74)' },
];

// 供奉时长选项（菩提苑源码）
const PERIODS = [
  { id: 'month', label: '一月供奉', price: 3.9 },
  { id: 'hundred', label: '百日供奉', price: 5.9 },
  { id: 'year', label: '一年供奉', price: 9.9 },
  { id: 'permanent', label: '永久长明', price: 19.9 },
];

// 关系选项（菩提苑源码顺序）
const RELATION_OPTIONS = ['父亲', '母亲', '爱人', '孩子', '孙辈', '朋友', '自己'];

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

// 灯墙滚动数据
const WALL_LANTERNS = [
  { name: '张*', type: '平安灯' },
  { name: '李*', type: '姻缘灯' },
  { name: '王*', type: '智慧灯' },
  { name: '赵*', type: '长寿灯' },
  { name: '陈*', type: '财福灯' },
  { name: '刘*', type: '平安灯' },
  { name: '杨*', type: '清心灯' },
  { name: '周*', type: '姻缘灯' },
  { name: '吴*', type: '平安灯' },
  { name: '郑*', type: '长寿灯' },
  { name: '孙*', type: '财福灯' },
  { name: '马*', type: '平安灯' },
];

export default function QifuPage() {
  const [selectedLamp, setSelectedLamp] = useState(3); // 默认选中平安灯
  const [selectedPeriod, setSelectedPeriod] = useState(0);
  const [familyName, setFamilyName] = useState('');
  const [relation, setRelation] = useState('');
  const [wish, setWish] = useState('');
  const [yourName, setYourName] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const [totalLights, setTotalLights] = useState(51);
  const [wallScroll, setWallScroll] = useState(WALL_LANTERNS);
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
    const surnames = ['黄*', '林*', '何*', '高*', '罗*', '梁*', '谢*', '宋*', '唐*', '许*'];
    const lampTypes = ['平安灯', '姻缘灯', '智慧灯', '长寿灯', '财福灯', '清心灯'];
    const timer = setInterval(() => {
      const newEntry = {
        name: surnames[Math.floor(Math.random() * surnames.length)],
        type: lampTypes[Math.floor(Math.random() * lampTypes.length)],
      };
      setWallScroll(prev => [newEntry, ...prev.slice(0, 15)]);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const currentPrice = PERIODS[selectedPeriod]?.price || 3.9;

  const handleLight = () => {
    if (!familyName.trim()) return;
    setTotalLights(l => l + 1);
    setShowPayment(true);
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
            <h1 className="text-4xl tracking-widest text-gold">心愿供灯</h1>
            <p className="mx-auto max-w-md text-base text-paper-dark/85">
              点一盏灯，写下一份祝愿，留给家人、自己或重要时刻一份温和的仪式感。
            </p>
          </section>

          {/* 灯墙统计 + 滚动条 */}
          <div className="flex justify-center">
            <div className="mx-auto inline-flex items-center gap-4 rounded-full border border-gold/30 bg-xuan-card/70 px-6 py-2 text-sm text-paper-dark/85">
              <span>已点亮 <span className="font-display text-lg text-gold">{totalLights}</span> 盏</span>
              <span className="h-4 w-px bg-gold/30" />
              <span>今日新增 <span className="font-display text-lg text-vermillion">0</span> 盏</span>
            </div>
          </div>
          <div className="relative mx-auto mt-3 max-w-lg overflow-hidden rounded-full border border-gold/20 bg-xuan-card/50 px-4 py-2">
            <div className="flex animate-[marquee_20s_linear_infinite] whitespace-nowrap gap-8">
              {wallScroll.map((wl, i) => (
                <span key={i} className="inline-flex items-center gap-1.5 text-xs text-paper-dark/75">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame size-3 text-vermillion/70" aria-hidden="true">
                    <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
                  </svg>
                  <span className="text-gold/85">{wl.name}</span>
                  <span>为</span>
                  <span className="text-gold/85">客**</span>
                  <span>点亮{wl.type}</span>
                </span>
              ))}
            </div>
          </div>

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
                  {RELATION_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </label>
            </div>

            {/* 选一盏灯 */}
            <div>
              <p className="text-base text-paper-dark/85">选一盏灯</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {LAMP_TYPES.map((lamp, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedLamp(i)}
                    className={`group relative rounded-xl border p-4 text-left transition-all ${
                      selectedLamp === i
                        ? 'border-gold/60 bg-gold/10 shadow-gold'
                        : 'border-gold/20 bg-xuan-surface/40 hover:border-gold/40'
                    }`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-flame mb-2 size-7" aria-hidden="true" style={{ color: selectedLamp === i ? lamp.flameColor : 'rgb(122, 106, 74)' }}>
                      <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
                    </svg>
                    <p className={`font-display text-lg ${selectedLamp === i ? 'text-gold' : 'text-paper-dark'}`}>{lamp.name}</p>
                    <p className="mt-1 text-sm text-paper-dark/65">{lamp.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* 供奉时长 */}
            <div>
              <p className="text-base text-paper-dark/85">供奉时长</p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {PERIODS.map((period, i) => (
                  <button
                    key={period.id}
                    type="button"
                    onClick={() => setSelectedPeriod(i)}
                    className={`rounded-xl border p-4 text-center transition-all ${
                      selectedPeriod === i
                        ? 'border-gold/60 bg-gold/10 shadow-gold'
                        : 'border-gold/20 bg-xuan-surface/40 hover:border-gold/40'
                    }`}
                  >
                    <p className="font-display text-lg text-paper-dark">{period.label}</p>
                    <p className="mt-1 font-number text-2xl text-vermillion">¥{period.price}</p>
                  </button>
                ))}
              </div>
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

          {/* 底部价格 + 按钮 */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-paper-dark/65">需供奉</p>
              <p className="font-display text-3xl text-gold">¥{currentPrice}</p>
            </div>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 font-body font-medium transition-all duration-fast min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg"
              onClick={handleLight}
            >
              点亮心愿灯
            </button>
          </div>

          {/* 心愿灯墙 */}
          <div className="transition-all duration-base rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-4">
            <h2 className="font-display text-2xl text-gold">心愿灯墙</h2>
            <p className="text-sm" style={{ color: 'rgba(212,197,169,0.65)' }}>
              姓名已脱敏处理 · 仅作心愿展示
            </p>
            <div className="relative overflow-hidden" style={{ maxHeight: '400px' }}>
              <div
                className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                style={{ animation: 'marquee-lanterns 40s linear infinite' }}
              >
                {WALL_LANTERNS.concat(WALL_LANTERNS).map((wl, i) => (
                  <WallLantern key={i} name={wl.name} merit={6.6} index={i} lanternType={wl.type} />
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
            <h3 className="text-[1.25rem] text-gold font-display">心愿供灯</h3>
            <p className="text-sm" style={{ color: '#D4C5A9' }}>请扫描下方二维码完成供灯</p>
            <img src="/zfb-payment.png" alt="支付宝收款码" className="mx-auto rounded-lg border-2 border-gold/30" />
            <p className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>供灯完成后请截图发送给我们确认</p>
            <button
              type="button"
              onClick={() => setShowPayment(false)}
              className="w-full rounded-lg border border-gold/30 py-2 text-sm text-paper-dark/80 hover:text-gold transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}
      </div>
    </>
  );
}
