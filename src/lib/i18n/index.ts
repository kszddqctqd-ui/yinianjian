'use client';

import { translations, type Translations, shichenLabels } from './translations';

const STORAGE_KEY = 'yinianjian_lang';
const SUPPORTED_LANGS = ['zh-CN', 'en'] as const;
export type SupportedLang = (typeof SUPPORTED_LANGS)[number];

const DEFAULT_LANG: SupportedLang = 'zh-CN';

function getStoredLang(): SupportedLang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && SUPPORTED_LANGS.includes(stored as SupportedLang)) {
    return stored as SupportedLang;
  }
  // Fallback: detect from browser
  if (typeof navigator !== 'undefined' && navigator.language) {
    if (navigator.language.startsWith('zh')) return DEFAULT_LANG;
    if (navigator.language.startsWith('en')) return 'en';
  }
  return DEFAULT_LANG;
}

let currentLang: SupportedLang = getStoredLang();

export function getLocale(): SupportedLang {
  return currentLang;
}

export function t(key: string): string {
  const translation = translations[key];
  if (!translation) return key;
  const langKey = currentLang === 'zh-CN' ? 'zh' : currentLang;
  return translation[langKey] || translation.zh;
}

export function setLocale(lang: SupportedLang): void {
  currentLang = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh-CN' ? 'zh-CN' : 'en';
    // Dispatch a custom event so components can re-render
    window.dispatchEvent(new CustomEvent('lang-change'));
  }
}

export function toggleLocale(): SupportedLang {
  const next = currentLang === 'zh-CN' ? 'en' : 'zh-CN';
  setLocale(next);
  return next;
}

export { shichenLabels };

export function useLocale(callback: (lang: SupportedLang) => void): void {
  if (typeof window === 'undefined') return;
  // Single-registration guard
  if (!(window as any).__i18nRegistered) {
    (window as any).__i18nRegistered = true;
    window.addEventListener('lang-change', () => {
      currentLang = getStoredLang();
      callback(currentLang);
    });
  }
}
