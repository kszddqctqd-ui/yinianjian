/**
 * Simple WAF (Web Application Firewall) for detecting common attacks.
 * Uses regex-based pattern matching on request headers, URLs, and bodies.
 */

// SQL injection patterns
const SQL_PATTERNS = [
  /\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|ALTER|CREATE|EXEC)\b.*\b(FROM|INTO|TABLE|WHERE|TO|WITH)\b/i,
  /\bOR\b\s+\d+\s*=\s*\d+/i,
  /\bOR\b\s+'[^']*'\s*=\s*'[^']*'/i,
  /;\s*(SELECT|INSERT|UPDATE|DELETE|DROP|ALTER)/i,
  /\bEXEC\b\s*\(/i,
  /xp_cmdshell/i,
  /\bWAITFOR\b\s+\bDELAY\b/i,
];

// XSS patterns
const XSS_PATTERNS = [
  /<script\b[^>]*>/gi,
  /javascript\s*:/i,
  /on(?:load|error|click|mouseover|focus|blur|submit|reset)\s*=/i,
  /<\s*iframe\b[^>]*>/gi,
  /<\s*object\b[^>]*>/gi,
  /<\s*embed\b[^>]*>/gi,
  /<\s*form\b[^>]*>/gi,
  /eval\s*\(/i,
  /String\.fromCharCode/i,
  /document\.cookie/i,
  /window\.location/i,
  /<\s*img\b[^>]*\bonerror\b/i,
];

// Path traversal patterns
const PATH_TRAVERSAL_PATTERNS = [
  /\.\.\//,
  /\.\.\\/ ,
  /%2e%2e%2f/i,
  /%2e%2e%5c/i,
  /\.\.%2f/i,
  /\.\.%5c/i,
  /\/etc\/passwd/i,
  /\/etc\/shadow/i,
  /c:\\windows/i,
];

// Malicious user-agent patterns
const MALICIOUS_UA_PATTERNS = [
  /sqlmap/i,
  /nikto/i,
  /nmap/i,
  /masscan/i,
  /dirbuster/i,
  /gobuster/i,
  /wfuzz/i,
  /hydra/i,
  /burpsuite/i,
  /metasploit/i,
  /havij/i,
  /acunetix/i,
];

export interface WafResult {
  blocked: boolean;
  reason: string;
}

/**
 * Check a URL or query string for malicious patterns.
 */
function checkUrl(url: string): WafResult | null {
  for (const pattern of SQL_PATTERNS) {
    if (pattern.test(url)) {
      return { blocked: true, reason: 'SQL injection detected' };
    }
  }
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(url)) {
      return { blocked: true, reason: 'XSS attack detected' };
    }
  }
  for (const pattern of PATH_TRAVERSAL_PATTERNS) {
    if (pattern.test(url)) {
      return { blocked: true, reason: 'Path traversal detected' };
    }
  }
  return null;
}

/**
 * Check a request body for malicious patterns.
 */
function checkBody(body: string): WafResult | null {
  for (const pattern of SQL_PATTERNS) {
    if (pattern.test(body)) {
      return { blocked: true, reason: 'SQL injection in body detected' };
    }
  }
  for (const pattern of XSS_PATTERNS) {
    if (pattern.test(body)) {
      return { blocked: true, reason: 'XSS in body detected' };
    }
  }
  return null;
}

/**
 * Check User-Agent header for known malicious crawlers/tools.
 */
function checkUserAgent(ua: string): WafResult | null {
  if (!ua) return null;
  for (const pattern of MALICIOUS_UA_PATTERNS) {
    if (pattern.test(ua)) {
      return { blocked: true, reason: 'Malicious scanner detected' };
    }
  }
  // Empty or extremely long UA is suspicious
  if (ua.length > 1024) {
    return { blocked: true, reason: 'Suspicious User-Agent length' };
  }
  return null;
}

/**
 * Main WAF entry point. Checks the incoming request for threats.
 */
export function wafCheck(options: {
  url?: string;
  method?: string;
  body?: string;
  userAgent?: string;
}): WafResult | null {
  // Method validation
  const allowedMethods = ['GET', 'HEAD', 'POST'];
  if (options.method && !allowedMethods.includes(options.method.toUpperCase())) {
    return { blocked: true, reason: `Method ${options.method} not allowed` };
  }

  // Check URL
  if (options.url) {
    const urlResult = checkUrl(options.url);
    if (urlResult) return urlResult;
  }

  // Check body
  if (options.body) {
    const bodyResult = checkBody(options.body);
    if (bodyResult) return bodyResult;
  }

  // Check User-Agent
  if (options.userAgent) {
    const uaResult = checkUserAgent(options.userAgent);
    if (uaResult) return uaResult;
  }

  return null;
}
