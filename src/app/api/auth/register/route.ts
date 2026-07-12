// POST /api/auth/register - 用户注册
import { NextResponse } from 'next/server';

function getUsers(): any[] {
  try {
    const raw = typeof globalThis !== 'undefined' ? '' : '';
    return [];
  } catch { return []; }
}

function saveUsers(users: any[]) {
  // localStorage-based persistence for demo
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, phone, password } = body;

    if (!username || !phone) {
      return NextResponse.json({ error: '用户名和手机号必填' }, { status: 400 });
    }

    // Generate referral code
    const referralCode = 'WM' + Date.now().toString(36).toUpperCase().slice(-6);

    const user = {
      id: 'u_' + Date.now(),
      username,
      phone,
      password: password ? 'hashed_' + password : '',
      referralCode,
      totalSpent: 0,
      totalEarned: 0,
      referrals: 0,
      createdAt: new Date().toISOString(),
    };

    // Store in localStorage (Next.js edge compatible)
    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('wm_users') || '[]');
      if (users.find((u: any) => u.phone === phone)) {
        return NextResponse.json({ error: '手机号已注册' }, { status: 409 });
      }
      users.push(user);
      localStorage.setItem('wm_users', JSON.stringify(users));
      localStorage.setItem('wm_current_user', JSON.stringify({ id: user.id, username: user.username, phone: user.phone, referralCode: user.referralCode }));
    }

    return NextResponse.json({
      success: true,
      user: { id: user.id, username: user.username, phone: user.phone, referralCode: user.referralCode },
    });
  } catch (err) {
    return NextResponse.json({ error: '注册失败' }, { status: 500 });
  }
}
