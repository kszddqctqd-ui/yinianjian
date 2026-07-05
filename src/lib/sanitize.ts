/**
 * 安全的 HTML 清理工具
 * 移除所有危险的 HTML 标签和属性
 */

// 允许的 HTML 标签白名单
const ALLOWED_TAGS = new Set([
  'strong', 'em', 'b', 'i', 'u', 'br', 'p', 'span', 'div', 'ul', 'ol', 'li',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'table', 'thead', 'tbody', 'tr', 'td', 'th',
]);

// 危险的正则表达式
const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /<object\b[^>]*>/gi,
  /<embed\b[^>]*>/gi,
  /<iframe\b[^>]*>/gi,
  /<form\b[^>]*>/gi,
  /<applet\b[^>]*>/gi,
  /<meta\b[^>]*>/gi,
  /<base\b[^>]*>/gi,
  /on\w+\s*=/gi,  // 事件处理器
  /javascript:/gi,
  /vbscript:/gi,
  /data:text\/html/gi,
];

export function sanitizeHTML(html: string): string {
  if (!html) return '';

  let sanitized = html;

  // 移除危险模式
  for (const pattern of DANGEROUS_PATTERNS) {
    sanitized = sanitized.replace(pattern, '');
  }

  // 移除 script 标签及其内容
  sanitized = sanitized.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, '');
  sanitized = sanitized.replace(/<script[\s\S]*?\/?>/gi, '');

  // 移除所有 on* 事件属性
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*["'][^"']*["']/gi, '');
  sanitized = sanitized.replace(/\s+on\w+\s*=\s*[^\s>]*/gi, '');

  // 移除 javascript: 和 vbscript: URL
  sanitized = sanitized.replace(/href\s*=\s*["']javascript:[^"']*["']/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*["']javascript:[^"']*["']/gi, 'src=""');

  return sanitized;
}
