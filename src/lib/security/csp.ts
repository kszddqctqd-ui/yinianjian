/**
 * Content Security Policy (CSP) generator.
 * Provides strict CSP headers to prevent XSS and other code injection attacks.
 */

// Allowed sources for different resource types
const CSP_CONFIG = {
  'default-src': ["'self'"],
  'style-src': ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
  'script-src': ["'self'", "'strict-dynamic'"],
  'img-src': ["'self'", 'data:', 'https:'],
  'font-src': ["'self'", 'https://fonts.gstatic.com'],
  'connect-src': ["'self'"],
  'frame-src': ["'none'"],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'upgrade-insecure-requests': [],
};

/**
 * Build a CSP directive string from the config.
 */
function buildCspHeader(): string {
  const directives = Object.entries(CSP_CONFIG).map(([key, values]) => {
    if (values.length === 0) return key;
    return `${key} ${values.join(' ')}`;
  });
  return directives.join('; ');
}

/**
 * Get the CSP header value.
 */
export function getCspHeader(): string {
  return buildCspHeader();
}

/**
 * Get all security-related headers as an object.
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    'Content-Security-Policy': getCspHeader(),
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy':
      'camera=(), microphone=(), geolocation=(), payment=()',
    'X-DNS-Prefetch-Control': 'off',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  };
}
