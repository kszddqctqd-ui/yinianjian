// 管理后台 localStorage 统一操作封装

// ========== 管理员账号 ==========
export interface AdminUser {
  id: string;
  username: string;
  password: string;
  role: 'super_admin' | 'admin' | 'reviewer';
  createdAt: string;
  lastLoginAt: string | null;
  status: 'active' | 'disabled';
}

export const ADMIN_USERS_KEY = 'yinianjian_admin_users';

function getAdminUsers(): AdminUser[] {
  try {
    const raw = localStorage.getItem(ADMIN_USERS_KEY);
    return raw ? JSON.parse(raw) : getDefaultAdmins();
  } catch {
    return getDefaultAdmins();
  }
}

function getDefaultAdmins(): AdminUser[] {
  return [{
    id: 'default-super',
    username: 'admin',
    password: 'admin123',
    role: 'super_admin',
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
    status: 'active',
  }];
}

export function authenticateAdmin(username: string, password: string): AdminUser | null {
  const users = getAdminUsers();
  return users.find(u => u.username === username && u.password === password && u.status === 'active') ?? null;
}

export function updateLastLogin(username: string): void {
  const users = getAdminUsers();
  const user = users.find(u => u.username === username);
  if (user) {
    user.lastLoginAt = new Date().toISOString();
    localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  }
}

export function getAdminUsersList(): AdminUser[] {
  return getAdminUsers();
}

export function addAdminUser(user: Omit<AdminUser, 'id' | 'createdAt' | 'lastLoginAt'>): AdminUser {
  const users = getAdminUsers();
  const newUser: AdminUser = {
    ...user,
    id: Date.now().toString(),
    createdAt: new Date().toISOString(),
    lastLoginAt: null,
  };
  users.push(newUser);
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
  return newUser;
}

export function deleteAdminUser(id: string): void {
  const users = getAdminUsers().filter(u => u.id !== id);
  localStorage.setItem(ADMIN_USERS_KEY, JSON.stringify(users));
}

// ========== 功能开关 ==========
export interface FeatureFlag {
  key: string;
  enabled: boolean;
}

export const FEATURE_FLAGS_KEY = 'yinianjian_feature_flags';

export const DEFAULT_FEATURE_FLAGS: FeatureFlag[] = [
  { key: 'bazi', enabled: true },
  { key: 'lottery', enabled: true },
  { key: 'dream', enabled: true },
  { key: 'divination', enabled: true },
  { key: 'naming', enabled: true },
  { key: 'palmistry', enabled: true },
  { key: 'meditation', enabled: true },
  { key: 'qifu', enabled: true },
  { key: 'almanac', enabled: true },
  { key: 'ziwei', enabled: true },
];

export function getFeatureFlags(): FeatureFlag[] {
  try {
    const raw = localStorage.getItem(FEATURE_FLAGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(DEFAULT_FEATURE_FLAGS));
  return DEFAULT_FEATURE_FLAGS;
}

export function toggleFeatureFlag(key: string, enabled: boolean): void {
  const flags = getFeatureFlags();
  const flag = flags.find(f => f.key === key);
  if (flag) flag.enabled = enabled;
  localStorage.setItem(FEATURE_FLAGS_KEY, JSON.stringify(flags));
}

// ========== 通知 ==========
export interface Notification {
  id: string;
  title: string;
  content: string;
  category: 'announcement' | 'activity' | 'maintenance';
  priority: 'normal' | 'important' | 'urgent';
  publishedAt: string;
  expiresAt: string | null;
  readCount: number;
}

export const NOTIFICATIONS_KEY = 'yinianjian_notifications';

export function getNotifications(): Notification[] {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addNotification(notif: Omit<Notification, 'id' | 'publishedAt' | 'readCount'>): Notification {
  const notifs = getNotifications();
  const newNotif: Notification = {
    ...notif,
    id: Date.now().toString(),
    publishedAt: new Date().toISOString(),
    readCount: 0,
  };
  notifs.unshift(newNotif);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
  return newNotif;
}

export function deleteNotification(id: string): void {
  const notifs = getNotifications().filter(n => n.id !== id);
  localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifs));
}

// ========== 分享/邀请 ==========
export interface ReferralRecord {
  id: string;
  inviterCode: string;
  inviteeCode: string;
  rewardAmount: number;
  status: 'pending' | 'completed' | 'rejected';
  createdAt: string;
}

export const REFERRALS_KEY = 'yinianjian_referrals';

export function getReferrals(): ReferralRecord[] {
  try {
    const raw = localStorage.getItem(REFERRALS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addReferral(inviterCode: string, inviteeCode: string, rewardAmount: number): ReferralRecord {
  const referrals = getReferrals();
  const newReferral: ReferralRecord = {
    id: Date.now().toString(),
    inviterCode,
    inviteeCode,
    rewardAmount,
    status: 'completed',
    createdAt: new Date().toISOString(),
  };
  referrals.push(newReferral);
  localStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
  return newReferral;
}

// ========== 站点配置 ==========
export interface SiteConfig {
  id: string;
  name: string;
  subdomain: string;
  logoUrl: string;
  primaryColor: string;
  features: Record<string, boolean>;
  prices: Record<string, number>;
  updatedAt: string;
}

export const SITES_KEY = 'yinianjian_sites';

export function getSites(): SiteConfig[] {
  try {
    const raw = localStorage.getItem(SITES_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  const defaultSite: SiteConfig = {
    id: 'default',
    name: '一念间',
    subdomain: 'yinianjian',
    logoUrl: '',
    primaryColor: '#C9A96E',
    features: {
      bazi: true, lottery: true, dream: true, divination: true,
      naming: true, palmistry: true, meditation: true, qifu: true,
      almanac: true, ziwei: true,
    },
    prices: { qifu: 6.6, palmistry: 9.9 },
    updatedAt: new Date().toISOString(),
  };
  localStorage.setItem(SITES_KEY, JSON.stringify([defaultSite]));
  return [defaultSite];
}

export function updateSiteConfig(config: SiteConfig): void {
  const sites = getSites();
  const idx = sites.findIndex(s => s.id === config.id);
  if (idx >= 0) {
    sites[idx] = { ...config, updatedAt: new Date().toISOString() };
  } else {
    sites.push({ ...config, id: Date.now().toString(), updatedAt: new Date().toISOString() });
  }
  localStorage.setItem(SITES_KEY, JSON.stringify(sites));
}

// ========== 错误日志 ==========
export interface ErrorLog {
  id: string;
  message: string;
  stack: string;
  page: string;
  userAgent: string;
  timestamp: number;
  severity: 'info' | 'warning' | 'error' | 'critical';
}

export const ERROR_LOGS_KEY = 'yinianjian_error_logs';

export function addErrorLog(error: Error, page: string): void {
  try {
    const logs = getErrorLogs();
    const log: ErrorLog = {
      id: Date.now().toString(),
      message: error.message,
      stack: error.stack || '',
      page,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      severity: error instanceof TypeError ? 'error' : 'warning',
    };
    logs.unshift(log);
    // Keep only last 100
    if (logs.length > 100) logs.pop();
    localStorage.setItem(ERROR_LOGS_KEY, JSON.stringify(logs));
  } catch {}
}

export function getErrorLogs(): ErrorLog[] {
  try {
    const raw = localStorage.getItem(ERROR_LOGS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function clearErrorLogs(): void {
  localStorage.removeItem(ERROR_LOGS_KEY);
}

// ========== 存储空间 ==========
export function getStorageUsage(): { totalBytes: number; totalHuman: string } {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length * 2; // UTF-16
    }
  }
  return { totalBytes: total, totalHuman: formatBytes(total) };
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ========== 模拟统计数据 ==========
export function getMockStats() {
  const records = (() => {
    try {
      const raw = localStorage.getItem('yinianjian_records');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })();

  const payments = (() => {
    try {
      const raw = localStorage.getItem('yinianjian_payments');
      return raw ? JSON.parse(raw) : [];
    } catch { return []; }
  })();

  const typeCounts: Record<string, number> = {};
  records.forEach((r: any) => {
    typeCounts[r.type] = (typeCounts[r.type] || 0) + 1;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayRecords = records.filter((r: any) => r.timestamp >= today.getTime());

  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const weekRecords = records.filter((r: any) => r.timestamp >= weekStart.getTime());

  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
  const monthRecords = records.filter((r: any) => r.timestamp >= monthStart.getTime());

  return {
    totalRecords: records.length,
    todayRecords: todayRecords.length,
    weekRecords: weekRecords.length,
    monthRecords: monthRecords.length,
    totalPayments: payments.length,
    totalIncome: payments.filter((p: any) => p.status === 'confirmed').reduce((s: number, p: any) => s + p.amount, 0),
    pendingPayments: payments.filter((p: any) => p.status === 'pending').length,
    typeDistribution: typeCounts,
    estimatedUsers: Math.max(records.length, payments.length * 5),
    onlineUsers: Math.floor(Math.random() * 20) + 1, // 模拟
  };
}
