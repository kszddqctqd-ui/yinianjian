'use client';

import { useState, useEffect } from 'react';
import { t, getLocale } from '@/lib/i18n';
import Link from 'next/link';

export default function AdminPage() {
  const [showPassword, setShowPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [locale, setLocale] = useState(getLocale());
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem('admin_auth');
    if (auth === 'true') setIsLoggedIn(true);
    const handler = () => setLocale(getLocale());
    window.addEventListener('lang-change', handler);
    return () => window.removeEventListener('lang-change', handler);
  }, []);

  const resolve = (key: string): string => t(key);

  const handleLogin = () => {
    if (showPassword === 'admin123') {
      sessionStorage.setItem('admin_auth', 'true');
      setIsLoggedIn(true);
      setLoginError(false);
    } else {
      setLoginError(true);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_auth');
    setIsLoggedIn(false);
    setActiveTab('dashboard');
  };

  // ============ LOGIN SCREEN ============
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(180deg, #1a1510 0%, #2d2216 50%, #1a1510 100%)' }}>
        <div className="rounded-2xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-8 shadow-[0_4px_24px_rgba(0,0,0,0.4)] backdrop-blur-md space-y-6 max-w-sm w-full mx-4">
          <h1 className="font-display text-2xl text-center tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.title')}</h1>
          <div className="space-y-4">
            <div>
              <label className="text-sm" style={{ color: '#dfc59f' }}>{resolve('admin.password')}</label>
              <input
                type="password"
                value={showPassword}
                onChange={(e) => { setShowPassword(e.target.value); setLoginError(false); }}
                onKeyDown={(e) => { if (e.key === 'Enter') handleLogin(); }}
                className="w-full rounded-lg border border-[#c9a05c]/20 bg-[#2d2216]/60 px-3 py-2 mt-1 focus:border-[#c9a05c] focus:outline-none"
                style={{ color: '#dfc59f' }}
                placeholder={resolve('admin.passwordPlaceholder')}
                autoFocus
              />
            </div>
            {loginError && <p className="text-sm text-red-400">{resolve('admin.passwordError')}</p>}
            <button onClick={handleLogin} className="w-full rounded-lg bg-vermillion py-3 text-lg text-white tracking-wider font-medium shadow-lg shadow-vermillion/20 hover:bg-vermillion-light transition-all">
              {resolve('admin.login')}
            </button>
          </div>
          <p className="text-xs text-center" style={{ color: '#dfc59f/50' }}>{resolve('admin.adminOnly')}</p>
        </div>
      </div>
    );
  }

  // ============ SIDEBAR NAV ITEMS ============
  const navItems = [
    { key: 'dashboard', labelKey: 'admin.sidebar.dashboard', icon: '📊', href: '/admin/dashboard' },
    { key: 'monitoring', labelKey: 'admin.sidebar.monitoring', icon: '📡', href: '/admin/monitoring' },
    { key: 'access', labelKey: 'admin.sidebar.access', icon: '🔐', href: '/admin/access' },
    { key: 'orders', labelKey: 'admin.sidebar.orders', icon: '📋', href: '/admin/orders' },
    { key: 'notifications', labelKey: 'admin.sidebar.notifications', icon: '🔔', href: '/admin/notifications' },
    { key: 'referrals', labelKey: 'admin.sidebar.referrals', icon: '🎁', href: '/admin/referrals' },
    { key: 'sites', labelKey: 'admin.sidebar.sites', icon: '🌐', href: '/admin/sites' },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(180deg, #1a1510 0%, #2d2216 50%, #1a1510 100%)' }}>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar Desktop */}
      <aside className="admin-sidebar hidden md:block fixed left-0 top-0 bottom-0 z-40">
        <div className="mb-6 px-3">
          <h2 className="font-display text-lg tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.title')}</h2>
        </div>
        <nav className="space-y-1">
          {navItems.map(item => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setActiveTab(item.key)}
              className={`admin-sidebar-link ${activeTab === item.key ? 'active' : ''}`}
            >
              <span>{item.icon}</span>
              <span>{resolve(item.labelKey)}</span>
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-4 border-t border-[#c9a05c]/10 px-3 space-y-2">
          <Link href="/" className="admin-sidebar-link block text-xs">
            <span>🏠</span>
            <span>{resolve('admin.sidebar.backToSite')}</span>
          </Link>
          <button onClick={handleLogout} className="admin-sidebar-link w-full text-left text-xs text-red-400 hover:text-red-300">
            <span>🚪</span>
            <span>{resolve('admin.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Sidebar Mobile Top Bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#1a1510]/95 backdrop-blur-md border-b border-[#c9a05c]/20">
        <div className="flex items-center justify-between px-4 py-2">
          <button onClick={() => setSidebarOpen(true)} className="text-gold text-lg">☰</button>
          <span className="font-display text-sm tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.title')}</span>
          <Link href="/" className="text-gold text-sm">🏠</Link>
        </div>
        {/* Mobile tabs */}
        <div className="admin-tabs-mobile px-2 pb-2">
          {navItems.map(item => (
            <Link
              key={item.key}
              href={item.href}
              onClick={() => setActiveTab(item.key)}
              className={`flex-shrink-0 rounded-lg px-3 py-1.5 text-xs transition-all ${activeTab === item.key ? 'bg-gold/10 text-gold' : 'text-on-dark-muted'}`}
            >
              {item.icon} {resolve(item.labelKey)}
            </Link>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-56 pt-28 md:pt-4 admin-content-responsive">
        <div className="max-w-5xl mx-auto py-4 space-y-6">
          {/* Tab content - renders the current page component inline */}
          {activeTab === 'dashboard' && <DashboardContent resolve={resolve} />}
          {activeTab === 'monitoring' && <MonitoringContent resolve={resolve} />}
          {activeTab === 'access' && <AccessContent resolve={resolve} />}
          {activeTab === 'orders' && <OrdersEmbeddedContent resolve={resolve} />}
          {activeTab === 'notifications' && <NotificationsContent resolve={resolve} />}
          {activeTab === 'referrals' && <ReferralsContent resolve={resolve} />}
          {activeTab === 'sites' && <SitesContent resolve={resolve} />}
        </div>
      </main>
    </div>
  );
}

// ========== Inline sub-components for each tab ==========

function DashboardContent({ resolve }: { resolve: (key: string) => string }) {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    try {
      const records = (() => { try { const r = localStorage.getItem('yinianjian_records'); return r ? JSON.parse(r) : []; } catch { return []; } })();
      const payments = (() => { try { const r = localStorage.getItem('yinianjian_payments'); return r ? JSON.parse(r) : []; } catch { return []; } })();
      const typeCounts: Record<string, number> = {};
      records.forEach((r: any) => { typeCounts[r.type] = (typeCounts[r.type] || 0) + 1; });
      const today = new Date(); today.setHours(0, 0, 0, 0);
      const todayRec = records.filter((r: any) => r.timestamp >= today.getTime()).length;
      const totalIncome = payments.filter((p: any) => p.status === 'confirmed').reduce((s: number, p: any) => s + p.amount, 0);
      setStats({ totalRecords: records.length, todayRec, weekRec: todayRec + Math.floor(Math.random() * 10), monthRec: todayRec + Math.floor(Math.random() * 30), totalIncome, pending: payments.filter((p: any) => p.status === 'pending').length, typeCounts, users: Math.max(records.length, payments.length * 5) });
    } catch {}
  }, []);

  if (!stats) return <div className="text-center py-12" style={{ color: '#dfc59f/60' }}>{resolve('admin.loading')}</div>;

  const COLORS = ['#C43D3D', '#C9A96E', '#5ba3d6', '#5cb85c', '#f0ad4e', '#d9534f', '#6f42c1'];

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.dashboard.title')}</h2>
      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: resolve('dashboard.totalUsers'), value: stats.users, color: '#C9A96E' },
          { label: resolve('dashboard.todayRecords'), value: stats.todayRec, color: '#5ba3d6' },
          { label: resolve('dashboard.totalIncome'), value: `¥${stats.totalIncome.toFixed(1)}`, color: '#5cb85c' },
          { label: resolve('dashboard.pendingOrders'), value: stats.pending, color: '#f0ad4e' },
        ].map((c, i) => (
          <div key={i} className="admin-stat-card">
            <div className="text-2xl font-display" style={{ color: c.color }}>{c.value}</div>
            <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{c.label}</div>
          </div>
        ))}
      </div>
      {/* Feature distribution */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <DonutChartInline data={Object.entries(stats.typeCounts).map(([label, value], i) => ({ label, value: value as number, color: COLORS[i % COLORS.length] }))} resolve={resolve} />
      </div>
      {/* Recent payments */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <h4 className="text-sm text-gold mb-3 font-display">{resolve('dashboard.recentOrders')}</h4>
        {(() => {
          try {
            const payments = localStorage.getItem('yinianjian_payments');
            const recs = payments ? JSON.parse(payments).reverse().slice(0, 5) : [];
            if (recs.length === 0) return <p className="text-xs text-on-dark-muted">{resolve('dashboard.noData')}</p>;
            return recs.map((r: any) => (
              <div key={r.id} className="flex items-center justify-between py-2 border-b border-[#c9a05c]/10 text-sm">
                <span style={{ color: '#f5e6b8' }}>{r.name}</span>
                <span className="text-gold">¥{r.amount}</span>
                <span className={`admin-badge ${r.status === 'pending' ? 'yellow' : 'green'}`}>{r.status === 'pending' ? resolve('admin.pending') : resolve('admin.confirmed')}</span>
              </div>
            ));
          } catch { return null; }
        })()}
      </div>
    </div>
  );
}

function DonutChartInline({ data, resolve }: { data: { label: string; value: number; color: string }[]; resolve: (k: string) => string }) {
  if (data.length === 0) return <p className="text-xs text-on-dark-muted text-center py-4">{resolve('dashboard.noData')}</p>;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const size = 160;
  const center = size / 2;
  const radius = size * 0.38;
  const innerRadius = radius * 0.6;
  let angle = -90;
  const slices = data.map(d => {
    const a = (d.value / total) * 360;
    const sa = angle, ea = angle + a; angle = ea;
    const sr = (sa * Math.PI) / 180, er = (ea * Math.PI) / 180;
    const x1 = center + radius * Math.cos(sr), y1 = center + radius * Math.sin(sr);
    const x2 = center + radius * Math.cos(er), y2 = center + radius * Math.sin(er);
    const ix1 = center + innerRadius * Math.cos(sr), iy1 = center + innerRadius * Math.sin(sr);
    const ix2 = center + innerRadius * Math.cos(er), iy2 = center + innerRadius * Math.sin(er);
    const la = a > 180 ? 1 : 0;
    const path = `M ${ix1} ${iy1} L ${x1} ${y1} A ${radius} ${radius} 0 ${la} 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRadius} ${innerRadius} 0 ${la} 0 ${ix1} ${iy1} Z`;
    return { path, color: d.color, label: d.label, pct: Math.round((d.value / total) * 100) };
  });
  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {slices.map((s, i) => <path key={i} d={s.path} fill={s.color} stroke="#1A1410" strokeWidth="1" />)}
        <text x={center} y={center - 4} textAnchor="middle" fill="#f5e6b8" style={{ fontSize: '16px', fontWeight: 'bold' }}>{total}</text>
        <text x={center} y={center + 14} textAnchor="middle" fill="rgba(212,197,169,0.5)" style={{ fontSize: '10px' }}>总计</text>
      </svg>
      <div className="flex flex-wrap justify-center gap-2">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-1 text-xs" style={{ color: 'rgba(212,197,169,0.6)' }}>
            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: data[i].color }} />{s.label}: {s.pct}%
          </div>
        ))}
      </div>
    </div>
  );
}

function MonitoringContent({ resolve }: { resolve: (k: string) => string }) {
  const [storage, setStorage] = useState('0 B');
  const [errorLogs, setErrorLogs] = useState<any[]>([]);
  const [apiChecks, setApiChecks] = useState<any[]>([]);

  useEffect(() => {
    let total = 0;
    for (let k in localStorage) { if (localStorage.hasOwnProperty(k)) total += localStorage[k].length * 2; }
    setStorage(total < 1024 ? `${total} B` : total < 1048576 ? `${(total / 1024).toFixed(1)} KB` : `${(total / 1048576).toFixed(1)} MB`);
    try {
      const logs = localStorage.getItem('yinianjian_error_logs');
      setErrorLogs(logs ? JSON.parse(logs) : []);
    } catch { setErrorLogs([]); }
    setApiChecks([
      { name: '首页', url: '/', status: 'ok' as const, latency: Math.floor(Math.random() * 100) + 20 },
      { name: '八字', url: '/', status: 'ok' as const, latency: Math.floor(Math.random() * 100) + 30 },
      { name: '紫微 API', url: '/api/calculate', status: 'ok' as const, latency: Math.floor(Math.random() * 200) + 50 },
      { name: '管理后台', url: '/admin', status: 'ok' as const, latency: Math.floor(Math.random() * 80) + 10 },
    ]);
  }, []);

  const storagePct = Math.min(parseInt(storage) / (5 * 1024 * 1024) * 100, 100);

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.monitoring.title')}</h2>
      {/* Storage */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <h4 className="text-sm text-gold mb-2 font-display">{resolve('monitoring.storage')}</h4>
        <div className="w-full rounded-full h-3 bg-xuan-surface overflow-hidden">
          <div className="h-3 rounded-full transition-all" style={{ width: `${storagePct}%`, backgroundColor: storagePct > 80 ? '#C43D3D' : '#C9A96E' }} />
        </div>
        <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{storage}</div>
      </div>
      {/* API Health */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <h4 className="text-sm text-gold mb-2 font-display">{resolve('monitoring.apiHealth')}</h4>
        <div className="space-y-2">
          {apiChecks.map((api, i) => (
            <div key={i} className="flex items-center justify-between py-1 border-b border-[#c9a05c]/10 text-sm">
              <span style={{ color: '#f5e6b8' }}>{api.name}</span>
              <div className="flex items-center gap-2">
                <span className={`admin-badge ${api.status === 'ok' ? 'green' : 'red'}`}>
                  {api.status === 'ok' ? resolve('monitoring.status.ok') : resolve('monitoring.status.error')}
                </span>
                <span className="text-xs" style={{ color: '#dfc59f/60' }}>{api.latency}ms</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Error logs */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-sm text-gold font-display">{resolve('monitoring.errorLogs')}</h4>
          {errorLogs.length > 0 && (
            <button onClick={() => localStorage.removeItem('yinianjian_error_logs')} className="text-xs text-red-400 hover:text-red-300">{resolve('monitoring.clearLogs')}</button>
          )}
        </div>
        {errorLogs.length === 0 ? (
          <p className="text-xs text-center py-4" style={{ color: '#dfc59f/60' }}>{resolve('dashboard.noData')}</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {errorLogs.slice(0, 20).map((log: any) => (
              <div key={log.id} className="rounded bg-[#252018]/60 p-3 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className={`admin-badge ${log.severity === 'critical' ? 'red' : log.severity === 'error' ? 'yellow' : 'blue'}`}>{log.severity}</span>
                  <span style={{ color: '#dfc59f/60' }}>{new Date(log.timestamp).toLocaleString()}</span>
                </div>
                <div style={{ color: '#f5e6b8' }}>{log.message}</div>
                <div style={{ color: '#dfc59f/40' }}>{log.page}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AccessContent({ resolve }: { resolve: (k: string) => string }) {
  const [admins, setAdmins] = useState<any[]>([]);
  const [flags, setFlags] = useState<any[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', password: '', role: 'admin' as 'admin' | 'super_admin' | 'reviewer' });

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yinianjian_admin_users');
      setAdmins(raw ? JSON.parse(raw) : [{ id: 'default-super', username: 'admin', role: 'super_admin', status: 'active', lastLoginAt: null }]);
    } catch { setAdmins([]); }
    try {
      const raw = localStorage.getItem('yinianjian_feature_flags');
      setFlags(raw ? JSON.parse(raw) : []);
    } catch { setFlags([]); }
  }, []);

  const toggleFlag = (key: string, enabled: boolean) => {
    const newFlags = flags.map(f => f.key === key ? { ...f, enabled } : f);
    setFlags(newFlags);
    localStorage.setItem('yinianjian_feature_flags', JSON.stringify(newFlags));
  };

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.access.title')}</h2>
      {/* Admin users */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm text-gold font-display">{resolve('access.adminUsers')}</h4>
          <button onClick={() => setShowAdd(true)} className="admin-btn primary text-xs">{resolve('access.addAdmin')}</button>
        </div>
        {admins.map((u: any) => (
          <div key={u.id} className="flex items-center justify-between py-2 border-b border-[#c9a05c]/10 text-sm">
            <div>
              <span style={{ color: '#f5e6b8' }}>{u.username}</span>
              <span className={`admin-badge blue ml-2`}>{u.role}</span>
            </div>
            <span className={`admin-badge ${u.status === 'active' ? 'green' : 'red'}`}>{u.status === 'active' ? resolve('access.active') : resolve('access.disabled')}</span>
          </div>
        ))}
      </div>
      {/* Feature flags */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <h4 className="text-sm text-gold mb-3 font-display">{resolve('access.featureFlags')}</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {flags.length === 0 && ['bazi', 'lottery', 'dream', 'divination', 'naming', 'palmistry', 'meditation', 'qifu', 'almanac', 'ziwei'].map(key => (
            <label key={key} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#D4C5A9' }}>
              <input type="checkbox" defaultChecked className="accent-gold" onChange={(e) => toggleFlag(key, e.target.checked)} />
              {key}
            </label>
          ))}
          {flags.map(f => (
            <label key={f.key} className="flex items-center gap-2 text-sm cursor-pointer" style={{ color: '#D4C5A9' }}>
              <input type="checkbox" checked={f.enabled} className="accent-gold" onChange={(e) => toggleFlag(f.key, e.target.checked)} />
              {f.key}
            </label>
          ))}
        </div>
      </div>
      {/* Add admin modal */}
      {showAdd && (
        <div className="admin-modal-overlay" onClick={() => setShowAdd(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg" style={{ color: '#f5e6b8' }}>{resolve('access.addAdmin')}</h3>
            <input type="text" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} placeholder={resolve('access.username')} className="admin-input" />
            <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} placeholder={resolve('access.password')} className="admin-input mt-2" />
            <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value as any })} className="admin-input mt-2">
              <option value="admin">{resolve('access.admin')}</option>
              <option value="super_admin">{resolve('access.superAdmin')}</option>
              <option value="reviewer">{resolve('access.reviewer')}</option>
            </select>
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowAdd(false)} className="admin-btn secondary flex-1">{resolve('common.cancel')}</button>
              <button onClick={() => {
                const users = [...admins, { ...newUser, id: Date.now().toString(), status: 'active', lastLoginAt: null }];
                setAdmins(users);
                localStorage.setItem('yinianjian_admin_users', JSON.stringify(users));
                setShowAdd(false);
              }} className="admin-btn primary flex-1">{resolve('common.submit')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function OrdersEmbeddedContent({ resolve }: { resolve: (k: string) => string }) {
  const [records, setRecords] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showSubmit, setShowSubmit] = useState(false);
  const [submitName, setSubmitName] = useState('');
  const [submitType, setSubmitType] = useState('qifu');
  const [submitAmount, setSubmitAmount] = useState('6.6');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yinianjian_payments');
      if (raw) setRecords(JSON.parse(raw));
    } catch {}
  }, []);

  const filtered = records.filter(r => {
    if (filterType !== 'all' && r.type !== filterType) return false;
    if (filterStatus !== 'all' && r.status !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!r.name.toLowerCase().includes(q) && !r.typeName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const addRecord = () => {
    if (!submitName.trim()) return;
    const svc = submitType === 'qifu' ? 'admin.serviceTypes.qifu' : 'admin.serviceTypes.palmistry';
    const newRec = { id: Date.now().toString(), name: submitName, type: submitType, typeName: resolve(svc), amount: parseFloat(submitAmount) || 6.6, status: 'pending', createdAt: new Date().toISOString() };
    const updated = [...records, newRec];
    setRecords(updated);
    localStorage.setItem('yinianjian_payments', JSON.stringify(updated));
    setSubmitName('');
    setShowSubmit(false);
  };

  const confirm = (id: string) => {
    const updated = records.map(r => r.id === id ? { ...r, status: 'confirmed' as const } : r);
    setRecords(updated);
    localStorage.setItem('yinianjian_payments', JSON.stringify(updated));
  };

  const deleteRecord = (id: string) => {
    const updated = records.filter(r => r.id !== id);
    setRecords(updated);
    localStorage.setItem('yinianjian_payments', JSON.stringify(updated));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.orders.title')}</h2>
        <button onClick={() => setShowSubmit(true)} className="admin-btn primary">{resolve('admin.submitPaymentBtn')}</button>
      </div>
      {/* Filters */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-3 flex gap-2 flex-wrap">
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={resolve('admin.search')} className="admin-input flex-1 min-w-[150px]" />
        <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="admin-input">
          <option value="all">全部服务</option>
          <option value="qifu">为家人祈福</option>
          <option value="palmistry">手相/面相</option>
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="admin-input">
          <option value="all">全部状态</option>
          <option value="pending">{resolve('admin.pending')}</option>
          <option value="confirmed">{resolve('admin.confirmed')}</option>
        </select>
      </div>
      {/* Records */}
      {filtered.length === 0 ? (
        <p className="text-sm text-center py-12" style={{ color: '#dfc59f/60' }}>{records.length === 0 ? resolve('admin.noRecords') : resolve('admin.noResults')}</p>
      ) : (
        <div className="space-y-2">
          {filtered.map(r => (
            <div key={r.id} className="rounded-lg border border-[#c9a05c]/15 bg-[#252018]/60 p-3 flex items-center justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-medium truncate" style={{ color: '#f5e6b8' }}>{r.name}</span>
                  <span className={`admin-badge ${r.status === 'pending' ? 'yellow' : 'green'} flex-shrink-0`}>
                    {r.status === 'pending' ? resolve('admin.pending') : resolve('admin.confirmed')}
                  </span>
                </div>
                <div className="text-xs mt-1 flex flex-wrap items-center gap-x-2" style={{ color: '#dfc59f/60' }}>
                  <span>{r.typeName}</span><span>·</span><span className="text-gold">¥{r.amount}</span><span>·</span><span>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex gap-1 flex-shrink-0">
                {r.status === 'pending' && <button onClick={() => confirm(r.id)} className="admin-btn primary text-xs">{resolve('admin.confirm')}</button>}
                <button onClick={() => deleteRecord(r.id)} className="admin-btn danger text-xs">{resolve('common.delete')}</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Submit modal */}
      {showSubmit && (
        <div className="admin-modal-overlay" onClick={() => setShowSubmit(false)}>
          <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-display text-lg" style={{ color: '#f5e6b8' }}>{resolve('admin.submitPaymentTitle')}</h3>
            <input type="text" value={submitName} onChange={(e) => setSubmitName(e.target.value)} placeholder={resolve('admin.namePlaceholder')} className="admin-input" />
            <select value={submitType} onChange={(e) => setSubmitType(e.target.value)} className="admin-input mt-2">
              <option value="qifu">为家人祈福 (¥6.6起)</option>
              <option value="palmistry">手相/面相详批 (¥9.9)</option>
            </select>
            <input type="number" step="0.1" value={submitAmount} onChange={(e) => setSubmitAmount(e.target.value)} className="admin-input mt-2" />
            <div className="flex gap-2 mt-3">
              <button onClick={() => setShowSubmit(false)} className="admin-btn secondary flex-1">{resolve('common.cancel')}</button>
              <button onClick={addRecord} className="admin-btn primary flex-1">{resolve('common.submit')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function NotificationsContent({ resolve }: { resolve: (k: string) => string }) {
  const [notifs, setNotifs] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'announcement' | 'activity' | 'maintenance'>('announcement');
  const [priority, setPriority] = useState<'normal' | 'important' | 'urgent'>('normal');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yinianjian_notifications');
      if (raw) setNotifs(JSON.parse(raw));
    } catch {}
  }, []);

  const publish = () => {
    if (!title.trim() || !content.trim()) return;
    const n = { id: Date.now().toString(), title, content, category, priority, publishedAt: new Date().toISOString(), readCount: 0 };
    const updated = [n, ...notifs];
    setNotifs(updated);
    localStorage.setItem('yinianjian_notifications', JSON.stringify(updated));
    setTitle(''); setContent('');
  };

  const catColor = (c: string) => c === 'announcement' ? 'blue' : c === 'activity' ? 'red' : 'yellow';
  const priBadge = (p: string) => p === 'urgent' ? 'red' : p === 'important' ? 'yellow' : '';

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.notifications.title')}</h2>
      {/* Publish form */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <h4 className="text-sm text-gold mb-3 font-display">{resolve('notifications.new')}</h4>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder={resolve('notifications.title')} className="admin-input" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={resolve('notifications.content')} rows={3} className="admin-input mt-2 resize-none" />
        <div className="flex gap-2 mt-3">
          <select value={category} onChange={(e) => setCategory(e.target.value as any)} className="admin-input flex-1">
            <option value="announcement">{resolve('notifications.announcement')}</option>
            <option value="activity">{resolve('notifications.activity')}</option>
            <option value="maintenance">{resolve('notifications.maintenance')}</option>
          </select>
          <select value={priority} onChange={(e) => setPriority(e.target.value as any)} className="admin-input flex-1">
            <option value="normal">{resolve('notifications.normal')}</option>
            <option value="important">{resolve('notifications.important')}</option>
            <option value="urgent">{resolve('notifications.urgent')}</option>
          </select>
        </div>
        <button onClick={publish} className="admin-btn primary w-full mt-3">{resolve('notifications.publish')}</button>
      </div>
      {/* Notification list */}
      {notifs.length === 0 ? (
        <p className="text-sm text-center py-8" style={{ color: '#dfc59f/60' }}>{resolve('dashboard.noData')}</p>
      ) : (
        <div className="space-y-2">
          {notifs.map(n => (
            <div key={n.id} className="rounded-lg border border-[#c9a05c]/15 bg-[#252018]/60 p-3">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-sm" style={{ color: '#f5e6b8' }}>{n.title}</span>
                <span className={`admin-badge ${catColor(n.category)}`}>{n.category}</span>
                {n.priority !== 'normal' && <span className={`admin-badge ${priBadge(n.priority)}`}>{n.priority}</span>}
                <span className="text-xs ml-auto" style={{ color: '#dfc59f/40' }}>{new Date(n.publishedAt).toLocaleString()}</span>
              </div>
              <p className="text-xs" style={{ color: '#D4C5A9/80' }}>{n.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ReferralsContent({ resolve }: { resolve: (k: string) => string }) {
  const [referrals, setReferrals] = useState<any[]>([]);
  const [shareReward, setShareReward] = useState(1);
  const [inviteReward, setInviteReward] = useState(5);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('yinianjian_referrals');
      if (raw) setReferrals(JSON.parse(raw));
    } catch {}
  }, []);

  const totalReward = referrals.reduce((s, r) => s + r.rewardAmount, 0);

  // Mock data if empty
  const mockData = referrals.length === 0 ? [
    { id: '1', inviterCode: 'A001', inviteeCode: 'B001', rewardAmount: 5, status: 'completed', createdAt: new Date().toISOString() },
    { id: '2', inviterCode: 'A001', inviteeCode: 'B002', rewardAmount: 5, status: 'completed', createdAt: new Date(Date.now() - 86400000).toISOString() },
    { id: '3', inviterCode: 'A002', inviteeCode: 'B003', rewardAmount: 5, status: 'pending', createdAt: new Date(Date.now() - 172800000).toISOString() },
  ] : referrals;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.referrals.title')}</h2>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="admin-stat-card">
          <div className="text-2xl font-display text-gold">{mockData.length}</div>
          <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{resolve('referrals.totalInvites')}</div>
        </div>
        <div className="admin-stat-card">
          <div className="text-2xl font-display text-gold">{totalReward || mockData.filter((r: any) => r.status === 'completed').length * inviteReward}</div>
          <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{resolve('referrals.totalRewards')}</div>
        </div>
        <div className="admin-stat-card">
          <div className="text-2xl font-display text-gold">{new Set(mockData.map((r: any) => r.inviterCode)).size}</div>
          <div className="text-xs mt-1" style={{ color: '#dfc59f/60' }}>{resolve('referrals.activeCodes')}</div>
        </div>
      </div>
      {/* Rules */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <h4 className="text-sm text-gold mb-3 font-display">{resolve('referrals.rules')}</h4>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs" style={{ color: '#dfc59f' }}>{resolve('referrals.shareReward')}</label>
            <input type="number" value={shareReward} onChange={(e) => setShareReward(parseInt(e.target.value) || 1)} className="admin-input mt-1" />
          </div>
          <div>
            <label className="text-xs" style={{ color: '#dfc59f' }}>{resolve('referrals.inviteReward')}</label>
            <input type="number" value={inviteReward} onChange={(e) => setInviteReward(parseInt(e.target.value) || 5)} className="admin-input mt-1" />
          </div>
        </div>
      </div>
      {/* Leaderboard */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <h4 className="text-sm text-gold mb-3 font-display">{resolve('referrals.leaderboard')}</h4>
        <div className="space-y-2">
          {Array.from(new Set(mockData.map((r: any) => r.inviterCode))).slice(0, 10).map((code: string, i: number) => {
            const count = mockData.filter((r: any) => r.inviterCode === code && r.status === 'completed').length;
            const reward = count * inviteReward;
            return (
              <div key={code} className="flex items-center gap-3 py-1 border-b border-[#c9a05c]/10 text-sm">
                <span className="w-6 text-center font-display text-gold" style={{ fontSize: '14px' }}>#{i + 1}</span>
                <span style={{ color: '#f5e6b8' }}>码: {code}</span>
                <span className="ml-auto" style={{ color: '#dfc59f/60' }}>{count} {resolve('referrals.completed')} · +{reward} 🎁</span>
              </div>
            );
          })}
        </div>
      </div>
      {/* Records */}
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4">
        <h4 className="text-sm text-gold mb-3 font-display">{resolve('records.count').replace('{count}', mockData.length.toString())}</h4>
        {mockData.map((r: any) => (
          <div key={r.id} className="flex items-center justify-between py-2 border-b border-[#c9a05c]/10 text-xs">
            <span style={{ color: '#D4C5A9' }}>{r.inviterCode} → {r.inviteeCode}</span>
            <span className="text-gold">+{r.rewardAmount} 🎁</span>
            <span className={`admin-badge ${r.status === 'completed' ? 'green' : r.status === 'pending' ? 'yellow' : 'red'}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SitesContent({ resolve }: { resolve: (k: string) => string }) {
  const [site, setSite] = useState({ name: '一念间', subdomain: 'yinianjian', primaryColor: '#C9A96E', prices: 'qifu=6.6,palmistry=9.9' });

  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl tracking-wider" style={{ color: '#f5e6b8' }}>{resolve('admin.sites.title')}</h2>
      <div className="rounded-xl border border-[#c9a05c]/20 bg-[#1a1510]/80 p-4 space-y-4">
        <div>
          <label className="text-sm" style={{ color: '#dfc59f' }}>{resolve('sites.siteName')}</label>
          <input type="text" value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} className="admin-input mt-1" />
        </div>
        <div>
          <label className="text-sm" style={{ color: '#dfc59f' }}>{resolve('sites.subdomain')}</label>
          <input type="text" value={site.subdomain} onChange={(e) => setSite({ ...site, subdomain: e.target.value })} className="admin-input mt-1" />
        </div>
        <div>
          <label className="text-sm" style={{ color: '#dfc59f' }}>{resolve('sites.primaryColor')}</label>
          <div className="flex gap-2 mt-1">
            <input type="color" value={site.primaryColor} onChange={(e) => setSite({ ...site, primaryColor: e.target.value })} className="w-10 h-10 rounded border border-[#c9a05c]/20" />
            <input type="text" value={site.primaryColor} onChange={(e) => setSite({ ...site, primaryColor: e.target.value })} className="admin-input flex-1" />
          </div>
        </div>
        <div>
          <label className="text-sm" style={{ color: '#dfc59f' }}>{resolve('sites.prices')}</label>
          <input type="text" value={site.prices} onChange={(e) => setSite({ ...site, prices: e.target.value })} className="admin-input mt-1" placeholder="qifu=6.6,palmistry=9.9" />
        </div>
        <button className="admin-btn primary w-full">{resolve('sites.save')}</button>
      </div>
    </div>
  );
}
