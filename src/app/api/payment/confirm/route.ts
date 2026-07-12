// POST /api/payment/confirm - 支付回调确认
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, orderId, amount, type, proofUrl } = body;

    if (!userId || !amount) {
      return NextResponse.json({ error: '参数缺失' }, { status: 400 });
    }

    if (typeof window !== 'undefined') {
      // Save order
      const orders = JSON.parse(localStorage.getItem('wm_orders') || '[]');
      const order = {
        id: 'ord_' + Date.now(),
        userId,
        orderId: orderId || 'ord_' + Date.now(),
        amount: parseFloat(amount),
        type: type || 'lantern',
        status: 'confirmed',
        proofUrl: proofUrl || '',
        createdAt: new Date().toISOString(),
      };
      orders.push(order);
      localStorage.setItem('wm_orders', JSON.stringify(orders));

      // Update user total spent
      const users = JSON.parse(localStorage.getItem('wm_users') || '[]');
      const idx = users.findIndex((u: any) => u.id === userId);
      if (idx >= 0) {
        users[idx].totalSpent = (users[idx].totalSpent || 0) + parseFloat(amount);
        localStorage.setItem('wm_users', JSON.stringify(users));
      }

      return NextResponse.json({
        success: true,
        order,
        message: '支付确认成功',
      });
    }

    return NextResponse.json({ error: '服务不可用' }, { status: 503 });
  } catch (err) {
    return NextResponse.json({ error: '确认失败' }, { status: 500 });
  }
}
