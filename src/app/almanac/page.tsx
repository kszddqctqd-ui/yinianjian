'use client';

import { useState, useEffect } from 'react';
import { Solar, Lunar } from 'lunar-javascript';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { t, getLocale, shichenLabels } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';

function resolve(key: string): string {
  return t(key);
}

export default function AlmanacPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const [loading, setLoading] = useState(true);
  const [almanac, setAlmanac] = useState<{
    date: string;
    lunarDate: string;
    ganZhi: { year: string; month: string; day: string; hour: string };
    yi: string[];
    ji: string[];
    chong: string;
    xingzuo: string;
    weekDay: string;
    jieQi: string;
  } | null>(null);

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  useEffect(() => {
    const today = new Date();
    const solar = Solar.fromYmdHms(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate(),
      today.getHours(),
      today.getMinutes(),
      today.getSeconds()
    );
    const lunar = solar.getLunar();

    setAlmanac({
      date: `${today.getFullYear()}${resolve('almanac.ganZhi.year')}${today.getMonth() + 1}${resolve('almanac.ganZhi.month')}${today.getDate()}${resolve('almanac.ganZhi.day')}`,
      lunarDate: lunar.toString(),
      ganZhi: {
        year: lunar.getYearInGanZhi(),
        month: lunar.getMonthInGanZhi(),
        day: lunar.getDayInGanZhi(),
        hour: lunar.getTimeInGanZhi(),
      },
      yi: lunar.getDayYi() || [],
      ji: lunar.getDayJi() || [],
      chong: lunar.getChongDesc() || '',
      xingzuo: solar.getXingzuo(),
      weekDay: solar.getWeekInChinese(),
      jieQi: (lunar as any).getCurrentJieQi?.() || '',
    });
    setLoading(false);
  }, [lang]);

  const shichenList = Object.entries(shichenLabels).map(([key, val]) => ({
    name: val[lang === 'zh-CN' ? 'zh' : 'en'],
    key,
  }));

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a0c' }}>
      {/* 金色荷花艺术背景 */}
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-[#c9a05c]/30 bg-[#c9a05c]/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a05c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days size-[2.6875rem]" aria-hidden="true">
                <path d="M8 2v4" /><path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
                <path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
              </svg>
            </div>
            <h1 className="text-4xl tracking-[0.2em] font-display" style={{ color: '#f5e6b8' }}>{resolve('almanac.title')}</h1>
            <p className="mx-auto max-w-md text-base" style={{ color: '#dfc59fcc' }}>
              {resolve('almanac.subtitle')}
            </p>
          </section>

          {loading ? (
            <div className="flex h-[60vh] items-center justify-center" style={{ color: '#dfc59f99' }}>
              {resolve('almanac.loading')}
            </div>
          ) : almanac ? (
            <div className="space-y-4">
              {/* Date card */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md space-y-2 text-center">
                <div className="text-lg font-display" style={{ color: '#f5e6b8' }}>{almanac.date}</div>
                <div className="text-sm" style={{ color: '#dfc59f' }}>{almanac.weekDay}</div>
                <div className="text-xs" style={{ color: '#dfc59f99' }}>{almanac.lunarDate}</div>
                {almanac.jieQi && (
                  <div className="text-xs mt-1" style={{ color: '#c9a05c' }}>{resolve('almanac.solarTermPrefix')}{almanac.jieQi}</div>
                )}
                <div className="text-xs" style={{ color: '#dfc59f99' }}>{resolve('almanac.zodiac')}: {almanac.xingzuo}</div>
              </div>

              {/* GanZhi */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <div className="text-center mb-3">
                  <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.ganZhi')}</span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: resolve('almanac.ganZhi.year'), value: almanac.ganZhi.year },
                    { label: resolve('almanac.ganZhi.month'), value: almanac.ganZhi.month },
                    { label: resolve('almanac.ganZhi.day'), value: almanac.ganZhi.day },
                    { label: resolve('almanac.ganZhi.hour'), value: almanac.ganZhi.hour },
                  ].map((g, i) => (
                    <div key={i}>
                      <div className="text-xs mb-1" style={{ color: '#dfc59f99' }}>{g.label}</div>
                      <div className="text-[1.25rem] font-number font-display" style={{ color: '#f5e6b8' }}>{g.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yi / Ji */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-center mb-2">
                      <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.yi')}</span>
                    </div>
                    <div className="space-y-1">
                      {(almanac.yi.length > 0 ? almanac.yi : [resolve('almanac.neither')]).map((item, i) => (
                        <div key={i} className="text-sm text-center" style={{ color: '#dfc59f' }}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-center mb-2">
                      <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.ji')}</span>
                    </div>
                    <div className="space-y-1">
                      {(almanac.ji.length > 0 ? almanac.ji : [resolve('almanac.neither')]).map((item, i) => (
                        <div key={i} className="text-sm text-center" style={{ color: '#dfc59f' }}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chong */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md text-center">
                <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.chong')}</span>
                <div className="mt-2 text-sm" style={{ color: '#dfc59f' }}>{almanac.chong || resolve('almanac.none')}</div>
              </div>

              {/* Twelve Hours */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <div className="text-center mb-3">
                  <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>{resolve('almanac.twelveHours')}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {shichenList.map((shichen, i) => {
                    const nowHour = new Date().getHours();
                    const timeMatch = shichen.name.match(/\((\d+):(\d+)-(\d+):(\d+)\)/);
                    const startHour = timeMatch ? parseInt(timeMatch[1]) : -1;
                    const isCurrent = startHour >= 0 && nowHour >= startHour && nowHour < (startHour + 2) % 24;
                    return (
                      <div
                        key={i}
                        className="rounded-lg border p-2 text-center text-xs transition-all"
                        style={{
                          borderColor: isCurrent ? '#c9a05c66' : '#c9a05c1a',
                          backgroundColor: isCurrent ? 'rgba(201,160,92,0.1)' : 'rgba(45,34,22,0.6)',
                          color: isCurrent ? '#f5e6b8' : '#dfc59fb0',
                        }}
                      >
                        <div className="font-display">{shichen.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </main>

      <BottomNav active="almanac" />
    </div>
  );
}
