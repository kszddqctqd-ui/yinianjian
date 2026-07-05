/**
 * Rate limiter using sliding window algorithm with in-memory Map storage.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 60; // max requests per window
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

const store = new Map<string, RateLimitEntry>();

/**
 * Check if the given key (typically IP) is within rate limit.
 * Returns { allowed, remaining, resetAt }.
 */
export function checkRateLimit(key: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now();
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Trim timestamps outside the current window
  const windowStart = now - WINDOW_MS;
  entry.timestamps = entry.timestamps.filter((t) => t > windowStart);

  if (entry.timestamps.length >= MAX_REQUESTS) {
    const resetAt = entry.timestamps[0] + WINDOW_MS;
    return { allowed: false, remaining: 0, resetAt };
  }

  entry.timestamps.push(now);
  const remaining = MAX_REQUESTS - entry.timestamps.length;
  const resetAt = now + WINDOW_MS;

  return { allowed: true, remaining, resetAt };
}

/**
 * Periodic cleanup of expired entries to prevent memory leaks.
 * Call this once at startup.
 */
export function startRateLimitCleanup(): void {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
      entry.timestamps = entry.timestamps.filter((t) => t > now - WINDOW_MS);
      if (entry.timestamps.length === 0) {
        store.delete(key);
      }
    }
  }, CLEANUP_INTERVAL_MS);
}
