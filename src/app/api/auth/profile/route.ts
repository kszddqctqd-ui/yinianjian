// GET /api/auth/profile - 获取用户资料
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (typeof window !== 'undefined') {
    const currentUser = JSON.parse(localStorage.getItem('wm_current_user') || 'null');
    if (!currentUser) {
      return NextResponse.json({ error: '未登录' }, { status: 401 });
    }
    const users = JSON.parse(localStorage.getItem('wm_users') || '[]');
    const user = users.find((u: any) => u.id === currentUser.id);
    if (!user) {
      return NextResponse.json({ error: '用户不存在' }, { status: 404 });
    }
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        phone: user.phone,
        referralCode: user.referralCode,
        totalSpent: user.totalSpent || 0,
        totalEarned: user.totalEarned || 0,
        referrals: user.referrals || 0,
        createdAt: user.createdAt,
      },
    });
  }

  return NextResponse.json({ error: '服务不可用' }, { status: 503 });
}
