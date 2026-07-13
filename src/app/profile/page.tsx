'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { getRecords, formatRelativeTime, type RecordEntry } from '@/lib/records';
import { t, getLocale, useLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

// 记录类型配置（对标菩提苑 6 个模块）
const RECORD_TYPES = [
  { nameKey: 'more.features.0.title', key: 'bazi', icon: 'compass', emptyBtn: 'profile.emptyBtn.bazi', href: '/' },
  { nameKey: 'more.features.3.title', key: 'lottery', icon: 'scroll', emptyBtn: 'profile.emptyBtn.lottery', href: '/lottery/' },
  { nameKey: 'more.features.7.title', key: 'divination', icon: 'compass', emptyBtn: 'profile.emptyBtn.divination', href: '/divination/' },
  { nameKey: 'feature.palmistry.hand', key: 'palmistry_hand', icon: 'hand', emptyBtn: 'profile.emptyBtn.palmistryHand', href: '/palmistry/' },
  { nameKey: 'feature.palmistry.face', key: 'palmistry_face', icon: 'user', emptyBtn: 'profile.emptyBtn.palmistryFace', href: '/palmistry/' },
  { nameKey: 'more.features.6.title', key: 'naming', icon: 'book', emptyBtn: 'profile.emptyBtn.naming', href: '/naming/' },
];

function Icon({ name, color = 'text-gold' }: { name: string; color?: string }): React.ReactElement {
  const icons: Record<string, React.ReactElement> = {
    compass: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-compass size-5 ${color}`} aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
      </svg>
    ),
    scroll: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-scroll-text size-5 ${color}`} aria-hidden="true">
        <path d="M15 12h-5" /><path d="M15 8h-5" /><path d="M19 17V5a2 2 0 0 0-2-2H4" /><path d="M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3" />
      </svg>
    ),
    hand: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-hand size-5 ${color}`} aria-hidden="true">
        <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" /><path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" /><path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" /><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.94-2.27l-1.56-1.92A2 2 0 0 1 3 16.5v-4a2 2 0 1 1 4 0" />
      </svg>
    ),
    user: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-user-round size-5 ${color}`} aria-hidden="true">
        <circle cx="12" cy="4" r="4" /><path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
      </svg>
    ),
    book: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-book-open size-5 ${color}`} aria-hidden="true">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    lamp: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-lamp size-5 ${color}`} aria-hidden="true">
        <path d="M8 2h8" /><path d="M12 2v4" /><path d="M12 6a6 6 0 0 0-6 6c0 2.21 1.15 3.54 3 4.5V18a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-1.5c1.85-1 3-2.29 3-4.5a6 6 0 0 0-6-6Z" /><path d="M9 18v1" /><path d="M15 18v1" />
      </svg>
    ),
    refresh: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-refresh-cw size-4 ${color}`} aria-hidden="true">
        <path d="M3 11a9 9 0 0 1 9-9 9 9 0 0 1 6.36 2.64L21 11" /><path d="M11 13a9 9 0 0 1-9 9 9 9 0 0 1-6.36-2.64L3 13" /><path d="M11 21l-3-3" /><path d="M13 21l3-3" />
      </svg>
    ),
    trash: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-trash-2 size-4 ${color}`} aria-hidden="true">
        <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
      </svg>
    ),
    arrow: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-arrow-right size-4 ${color}`} aria-hidden="true">
        <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
      </svg>
    ),
    phone: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-phone size-5 ${color}`} aria-hidden="true">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
    key: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-key-round size-5 ${color}`} aria-hidden="true">
        <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
        <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
      </svg>
    ),
  };
  return icons[name] || icons.compass;
}

// 功德等级
function getMeritBadge(total: number): { labelKey: string; variant: string } {
  if (total >= 1000) return { labelKey: 'profile.meritBadges.4', variant: 'gold' };
  if (total >= 500) return { labelKey: 'profile.meritBadges.3', variant: 'gold' };
  if (total >= 100) return { labelKey: 'profile.meritBadges.2', variant: 'gold' };
  if (total >= 10) return { labelKey: 'profile.meritBadges.1', variant: 'gold' };
  return { labelKey: 'profile.meritBadges.0', variant: 'gold' };
}

export default function ProfilePage() {
  const [records, setRecords] = useState<RecordEntry[]>([]);
  const [totalReadings, setTotalReadings] = useState(0);
  const [lang, setLang] = useState<SupportedLang>(getLocale());

  useLocale(setLang);

  const resolve = (key: string): string => t(key);

  useEffect(() => {
    const all = getRecords();
    setRecords(all);
    setTotalReadings(all.length);
  }, []);

  const baziCount = records.filter(r => r.type === 'bazi').length;
  const lotteryCount = records.filter(r => r.type === 'lottery').length;
  const divinationCount = records.filter(r => r.type === 'divination').length;
  const palmistryCount = records.filter(r => r.type === 'palmistry').length;
  const namingCount = records.filter(r => r.type === 'naming').length;

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* ===== 区块1: 我的吉祥号 ===== */}
          <section>
            <div className="card-standard space-y-4">
              {/* 吉祥号 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Icon name="key" color="text-gold" />
                  <span className="font-display text-lg" style={{ color: '#C9A96E' }}>{resolve('profile.myAuspiciousId')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[1.875rem] tracking-[0.08em] font-display" style={{ color: '#C9A96E' }}>
                    玄真7791
                  </span>
                  <button type="button" className="rounded-md border border-gold/20 bg-xuan-surface/40 px-2 py-1 text-xs text-paper-dark/60 hover:text-gold hover:border-gold/40 transition-all">
                    {resolve('profile.copy')}
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: 'rgba(212,197,169,0.65)' }}>
                  {resolve('profile.idNote')}
                </p>
                <a href="/records/" className="mt-2 inline-block text-xs text-gold hover:underline">
                  {resolve('profile.haveId')} → {resolve('profile.findId')}
                </a>
              </div>

              {/* 用户信息 */}
              <div className="flex items-center gap-4">
                {/* 左侧 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-full border-2 border-gold/40" style={{ background: 'rgba(201,169,110,0.1)' }}>
                    <Icon name="user" color="text-gold" />
                  </div>
                  <div>
                    <div className="font-display text-lg" style={{ color: '#D4C5A9' }}>善信玄真7791</div>
                    <div className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('profile.notBoundPhone')}</div>
                    <div className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('profile.registerDate')}</div>
                  </div>
                </div>

                {/* 右侧：功德 */}
                <div className="ml-auto text-right">
                  <div className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>{resolve('profile.currentMerit')}</div>
                  <div className="font-display text-[1.5rem]" style={{ color: '#C9A96E' }}>{totalReadings}</div>
                  <div className="mt-1 inline-flex items-center rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold">
                    {resolve(getMeritBadge(totalReadings).labelKey)}
                  </div>
                </div>
              </div>

              {/* 统计栏 */}
              <div className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>
                {resolve('profile.historyCount').replace('{count}', totalReadings.toString())} · {resolve('profile.notIncense')} · {resolve('profile.notSignedIn')}
              </div>
            </div>
          </section>

          {/* ===== 区块2: 绑定手机号 ===== */}
          <section>
            <div className="card-standard space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="phone" color="text-vermillion" />
                <span className="font-display text-[1.25rem]" style={{ color: '#C9A96E' }}>{resolve('profile.bindPhone')}</span>
              </div>
              <p className="text-sm" style={{ color: 'rgba(212,197,169,0.65)' }}>
                {resolve('profile.bindPhoneDesc')}
              </p>
              <button type="button" className="inline-flex items-center gap-2 rounded-md bg-vermillion px-4 py-2 text-sm text-white hover:bg-vermillion-light transition-colors">
                <Icon name="phone" color="text-white" />
                {resolve('profile.bindPhoneNow')}
              </button>
            </div>
          </section>

          {/* ===== 区块3: 切换吉祥号 ===== */}
          <section>
            <div className="card-standard space-y-3">
              <div className="flex items-center gap-2">
                <Icon name="key" color="text-gold" />
                <span className="font-display text-[1.25rem]" style={{ color: '#C9A96E' }}>{resolve('profile.switchId')}</span>
              </div>
            </div>
          </section>

          {/* ===== 区块4: 六大服务记录卡片 ===== */}
          <section>
            <h2 className="font-display text-[1.25rem] tracking-wider" style={{ color: '#C9A96E', paddingBottom: '1rem' }}>
              {resolve('profile.myRecords')}
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {RECORD_TYPES.map((rt, i) => {
                const counts: Record<string, number> = { bazi: baziCount, lottery: lotteryCount, divination: divinationCount, palmistry_hand: palmistryCount, palmistry_face: palmistryCount, naming: namingCount };
                const count = counts[rt.key] ?? 0;
                return (
                  <div
                    key={i}
                    className="card-standard flex flex-col gap-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon name={rt.icon} color="text-gold" />
                        <span className="font-display text-lg" style={{ color: '#D4C5A9' }}>{resolve(rt.nameKey)}</span>
                      </div>
                      <span className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold-80">
                        {resolve('profile.recordCount').replace('{count}', count.toString())}
                      </span>
                    </div>

                    {count > 0 ? (
                      <div className="flex-1 space-y-2 overflow-hidden" style={{ maxHeight: '180px' }}>
                        {records
                          .filter(r => {
                            if (rt.key === 'palmistry_hand' || rt.key === 'palmistry_face') return r.type === 'palmistry';
                            return r.type === rt.key;
                          })
                          .slice(0, 3)
                          .map((r, j) => (
                            <div key={j} className="rounded-md bg-xuan-surface/40 p-2">
                              <div className="text-sm" style={{ color: '#D4C5A9' }}>{r.summary}</div>
                              <div className="text-[10px]" style={{ color: 'rgba(212,197,169,0.5)' }}>{formatRelativeTime(r.timestamp)}</div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('profile.noRecords')}</p>
                        <a href={rt.href} className="mt-1 inline-block text-xs text-gold hover:underline">
                          {resolve(rt.emptyBtn)}
                        </a>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <BottomNav active="more" />
    </div>
  );
}
