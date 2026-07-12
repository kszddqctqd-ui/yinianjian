// POST /api/incense/verify - 线上香验证码
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, code } = body;

    if (typeof window !== 'undefined') {
      if (action === 'request') {
        // 生成验证码
        const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let result = '';
        for (let i = 0; i < 5; i++) {
          result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const codes = JSON.parse(localStorage.getItem('wm_verify_codes') || '{}');
        codes.request = { code: result, expiresAt: Date.now() + 300000, used: false };
        localStorage.setItem('wm_verify_codes', JSON.stringify(codes));
        return NextResponse.json({ success: true, code: result, hint: '请输入验证码' });
      }

      if (action === 'verify') {
        const codes = JSON.parse(localStorage.getItem('wm_verify_codes') || '{}');
        const req = codes.request;
        if (!req) return NextResponse.json({ error: '验证码已过期' }, { status: 408 });
        if (req.used) return NextResponse.json({ error: '验证码已使用' }, { status: 410 });
        if (Date.now() > req.expiresAt) return NextResponse.json({ error: '验证码已过期' }, { status: 408 });
        if (req.code.toUpperCase() !== code?.toUpperCase()) {
          return NextResponse.json({ error: '验证码错误' }, { status: 401 });
        }
        req.used = true;
        localStorage.setItem('wm_verify_codes', JSON.stringify(codes));
        return NextResponse.json({ success: true, message: '验证通过' });
      }
    }

    return NextResponse.json({ error: '服务不可用' }, { status: 503 });
  } catch (err) {
    return NextResponse.json({ error: '验证失败' }, { status: 500 });
  }
}
