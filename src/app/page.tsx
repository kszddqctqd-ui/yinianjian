'use client';

import { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { IncenseSmoke } from '@/components/IncenseSmoke';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

function resolve(key: string): string {
  return t(key);
}

// Lucide icon renderer (mirrors 菩提苑's icon definitions)
function LucideIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}): React.ReactElement | null {
  const icons: Record<string, React.ReactElement> = {
    heart: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
    calendar: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M8 2v4" /><path d="M16 2v4" /><rect width="18" height="18" x="3" y="4" rx="2" /><path d="M3 10h18" /><path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" /><path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
      </svg>
    ),
    moon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401" />
      </svg>
    ),
    sparkles: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" /><path d="M20 2v4" /><path d="M22 4h-4" /><circle cx="4" cy="20" r="2" />
      </svg>
    ),
    compass: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    scroll: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
      </svg>
    ),
    hand: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
      </svg>
    ),
    book: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 7v14" /><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z" />
      </svg>
    ),
    flame: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4" />
      </svg>
    ),
    search: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
        <path d="m21 21-4.34-4.34" /><circle cx="11" cy="11" r="8" />
      </svg>
    ),
  };
  return icons[name] || null;
}

// Nine features data (aligned with 菩提苑)
const nineFeatures = [
  {
    name: 'feature.pray.title',
    href: '/qifu/',
    icon: 'heart',
    iconColor: 'text-vermillion',
    desc: 'feature.pray.desc',
    tag: 'feature.pray.tag',
    delay: 0,
  },
  {
    name: 'feature.almanac.title',
    href: '/almanac/',
    icon: 'calendar',
    iconColor: 'text-gold',
    desc: 'feature.almanac.desc',
    tag: 'feature.almanac.tag',
    delay: 0.06,
  },
  {
    name: 'feature.dream.title',
    href: '/dream/',
    icon: 'moon',
    iconColor: 'text-gold',
    desc: 'feature.dream.desc',
    tag: null,
    delay: 0.12,
  },
  {
    name: 'feature.lottery.title',
    href: '/lottery/',
    icon: 'sparkles',
    iconColor: 'text-gold',
    desc: 'feature.lottery.desc',
    tag: 'feature.lottery.tag',
    delay: 0.18,
  },
  {
    name: 'feature.bazi.title',
    href: '/bazi',
    icon: 'compass',
    iconColor: 'text-gold',
    desc: 'feature.bazi.desc',
    tag: null,
    delay: 0.24,
  },
  {
    name: 'feature.divination.title',
    href: '/divination/',
    icon: 'scroll',
    iconColor: 'text-gold',
    desc: 'feature.divination.desc',
    tag: 'feature.divination.tag',
    delay: 0.3,
  },
  {
    name: 'feature.palmistry.title',
    href: '/palmistry/',
    icon: 'hand',
    iconColor: 'text-gold',
    desc: 'feature.palmistry.desc',
    tag: null,
    delay: 0.36,
  },
  {
    name: 'feature.naming.title',
    href: '/naming/',
    icon: 'book',
    iconColor: 'text-gold',
    desc: 'feature.naming.desc',
    tag: null,
    delay: 0.42,
  },
  {
    name: 'feature.meditation.title',
    href: '/meditation/',
    icon: 'flame',
    iconColor: 'text-gold',
    desc: 'feature.meditation.desc',
    tag: null,
    delay: 0.48,
  },
];

// Fade-in wrapper with staggered delay
function FadeInSection({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), Math.round(delay * 1000));
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(12px)',
        transition: 'opacity 0.5s ease-out, transform 0.5s ease-out',
      }}
    >
      {children}
    </div>
  );
}

// Tag component for feature cards
function FeatureTag({ textKey }: { textKey: string | null }) {
  if (!textKey) return null;
  return (
    <span className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold/80">
      {resolve(textKey)}
    </span>
  );
}

export default function HomePage() {
  const [_lang, setLang] = useState<SupportedLang>(getLocale());

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  return (
    <div className="relative min-h-screen bg-xuan">
      {/* ===== 全局背景层 (菩提苑风格) ===== */}
      {/* 层1: 渐变背景 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />

      {/* 层2: 寺庙山脉 SVG 纹理 */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]"
        style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }}
      />

      {/* 层3: 径向暗角 */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)',
        }}
      />

      {/* 层4: 顶部金色光晕 */}
      <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-gold/15 to-transparent" />

      {/* 层5: 金色光点粒子 (复用 FloatingParticles 组件) */}
      <FloatingParticles />

      {/* ===== 导航栏 ===== */}
      <Header />

      {/* ===== 主体内容 ===== */}
      <main className="relative z-10 mx-auto min-h-[calc(100svh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-6 px-4 pb-24">

          {/* ===== Hero 区域 ===== */}
          <FadeInSection>
            <section className="space-y-3 pt-6 text-center">
              {/* 莲花图标 */}
              <div className="mx-auto mb-2 flex size-20 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
                <LucideIcon name="moon" className="lucide lucide-moon size-8 text-gold" aria-hidden="true" />
              </div>

              {/* 标题 */}
              <h1
                className="text-5xl tracking-widest text-gold md:text-6xl"
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
              <p className="mx-auto max-w-md text-base leading-loose text-paper-dark/85 md:text-lg">
                {resolve('brand.tagline')}
              </p>

              {/* 双按钮 */}
              <div className="flex flex-col gap-3 px-4 sm:w-auto sm:flex-row sm:px-0">
                <a href="/qifu/" className="w-full sm:w-auto">
                  <button className="btn-primary w-full text-lg sm:w-auto tracking-wider">
                    {resolve('hero.btn.pray')}
                  </button>
                </a>
                <a href="/" className="w-full sm:w-auto">
                  <button className="btn-secondary w-full text-lg sm:w-auto">
                    {resolve('hero.btn.bazi')}
                  </button>
                </a>
              </div>

              {/* 滚动提示 */}
              <FadeInSection delay={0.3}>
                <p className="animate-bounce text-sm text-paper-dark/65">
                  {resolve('hero.scrollHint') || '向下滚动 · 看更多功德'}
                </p>
              </FadeInSection>
            </section>
          </FadeInSection>

          {/* ===== 九大善门 ===== */}
          <FadeInSection>
            <section className="space-y-6 pb-section">
              <h2
                className="text-center text-3xl tracking-widest text-gold"
                style={{ fontFamily: "'ZhiMangXing', cursive" }}
              >
                {resolve('feature.nine.title')}
              </h2>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {nineFeatures.map((feature) => (
                  <FadeInSection key={feature.name} delay={feature.delay}>
                    <a href={feature.href}>
                      <div className="card-standard h-full space-y-3 hover-lift">
                        {/* 图标 + 标签 */}
                        <div className="flex items-center justify-between">
                          <LucideIcon
                            name={feature.icon}
                            className={`lucide lucide-${feature.icon} size-9 ${feature.iconColor}`}
                          />
                          <FeatureTag textKey={feature.tag} />
                        </div>

                        {/* 标题 */}
                        <h3 className="text-2xl text-paper-dark font-display">{resolve(feature.name)}</h3>

                        {/* 描述 */}
                        <p className="text-base text-paper-dark/80">{resolve(feature.desc)}</p>
                      </div>
                    </a>
                  </FadeInSection>
                ))}
              </div>
            </section>
          </FadeInSection>

          {/* ===== 为何选本站 ===== */}
          <FadeInSection>
            <section className="space-y-6 pb-section">
              <div className="card-standard space-y-5 text-center">
                {/* 标语 */}
                <p className="text-sm tracking-wider text-gold/80">
                  {resolve('philosophy.title')}
                </p>

                {/* 标题 */}
                <h2
                  className="text-2xl tracking-widest text-gold md:text-3xl"
                  style={{ fontFamily: "'ZhiMangXing', cursive" }}
                >
                  {resolve('why.title')}
                </h2>

                {/* 三列特性 */}
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-lg border border-gold/15 bg-xuan-surface/40 p-4 text-left">
                    <p className="font-display text-lg text-gold">{resolve('why.feature1.title')}</p>
                    <p className="mt-2 text-sm text-paper-dark/80">{resolve('why.feature1.desc')}</p>
                  </div>
                  <div className="rounded-lg border border-gold/15 bg-xuan-surface/40 p-4 text-left">
                    <p className="font-display text-lg text-gold">{resolve('why.feature2.title')}</p>
                    <p className="mt-2 text-sm text-paper-dark/80">{resolve('why.feature2.desc')}</p>
                  </div>
                  <div className="rounded-lg border border-gold/15 bg-xuan-surface/40 p-4 text-left">
                    <p className="font-display text-lg text-gold">{resolve('why.feature3.title')}</p>
                    <p className="mt-2 text-sm text-paper-dark/80">{resolve('why.feature3.desc')}</p>
                  </div>
                </div>

                {/* 古籍书封图片 */}
                <div className="pt-1 md:pt-2">
                  <figure className="mx-auto w-full">
                    <picture>
                      <source srcSet="/books/classics-strip-matted.webp?v=20260613-matted" type="image/webp" />
                      <img
                        src="/books/classics-strip-matted.png?v=20260613-matted"
                        alt="命理经典古籍书封展示"
                        width={2015}
                        height={388}
                        loading="lazy"
                        decoding="async"
                        className="block h-auto w-full select-none"
                        draggable="false"
                      />
                    </picture>
                    <figcaption className="sr-only">命理经典古籍书封展示</figcaption>
                  </figure>
                </div>
              </div>
            </section>
          </FadeInSection>

          {/* ===== 在线上香 ===== */}
          <FadeInSection>
            <section className="space-y-6 pb-section">
              <div className="rounded-t-xl rounded-b-xl border-x-4 border-gold/40 bg-paper-warm px-8 py-6 text-ink shadow-card">
                <div className="gold-divider mb-4" />

                {/* 火焰图标 */}
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-vermillion/30 bg-vermillion/10">
                  <LucideIcon name="flame" className="lucide-flame size-7 text-vermillion" />
                </div>

                {/* 副标题 */}
                <p className="text-sm text-ink-light tracking-widest">
                  {resolve('incense.subtitle')}
                </p>

                {/* 标题 */}
                <h2
                  className="text-2xl tracking-widest md:text-3xl"
                  style={{ fontFamily: "'ZhiMangXing', cursive" }}
                >
                  {resolve('incense.title')}
                </h2>

                {/* 描述 */}
                <p className="mx-auto max-w-md text-base leading-loose text-ink">
                  {resolve('incense.desc') || resolve('incense.subtitle')}
                </p>

                {/* 按钮 */}
                <div className="flex justify-center">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      const today = new Date().toISOString().slice(0, 10);
                      const todayKey = `yinianjian_incense_${today}`;
                      const count = parseInt(localStorage.getItem(todayKey) || '0', 10);
                      if (count < 3) {
                        localStorage.setItem(todayKey, String(count + 1));
                        // 增加功德
                        const meritKey = 'yinianjian_total_merit';
                        const total = parseInt(localStorage.getItem(meritKey) || '0', 10);
                        localStorage.setItem(meritKey, String(total + 1));
                      }
                      window.location.href = '/qifu/';
                    }}
                  >
                    {resolve('incense.btn.offer')}
                  </button>
                </div>

                <div className="gold-divider mt-4" />
              </div>
            </section>
          </FadeInSection>

          {/* ===== 分享返佣 ===== */}
          <FadeInSection>
            <section className="space-y-6 pb-section">
              <div className="rounded-t-xl rounded-b-xl border-x-4 border-gold/40 bg-paper-warm px-8 py-6 text-ink shadow-card">
                <div className="gold-divider mb-4" />

                {/* 火花图标 */}
                <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-vermillion/30 bg-vermillion/10">
                  <LucideIcon name="sparkles" className="lucide-sparkles size-7 text-vermillion" />
                </div>

                {/* 副标题 */}
                <p className="text-sm text-ink-light tracking-widest">
                  {resolve('share.desc') || '一灯传万灯'}
                </p>

                {/* 标题 */}
                <h2
                  className="text-2xl tracking-widest md:text-3xl"
                  style={{ fontFamily: "'ZhiMangXing', cursive" }}
                >
                  {resolve('share.title')}
                </h2>

                {/* 描述 */}
                <p className="mx-auto max-w-md text-base leading-loose text-ink">
                  {resolve('share.desc')}
                </p>

                {/* 分享按钮 */}
                <div className="flex justify-center">
                  <button className="btn-primary" onClick={() => window.location.href = '/invite/'}>
                    {resolve('share.btn.share')}
                  </button>
                </div>

                <div className="gold-divider mt-4" />
              </div>
            </section>
          </FadeInSection>
        </div>
      </main>

      {/* ===== 页脚 ===== */}
      <footer className="space-y-5 border-t border-gold/10 px-4 pt-10 text-center text-sm">
        {/* 三段诗句 */}
        <div className="space-y-3">
          <p className="leading-loose text-gold/80">
            {resolve('footer.poem') || '善念起于心，福缘自然生。一念清净，万物皆宁。'}
          </p>
          <p className="leading-loose text-paper-dark/70">
            {resolve('footer.poem') || '若人顺心意，则万事皆顺。'}
          </p>
          <p className="leading-loose text-paper-dark/65">
            {resolve('footer.poem') || '命我自立，福我自求。诸恶莫作，众善奉行。'}
          </p>
        </div>

        {/* 链接 */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gold/80">
          <a href="/terms/" className="transition-colors hover:text-gold-light">
            {resolve('footer.terms')}
          </a>
          <a href="/privacy/" className="transition-colors hover:text-gold-light">
            {resolve('footer.privacy')}
          </a>
          <a href="/ai-notice/" className="transition-colors hover:text-gold-light">
            {resolve('footer.aiNotice')}
          </a>
        </div>

        {/* 金色分割线 */}
        <div className="mx-auto w-12 border-t border-gold/15" />

        {/* 免责声明 */}
        <p className="mx-auto max-w-2xl text-xs leading-6 text-paper-dark/65">
          {resolve('footer.disclaimer')}
        </p>

        {/* 版权声明 */}
        <p className="mx-auto max-w-2xl text-xs leading-6 text-paper-dark/62">
          {resolve('footer.disclaimer') || '继续使用本站即表示您已阅读《用户协议》《隐私说明》《AI生成说明》。'}
        </p>

        {/* 品牌署名 */}
        <p className="text-xs text-paper-dark/60" style={{ fontFamily: "'ZhiMangXing', cursive" }}>
          {resolve('brand.name')} · 一念悠悠，一灯长明
        </p>
      </footer>

      {/* ===== 底部导航 ===== */}
      <BottomNav active="home" />
    </div>
  );
}
