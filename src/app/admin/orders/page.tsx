'use client';

import { useState, useEffect } from 'react';
import { t, getLocale } from '@/lib/i18n';

interface PaymentRecord {
  id: string;
  name: string;
  type: string;
  typeName: string;
  amount: number;
  status: 'pending' | 'confirmed';
  createdAt: string;
}

const ADMIN_PASSWORD = 'admin123';

const SERVICE_OPTIONS = [
  { value: 'qifu', labelKey: 'admin.serviceTypes.qifu', defaultPrice: 6.6 },
  { value: 'palmistry', labelKey: 'admin.serviceTypes.palmistry', defaultPrice: 9.9 },
];

export default function OrdersPage() {
  const [locale, setLocale] = useState(getLocale());
  const [records, setRecords] = useState<PaymentRecord[]>([]);
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitName, setSubmitName] = useState('');
  const [submitType, setSubmitType] = useState<'qifu' | 'palmistry'>('qifu');
  const [submitAmount, setSubmitAmount] = useState('6.6');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadRecords();
    const handler = () => setLocale(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const resolve = (key: string): string => t(key);

  const loadRecords = () => {
    const saved = localStorage.getItem('yinianjian_payments');
    if (saved) setRecords(JSON.parse(saved));
  };

  const saveRecords = (newRecords: PaymentRecord[]) => {
    localStorage.setItem('yinianjian_payments', JSON.stringify(newRecords));
    setRecords(newRecords);
  };

  const handleSubmitPayment = () => {
    if (!submitName.trim()) { alert(resolve('admin.enterName')); return; }
    const svc = SERVICE_OPTIONS.find(o => o.value === submitType)!;
    const newRecord: PaymentRecord = {
      id: Date.now().toString(),
      name: submitName,
      type: submitType,
      typeName: resolve(svc.labelKey),
      amount: parseFloat(submitAmount) || svc.defaultPrice,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    saveRecords([...records, newRecord]);
    setSubmitName('');
    setShowSubmit(false);
  };

  const handleConfirm = (id: string) => {
    saveRecords(records.map(r => r.id === id ? { ...r, status: 'confirmed' } : r));
  };

  const handleDelete = (id: string) => {
    if (!confirm(resolve('admin.confirmDelete'))) return;
    saveRecords(records.filter(r => r.id !== id));
  };

  const handleClearAll = () => {
    if (!confirm(resolve('admin.confirmClearAll'))) return;
    saveRecords([]);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(records, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `yinianjian_payments_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const pendingCount = records.filter(r => r.status === 'pending').length;
  const confirmedCount = records.filter(r => r.status === 'confirmed').length;
  const totalIncome = records.filter(r => r.status === 'confirmed').reduce((s, r) => s + r.amount, 0);

  const filteredRecords = records.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.typeName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-yellow-500/20 bg-[#1a1510]/80 p-4 text-center">
          <div className="text-2xl font-display text-yellow-400">{pendingCount}</div>
          <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{resolve('admin.pending')}</div>
        </div>
        <div className="rounded-xl border border-green-500/20 bg-[#1a1510]/80 p-4 text-center">
          <div className="text-2xl font-display text-green-400">{confirmedCount}</div>
          <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{resolve('admin.confirmed')}</div>
        </div>
        <div className="rounded-xl border border-gold/20 bg-[#1a1510]/80 p-4 text-center">
          <div className="text-2xl font-display" style={{ color: '#f5e6b8' }}>¥{totalIncome.toFixed(1)}</div>
          <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{resolve('admin.totalIncome')}</div>
        </div>
        <div className="rounded-xl border border-blue-500/20 bg-[#1a1510]/80 p-4 text-center">
          <div className="text-2xl font-display" style={{ color: '#5ba3d6' }}>{filteredRecords.length}</div>
          <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{resolve('admin.paymentRecords')}</div>
        </div>
      </div>

      {/* Search & Filter */}
      {records.length > 0 && (
        <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4 space-y-3">
          <div className="flex gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={resolve('admin.search')}
              className="admin-input flex-1"
            />
            <button onClick={handleExport} className="admin-btn secondary whitespace-nowrap">
              {resolve('admin.export')} JSON
            </button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="admin-input">
              <option value="all">全部服务</option>
              {SERVICE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{resolve(opt.labelKey)}</option>
              ))}
            </select>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="admin-input">
              <option value="all">全部状态</option>
              <option value="pending">{resolve('admin.pending')}</option>
              <option value="confirmed">{resolve('admin.confirmed')}</option>
            </select>
            {(searchQuery || filterType !== 'all' || filterStatus !== 'all') && (
              <button onClick={() => { setSearchQuery(''); setFilterType('all'); setFilterStatus('all'); }} className="admin-btn danger">
                重置筛选
              </button>
            )}
          </div>
        </div>
      )}

      {/* Submit Payment Modal */}
      {showSubmit && (
        <div className="admin-modal-overlay" onClick={() => setShowSubmit(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.submitPaymentTitle')}</h3>
            <div>
              <label className="text-sm" style={{ color: '#dfc59f' }}>{resolve('admin.name')}</label>
              <input type="text" value={submitName} onChange={(e) => setSubmitName(e.target.value)} className="admin-input mt-1" placeholder={resolve('admin.namePlaceholder')} />
            </div>
            <div>
              <label className="text-sm" style={{ color: '#dfc59f' }}>{resolve('admin.service')}</label>
              <select value={submitType} onChange={(e) => { setSubmitType(e.target.value as 'qifu' | 'palmistry'); const opt = SERVICE_OPTIONS.find(o => o.value === e.target.value); if (opt) setSubmitAmount(opt.defaultPrice.toFixed(1)); }} className="admin-input mt-1">
                {SERVICE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{resolve(opt.labelKey)} (¥{opt.defaultPrice}起)</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm" style={{ color: '#dfc59f' }}>{resolve('admin.amount')}</label>
              <input type="number" step="0.1" value={submitAmount} onChange={(e) => setSubmitAmount(e.target.value)} className="admin-input mt-1" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowSubmit(false)} className="admin-btn secondary flex-1">{resolve('common.cancel')}</button>
              <button onClick={handleSubmitPayment} className="admin-btn primary flex-1">{resolve('common.submit')}</button>
            </div>
          </div>
        </div>
      )}

      {/* Records List */}
      <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.paymentRecords')}</h2>
          {records.length > 0 && (
            <button onClick={handleClearAll} className="text-xs text-red-400 hover:text-red-300 transition-colors">{resolve('admin.clearAll')}</button>
          )}
        </div>
        {filteredRecords.length === 0 ? (
          <p className="text-sm text-center py-12" style={{ color: '#dfc59f/60' }}>
            {records.length === 0 ? resolve('admin.noRecords') : resolve('admin.noResults')}
          </p>
        ) : (
          <div className="space-y-3">
            {filteredRecords.map(record => (
              <div key={record.id} className="rounded-lg border border-[#c9a05c]/15 bg-[#252018]/60 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium truncate" style={{ color: '#f5e6b8' }}>{record.name}</span>
                    <span className={`admin-badge ${record.status === 'pending' ? 'yellow' : 'green'}`}>
                      {record.status === 'pending' ? resolve('admin.pending') : resolve('admin.confirmed')}
                    </span>
                  </div>
                  <div className="text-xs flex flex-wrap items-center gap-x-2" style={{ color: '#dfc59f/60' }}>
                    <span>{record.typeName}</span>
                    <span>·</span>
                    <span className="text-gold font-medium">¥{record.amount.toFixed(1)}</span>
                    <span>·</span>
                    <span>{new Date(record.createdAt).toLocaleDateString(locale === 'zh-CN' ? 'zh-CN' : 'en-US')}</span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {record.status === 'pending' && (
                    <button onClick={() => handleConfirm(record.id)} className="admin-btn primary">{resolve('admin.confirm')}</button>
                  )}
                  <button onClick={() => handleDelete(record.id)} className="admin-btn danger">{resolve('common.delete')}</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
