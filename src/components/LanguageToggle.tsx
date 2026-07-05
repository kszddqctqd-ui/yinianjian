'use client';

import { useState, useEffect } from 'react';
import { getLocale, toggleLocale, type SupportedLang } from '@/lib/i18n';

export function LanguageToggle() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const handleToggle = () => {
    const next = toggleLocale();
    setLang(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      className="inline-flex items-center gap-1 rounded-full border border-gold/30 px-2.5 py-1.5 text-xs text-gold transition-colors hover:bg-gold/10"
      aria-label="Switch language"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-globe size-3.5" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
        <path d="M2 12h20" />
      </svg>
      {lang === 'zh-CN' ? 'EN' : '中文'}
    </button>
  );
}
