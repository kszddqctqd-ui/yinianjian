'use client';

import { useState, useEffect } from 'react';
import { t, getLocale } from '@/lib/i18n';
import type { SupportedLang } from '@/lib/i18n';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { GoldenLotusBg } from '@/components/GoldenLotusBg';
import { getRecords, deleteRecord, formatRelativeTime, clearRecords, type RecordEntry } from '@/lib/records';

function resolve(key: string): string {
  return t(key);
}

const TYPE_LABELS: Record<string, { labelKey: string; icon: string }> = {
  'bazi': { labelKey: 'profile.recordTypes.bazi', icon: '☯' },
  'lottery': { labelKey: 'profile.recordTypes.lottery', icon: '🏮' },
  'dream': { labelKey: 'profile.recordTypes.dream', icon: '📖' },
  'divination': { labelKey: 'profile.recordTypes.divination', icon: '🪙' },
  'naming': { labelKey: 'profile.recordTypes.naming', icon: '✍' },
  'palmistry': { labelKey: 'profile.recordTypes.palmistry', icon: '🤚' },
};

export default function RecordsPage() {
  const [lang, setLang] = useState<SupportedLang>(getLocale());
  const [records, setRecords] = useState<RecordEntry[]>(getRecords());
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setLang(getLocale());
    const handler = () => setLang(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const filtered = filter === 'all' ? records : records.filter(r => r.type === filter);
  const types = ['all', ...Object.keys(TYPE_LABELS)];

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setRecords(getRecords());
    if (expandedId === id) setExpandedId(null);
  };

  const handleClearAll = () => {
    if (confirm(resolve('records.clearConfirm'))) {
      clearRecords();
      setRecords([]);
    }
  };

  return (
    <div className="min-h-screen bg-xuan relative overflow-hidden">
      <GoldenLotusBg />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 pb-24">
          {/* Title */}
          <div className="pt-8 text-center space-y-3">
            <h1 className="text-[1.875rem] text-gold font-display tracking-[0.15em]">{resolve('records.title')}</h1>
            <p className="text-xs text-paper-dark/50">{resolve('records.count').replace('{count}', records.length.toString())}</p>
          </div>

          {/* Tabs */}
          <div className="mt-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`flex-shrink-0 rounded-full border px-4 py-1.5 text-sm transition-all ${
                  filter === t
                    ? 'border-gold/60 bg-gold/10 text-gold'
                    : 'border-gold/20 text-on-dark-muted hover:text-gold'
                }`}
              >
                {t === 'all' ? resolve('profile.all') : TYPE_LABELS[t]?.icon + ' ' + resolve(TYPE_LABELS[t]?.labelKey)}
              </button>
            ))}
          </div>

          {/* Clear all */}
          {records.length > 0 && (
            <div className="mt-4 text-right">
              <button
                onClick={handleClearAll}
                className="text-xs text-paper-dark/40 hover:text-vermillion transition-colors"
              >
                {resolve('profile.clearAll')}
              </button>
            </div>
          )}

          {/* Record list */}
          {filtered.length === 0 ? (
            <div className="mt-12 text-center space-y-3">
              <div className="text-5xl opacity-30">📜</div>
              <p className="text-sm text-paper-dark/50">{resolve('records.noRecords')}</p>
              <p className="text-xs text-paper-dark/40">{resolve('records.useFeature')}</p>
            </div>
          ) : (
            <div className="mt-6 space-y-3">
              {filtered.map(record => (
                <div
                  key={record.id}
                  className="rounded-lg border border-gold/20 bg-xuan-card/95 overflow-hidden transition-all duration-300"
                >
                  {/* Summary row */}
                  <button
                    onClick={() => setExpandedId(expandedId === record.id ? null : record.id)}
                    className="w-full p-4 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-[1.25rem]">{TYPE_LABELS[record.type]?.icon || '📋'}</span>
                        <div>
                          <div className="text-sm text-gold">{resolve(TYPE_LABELS[record.type]?.labelKey) || record.type}</div>
                          <div className="text-xs text-on-dark-muted">{record.summary}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-on-dark-dim">{formatRelativeTime(record.timestamp)}</div>
                        <svg
                          className={`w-4 h-4 text-paper-dark/40 transition-transform ml-auto ${expandedId === record.id ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        >
                          <path d="m6 9 6 6 6-6" />
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded detail */}
                  {expandedId === record.id && (
                    <div className="border-t border-gold/10 p-4 space-y-3">
                      <pre className="text-xs text-on-dark-muted whitespace-pre-wrap break-all font-mono bg-xuan-surface/50 p-3 rounded-lg max-h-48 overflow-y-auto">
                        {JSON.stringify(record.data, null, 2)}
                      </pre>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(record.id); }}
                        className="text-xs text-vermillion/60 hover:text-vermillion transition-colors"
                      >
                        {resolve('profile.deleteRecord')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav active="more" />
    </div>
  );
}
