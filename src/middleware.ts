/**
 * Next.js Middleware - Entry point for all requests.
 * Applies security headers, rate limiting, and WAF protection.
 */

import { NextResponse, userAgent } from 'next/server';
import type { NextRequest } from 'next/server';
import { securityMiddleware } from '@/lib/security/middleware';
import { startRateLimitCleanup } from '@/lib/security/rate-limit';

// Start periodic cleanup of rate limit entries
startRateLimitCleanup();

export async function middleware(request: NextRequest) {
  const result = await securityMiddleware({
    url: request.nextUrl.pathname + request.nextUrl.search,
    method: request.method,
    headers: request.headers,
    body: request.method === 'POST' ? await request.text() : undefined,
  });

  const response = await finalizeResponse(result, request);
  return response;
}

async function finalizeResponse(
  result: { status: number; headers?: Record<string, string>; body?: string } | null,
  request: NextRequest
): Promise<NextResponse> {
  // Blocked request
  if (result && result.status !== 0) {
    return new NextResponse(result.body, {
      status: result.status,
      headers: result.headers,
    });
  }

  // Allowed request - add security headers
  const response = NextResponse.next();

  if (result?.headers) {
    for (const [key, value] of Object.entries(result.headers)) {
      response.headers.set(key, value);
    }
  }

  return response;
}

export const config = {
  // Run on all paths except static files, favicons, and model files
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp)$|models/.*)$)'],
};
