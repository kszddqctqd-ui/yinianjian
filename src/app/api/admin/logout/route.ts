import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const response = NextResponse.redirect(new URL('/', request.url));
  response.headers.set('Set-Cookie', 'auth_token=; Path=/; HttpOnly; Max-Age=0');
  return response;
}
