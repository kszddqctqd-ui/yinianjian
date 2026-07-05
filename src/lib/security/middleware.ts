/**
 * Request middleware for security hardening.
 * Handles rate limiting, request size validation, and threat detection.
 */

import { checkRateLimit } from './rate-limit';
import { wafCheck } from './waf';
import { getSecurityHeaders } from './csp';

// Maximum request body size: 1 MB
const MAX_BODY_SIZE = 1 * 1024 * 1024;

// Maximum URL length
const MAX_URL_LENGTH = 2048;

// Maximum header value length
const MAX_HEADER_LENGTH = 8192;

/**
 * Extract client IP from request.
 */
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return headers.get('cf-connecting-ip') || 'unknown';
}

/**
 * Validate request size constraints.
 */
export function validateRequestSize(options: {
  url?: string;
  headers?: Headers;
  body?: string;
}): { valid: boolean; reason: string } {
  // URL length check
  if (options.url && options.url.length > MAX_URL_LENGTH) {
    return { valid: false, reason: 'URL too long' };
  }

  // Header size check
  if (options.headers) {
    options.headers.forEach((value, name) => {
      if (value.length > MAX_HEADER_LENGTH) {
        return { valid: false, reason: `Header ${name} too long` };
      }
    });
  }

  // Body size check
  if (options.body && new Blob([options.body]).size > MAX_BODY_SIZE) {
    return { valid: false, reason: 'Request body too large' };
  }

  return { valid: true, reason: '' };
}

/**
 * Check for suspicious User-Agent patterns.
 */
export function isSuspiciousUserAgent(ua: string | null): boolean {
  if (!ua || ua.length === 0) return true; // No UA is suspicious
  // Check for empty, whitespace-only, or abnormally long UA
  if (/^\s*$/.test(ua) || ua.length > 512) return true;
  return false;
}

/**
 * Main middleware handler. Returns null if request is allowed,
 * or a response object if it should be blocked.
 */
export async function securityMiddleware(options: {
  url?: string;
  method?: string;
  headers?: Headers;
  body?: string;
}): Promise<{ status: number; headers?: Record<string, string>; body?: string } | null> {
  const headers = options.headers || new Headers();
  const ip = getClientIp(headers);

  // --- Rate limiting ---
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return {
      status: 429,
      headers: {
        'Retry-After': String(Math.ceil((rateLimit.resetAt - Date.now()) / 1000)),
      },
      body: JSON.stringify({ error: 'Too many requests. Please try again later.' }),
    };
  }

  // --- Request size validation ---
  const sizeCheck = validateRequestSize({
    url: options.url,
    headers,
    body: options.body,
  });
  if (!sizeCheck.valid) {
    return {
      status: 413,
      body: JSON.stringify({ error: sizeCheck.reason }),
    };
  }

  // --- WAF check ---
  const wafResult = wafCheck({
    url: options.url,
    method: options.method,
    body: options.body,
    userAgent: headers.get('user-agent') ?? undefined,
  });
  if (wafResult) {
    return {
      status: 403,
      body: JSON.stringify({ error: wafResult.reason }),
    };
  }

  // --- Suspicious UA check ---
  if (isSuspiciousUserAgent(headers.get('user-agent'))) {
    return {
      status: 403,
      body: JSON.stringify({ error: 'Suspicious request' }),
    };
  }

  // --- Allowed: return security headers ---
  const securityHeaders = getSecurityHeaders();
  // Add rate limit headers for transparency
  securityHeaders['X-RateLimit-Limit'] = '60';
  securityHeaders['X-RateLimit-Remaining'] = String(rateLimit.remaining);

  return {
    status: 0, // 0 means pass through to Next.js
    headers: securityHeaders,
  };
}
