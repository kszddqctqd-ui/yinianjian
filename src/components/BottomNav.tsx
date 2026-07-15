'use client';

import { useState, useEffect } from 'react';
import { t, getLocale, type SupportedLang } from '@/lib/i18n';

export function BottomNav({ active = 'home' }: { active?: string }) {
  const [clickCount, setClickCount] = useState(0);
  const [lang, setLang] = useState<SupportedLang>(getLocale());

  useEffect(() => {
    if (clickCount === 0) return;
    const timer = setTimeout(() => setClickCount(0), 2000);
    return () => clearTimeout(timer);
  }, [clickCount]);

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    if (newCount >= 6) {
      setClickCount(0);
      window.location.href = '/admin';
    }
  };

  // 6个Tab完全对标菩提苑
  const tabs = [
    { name: 'home', label: t('bottomnav.home'), href: '/', icon: 'house' },
    { name: 'qifu', label: t('bottomnav.qifu'), href: '/qifu/', icon: 'heart' },
    { name: 'almanac', label: t('bottomnav.almanac'), href: '/almanac/', icon: 'calendar-days' },
    { name: 'lottery', label: t('bottomnav.lottery'), href: '/lottery/', icon: 'scroll-text' },
    { name: 'profile', label: t('bottomnav.profile'), href: '/profile/', icon: 'user' },
    { name: 'more', label: t('bottomnav.more'), href: '/more/', icon: 'layout-grid' },
  ];

  // 激活态判断
  const isActive = (name: string) => name === active;

  // SVG图标映射
  const icons: Record<string, React.ReactNode> = {
    house: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house size-5" aria-hidden="true">
        <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
        <path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
      </svg>
    ),
    heart: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-5" aria-hidden="true">
        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"></path>
      </svg>
    ),
    'calendar-days': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days size-5" aria-hidden="true">
        <path d="M8 2v4"></path><path d="M16 2v4"></path>
        <rect width="18" height="18" x="3" y="4" rx="2"></rect>
        <path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path>
        <path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path>
      </svg>
    ),
    'scroll-text': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll-text size-5" aria-hidden="true">
        <path d="M15 12h-5"></path><path d="M15 8h-5"></path>
        <path d="M19 17V5a2 2 0 0 0-2-2H4"></path>
        <path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"></path>
      </svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user size-5" aria-hidden="true">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
        <circle cx="12" cy="7" r="4"></circle>
      </svg>
    ),
    'layout-grid': (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid size-5" aria-hidden="true">
        <rect width="7" height="7" x="3" y="3" rx="1"></rect>
        <rect width="7" height="7" x="14" y="3" rx="1"></rect>
        <rect width="7" height="7" x="14" y="14" rx="1"></rect>
        <rect width="7" height="7" x="3" y="14" rx="1"></rect>
      </svg>
    ),
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-xuan-card/97 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-6 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        {tabs.map((tab) => (
          <a
            key={tab.name}
            className={`flex flex-col items-center gap-0.5 rounded-md px-0 py-2 text-xs transition-colors duration-fast ${isActive(tab.name) ? 'text-gold' : 'text-ink-muted'}`}
            href={tab.href}
          >
            {icons[tab.icon]}
            <span className="text-[11px]">{tab.label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}
