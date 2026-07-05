'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { getRecords, getTotalRecordCount, formatRelativeTime, type RecordEntry } from '@/lib/records';
import { t, getLocale, useLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

// 记录类型配置
const RECORD_TYPES = [
  { nameKey: 'more.features.0.title', key: 'bazi', icon: 'compass', emptyBtn: 'profile.emptyBtn.bazi', href: '/' },
  { nameKey: 'more.features.3.title', key: 'lottery', icon: 'scroll', emptyBtn: 'profile.emptyBtn.lottery', href: '/lottery/' },
  { nameKey: 'more.features.7.title', key: 'divination', icon: 'compass', emptyBtn: 'profile.emptyBtn.divination', href: '/divination/' },
  { nameKey: 'feature.palmistry.title', key: 'palmistry_hand', icon: 'hand', emptyBtn: 'profile.emptyBtn.palmistryHand', href: '/palmistry/' },
  { nameKey: 'feature.palmistry.title', key: 'palmistry_face', icon: 'user', emptyBtn: 'profile.emptyBtn.palmistryFace', href: '/palmistry/' },
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
    heart: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`lucide lucide-heart size-5 ${color}`} aria-hidden="true">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
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
  const dreamCount = records.filter(r => r.type === 'dream').length;

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* ===== 区块1: 用户信息卡 ===== */}
          <section>
            <div className="card-standard space-y-5">
              {/* 吉祥号 */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-key-round size-5 text-gold" aria-hidden="true">
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
                  </svg>
                  <span className="font-display text-lg" style={{ color: '#C9A96E' }}>{resolve('profile.myAuspiciousId')}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-3xl tracking-[0.08em] font-display" style={{ color: '#C9A96E' }}>
                    ——
                  </span>
                  <button type="button" className="rounded-md border border-gold/20 bg-xuan-surface/40 px-2 py-1 text-xs text-paper-dark/60 hover:text-gold hover:border-gold/40 transition-all">
                    {resolve('profile.copy')}
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: '#D4C5A9/65' }}>
                  {resolve('profile.idNote')}
                </p>
              </div>

              {/* 用户信息 */}
              <div className="flex items-center gap-4">
                {/* 左侧 */}
                <div className="flex items-center gap-3">
                  <div className="flex size-14 items-center justify-center rounded-full border-2 border-gold/40" style={{ background: 'rgba(201,169,110,0.1)' }}>
                    <Icon name="user" color="text-gold" />
                  </div>
                  <div>
                    <div className="font-display text-lg" style={{ color: '#D4C5A9' }}>{resolve('profile.userTitle')}</div>
                    <div className="text-xs" style={{ color: '#D4C5A9/50' }}>{resolve('profile.userSub')}</div>
                  </div>
                </div>

                {/* 右侧：功德 */}
                <div className="ml-auto text-right">
                  <div className="text-xs" style={{ color: '#D4C5A9/65' }}>{resolve('profile.currentMerit')}</div>
                  <div className="font-display text-2xl" style={{ color: '#C9A96E' }}>{totalReadings}</div>
                  <div className="mt-1 inline-flex items-center rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold">
                    {resolve(getMeritBadge(totalReadings).labelKey)}
                  </div>
                </div>
              </div>

              {/* 统计栏 */}
              <div className="text-xs" style={{ color: '#D4C5A9/65' }}>
                {resolve('profile.historyCount').replace('{count}', totalReadings.toString())} · {resolve('profile.dailyIncense')} · {resolve('profile.notSignedIn')}
              </div>
            </div>
          </section>

          {/* ===== 区块2: 我的祈福灯 ===== */}
          <section>
            <div className="card-standard space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="lamp" color="text-vermillion" />
                  <span className="font-display text-xl" style={{ color: '#C9A96E' }}>{resolve('profile.myPrayerLamps')}</span>
                  <span className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold-80">0</span>
                </div>
              </div>

              {/* 空状态 */}
              <div className="rounded-lg border border-gold/20 bg-xuan-surface/40 p-6 text-center">
                <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full border border-gold/20 bg-vermillion/10">
                  <Icon name="lamp" color="text-vermillion" />
                </div>
                <p className="text-sm" style={{ color: '#D4C5A9/65' }}>{resolve('profile.noPrayerLamp')}</p>
                <a href="/qifu/" className="mt-2 inline-block rounded-md border border-gold/30 px-4 py-1.5 text-sm text-gold hover:bg-gold/10 transition-colors">
                  {resolve('profile.lightForFamily')}
                </a>
              </div>
            </div>
          </section>

          {/* ===== 区块3: 六类记录卡片 ===== */}
          <section>
            <h2 className="font-display text-xl tracking-wider" style={{ color: '#C9A96E', paddingBottom: '1rem' }}>
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
                              <div className="text-[10px]" style={{ color: '#D4C5A9/50' }}>{formatRelativeTime(r.timestamp)}</div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-xs" style={{ color: '#D4C5A9/50' }}>{resolve('profile.noRecords')}</p>
                        <a href={rt.href} className="mt-1 inline-block text-xs text-gold hover:underline">
                          {resolve(rt.emptyBtn)}
                        </a>
                      </div>
                    )}

                    {count > 0 && (
                      <button type="button" className="flex items-center gap-1 text-xs text-paper-dark/50 hover:text-vermillion transition-colors">
                        <Icon name="trash" color="text-current" />
                        <span>{resolve('profile.clear')}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== 区块4: 最近功德 ===== */}
          <section>
            <div className="card-standard space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="refresh" color="text-gold" />
                  <span className="font-display text-xl" style={{ color: '#C9A96E' }}>{resolve('profile.meritRecords')}</span>
                </div>
              </div>

              {records.length > 0 ? (
                <div className="space-y-2">
                  {records.slice(-5).reverse().map((r, i) => (
                    <div key={i} className="flex items-center justify-between rounded-md bg-xuan-surface/40 p-3">
                      <div>
                        <div className="text-sm" style={{ color: '#D4C5A9' }}>{r.summary}</div>
                        <div className="text-xs" style={{ color: '#D4C5A9/50' }}>{formatRelativeTime(r.timestamp)}</div>
                      </div>
                      <span className="font-number text-sm" style={{ color: '#C9A96E' }}>+1</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-sm" style={{ color: '#D4C5A9/50' }}>{resolve('profile.noMerit')}</p>
                  <a href="/qifu/" className="mt-2 inline-block text-sm text-gold hover:underline">
                    {resolve('profile.goOffer')}
                  </a>
                </div>
              )}
            </div>
          </section>

          {/* ===== 区块5: 设置 ===== */}
          <section>
            <div className="card-standard space-y-4">
              <h3 className="font-display text-xl" style={{ color: '#C9A96E' }}>{resolve('profile.settings')}</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/records'}
                  className="w-full flex items-center justify-between rounded-md border border-gold/20 bg-xuan-surface/40 px-4 py-3 text-sm text-paper-dark/80 hover:text-gold hover:border-gold/30 transition-all"
                >
                  <span>{resolve('profile.viewRecords')}</span>
                  <Icon name="arrow" color="text-current" />
                </button>
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-md border border-gold/20 bg-xuan-surface/40 px-4 py-3 text-sm text-paper-dark/80 hover:text-vermillion hover:border-vermillion/30 transition-all"
                  onClick={() => {
                    if (confirm(resolve('profile.clearConfirm'))) {
                      localStorage.clear();
                      window.location.reload();
                    }
                  }}
                >
                  <span>{resolve('profile.clearCache')}</span>
                  <Icon name="trash" color="text-current" />
                </button>
              </div>
            </div>
          </section>

          {/* ===== 区块6: 关于 ===== */}
          <section>
            <div className="card-standard space-y-3">
              <h3 className="font-display text-xl" style={{ color: '#C9A96E' }}>{resolve('profile.about')}</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span style={{ color: '#D4C5A9' }}>{resolve('profile.version')}</span>
                  <span style={{ color: '#D4C5A9/50' }}>4.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#D4C5A9' }}>{resolve('profile.copyright')}</span>
                  <span style={{ color: '#D4C5A9/50' }}>{resolve('profile.copyrightFull')}</span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: '#D4C5A9' }}>{resolve('profile.philosophy')}</span>
                  <span style={{ color: '#D4C5A9/50' }}>{resolve('profile.userSub')}</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
