import { NextResponse } from 'next/server';
import { calculateZiwei, calculateBazi, calculateBaziDayun, toZiweiText, toBaziText } from 'taibu-core';

export async function POST(req: Request) {
  try {
    const { year, month, day, hour, gender, type } = await req.json();

    if (!year || !month || !day || !hour || !gender) {
      return NextResponse.json({ error: '缺少参数' }, { status: 400 });
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
