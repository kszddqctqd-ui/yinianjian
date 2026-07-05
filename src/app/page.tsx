'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { t, getLocale, shichenLabels } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

// 菩提苑风格的9大功能卡片 (translated)
const nineFeatures = [
  {
    name: 'feature.pray.title',
    href: '/qifu/',
    icon: 'heart',
    iconColor: 'text-vermillion',
    desc: 'feature.pray.desc',
    tag: 'feature.pray.tag',
  },
  {
    name: 'feature.almanac.title',
    href: '/almanac/',
    icon: 'calendar',
    iconColor: 'text-gold',
    desc: 'feature.almanac.desc',
    tag: 'feature.almanac.tag',
  },
  {
    name: 'feature.dream.title',
    href: '/dream/',
    icon: 'moon',
    iconColor: 'text-gold',
    desc: 'feature.dream.desc',
    tag: null,
  },
  {
    name: 'feature.lottery.title',
    href: '/lottery/',
    icon: 'scroll',
    iconColor: 'text-gold',
    desc: 'feature.lottery.desc',
    tag: 'feature.lottery.tag',
  },
  {
    name: 'feature.bazi.title',
    href: '/',
    icon: 'compass',
    iconColor: 'text-gold',
    desc: 'feature.bazi.desc',
    tag: null,
  },
  {
    name: 'feature.divination.title',
    href: '/divination/',
    icon: 'compass',
    iconColor: 'text-gold',
    desc: 'feature.divination.desc',
    tag: 'feature.divination.tag',
  },
  {
    name: 'feature.palmistry.title',
    href: '/palmistry/',
    icon: 'hand',
    iconColor: 'text-gold',
    desc: 'feature.palmistry.desc',
    tag: null,
  },
  {
    name: 'feature.naming.title',
    href: '/naming/',
    icon: 'book',
    iconColor: 'text-gold',
    desc: 'feature.naming.desc',
    tag: null,
  },
  {
    name: 'feature.meditation.title',
    href: '/meditation/',
    icon: 'flame',
    iconColor: 'text-gold',
    desc: 'feature.meditation.desc',
    tag: null,
  },
];

function resolve(key: string): string {
  return t(key);
}

function getLangKey(lang: SupportedLang): 'zh' | 'en' {
  return lang === 'zh-CN' ? 'zh' : 'en';
}

// Lucide 图标 SVG
function Icon({ name, color = 'text-gold' }: { name: string; color?: string }) {
  const icons: Record<string, React.ReactElement> = {
    heart: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-heart size-9 ${color}`} aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-calendar-days size-9 ${color}`} aria-hidden="true">
        <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
      </svg>
    ),
    moon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-moon size-9 ${color}`} aria-hidden="true">
        <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
      </svg>
    ),
    scroll: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-scroll-text size-9 ${color}`} aria-hidden="true">
        <path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
      </svg>
    ),
    compass: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-compass size-9 ${color}`} aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    book: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-book-open size-9 ${color}`} aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    hand: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-hand size-9 ${color}`} aria-hidden="true">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </svg>
    ),
    flame: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-flame size-9 ${color}`} aria-hidden="true">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
      </svg>
    ),
  };
  return icons[name] || icons.compass;
}

// 标签组件
function Tag({ textKey }: { textKey: string | null }) {
  if (!textKey) return null;
  return (
    <span
      className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold-80"
      style={{ fontFamily: 'var(--font-family-body)' }}
    >
      {resolve(textKey)}
    </span>
  );
}

export default function HomePage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const [birthYear, setBirthYear] = useState(1990);
  const [birthMonth, setBirthMonth] = useState(5);
  const [birthDay, setBirthDay] = useState(15);
  const [birthShichen, setBirthShichen] = useState('wei');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [selectedMaster, setSelectedMaster] = useState<number | null>(0);
  const [baziLoading, setBaziLoading] = useState(false);

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const handleBaziSubmit = () => {
    setBaziLoading(true);
    setTimeout(() => {
      setBaziLoading(false);
      const masterNames = [
        resolve('bazi.master.0.name'),
        resolve('bazi.master.1.name'),
        resolve('bazi.master.2.name'),
      ];
      const shichenNames = ['zi', 'chou', 'yin', 'mao', 'chen', 'si', 'wu', 'wei', 'shen', 'you', 'xu', 'hai'].map(s =>
        shichenLabels[s]?.[getLangKey(lang)] || s
      );
      alert(`${resolve('bazi.form.gender')}: ${gender}\n${resolve('bazi.form.shichen')}: ${shichenNames[birthShichen === 'zi' ? 0 : birthShichen === 'chou' ? 1 : birthShichen === 'yin' ? 2 : birthShichen === 'mao' ? 3 : birthShichen === 'chen' ? 4 : birthShichen === 'si' ? 5 : birthShichen === 'wu' ? 6 : birthShichen === 'wei' ? 7 : birthShichen === 'shen' ? 8 : birthShichen === 'you' ? 9 : birthShichen === 'xu' ? 10 : 11]}\n${resolve('bazi.selectMaster')}: ${masterNames[selectedMaster ?? 0]}`);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      {/* 全局背景层 */}
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100svh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-6xl px-4">
          {/* ===== Hero Section ===== */}
          <section className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center gap-6 px-2 text-center">
            {/* Logo 容器 + 光环扩散 */}
            <div className="relative mx-auto flex size-20 items-center justify-center rounded-full border border-gold/30" style={{ background: 'rgba(201,169,110,0.1)' }}>
              <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-12 text-gold drop-shadow-[0_0_8px_rgba(201,160,94,0.4)]" xmlns="http://www.w3.org/2000/svg">
                <path d="M32 6 C 22 6, 12 12, 10 22 C 8 32, 14 44, 24 50 C 28 53, 30 56, 31 60 L 32 62 L 33 60 C 34 56, 36 53, 40 50 C 50 44, 56 32, 54 22 C 52 12, 42 6, 32 6 Z" fill="currentColor" fillOpacity="0.12" />
                <path d="M32 8 V 60" strokeWidth="1.4" />
                <path d="M32 16 C 26 18, 20 22, 16 28" />
                <path d="M32 16 C 38 18, 44 22, 48 28" />
                <path d="M32 28 C 24 30, 18 36, 16 42" />
                <path d="M32 28 C 40 30, 46 36, 48 42" />
                <path d="M32 42 C 28 46, 26 50, 26 54" />
                <path d="M32 42 C 36 46, 38 50, 38 54" />
              </svg>
              {/* 两个扩展光环 */}
              <div className="absolute inset-0 rounded-full border-[1.5px] border-gold/60" style={{ animation: 'ring-expand 3s ease-out infinite' }} />
              <div className="absolute inset-0 rounded-full border-[1.5px] border-gold/60" style={{ animation: 'ring-expand 3s ease-out infinite 1.5s' }} />
            </div>

            {/* 标题 - 品牌字体金色渐变 */}
            <h1
              className="text-5xl md:text-6xl tracking-[0.15em]"
              style={{
                fontFamily: "'ZhiMangXing', cursive",
                background: 'linear-gradient(180deg, #f5e6b8 0%, #c9a05c 50%, #8b6914 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))',
              }}
            >
              {resolve('brand.name')}
            </h1>

            {/* 副标题 */}
            <p className="max-w-md text-base md:text-lg leading-loose text-paper-dark-85">
              {resolve('brand.tagline')}
            </p>

            {/* 双按钮 */}
            <div className="flex flex-col gap-3 sm:flex-row sm:w-auto sm:px-0">
              <a href="/qifu/" className="btn-primary text-center">
                {resolve('hero.btn.pray')}
              </a>
              <a href="/" className="btn-secondary text-center">
                {resolve('hero.btn.bazi')}
              </a>
            </div>

            {/* 滚动提示 */}
            <div className="mt-4 animate-[bounce_1s_ease-in-out_infinite] text-sm text-paper-dark-65">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down mx-auto" aria-hidden="true">
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </section>

          {/* ===== 八字排盘表单 ===== */}
          <section className="mt-8 space-y-6">
            <div className="card-standard max-w-2xl mx-auto space-y-5">
              {/* Title */}
              <div className="text-center">
                <div className="mx-auto mb-2 flex size-16 items-center justify-center rounded-full border border-vermillion/30 bg-vermillion/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-8 text-vermillion" aria-hidden="true">
                    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                  </svg>
                </div>
                <h2 className="font-display text-3xl tracking-widest" style={{ color: '#C9A96E' }}>{resolve('bazi.title')}</h2>
                <p className="mt-1 text-sm" style={{ color: '#D4C5A9' }}>{resolve('bazi.subtitle')}</p>
              </div>

              {/* Master selector */}
              <div>
                <p className="text-center text-base font-display" style={{ color: '#C9A96E' }}>{resolve('bazi.selectMaster')}</p>
                <div className="mt-3 grid grid-cols-3 gap-3">
                  {[
                    { name: 'bazi.master.0.name', role: 'bazi.master.0.role', feature: 'bazi.master.0.feature', gradient: 'from-amber-900/40 to-stone-800/40' },
                    { name: 'bazi.master.1.name', role: 'bazi.master.1.role', feature: 'bazi.master.1.feature', gradient: 'from-rose-900/30 to-stone-800/40' },
                    { name: 'bazi.master.2.name', role: 'bazi.master.2.role', feature: 'bazi.master.2.feature', gradient: 'from-teal-900/30 to-stone-800/40' },
                  ].map((master, i) => (
                    <div
                      key={i}
                      className={`group rounded-xl border p-4 text-left transition-all ${
                        selectedMaster === i
                          ? 'border-gold/60 bg-gold/10 shadow-gold'
                          : 'border-gold/20 hover:border-gold/40 hover:bg-xuan-surface/70'
                      }`}
                      onClick={() => setSelectedMaster(i)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Avatar placeholder */}
                      <div className={`mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-gradient-to-br ${master.gradient} border border-gold/20`}>
                        <span className="text-xl font-display" style={{ color: '#C9A96E' }}>
                          {resolve(master.name).charAt(0)}
                        </span>
                      </div>
                      <div className="text-center text-sm font-display" style={{ color: '#D4C5A9' }}>{resolve(master.name)}</div>
                      <div className="text-center text-[10px]" style={{ color: '#D4C5A9/65' }}>{resolve(master.role)}</div>
                      <div className="mt-1 text-center text-xs" style={{ color: '#C9A96E/85' }}>{resolve(master.feature)}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Birth form */}
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-1">
                  <span className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('bazi.form.year')}</span>
                  <select value={birthYear} onChange={(e) => setBirthYear(parseInt(e.target.value))} className="h-12 w-full rounded-md border border-gold/20 bg-xuan-surface/40 px-3 text-base text-paper-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all">
                    {Array.from({ length: 100 }, (_, i) => 2025 - i).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('bazi.form.month')}</span>
                  <select value={birthMonth} onChange={(e) => setBirthMonth(parseInt(e.target.value))} className="h-12 w-full rounded-md border border-gold/20 bg-xuan-surface/40 px-3 text-base text-paper-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all">
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('bazi.form.day')}</span>
                  <select value={birthDay} onChange={(e) => setBirthDay(parseInt(e.target.value))} className="h-12 w-full rounded-md border border-gold/20 bg-xuan-surface/40 px-3 text-base text-paper-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all">
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </label>
                <label className="block space-y-1">
                  <span className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('bazi.form.shichen')}</span>
                  <select value={birthShichen} onChange={(e) => setBirthShichen(e.target.value)} className="h-12 w-full rounded-md border border-gold/20 bg-xuan-surface/40 px-3 text-base text-paper-dark focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold/30 transition-all">
                    <option value="zi">{shichenLabels.zi?.[getLangKey(lang)] || '子时 (23:00-01:00)'}</option>
                    <option value="chou">{shichenLabels.chou?.[getLangKey(lang)] || '丑时 (01:00-03:00)'}</option>
                    <option value="yin">{shichenLabels.yin?.[getLangKey(lang)] || '寅时 (03:00-05:00)'}</option>
                    <option value="mao">{shichenLabels.mao?.[getLangKey(lang)] || '卯时 (05:00-07:00)'}</option>
                    <option value="chen">{shichenLabels.chen?.[getLangKey(lang)] || '辰时 (07:00-09:00)'}</option>
                    <option value="si">{shichenLabels.si?.[getLangKey(lang)] || '巳时 (09:00-11:00)'}</option>
                    <option value="wu">{shichenLabels.wu?.[getLangKey(lang)] || '午时 (11:00-13:00)'}</option>
                    <option value="wei">{shichenLabels.wei?.[getLangKey(lang)] || '未时 (13:00-15:00)'}</option>
                    <option value="shen">{shichenLabels.shen?.[getLangKey(lang)] || '申时 (15:00-17:00)'}</option>
                    <option value="you">{shichenLabels.you?.[getLangKey(lang)] || '酉时 (17:00-19:00)'}</option>
                    <option value="xu">{shichenLabels.xu?.[getLangKey(lang)] || '戌时 (19:00-21:00)'}</option>
                    <option value="hai">{shichenLabels.hai?.[getLangKey(lang)] || '亥时 (21:00-23:00)'}</option>
                  </select>
                </label>
              </div>

              {/* Gender toggle */}
              <div className="flex items-center gap-4">
                <span className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('bazi.form.gender')}：</span>
                <button type="button" onClick={() => setGender('男')} className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${gender === '男' ? 'border-gold/60 bg-gold/10 text-gold font-medium' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                  {resolve('bazi.form.male')}
                </button>
                <button type="button" onClick={() => setGender('女')} className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${gender === '女' ? 'border-gold/60 bg-gold/10 text-gold font-medium' : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'}`}>
                  {resolve('bazi.form.female')}
                </button>
              </div>

              {/* Submit */}
              <button type="button" className="btn-primary w-full disabled:opacity-50" onClick={handleBaziSubmit} disabled={baziLoading}>
                {baziLoading ? resolve('bazi.form.loading') : resolve('bazi.form.submit')}
              </button>

              <p className="text-xs leading-loose text-center" style={{ color: 'rgba(212,197,169,0.65)' }}>
                {resolve('bazi.form.disclaimer')}
              </p>
            </div>
          </section>

          {/* ===== 九大功能卡片 ===== */}
          <section className="mt-16 space-y-8">
            <h2
              className="text-center text-3xl tracking-[0.15em]"
              style={{
                color: '#C9A96E',
                fontFamily: "'ZhiMangXing', cursive",
                paddingBottom: '4rem',
              }}
            >
              {resolve('feature.nine.title')}
            </h2>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {nineFeatures.map((feature, index) => (
                <a
                  key={feature.name}
                  href={feature.href}
                  className="card-standard hover-lift"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  {/* 图标区 */}
                  <div className="flex items-center justify-between">
                    <Icon name={feature.icon} color={feature.iconColor} />
                    <Tag textKey={feature.tag} />
                  </div>

                  {/* 标题 */}
                  <h3 className="mt-3 text-2xl font-display" style={{ color: '#D4C5A9' }}>
                    {resolve(feature.name)}
                  </h3>

                  {/* 描述 */}
                  <p className="mt-1 text-base text-paper-dark-80" style={{ color: '#D4C5A9' }}>
                    {resolve(feature.desc)}
                  </p>
                </a>
              ))}
            </div>
          </section>

          {/* ===== 信任/理念区域 ===== */}
          <section className="mt-16 space-y-6">
            <h2
              className="text-center text-3xl tracking-[0.15em]"
              style={{
                fontFamily: "'ZhiMangXing', cursive",
                background: 'linear-gradient(180deg, #f5e6b8 0%, #c9a05c 50%, #8b6914 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
              }}
            >
              {resolve('philosophy.title')}
            </h2>

            <div className="mx-auto max-w-2xl space-y-4 text-center">
              <p className="text-sm leading-loose" style={{ color: '#D4C5A9' }}>
                {resolve('philosophy.point1')}
              </p>
              <p className="text-sm leading-loose" style={{ color: '#D4C5A9' }}>
                {resolve('philosophy.point2')}
              </p>
            </div>
          </section>

          {/* ===== 页脚 ===== */}
          <footer className="mt-16 space-y-4 pb-8">
            <div className="gold-divider" />

            <div className="mx-auto max-w-md space-y-2 text-center">
              <div className="flex justify-center gap-4 text-sm">
                <a href="/terms/" className="text-paper-dark-65 hover:text-gold transition-colors">{resolve('footer.terms')}</a>
                <span className="text-paper-dark-65">·</span>
                <a href="/privacy/" className="text-paper-dark-65 hover:text-gold transition-colors">{resolve('footer.privacy')}</a>
                <span className="text-paper-dark-65">·</span>
                <a href="/ai-notice/" className="text-paper-dark-65 hover:text-gold transition-colors">{resolve('footer.aiNotice')}</a>
              </div>

              <p className="text-xs leading-6" style={{ color: 'rgba(212,197,169,0.62)' }}>
                {resolve('footer.disclaimer')}
              </p>

              <p
                className="text-base leading-loose"
                style={{
                  color: 'rgba(201,169,110,0.80)',
                  fontFamily: "'ZhiMangXing', cursive",
                }}
              >
                {resolve('footer.poem').replace('\n', '<br />')}
              </p>
            </div>
          </footer>
        </div>
      </main>

      <BottomNav active="home" />
    </div>
  );
}
