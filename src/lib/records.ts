// localStorage 记录持久化工具
export interface RecordEntry {
  id: string;
  type: 'bazi' | 'lottery' | 'dream' | 'divination' | 'naming' | 'palmistry';
  timestamp: number;
  data: Record<string, any>;
  summary: string;
}

const STORAGE_KEY = 'yinianjian_records';
const MAX_PER_TYPE = 50;

function getAllRecords(): RecordEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveAll(records: RecordEntry[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch {
    // Storage full — try to evict oldest records
    const oldest = records.shift();
    if (oldest) saveAll(records);
  }
}

export function saveRecord(
  type: RecordEntry['type'],
  data: Record<string, any>,
  summary: string,
): RecordEntry | null {
  const records = getAllRecords();
  const entry: RecordEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    timestamp: Date.now(),
    data,
    summary,
  };
  records.unshift(entry);

  // Evict oldest per type if over limit
  const byType = records.filter(r => r.type === type);
  if (byType.length > MAX_PER_TYPE) {
    const toRemove = new Set(byType.slice(MAX_PER_TYPE).map(r => r.id));
    saveAll(records.filter(r => !toRemove.has(r.id)));
  } else {
    saveAll(records);
  }
  return entry;
}

export function getRecords(): RecordEntry[] {
  return getAllRecords().sort((a, b) => b.timestamp - a.timestamp);
}

export function getRecordsByType(type: RecordEntry['type']): RecordEntry[] {
  return getRecords().filter(r => r.type === type);
}

export function getRecord(id: string): RecordEntry | null {
  return getAllRecords().find(r => r.id === id) ?? null;
}

export function deleteRecord(id: string): void {
  saveAll(getAllRecords().filter(r => r.id !== id));
}

export function clearRecords(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function getTotalRecordCount(): number {
  return getAllRecords().length;
}

export function formatRelativeTime(ts: number): string {
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return '刚刚';
  if (mins < 60) return `${mins}分钟前`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;
  return `${Math.floor(months / 12)}年前`;
}
