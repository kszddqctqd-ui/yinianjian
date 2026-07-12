// POST /api/share/referral - 分享裂变/返佣
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fromUserId, toUserId, action } = body;

    if (typeof window !== 'undefined') {
      if (action === 'register') {
        // 新用户通过推荐码注册
        const referrals = JSON.parse(localStorage.getItem('wm_referrals') || '[]');
        const commission = {
          id: 'com_' + Date.now(),
          fromUserId,
          toUserId,
          amount: 0, // 注册时暂无佣金
          status: 'pending',
          createdAt: new Date().toISOString(),
        };
        referrals.push(commission);
        localStorage.setItem('wm_referrals', JSON.stringify(referrals));

        // Update referrer referral count
        const users = JSON.parse(localStorage.getItem('wm_users') || '[]');
        const idx = users.findIndex((u: any) => u.id === fromUserId);
        if (idx >= 0) {
          users[idx].referrals = (users[idx].referrals || 0) + 1;
          localStorage.setItem('wm_users', JSON.stringify(users));
        }

        return NextResponse.json({ success: true, message: '推荐成功' });
      }

      if (action === 'earn') {
        // 被推荐人消费后获得返佣
        const commission = {
          id: 'com_' + Date.now(),
          fromUserId,
          toUserId,
          amount: body.amount || 0,
          status: 'earned',
          createdAt: new Date().toISOString(),
        };
        const referrals = JSON.parse(localStorage.getItem('wm_referrals') || '[]');
        referrals.push(commission);
        localStorage.setItem('wm_referrals', JSON.stringify(referrals));

        // Credit referrer
        const users = JSON.parse(localStorage.getItem('wm_users') || '[]');
        const idx = users.findIndex((u: any) => u.id === fromUserId);
        if (idx >= 0) {
          users[idx].totalEarned = (users[idx].totalEarned || 0) + parseFloat(body.amount || '0');
          localStorage.setItem('wm_users', JSON.stringify(users));
        }

        return NextResponse.json({ success: true, message: '返佣到账' });
      }
    }

    return NextResponse.json({ error: '服务不可用' }, { status: 503 });
  } catch (err) {
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
