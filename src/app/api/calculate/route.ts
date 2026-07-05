import { NextResponse } from 'next/server';
import { calculateZiwei, calculateBazi, calculateBaziDayun, toZiweiText, toBaziText } from 'taibu-core';

export async function POST(req: Request) {
  try {
    // Content-Type 校验
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json({ error: 'Content-Type 必须是 application/json' }, { status: 415 });
    }

    const body = await req.json() as Record<string, unknown>;

    const year = typeof body.year === 'number' ? body.year : parseInt(String(body.year));
    const month = typeof body.month === 'number' ? body.month : parseInt(String(body.month));
    const day = typeof body.day === 'number' ? body.day : parseInt(String(body.day));
    const hour = typeof body.hour === 'number' ? body.hour : parseInt(String(body.hour));
    const gender = typeof body.gender === 'string' ? body.gender : '';
    const type = typeof body.type === 'string' ? body.type : '';

    if (!year || !month || !day || !hour || !gender) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
    }

    // 参数范围校验
    if (year < 1900 || year > 2100) {
      return NextResponse.json({ error: '年份超出范围' }, { status: 400 });
    }
    if (month < 1 || month > 12) {
      return NextResponse.json({ error: '月份超出范围' }, { status: 400 });
    }
    if (day < 1 || day > 31) {
      return NextResponse.json({ error: '日期超出范围' }, { status: 400 });
    }
    if (hour < 0 || hour > 23) {
      return NextResponse.json({ error: '小时超出范围' }, { status: 400 });
    }

    const genderCode = gender === '男' ? 'male' : 'female';
    if (type === 'ziwei') {
      const result = calculateZiwei({ birthYear: year, birthMonth: month, birthDay: day, birthHour: hour, gender: genderCode });
      return NextResponse.json({ success: true, data: result });
    }

    if (type === 'bazi') {
      const result = calculateBazi({ birthYear: year, birthMonth: month, birthDay: day, birthHour: hour, gender: genderCode });
      return NextResponse.json({ success: true, data: result });
    }

    return NextResponse.json({ error: '不支持的类型' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
