'use client';

import { useRouter } from 'next/navigation';
import { MusicToggle } from './MusicToggle';
import { LanguageToggle } from './LanguageToggle';
import { t } from '@/lib/i18n';

export function Header() {
  const router = useRouter();

  return (
    <>
      <header className="fixed top-0 z-50 h-14 w-full transition-all duration-base safe-top bg-transparent">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          {/* Logo 区 - 纯SVG（对齐菩提苑） */}
          <a className="flex items-center gap-2.5" href="/">
            {/* 菩提叶 SVG logo（对齐菩提苑） */}
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-9 shrink-0 rounded-full text-gold drop-shadow-[0_0_8px_rgba(201,160,94,0.4)]" xmlns="http://www.w3.org/2000/svg" style={{ background: 'rgba(201,169,110,0.1)' }}>
              <path d="M32 6 C 22 6, 12 12, 10 22 C 8 32, 14 44, 24 50 C 28 53, 30 56, 31 60 L 32 62 L 33 60 C 34 56, 36 53, 40 50 C 50 44, 56 32, 54 22 C 52 12, 42 6, 32 6 Z" fill="currentColor" fillOpacity="0.12" />
              <path d="M32 8 V 60" strokeWidth="1.4" />
              <path d="M32 16 C 26 18, 20 22, 16 28" />
              <path d="M32 16 C 38 18, 44 22, 48 28" />
              <path d="M32 28 C 24 30, 18 36, 16 42" />
              <path d="M32 28 C 40 30, 46 36, 48 42" />
              <path d="M32 42 C 28 46, 26 50, 26 54" />
              <path d="M32 42 C 36 46, 38 50, 38 54" />
            </svg>
            {/* 品牌名 - 金色渐变文字 */}
            <span
              className="font-brand text-[1.4rem] md:text-[1.65rem] tracking-[0.12em]"
              style={{
                background: 'linear-gradient(180deg, #f5e6b8 0%, #c9a05c 50%, #8b6914 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                color: 'transparent',
                filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))',
              }}
            >
              {t('brand.name')}
            </span>
          </a>

          {/* 桌面导航 - 全部9项固定显示 */}
          <nav className="flex items-center gap-5">
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/qifu/">{t('nav.qifu')}</a>
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/almanac/">{t('nav.almanac')}</a>
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/lottery/">{t('nav.lottery')}</a>
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/">{t('nav.bazi')}</a>
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/dream/">{t('nav.dream')}</a>
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/palmistry/">{t('nav.palmistry')}</a>
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/naming/">{t('nav.naming')}</a>
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/divination/">{t('nav.divination')}</a>
            <a className="font-body text-sm text-paper-dark-85 transition-colors duration-fast hover:text-gold" href="/meditation/">{t('nav.meditation')}</a>
          </nav>

          {/* 右侧按钮区 */}
          <div className="flex items-center gap-2">
            {/* 音乐控制按钮 */}
            <MusicToggle />
            {/* 添加到桌面 */}
            <div className="relative">
              <button type="button" className="flex size-8 items-center justify-center rounded-full border border-gold/30 text-gold/70 hover:bg-gold/10 hover:text-gold" aria-label="添加到桌面" title="添加到桌面" onClick={() => {
                if ('serviceWorker' in navigator) {
                  const deferredPrompt = (window as any).__pwaDeferredPrompt;
                  if (deferredPrompt) {
                    deferredPrompt.prompt();
                    deferredPrompt.userChoice.then((choiceResult: { outcome: string }) => {
                      if (choiceResult.outcome === 'accepted') {
                        console.log('用户接受了 PWA 安装');
                      }
                      (window as any).__pwaDeferredPrompt = null;
                    });
                  } else {
                    alert('请将浏览器书签栏拖动到桌面，或从菜单选择"安装"');
                  }
                }
              }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download size-4" aria-hidden="true">
                  <path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* 底部金色分隔线 */}
        <div className="gold-divider transition-opacity duration-slow opacity-0" />
      </header>

      {/* 浮动"赚"按钮 */}
      <button
        type="button"
        className="fixed right-3 z-40 flex size-10 items-center justify-center rounded-full border border-gold/50 bg-gradient-to-br from-gold/35 via-gold/20 to-vermillion/20 text-gold shadow-lg shadow-gold/20 backdrop-blur-md hover:from-gold/45 hover:to-vermillion/30 md:right-4 md:bottom-4 md:size-14"
        style={{ bottom: 'calc(env(safe-area-inset-bottom) + 88px)' }}
        aria-label="赚钱 / 开分站"
        title="赚钱 / 开分站"
        onClick={() => router.push('/more/')}
      >
        <span className="font-display text-[18px] text-gold drop-shadow-[0_0_10px_rgba(201,162,39,0.35)] md:text-[24px]">赚</span>
      </button>
    </>
  );
}
