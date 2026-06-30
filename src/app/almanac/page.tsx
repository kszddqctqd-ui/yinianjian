'use client';

import { useState, useEffect } from 'react';
import { Solar, Lunar } from 'lunar-javascript';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';

export default function AlmanacPage() {
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
      date: `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`,
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
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1510 0%, #2d2216 50%, #1a1510 100%)' }}>
      {/* Side feather masks */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#0a0a0c] to-transparent" />
      <div className="pointer-events-none fixed inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#0a0a0c] to-transparent" />

      {/* Background layers */}
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]" style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(201,160,92,0.06) 0%, transparent 60%)' }} />
      <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-[#c9a05c]/10 to-transparent" />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-3 flex size-20 items-center justify-center rounded-full border border-[#c9a05c]/30 bg-[#c9a05c]/10">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c9a05c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-calendar-days size-10" aria-hidden="true">
                <path d="M8 2v4" /><path d="M16 2v4" />
                <rect width="18" height="18" x="3" y="4" rx="2" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" /><path d="M12 14h.01" /><path d="M16 14h.01" />
                <path d="M8 18h.01" /><path d="M12 18h.01" /><path d="M16 18h.01" />
              </svg>
            </div>
            <h1 className="text-4xl tracking-[0.2em] font-display" style={{ color: '#f5e6b8' }}>今日黄历</h1>
            <p className="mx-auto max-w-md text-base" style={{ color: '#dfc59fcc' }}>
              干支宜忌、神煞冲煞、十二时辰，传统择吉一目了然。
            </p>
          </section>

          {loading ? (
            <div className="flex h-[60vh] items-center justify-center" style={{ color: '#dfc59f99' }}>
              加载今日黄历...
            </div>
          ) : almanac ? (
            <div className="space-y-4">
              {/* Date card */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md space-y-2 text-center">
                <div className="text-lg font-display" style={{ color: '#f5e6b8' }}>{almanac.date}</div>
                <div className="text-sm" style={{ color: '#dfc59f' }}>{almanac.weekDay}</div>
                <div className="text-xs" style={{ color: '#dfc59f99' }}>{almanac.lunarDate}</div>
                {almanac.jieQi && (
                  <div className="text-xs mt-1" style={{ color: '#c9a05c' }}>节气：{almanac.jieQi}</div>
                )}
                <div className="text-xs" style={{ color: '#dfc59f99' }}>星座：{almanac.xingzuo}</div>
              </div>

              {/* GanZhi */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <div className="text-center mb-3">
                  <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>干支</span>
                </div>
                <div className="grid grid-cols-4 gap-3 text-center">
                  {[
                    { label: '年', value: almanac.ganZhi.year },
                    { label: '月', value: almanac.ganZhi.month },
                    { label: '日', value: almanac.ganZhi.day },
                    { label: '时', value: almanac.ganZhi.hour },
                  ].map((g, i) => (
                    <div key={i}>
                      <div className="text-xs mb-1" style={{ color: '#dfc59f99' }}>{g.label}</div>
                      <div className="text-xl font-number font-display" style={{ color: '#f5e6b8' }}>{g.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Yi / Ji */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-center mb-2">
                      <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>宜</span>
                    </div>
                    <div className="space-y-1">
                      {(almanac.yi.length > 0 ? almanac.yi : ['诸事不宜']).map((item, i) => (
                        <div key={i} className="text-sm text-center" style={{ color: '#dfc59f' }}>{item}</div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-center mb-2">
                      <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>忌</span>
                    </div>
                    <div className="space-y-1">
                      {(almanac.ji.length > 0 ? almanac.ji : ['诸事不宜']).map((item, i) => (
                        <div key={i} className="text-sm text-center" style={{ color: '#dfc59f' }}>{item}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Chong */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md text-center">
                <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>冲煞</span>
                <div className="mt-2 text-sm" style={{ color: '#dfc59f' }}>{almanac.chong || '无'}</div>
              </div>

              {/* 十二时辰 */}
              <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md">
                <div className="text-center mb-3">
                  <span className="text-xs tracking-wider" style={{ color: '#c9a05c' }}>十二时辰</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { name: '子时', time: '23:00-01:00' },
                    { name: '丑时', time: '01:00-03:00' },
                    { name: '寅时', time: '03:00-05:00' },
                    { name: '卯时', time: '05:00-07:00' },
                    { name: '辰时', time: '07:00-09:00' },
                    { name: '巳时', time: '09:00-11:00' },
                    { name: '午时', time: '11:00-13:00' },
                    { name: '未时', time: '13:00-15:00' },
                    { name: '申时', time: '15:00-17:00' },
                    { name: '酉时', time: '17:00-19:00' },
                    { name: '戌时', time: '19:00-21:00' },
                    { name: '亥时', time: '21:00-23:00' },
                  ].map((shichen, i) => {
                    const nowHour = new Date().getHours();
                    const startHour = parseInt(shichen.time.split(':')[0]);
                    const endHour = parseInt(shichen.time.split('-')[0].split(':')[1] || '24');
                    const isCurrent = nowHour >= startHour && nowHour < endHour;
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
                        <div className="text-[10px] mt-0.5" style={{ color: isCurrent ? '#dfc59f' : '#dfc59f60' }}>{shichen.time}</div>
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
