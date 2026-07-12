// GET/POST /api/orders - 订单管理
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (typeof window !== 'undefined') {
    const orders = JSON.parse(localStorage.getItem('wm_orders') || '[]');
    const filtered = userId ? orders.filter((o: any) => o.userId === userId) : orders;
    return NextResponse.json({
      success: true,
      orders: filtered.slice(0, 50),
      total: filtered.length,
    });
  }
  return NextResponse.json({ error: '服务不可用' }, { status: 503 });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, orderId } = body;

    if (action === 'cancel' && typeof window !== 'undefined') {
      const orders = JSON.parse(localStorage.getItem('wm_orders') || '[]');
      const idx = orders.findIndex((o: any) => o.id === orderId);
      if (idx >= 0) {
        orders[idx].status = 'cancelled';
        localStorage.setItem('wm_orders', JSON.stringify(orders));
        return NextResponse.json({ success: true, message: '订单已取消' });
      }
    }

    return NextResponse.json({ error: '未知操作' }, { status: 400 });
  } catch {
    return NextResponse.json({ error: '操作失败' }, { status: 500 });
  }
}
