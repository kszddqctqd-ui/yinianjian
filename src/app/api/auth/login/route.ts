// POST /api/auth/login - 用户登录
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phone, password } = body;

    if (!phone) {
      return NextResponse.json({ error: '请输入手机号' }, { status: 400 });
    }

    if (typeof window !== 'undefined') {
      const users = JSON.parse(localStorage.getItem('wm_users') || '[]');
      const user = users.find((u: any) => u.phone === phone);
      if (!user) {
        return NextResponse.json({ error: '用户不存在' }, { status: 404 });
      }
      if (password && user.password !== 'hashed_' + password) {
        return NextResponse.json({ error: '密码错误' }, { status: 401 });
      }
      localStorage.setItem('wm_current_user', JSON.stringify({ id: user.id, username: user.username, phone: user.phone, referralCode: user.referralCode }));
      return NextResponse.json({
        success: true,
        user: { id: user.id, username: user.username, phone: user.phone, referralCode: user.referralCode, totalSpent: user.totalSpent || 0 },
      });
    }

    return NextResponse.json({ error: '服务不可用' }, { status: 503 });
  } catch (err) {
    return NextResponse.json({ error: '登录失败' }, { status: 500 });
  }
}
