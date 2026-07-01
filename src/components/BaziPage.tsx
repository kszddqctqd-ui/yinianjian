'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { calculateBaZi, type BaZiResult } from '@/lib/bazi';
import { ZhuPan } from './ZhuPan';
import { WuXingChart } from './WuXingChart';
import { MingLiAnalysis } from './MingLiAnalysis';
import { MusicToggle, MusicToggleFloat } from './MusicToggle';
import { BottomNav } from './BottomNav';
import { Header } from './Header';
import { MasterSelector } from './MasterSelector';
import { ShareButton } from './ShareButton';
import { FloatingParticles } from './FloatingParticles';
import { saveRecord } from '@/lib/records';

type Gender = '男' | '女';

const MIN_YEAR = 1900;
const MAX_YEAR = 2100;
const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS_MAP: Record<number, number[]> = {};
for (let m = 1; m <= 12; m++) {
  DAYS_MAP[m] = Array.from({ length: new Date(2024, m, 0).getDate() }, (_, i) => i + 1);
}
const SHICHEN_OPTIONS = [
  { label: '子时 (23:00-01:00)', value: 'zi' },
  { label: '丑时 (01:00-03:00)', value: 'chou' },
  { label: '寅时 (03:00-05:00)', value: 'yin' },
  { label: '卯时 (05:00-07:00)', value: 'mao' },
  { label: '辰时 (07:00-09:00)', value: 'chen' },
  { label: '巳时 (09:00-11:00)', value: 'si' },
  { label: '午时 (11:00-13:00)', value: 'wu' },
  { label: '未时 (13:00-15:00)', value: 'wei' },
  { label: '申时 (15:00-17:00)', value: 'shen' },
  { label: '酉时 (17:00-19:00)', value: 'you' },
  { label: '戌时 (19:00-21:00)', value: 'xu' },
  { label: '亥时 (21:00-23:00)', value: 'hai' },
];

export function BaziPage() {
  const [year, setYear] = useState(1990);
  const [month, setMonth] = useState(5);
  const [day, setDay] = useState(15);
  const [shichen, setShichen] = useState('wei');
  const [gender, setGender] = useState<Gender>('男');
  const [selectedMaster, setSelectedMaster] = useState<number | null>(0);
  const [result, setResult] = useState<BaZiResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState<'公历' | '农历'>('公历');
  const resultRef = useRef<HTMLDivElement>(null);

  const maxDay = DAYS_MAP[month]?.length ?? 31;

  useEffect(() => {
    if (day > maxDay) setDay(maxDay);
  }, [month, day, maxDay]);

  useEffect(() => {
    if (showResult && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [showResult]);

  const handleCalculate = useCallback(() => {
    if (selectedMaster === null) {
      alert('请选择一位师父为您开示');
      return;
    }
    // Convert shichen label to hour
    const shichenHour = SHICHEN_OPTIONS.find(s => s.value === shichen)?.label.split('(')[1]?.replace(')', '').split('-')[0] || '0';
    const hour = parseInt(shichenHour) || 0;
    setLoading(true);
    setTimeout(() => {
      const res = calculateBaZi(year, month, day, hour);
      setResult(res);
      setShowResult(true);
      setLoading(false);
      saveRecord('bazi', {
        year, month, day, shichen, gender,
        riZhu: res.riZhu,
        wuXingCount: res.wuXingCount,
      }, `八字：${res.riZhu} (${year}年${month}月${day}日)`);
    }, 400);
  }, [year, month, day, shichen, selectedMaster]);

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

      {/* Floating earn button */}
      <button
        type="button"
        className="fixed right-3 z-40 flex size-10 items-center justify-center rounded-full border border-gold/50 bg-gradient-to-br from-gold/35 via-gold/20 to-vermillion/20 text-gold shadow-lg shadow-gold/20 backdrop-blur-md hover:from-gold/45 hover:to-vermillion/30 bottom-[calc(env(safe-area-inset-bottom)+88px)] md:right-4 md:bottom-4 md:size-14"
        aria-label="赚钱 / 开分站"
        title="赚钱 / 开分站"
      >
        <span className="font-display text-[18px] text-gold drop-shadow-[0_0_10px_rgba(201,162,39,0.35)] md:text-[24px]">赚</span>
      </button>

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-5xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center section-enter">
            <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full border border-gold/20 bg-gold/5 hover-scale hover-lift">
              <svg className="size-8 text-gold" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="M 8 12 C 8 8 12 4 12 4 C 12 4 16 8 16 12" />
                <path d="M 6 16 L 18 16" />
                <path d="M 7 10 L 17 10" />
                <path d="M 12 4 L 12 20" />
              </svg>
            </div>
            <h1 className="text-4xl text-gold">八字精批</h1>
            <p className="text-base text-on-dark-muted">
              输入生辰，真排盘、看格局、看大运、看建议，先把命盘根基看清，再往后看流年节奏。
            </p>
          </section>

          {/* Master Selector */}
          <div className="section-enter">
            <MasterSelector selected={selectedMaster} onSelect={setSelectedMaster} />
          </div>

          {/* Input Card */}
          <div className="transition-smooth rounded-lg border border-gold/20 bg-xuan-card/95 p-card-pad shadow-paper backdrop-blur-sm hover:border-gold/30 hover:shadow-card space-y-5 section-enter">
            {/* Year/Month/Day */}
            <div className="space-y-4 animate-stagger">
              <div className="grid gap-3 md:grid-cols-3">
                <DatePicker
                  label="出生年"
                  value={year}
                  min={MIN_YEAR}
                  max={MAX_YEAR}
                  onChange={setYear}
                  ariaLabel="减少出生年"
                  ariaLabelInc="增加出生年"
                />
                <DatePicker
                  label="出生月"
                  value={month}
                  min={1}
                  max={12}
                  onChange={setMonth}
                  ariaLabel="减少出生月"
                  ariaLabelInc="增加出生月"
                />
                <DatePicker
                  label="出生日"
                  value={day}
                  min={1}
                  max={maxDay}
                  onChange={setDay}
                  ariaLabel="减少出生日"
                  ariaLabelInc="增加出生日"
                />
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <label className="space-y-2">
                  <span className="text-label">出生时辰</span>
                  <select
                    value={shichen}
                    onChange={(e) => setShichen(e.target.value)}
                    className="h-16 w-full rounded-xl border border-gold/30 bg-xuan-surface px-4 text-lg text-paper-dark focus:border-gold focus:outline-none transition-smooth"
                  >
                    {SHICHEN_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </label>
                <div className="space-y-2">
                  <p className="text-label">性别</p>
                  <div className="flex h-16 items-stretch overflow-hidden rounded-xl border border-gold/30 bg-xuan-surface transition-smooth">
                    <button
                      type="button"
                      onClick={() => setGender('男')}
                      className="flex flex-1 items-center justify-center text-lg transition-smooth bg-gold/15 text-gold"
                    >
                      男
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('女')}
                      className="flex flex-1 items-center justify-center text-lg transition-smooth text-paper-dark hover:bg-gold/5"
                    >
                      女
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-gold/12 bg-xuan-surface/30 px-4 py-3 text-small leading-relaxed text-on-dark-muted transition-smooth hover:bg-xuan-surface/50">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full border border-gold/20 bg-gold/10">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check size-3.5 text-gold" aria-hidden="true">
                    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
                    <path d="m9 12 2 2 4-4"></path>
                  </svg>
                </div>
                <div className="space-y-1.5">
                  <p className="text-on-dark">
                    点击<span className="mx-1 text-gold">"开始真排盘"</span>即表示您已阅读并同意
                    <a className="mx-1 text-gold transition-smooth-fast hover:text-gold-light" href="/terms/">《用户协议》</a>
                    <a className="mr-1 text-gold transition-smooth-fast hover:text-gold-light" href="/privacy/">《隐私说明》</a>
                    与
                    <a className="ml-1 text-gold transition-smooth-fast hover:text-gold-light" href="/ai-notice/">《AI 生成说明》</a>
                    ，并同意我们按说明处理您主动提交的生辰信息。
                  </p>
                  <p className="text-on-dark-muted">
                    仅作传统文化参考，请结合现实情况判断；未满18周岁请勿使用本服务，请勿提交他人的照片、生辰或其他信息。
                  </p>
                </div>
              </div>
            </div>

            {/* Calculate button */}
            <div className="flex justify-center section-enter">
              <button
                type="button"
                onClick={handleCalculate}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 font-body font-medium transition-smooth focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold/40 disabled:cursor-not-allowed disabled:opacity-50 min-w-[180px] rounded-lg bg-vermillion tracking-wider text-white shadow-lg shadow-vermillion/20 hover:bg-vermillion-light active:bg-vermillion-dark h-12 px-8 text-lg hover-lift"
                tabIndex={0}
              >
                <span className="contents">{loading ? '排盘中...' : '开始真排盘'}</span>
              </button>
            </div>
            <p className="text-center text-tiny text-on-dark-dim">仅作传统文化参考，请结合现实情况判断</p>
          </div>

          {/* Result */}
          {showResult && result && (
            <div ref={resultRef} className="space-y-5">
              <div className="section-enter"><ZhuPan result={result} gender={gender} /></div>
              <div className="section-enter" style={{ animationDelay: '100ms' }}><WuXingChart wuXingCount={result.wuXingCount} /></div>
              <div className="section-enter" style={{ animationDelay: '200ms' }}><MingLiAnalysis result={result} gender={gender} /></div>
              <div className="section-enter" style={{ animationDelay: '300ms' }}><ShareButton /></div>
            </div>
          )}
        </div>
      </main>

      <BottomNav active="bazi" />
    </div>
  );
}

function DatePicker({
  label, value, min, max, onChange, ariaLabel, ariaLabelInc,
}: {
  label: string; value: number; min: number; max: number; onChange: (v: number) => void; ariaLabel: string; ariaLabelInc: string;
}) {
  const displaySuffix = label === '出生年' ? '年' : label === '出生月' ? '月' : '日';
  return (
    <div className="relative space-y-2">
      <p className="text-label">{label}</p>
      <div className="relative flex h-16 items-stretch overflow-visible rounded-xl border border-gold/30 bg-xuan-surface">
        <button
          type="button"
          aria-label={ariaLabel}
          onClick={() => onChange(Math.max(min, value - 1))}
          className="flex w-12 items-center justify-center text-on-dark-muted hover:bg-gold/10 active:bg-gold/15 disabled:opacity-30 transition-smooth-fast"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-down size-5" aria-hidden="true">
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="点击选择"
          className="flex flex-1 flex-col items-center justify-center transition-smooth hover:bg-gold/5 active:bg-gold/10"
        >
          <span className="font-number text-2xl text-gold">{value}{displaySuffix}</span>
          <span className="text-tiny text-on-dark-dim">点击选择</span>
        </button>
        <button
          type="button"
          aria-label={ariaLabelInc}
          onClick={() => onChange(Math.min(max, value + 1))}
          className="flex w-12 items-center justify-center text-on-dark-muted hover:bg-gold/10 active:bg-gold/15 disabled:opacity-30 transition-smooth-fast"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-up size-5" aria-hidden="true">
            <path d="m18 15-6-6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
