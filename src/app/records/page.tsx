'use client';

import { useState } from 'react';
import { Header } from '@/components/Header';
import { MusicToggleFloat } from '@/components/MusicToggle';
import { BottomNav } from '@/components/BottomNav';
import { FloatingParticles } from '@/components/FloatingParticles';
import { getRecords, deleteRecord, formatRelativeTime, clearRecords, type RecordEntry } from '@/lib/records';

const TYPE_LABELS: Record<string, { label: string; icon: string }> = {
  'bazi': { label: '八字', icon: '☯' },
  'lottery': { label: '灵签', icon: '🏮' },
  'dream': { label: '解梦', icon: '📖' },
  'divination': { label: '占卜', icon: '🪙' },
  'naming': { label: '起名', icon: '✍' },
  'palmistry': { label: '手相', icon: '🤚' },
};

export default function RecordsPage() {
  const [records, setRecords] = useState<RecordEntry[]>(getRecords());
  const [filter, setFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = filter === 'all' ? records : records.filter(r => r.type === filter);
  const types = ['all', ...Object.keys(TYPE_LABELS)];

  const handleDelete = (id: string) => {
    deleteRecord(id);
    setRecords(getRecords());
    if (expandedId === id) setExpandedId(null);
  };

  const handleClearAll = () => {
    if (confirm('确定要清空所有记录吗？此操作不可撤销。')) {
      clearRecords();
      setRecords([]);
    }
  };

  return (
    <div className="min-h-screen bg-deep relative overflow-hidden">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-xuan via-xuan-card to-xuan" />
      <div className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-[0.20]" style={{ backgroundImage: "url('/temple/temple-mountain.svg')" }} />
      <div className="pointer-events-none fixed inset-0 z-0" style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(10,6,4,0.55) 0%, rgba(10,6,4,0.35) 30%, transparent 60%, rgba(10,6,4,0.6) 100%)' }} />
      <FloatingParticles />
      <Header />
      <MusicToggleFloat />

      <main className="relative z-10 mx-auto min-h-[calc(100vh-3.5rem)] w-full pt-14 pb-24 md:pb-8">
        <div className="mx-auto max-w-4xl px-4 pb-24">
          {/* Title */}
          <div className="pt-8 text-center space-y-3">
            <h1 className="text-3xl text-gold font-display tracking-[0.15em]">我的记录</h1>
            <p className="text-xs text-paper-dark/50">共 {records.length} 条记录</p>
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
                {t === 'all' ? '全部' : TYPE_LABELS[t]?.icon + ' ' + TYPE_LABELS[t]?.label}
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
                清空所有记录
              </button>
            </div>
          )}

          {/* Record list */}
          {filtered.length === 0 ? (
            <div className="mt-12 text-center space-y-3">
              <div className="text-5xl opacity-30">📜</div>
              <p className="text-sm text-paper-dark/50">暂无记录</p>
              <p className="text-xs text-paper-dark/40">使用八字、灵签等功能后将自动保存记录</p>
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
                        <span className="text-xl">{TYPE_LABELS[record.type]?.icon || '📋'}</span>
                        <div>
                          <div className="text-sm text-gold">{TYPE_LABELS[record.type]?.label || record.type}</div>
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
                        删除此记录
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav active="profile" />
    </div>
  );
}
