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

export default function NamingPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const [formData, setFormData] = useState({
    surname: '',
    gender: '男' as '男' | '女',
    birthYear: 2024,
    birthMonth: 7,
    birthDay: 1,
    nameLength: 2,
    style: resolve('naming.styles.0'),
    generation: '',
    taboo: '',
  });
  const [results, setResults] = useState<NameSuggestion[]>([]);
  const [generating, setGenerating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const styleKeys = ['naming.styles.0', 'naming.styles.1', 'naming.styles.2', 'naming.styles.3', 'naming.styles.4', 'naming.styles.5'];
  const styles = styleKeys.map(s => resolve(s));

  const handleSubmit = () => {
    if (!formData.surname.trim()) {
      alert(resolve('naming.alert.enterSurname'));
      return;
    }
    setGenerating(true);
    setShowResult(false);

    setTimeout(() => {
      let wuXingCount: Record<string, number> = {
        '金': 0,
        '木': 0,
        '水': 0,
        '火': 0,
        '土': 0,
      };
      try {
        const bazi = calculateBaZi(formData.birthYear, formData.birthMonth, formData.birthDay, 12);
        wuXingCount = bazi.wuXingCount;
      } catch {
        // Use default if calculation fails
      }

      const suggestions = generateNames(
        formData.surname,
        wuXingCount,
        formData.style,
        formData.nameLength,
      );
      setResults(suggestions);
      setGenerating(false);
      setShowResult(true);

      if (suggestions.length > 0) {
        saveRecord('naming', {
          surname: formData.surname,
          gender: formData.gender,
          birth: `${formData.birthYear}-${formData.birthMonth}-${formData.birthDay}`,
          style: formData.style,
          suggestions,
        }, `为${formData.surname}宝宝起名 (${formData.style})`);
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
                  value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value })}
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
                    onClick={() => setFormData({ ...formData, gender: '男' })}
                    className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${
                      formData.gender === '男'
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    {resolve('bazi.form.male')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: '女' })}
                    className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${
                      formData.gender === '女'
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    {resolve('bazi.form.female')}
                  </button>
                </div>
              </label>

              {/* Birth info */}
              <div className="grid grid-cols-3 gap-3">
                <label className="block space-y-1">
                  <span className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>{resolve('naming.form.year')}</span>
                  <input
                    type="number"
                    value={formData.birthYear}
                    onChange={(e) => setFormData({ ...formData, birthYear: parseInt(e.target.value) || 2024 })}
                    min={1900} max={2100}
                    className="input-standard h-12 w-full px-3 text-base"
                    style={{ color: '#D4C5A9' }}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>{resolve('naming.form.month')}</span>
                  <input
                    type="number"
                    value={formData.birthMonth}
                    onChange={(e) => setFormData({ ...formData, birthMonth: Math.min(12, Math.max(1, parseInt(e.target.value) || 5)) })}
                    min={1} max={12}
                    className="input-standard h-12 w-full px-3 text-base"
                    style={{ color: '#D4C5A9' }}
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-xs" style={{ color: 'rgba(212,197,169,0.65)' }}>{resolve('naming.form.day')}</span>
                  <input
                    type="number"
                    value={formData.birthDay}
                    onChange={(e) => setFormData({ ...formData, birthDay: Math.min(31, Math.max(1, parseInt(e.target.value) || 15)) })}
                    min={1} max={31}
                    className="input-standard h-12 w-full px-3 text-base"
                    style={{ color: '#D4C5A9' }}
                  />
                </label>
              </div>

              {/* Name length */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('naming.form.nameLength')}</span>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nameLength: 1 })}
                    className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${
                      formData.nameLength === 1
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    {resolve('naming.form.singleChar')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, nameLength: 2 })}
                    className={`flex-1 h-12 rounded-md border px-3 text-base transition-all ${
                      formData.nameLength === 2
                        ? 'border-gold/60 bg-gold/10 text-gold'
                        : 'border-gold/20 bg-xuan-surface/40 text-paper-dark hover:border-gold/40'
                    }`}
                  >
                    {resolve('naming.form.doubleChar')}
                  </button>
                </div>
              </label>

              {/* Style */}
              <label className="block space-y-2">
                <span className="text-base" style={{ color: '#D4C5A9' }}>{resolve('naming.form.style')}</span>
                <div className="grid grid-cols-3 gap-2">
                  {styles.map((s, idx) => (
                    <button
                      key={styleKeys[idx]}
                      type="button"
                      onClick={() => setFormData({ ...formData, style: s })}
                      className={`rounded-md border p-2 text-xs transition-all ${
                        formData.style === s
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
                  value={formData.generation}
                  onChange={(e) => setFormData({ ...formData, generation: e.target.value })}
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
                  value={formData.taboo}
                  onChange={(e) => setFormData({ ...formData, taboo: e.target.value })}
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
                disabled={generating || !formData.surname.trim()}
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
                        {formData.generation && <span className="rounded-full border border-vermillion/25 px-2 py-0.5 text-xs text-vermillion">{resolve('naming.generationChar')}{formData.generation}</span>}
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
        </div>
      </main>

      <BottomNav active="naming" />
    </div>
  );
}
