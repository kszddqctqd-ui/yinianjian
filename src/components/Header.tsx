'use client';

import { useRouter } from 'next/navigation';
import { MusicToggle } from './MusicToggle';
import { LanguageToggle } from './LanguageToggle';
import { t } from '@/lib/i18n';

export function Header() {
  const router = useRouter();

  return (
    <header className="fixed top-0 z-50 h-14 w-full transition-all duration-base safe-top bg-transparent">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
        {/* Logo 区 */}
        <a className="flex items-center gap-2.5" href="/">
          {/* 莲叶图标 */}
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-gold/30 text-gold shadow-[0_0_8px_rgba(201,160,94,0.4)]" style={{ background: 'rgba(201,169,110,0.1)' }}>
            <svg viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="size-8 md:size-12" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 6 C 22 6, 12 12, 10 22 C 8 32, 14 44, 24 50 C 28 53, 30 56, 31 60 L 32 62 L 33 60 C 34 56, 36 53, 40 50 C 50 44, 56 32, 54 22 C 52 12, 42 6, 32 6 Z" fill="currentColor" fillOpacity="0.12" />
              <path d="M32 8 V 60" strokeWidth="1.4" />
              <path d="M32 16 C 26 18, 20 22, 16 28" />
              <path d="M32 16 C 38 18, 44 22, 48 28" />
              <path d="M32 28 C 24 30, 18 36, 16 42" />
              <path d="M32 28 C 40 30, 46 36, 48 42" />
              <path d="M32 42 C 28 46, 26 50, 26 54" />
              <path d="M32 42 C 36 46, 38 50, 38 54" />
            </svg>
          </div>
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

        {/* 桌面导航 - 精简为核心入口 */}
        <nav className="hidden items-center gap-5 md:flex">
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
          {/* Language toggle */}
          <LanguageToggle />
          {/* 音乐控制按钮 */}
          <MusicToggle />
          {/* 找回记录按钮 */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-3 py-1.5 text-sm text-gold transition-colors hover:bg-gold/10"
              onClick={() => router.push('/records/')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round size-4" aria-hidden="true">
                <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
              </svg>
              {t('nav.records')}
            </button>
          </div>
        </div>
      </div>

      {/* 底部金色分隔线 */}
      <div className="gold-divider transition-opacity duration-slow opacity-0" />
    </header>
  );
}
