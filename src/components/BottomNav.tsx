'use client';

export function BottomNav({ active = 'home' }: { active?: string }) {
  const isActive = (name: string) => active === name;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/20 bg-xuan-card/97 backdrop-blur-md md:hidden">
      <div className="grid grid-cols-6 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2">
        <a className={`flex flex-col items-center gap-0.5 rounded-md px-0 py-2 text-xs transition-colors duration-fast ${isActive('home') ? 'text-gold' : 'text-on-dark-muted'}`} href="/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-house size-5" aria-hidden="true"><path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
          <span className="text-[11px]">首页</span>
        </a>
        <a className={`flex flex-col items-center gap-0.5 rounded-md px-0 py-2 text-xs transition-colors duration-fast ${isActive('qifu') ? 'text-gold' : 'text-on-dark-muted'}`} href="/qifu/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-heart size-5" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
          <span className="text-[11px]">祈福</span>
        </a>
        <a className={`flex flex-col items-center gap-0.5 rounded-md px-0 py-2 text-xs transition-colors duration-fast ${isActive('almanac') ? 'text-gold' : 'text-on-dark-muted'}`} href="/almanac/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days size-5" aria-hidden="true"><path d="M8 2v4"></path><path d="M16 2v4"></path><rect width="18" height="18" x="3" y="4" rx="2"></rect><path d="M3 10h18"></path><path d="M8 14h.01"></path><path d="M12 14h.01"></path><path d="M16 14h.01"></path><path d="M8 18h.01"></path><path d="M12 18h.01"></path><path d="M16 18h.01"></path></svg>
          <span className="text-[11px]">黄历</span>
        </a>
        <a className={`flex flex-col items-center gap-0.5 rounded-md px-0 py-2 text-xs transition-colors duration-fast ${isActive('lottery') ? 'text-gold' : 'text-on-dark-muted'}`} href="/lottery/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-scroll-text size-5" aria-hidden="true"><path d="M15 12h-5"></path><path d="M15 8h-5"></path><path d="M19 17V5a2 2 0 0 0-2-2H4"></path><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3"></path></svg>
          <span className="text-[11px]">灵签</span>
        </a>
        <a className={`flex flex-col items-center gap-0.5 rounded-md px-0 py-2 text-xs transition-colors duration-fast ${isActive('profile') ? 'text-gold' : 'text-on-dark-muted'}`} href="/profile/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user size-5" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
          <span className="text-[11px]">我的</span>
        </a>
        <a className={`flex flex-col items-center gap-0.5 rounded-md px-0 py-2 text-xs transition-colors duration-fast ${isActive('more') ? 'text-gold' : 'text-on-dark-muted'}`} href="/more/">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-layout-grid size-5" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="3" rx="1"></rect><rect width="7" height="7" x="14" y="14" rx="1"></rect><rect width="7" height="7" x="3" y="14" rx="1"></rect></svg>
          <span className="text-[11px]">更多</span>
        </a>
      </div>
    </nav>
  );
}
