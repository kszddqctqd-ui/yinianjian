'use client';

import { useEffect, useState } from 'react';
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
    <div className="min-h-screen bg-deep relative overflow-hidden">
      {/* Background layers */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]"
        style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }}
      />
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)',
        }}
      />
      <div className="fixed inset-x-0 top-0 z-0 h-32 bg-gradient-to-b from-gold/15 to-transparent" />
      <FloatingParticles />

      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 app-container space-y-section px-4 pb-24 pt-14">
        {/* Title */}
        <section className="space-y-3 pt-4 text-center">
          <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5">
            <span className="size-9 shrink-0 text-gold drop-shadow-[0_0_8px_rgba(201,160,94,0.4)]">📅</span>
          </div>
          <span className="font-display text-[18px] text-gold-gradient drop-shadow-[0_0_10px_rgba(201,162,39,0.35)] md:text-[24px]">
            今日黄历
          </span>
          <p className="text-base text-paper-dark/80">
            干支宜忌、神煞冲煞、十二时辰，传统择吉一目了然。
          </p>
        </section>

        {loading ? (
          <div className="flex h-[60vh] items-center justify-center text-paper-dark/65">
            加载今日黄历...
          </div>
        ) : almanac ? (
          <div className="space-y-4">
            {/* Date card */}
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
              <div className="text-center space-y-2">
                <div className="text-lg text-gold font-display">{almanac.date}</div>
                <div className="text-sm text-paper-dark/80">{almanac.weekDay}</div>
                <div className="text-xs text-paper-dark/60">{almanac.lunarDate}</div>
                {almanac.jieQi && (
                  <div className="text-xs text-gold/80 mt-1">节气：{almanac.jieQi}</div>
                )}
                <div className="text-xs text-paper-dark/60">星座：{almanac.xingzuo}</div>
              </div>
            </div>

            {/* GanZhi */}
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
              <div className="text-center mb-3">
                <span className="text-xs text-gold/80 tracking-wider">干支</span>
              </div>
              <div className="grid grid-cols-4 gap-3 text-center">
                <div>
                  <div className="text-xs text-paper-dark/60 mb-1">年</div>
                  <div className="text-xl text-gold font-number">{almanac.ganZhi.year}</div>
                </div>
                <div>
                  <div className="text-xs text-paper-dark/60 mb-1">月</div>
                  <div className="text-xl text-gold font-number">{almanac.ganZhi.month}</div>
                </div>
                <div>
                  <div className="text-xs text-paper-dark/60 mb-1">日</div>
                  <div className="text-xl text-gold font-number">{almanac.ganZhi.day}</div>
                </div>
                <div>
                  <div className="text-xs text-paper-dark/60 mb-1">时</div>
                  <div className="text-xl text-gold font-number">{almanac.ganZhi.hour}</div>
                </div>
              </div>
            </div>

            {/* Yi / Ji */}
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-center mb-2">
                    <span className="text-xs text-gold/80 tracking-wider">宜</span>
                  </div>
                  <div className="space-y-1">
                    {(almanac.yi.length > 0 ? almanac.yi : ['诸事不宜']).map((item, i) => (
                      <div key={i} className="text-sm text-paper-dark/85 text-center">{item}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-center mb-2">
                    <span className="text-xs text-gold/80 tracking-wider">忌</span>
                  </div>
                  <div className="space-y-1">
                    {(almanac.ji.length > 0 ? almanac.ji : ['诸事不宜']).map((item, i) => (
                      <div key={i} className="text-sm text-paper-dark/85 text-center">{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chong */}
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
              <div className="text-center">
                <span className="text-xs text-gold/80 tracking-wider">冲煞</span>
                <div className="mt-2 text-sm text-paper-dark/85">
                  {almanac.chong || '无'}
                </div>
              </div>
            </div>

            {/* 十二时辰 */}
            <div className="rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm">
              <div className="text-center mb-3">
                <span className="text-xs text-gold/80 tracking-wider">十二时辰</span>
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
                  const isCurrent = nowHour >= parseInt(shichen.time.split(':')[0]) &&
                                    nowHour < parseInt(shichen.time.split('-')[0].split(':')[1] || '24');
                  return (
                    <div
                      key={i}
                      className={`rounded-md border p-2 text-center text-xs ${
                        isCurrent
                          ? 'border-gold/40 bg-gold/10 text-gold'
                          : 'border-gold/10 bg-xuan-surface/40 text-paper-dark/70'
                      }`}
                    >
                      <div className="text-gold">{shichen.name}</div>
                      <div className="text-[10px] text-paper-dark/50">{shichen.time}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}
      </main>

      <BottomNav active="almanac" />
    </div>
  );
}
