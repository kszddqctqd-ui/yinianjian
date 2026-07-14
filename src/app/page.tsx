'use client';

import { useEffect, useRef, useState } from 'react';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import MusicToggle from '@/components/MusicToggle';
import { t } from '@/lib/i18n';

// 翻译函数
function resolve(key: string): string {
  return t(key);
}

// 淡入动画组件
function FadeInSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="opacity-0 transition-all duration-700"
      style={{ transitionDelay: `${delay}ms`, opacity: visible ? 1 : undefined }}
    >
      {children}
    </div>
  );
}

// 九大善门图标映射
const featureIcons = [
  '🏮', // 心愿供灯
  '📅', // 今日黄历
  '💤', // 周公解梦
  '🎋', // 传统签谱
  '🔮', // 八字精批
  '☯️', // 周易卦象
  '🤲', // 手相/面相
  '👶', // 宝宝起名
  '🧘', // 静心禅坐
];

// 粒子组件
function Particles() {
  const [particles, setParticles] = useState<Array<{ id: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    const ps = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 12,
    }));
    setParticles(ps);
  }, []);

  return (
    <>
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </>
  );
}

export default function Home() {
  const [lang, setLang] = useState('zh-CN');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('yinianjian_lang');
      if (saved === 'en') setLang('en');
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <div className="relative min-h-screen bg-xuan text-paper overflow-hidden">
      {/* 背景渐变 */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />

      {/* 径向光晕 */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(201,169,110,0.08) 0%, transparent 60%)',
        }}
      />

      {/* 粒子效果 */}
      <Particles />

      {/* 寺庙山景背景 */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.12]"
        style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }}
      />

      {/* ===== 顶部导航 ===== */}
      <Header lang={lang} setLang={setLang} />

      {/* ===== 主内容 ===== */}
      <main className="relative z-10 mx-auto max-w-4xl px-4 pb-24 pt-20">

        {/* --- 首屏：灯笼祈福区 --- */}
        <FadeInSection>
          <section className="space-y-6 pt-6 text-center">
            {/* 灯笼发光 */}
            <div className="flex justify-center">
              <div className="lantern-glow">
                <svg viewBox="0 0 120 160" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-28 md:size-36">
                  {/* 灯笼绳 */}
                  <line x1="60" y1="0" x2="60" y2="20" stroke="#C9A05C" strokeWidth="2" />
                  {/* 灯笼顶盖 */}
                  <rect x="35" y="18" width="50" height="8" rx="4" fill="#C9A05C" />
                  {/* 灯笼身 */}
                  <ellipse cx="60" cy="75" rx="40" ry="50" fill="url(#lanternGrad)" stroke="#C9A05C" strokeWidth="1.5" />
                  {/* 灯笼底盖 */}
                  <rect x="35" y="122" width="50" height="8" rx="4" fill="#C9A05C" />
                  {/* 灯笼穗 */}
                  <line x1="50" y1="130" x2="45" y2="155" stroke="#C9A05C" strokeWidth="1.5" />
                  <line x1="60" y1="130" x2="60" y2="158" stroke="#C9A05C" strokeWidth="1.5" />
                  <line x1="70" y1="130" x2="75" y2="155" stroke="#C9A05C" strokeWidth="1.5" />
                  {/* 灯笼字 */}
                  <text x="60" y="82" textAnchor="middle" fill="#1A1410" fontSize="22" fontWeight="bold" fontFamily="'ZhiMangXing', cursive">福</text>
                  <defs>
                    <radialGradient id="lanternGrad" cx="0.5" cy="0.4" r="0.5">
                      <stop offset="0%" stopColor="#F5E6B8" stopOpacity="0.9" />
                      <stop offset="100%" stopColor="#C9A05C" stopOpacity="0.6" />
                    </radialGradient>
                  </defs>
                </svg>
              </div>
            </div>

            {/* 标题 */}
            <h1
              className="text-4xl tracking-widest text-gold md:text-5xl"
              style={{
                fontFamily: "'ZhiMangXing', cursive",
                background: 'linear-gradient(180deg, #f5e6b8 0%, #c9a05c 50%, #8b6914 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              一念间
            </h1>

            {/* 副标题 */}
            <p className="text-sm tracking-wider text-gold/80">
              心诚则灵 · 传统文化 · 命理玄学
            </p>

            {/* 祈福按钮 */}
            <div className="flex justify-center gap-4 pt-2">
              <button className="btn-pray-gold rounded-full px-8 py-3 text-sm tracking-wider shadow-lg transition-transform hover:scale-105">
                心愿供灯
              </button>
              <button className="btn-pray-gold rounded-full px-8 py-3 text-sm tracking-wider shadow-lg transition-transform hover:scale-105">
                大师八字精批
              </button>
            </div>

            {/* 滚动提示 */}
            <p className="pt-4 text-xs tracking-widest text-on-dark-muted">
              向下滚动 · 看更多功德
            </p>
          </section>
        </FadeInSection>

        {/* --- 九大善门：3x3宫格 --- */}
        <FadeInSection>
          <section className="space-y-6 pb-8">
            <div className="glass-card p-6">
              {/* 标题 */}
              <h2
                className="pb-4 text-center text-2xl tracking-widest text-gold md:text-3xl"
                style={{ fontFamily: "'ZhiMangXing', cursive" }}
              >
                九大善门
              </h2>

              {/* 3x3 宫格 */}
              <div className="feature-grid-3x3">
                {[
                  { key: 'feature.pray', tag: 'feature.pray.tag' },
                  { key: 'feature.almanac', tag: 'feature.almanac.tag' },
                  { key: 'feature.dream', tag: '' },
                  { key: 'feature.lottery', tag: 'feature.lottery.tag' },
                  { key: 'feature.bazi', tag: '' },
                  { key: 'feature.divination', tag: 'feature.divination.tag' },
                  { key: 'feature.palmistry', tag: '' },
                  { key: 'feature.naming', tag: '' },
                  { key: 'feature.meditation', tag: '' },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`/${item.key.split('.')[1]}/`}
                    className="glass-card flex flex-col items-center p-4 text-center"
                  >
                    <div className="feature-card-icon">{featureIcons[i]}</div>
                    <h3
                      className="mb-1 text-sm font-semibold text-gold md:text-base"
                      style={{ fontFamily: "'ZhiMangXing', cursive" }}
                    >
                      {resolve(item.key + '.title')}
                    </h3>
                    {item.tag && (
                      <p className="text-xs text-on-dark-muted">{resolve(item.tag)}</p>
                    )}
                    <p className="mt-2 text-xs leading-relaxed text-on-dark-dim line-clamp-2">
                      {resolve(item.key + '.desc')}
                    </p>
                  </a>
                ))}
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* --- 为何选本站 --- */}
        <FadeInSection>
          <section className="space-y-6 pb-8">
            <div className="glass-card p-6">
              <h2
                className="pb-4 text-center text-2xl tracking-widest text-gold md:text-3xl"
                style={{ fontFamily: "'ZhiMangXing', cursive" }}
              >
                为何选本站
              </h2>

              {/* 三列特性 */}
              <div className="grid gap-4 md:grid-cols-3">
                <div className="glass-card p-4 text-center">
                  <p className="font-display text-lg text-gold">真排盘</p>
                  <p className="mt-2 text-xs leading-relaxed text-on-dark-muted">以立春为岁首，依据节气真排盘，非普通软件简化算法</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="font-display text-lg text-gold">古籍为据</p>
                  <p className="mt-2 text-xs leading-relaxed text-on-dark-muted">引用《渊海子平》《三命通会》《滴天髓》等经典</p>
                </div>
                <div className="glass-card p-4 text-center">
                  <p className="font-display text-lg text-gold">多风格解读</p>
                  <p className="mt-2 text-xs leading-relaxed text-on-dark-muted">三位师父不同风格，庄重持重、慈悲温柔、直爽通透</p>
                </div>
              </div>

              {/* 古籍书封图片 */}
              <div className="pt-4 md:pt-6">
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
                      className="block h-auto w-full select-none rounded-lg"
                      draggable="false"
                    />
                  </picture>
                  <figcaption className="sr-only">命理经典古籍书封展示</figcaption>
                </figure>
              </div>
            </div>
          </section>
        </FadeInSection>

        {/* --- 在线上香 --- */}
        <FadeInSection>
          <section className="space-y-6 pb-8">
            <div className="glass-card p-6 text-center">
              {/* 火焰图标 */}
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-vermillion/30 bg-vermillion/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C43D3D" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-8">
                  <path d="M12 2c0 4-4 6-4 10a4 4 0 0 0 8 0c0-4-4-6-4-10z" />
                </svg>
              </div>

              {/* 副标题 */}
              <p className="mt-3 text-sm text-on-dark-muted tracking-wider">
                {resolve('incense.subtitle')}
              </p>

              {/* 标题 */}
              <h2
                className="text-2xl tracking-widest text-gold md:text-3xl"
                style={{ fontFamily: "'ZhiMangXing', cursive" }}
              >
                {resolve('incense.title')}
              </h2>

              {/* 描述 */}
              <p className="mx-auto max-w-md text-base leading-loose text-on-dark-muted">
                {resolve('incense.desc')}
              </p>

              {/* 按钮 */}
              <div className="flex justify-center pt-2">
                <button
                  type="button"
                  className="btn-pray-gold rounded-full px-8 py-3 text-sm tracking-wider shadow-lg transition-transform hover:scale-105"
                  onClick={() => {
                    const today = new Date().toISOString().slice(0, 10);
                    const todayKey = `yinianjian_incense_${today}`;
                    const count = parseInt(localStorage.getItem(todayKey) || '0', 10);
                    if (count < 3) {
                      localStorage.setItem(todayKey, String(count + 1));
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
            </div>
          </section>
        </FadeInSection>

        {/* --- 分享给家人 --- */}
        <FadeInSection>
          <section className="space-y-6 pb-8">
            <div className="glass-card p-6 text-center">
              {/* 火花图标 */}
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="#C9A05C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-8">
                  <path d="M12 2l2.4 7.2H22l-6 4.8 2.4 7.2L12 16.4l-6.4 4.8 2.4-7.2-6-4.8h7.6z" />
                </svg>
              </div>

              {/* 标题 */}
              <h2
                className="mt-3 text-2xl tracking-widest text-gold md:text-3xl"
                style={{ fontFamily: "'ZhiMangXing', cursive" }}
              >
                {resolve('share.title')}
              </h2>

              {/* 描述 */}
              <p className="mx-auto max-w-md text-base leading-loose text-on-dark-muted">
                {resolve('share.desc')}
              </p>

              {/* 按钮 */}
              <div className="flex justify-center pt-2">
                <button className="btn-pray-gold rounded-full px-8 py-3 text-sm tracking-wider shadow-lg transition-transform hover:scale-105" onClick={() => window.location.href = '/invite/'}>
                  {resolve('share.btn.share')}
                </button>
              </div>
            </div>
          </section>
        </FadeInSection>
      </main>

      {/* ===== 页脚 ===== */}
      <footer className="relative z-10 space-y-5 border-t border-gold/10 px-4 pt-10 text-center text-sm">
        {/* 三段诗句 */}
        <div className="space-y-3">
          <p className="leading-loose text-gold/80">
            {resolve('footer.poem') || '善念起于心，福缘自然生。一念清净，万物皆宁。'}
          </p>
          <p className="leading-loose text-on-dark-muted">
            {resolve('footer.poem') || '菩提本无树，明镜亦非台。本来无一物，何处惹尘埃。'}
          </p>
          <p className="leading-loose text-on-dark-dim">
            {resolve('footer.poem') || '命自我立，福自我求。诸恶莫作，众善奉行。'}
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
