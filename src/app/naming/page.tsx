'use client';

import { useState, useEffect } from 'react';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { calculateBaZi, TIAN_GAN_WUXING } from '@/lib/bazi';
import { generateNames, getFavorableElements, type NameSuggestion } from '@/lib/names';
import { saveRecord } from '@/lib/records';

function resolve(key: string): string {
  return t(key);
}

const SHICHEN_LABELS = [
  { label: '子时', time: '23:00-01:00', hour: 0 },
  { label: '丑时', time: '01:00-03:00', hour: 1 },
  { label: '寅时', time: '03:00-05:00', hour: 2 },
  { label: '卯时', time: '05:00-07:00', hour: 3 },
  { label: '辰时', time: '07:00-09:00', hour: 4 },
  { label: '巳时', time: '09:00-11:00', hour: 5 },
  { label: '午时', time: '11:00-13:00', hour: 6 },
  { label: '未时', time: '13:00-15:00', hour: 7 },
  { label: '申时', time: '15:00-17:00', hour: 8 },
  { label: '酉时', time: '17:00-19:00', hour: 9 },
  { label: '戌时', time: '19:00-21:00', hour: 10 },
  { label: '亥时', time: '21:00-23:00', hour: 11 },
];

export default function NamingPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const [surname, setSurname] = useState('');
  const [gender, setGender] = useState<'男' | '女'>('男');
  const [birthYear, setBirthYear] = useState(2024);
  const [birthMonth, setBirthMonth] = useState(7);
  const [birthDay, setBirthDay] = useState(1);
  const [birthHour, setBirthHour] = useState(7); // 未时 default
  const [nameTotalLen, setNameTotalLen] = useState(3); // 3=双字名(姓+2), 2=单字名(姓+1)
  const [style, setStyle] = useState('诗意');
  const [generation, setGeneration] = useState('');
  const [taboo, setTaboo] = useState('');
  const [results, setResults] = useState<NameSuggestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const styles = ['诗意', '刚毅', '儒雅', '清逸', '典雅', '温润'];

  const handleSubmit = () => {
    if (!surname.trim()) {
      alert(resolve('naming.alert.enterSurname'));
      return;
    }
    setGenerating(true);
    setShowResult(false);

    setTimeout(() => {
      let wuXingCount: Record<string, number> = { '金': 0, '木': 0, '水': 0, '火': 0, '土': 0 };
      try {
        const bazi = calculateBaZi(birthYear, birthMonth, birthDay, birthHour);
        wuXingCount = bazi.wuXingCount;
      } catch { /* ignore */ }

      const nameLen = nameTotalLen === 2 ? 1 : 2; // 2字=单字名, 3字=双字名
      const suggestions = generateNames(surname, wuXingCount, style, nameLen);
      setResults(suggestions);
      setGenerating(false);
      setShowResult(true);

      if (suggestions.length > 0) {
        saveRecord('naming', {
          surname, gender,
          birth: `${birthYear}-${birthMonth}-${birthDay}`,
          hour: SHICHEN_LABELS[birthHour]?.label || '',
          style,
          suggestions,
        }, `为${surname}宝宝起名 (${style})`);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl space-y-section px-4 pb-24">
          {/* Title */}
          <section className="space-y-3 pt-8 text-center">
            <div className="mx-auto mb-2 flex size-[3.1875rem] items-center justify-center rounded-full border border-gold/20 bg-gold/5">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-book-open size-[2.25rem] text-gold" aria-hidden="true">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              </svg>
            </div>
            <h1 className="font-display text-4xl tracking-widest" style={{ color: '#C9A96E' }}>{resolve('naming.title')}</h1>
            <p className="text-base" style={{ color: '#D4C5A9' }}>
              {resolve('naming.subtitle')}
            </p>
          </section>

          {/* Form */}
          <div>
            <div className="card-standard space-y-6">
              {/* Surname */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('naming.form.surname')}</span>
                <input
                  type="text"
                  value={surname}
                  onChange={(e) => setSurname(e.target.value)}
                  placeholder={resolve('naming.form.surname.placeholder')}
                  maxLength={4}
                  className="input-standard h-12 w-full px-3 text-base"
                  style={{ color: '#D4C5A9' }}
                />
              </label>

              {/* Gender */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('naming.form.gender')}</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setGender('男')}
                    className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${
                      gender === '男'
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    {resolve('bazi.form.male')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setGender('女')}
                    className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${
                      gender === '女'
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    {resolve('bazi.form.female')}
                  </button>
                </div>
              </label>

              {/* Birth info */}
              <div className="grid grid-cols-4 gap-3">
                <label className="block space-y-1">
                  <span className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>{resolve('naming.form.year')}</span>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(parseInt(e.target.value) || 2024)}
                    min={1900} max={2100}
                    className="input-standard h-12 w-full px-3 text-base"
                    style={{ color: '#D4C5A9' }}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>{resolve('naming.form.month')}</span>
                  <input
                    type="number"
                    value={birthMonth}
                    onChange={(e) => setBirthMonth(Math.min(12, Math.max(1, parseInt(e.target.value) || 7)))}
                    min={1} max={12}
                    className="input-standard h-12 w-full px-3 text-base"
                    style={{ color: '#D4C5A9' }}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>{resolve('naming.form.day')}</span>
                  <input
                    type="number"
                    value={birthDay}
                    onChange={(e) => setBirthDay(Math.min(31, Math.max(1, parseInt(e.target.value) || 1)))}
                    min={1} max={31}
                    className="input-standard h-12 w-full px-3 text-base"
                    style={{ color: '#D4C5A9' }}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>{resolve('naming.form.hour')}</span>
                  <select
                    value={birthHour}
                    onChange={(e) => setBirthHour(parseInt(e.target.value))}
                    className="input-standard h-12 w-full px-3 text-base appearance-none"
                    style={{ color: '#D4C5A9' }}
                  >
                    {SHICHEN_LABELS.map((s, i) => (
                      <option key={i} value={i}>{s.label} ({s.time})</option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Name length — 对齐菩提苑: 2字=单字名, 3字=双字名 */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('naming.form.nameLength')}</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setNameTotalLen(2)}
                    className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${
                      nameTotalLen === 2
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    {resolve('naming.form.twoChars')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNameTotalLen(3)}
                    className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${
                      nameTotalLen === 3
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    {resolve('naming.form.threeChars')}
                  </button>
                </div>
              </label>

              {/* Style */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('naming.form.style')}</span>
                <div className="grid grid-cols-3 gap-2">
                  {styles.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStyle(s)}
                      className={`rounded-md border p-2 text-xs transition-all ${
                        style === s
                          ? 'border-gold/60 bg-gold/10 text-gold'
                          : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </label>

              {/* Generation name */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('naming.form.generation')}</span>
                <input
                  type="text"
                  value={generation}
                  onChange={(e) => setGeneration(e.target.value)}
                  placeholder={resolve('naming.form.generation.placeholder')}
                  maxLength={2}
                  className="input-standard h-12 w-full px-3 text-base"
                  style={{ color: '#D4C5A9' }}
                />
              </label>

              {/* Taboo characters */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('naming.form.taboo')}</span>
                <input
                  type="text"
                  value={taboo}
                  onChange={(e) => setTaboo(e.target.value)}
                  placeholder={resolve('naming.form.taboo.placeholder')}
                  maxLength={50}
                  className="input-standard h-12 w-full px-3 text-base"
                  style={{ color: '#D4C5A9' }}
                />
              </label>

              {/* Submit */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={generating || !surname.trim()}
                className="btn-primary w-full"
              >
                {generating ? resolve('naming.generating') : resolve('naming.btn.generate')}
              </button>
            </div>
          </div>

          {/* Results */}
          {showResult && results.length > 0 && (
            <div className="space-y-3">
              <div className="text-center">
                <span className="text-xs text-gold-80 tracking-wider">{resolve('naming.results')}</span>
              </div>
              {results.map((r, i) => (
                <div key={i} className="card-standard">
                  <div className="flex items-start gap-4">
                    <div className="text-[1.875rem] text-gold font-display font-bold">{r.fullName}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex gap-2 flex-wrap">
                        <span className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold-80">{r.element}{resolve('naming.elementSuffix')}</span>
                        <span className="rounded-full border border-gold/25 px-2 py-0.5 text-xs text-gold-80">{r.style}</span>
                        {generation && <span className="rounded-full border border-vermillion/25 px-2 py-0.5 text-xs text-vermillion">{resolve('naming.generationChar')}{generation}</span>}
                      </div>
                      <p className="text-sm" style={{ color: '#D4C5A9' }}>{r.meaning}</p>
                      {r.source && <p className="text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('naming.sourceLabel')}{r.source}</p>}
                    </div>
                  </div>
                </div>
              ))}
              <p className="text-center text-xs" style={{ color: 'rgba(212,197,169,0.5)' }}>{resolve('naming.resultNote')}</p>
            </div>
          )}

          {showResult && results.length === 0 && (
            <div className="card-standard text-center space-y-2">
              <p className="text-sm" style={{ color: '#D4C5A9' }}>{resolve('naming.noResult')}</p>
            </div>
          )}

          {/* Footer links */}
          <div className="flex justify-center gap-3 text-xs mt-8" style={{ color: 'rgba(212,197,169,0.5)' }}>
            <a href="/terms/" className="hover:text-gold">{resolve('footer.terms')}</a>
            <a href="/privacy/" className="hover:text-gold">{resolve('footer.privacy')}</a>
            <a href="/ai-notice/" className="hover:text-gold">{resolve('footer.aiNotice')}</a>
          </div>
        </div>
      </main>

      <BottomNav active="naming" />
    </div>
  );
}
