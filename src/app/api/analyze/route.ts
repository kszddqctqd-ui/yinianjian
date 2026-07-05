import { NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/llm';

// 手相/面相/八字分析的系统提示词模板
const ANALYSIS_PROMPTS = {
  palmistry: `你是一个专业的中国手相学大师。请根据用户提供的手相照片描述和基本信息，给出详细的命运分析。
分析要点：
1. 手型与五行属性
2. 主要纹路（生命线、智慧线、感情线、事业线）的形态和含义
3. 丘位分布与性格特征
4. 综合运势建议

请用专业但通俗易懂的语言回答，保持积极正面的态度。`,

  face: `你是一个专业的中国面相学大师。请根据用户提供的面相照片描述和基本信息，给出详细的命运分析。
分析要点：
1. 面型与五行属性
2. 五官（眉、眼、鼻、口、耳）的特征和含义
3. 十二宫位分析
4. 综合运势建议

请用专业但通俗易懂的语言回答，保持积极正面的态度。`,

  bazi: `你是一个专业的中国传统命理学大师。请根据用户的八字信息和手相/面相分析结果，给出综合的命运解读。
分析要点：
1. 八字格局分析
2. 五行强弱与喜忌
3. 大运流年趋势
4. 与手相/面相结果的交叉验证
5. 综合运势与建议

请用专业但通俗易懂的语言回答，保持积极正面的态度。`,
};

export async function POST(req: Request) {
  try {
    // Content-Type 校验
    const contentType = req.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      return NextResponse.json(
        { error: 'Content-Type 必须是 application/json' },
        { status: 415 },
      );
    }

    // 限流检查
    const ip = getClientIp(req);
    if (!checkRateLimit(ip, 5)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 },
      );
    }

    // 解析请求体
    const body = await req.json() as Record<string, unknown>;
    const text = typeof body.text === 'string' ? body.text : '';
    const imageUrl = typeof body.image_url === 'string' ? body.image_url : '';
    const category = (typeof body.category === 'string' ? body.category : 'palmistry') as 'palmistry' | 'face' | 'bazi';

    if (!text || text.length > 5000) {
      return NextResponse.json(
        { error: '请提供分析内容（最多5000字）' },
        { status: 400 },
      );
    }

    // 构建系统提示词
    const systemPrompt = ANALYSIS_PROMPTS[category] || ANALYSIS_PROMPTS.palmistry;

    // 构建图片描述（如果有图片 URL）
    let imageContext = '';
    if (imageUrl) {
      // 验证 URL 格式
      try {
        new URL(imageUrl);
        imageContext = `\n\n分析对象图片：${imageUrl}\n请结合上述图片信息进行综合分析。`;
      } catch {
        return NextResponse.json(
          { error: '无效的 URL 格式' },
          { status: 400 },
        );
      }
    }

    const prompt = `${text}${imageContext}`;

    // 调用 LLM
    const { chat } = await import('@/lib/llm');
    const response = await chat({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt },
      ],
      temperature: 0.5,
      maxTokens: 2048,
      provider: typeof body.provider === 'string' ? body.provider : undefined,
    });

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || '分析服务暂时不可用' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      content: response.content,
      provider: response.provider,
      model: response.model,
    });
  } catch (e: any) {
    console.error('[API /analyze] Error:', e);
    return NextResponse.json(
      { error: e.message || '服务器内部错误' },
      { status: 500 },
    );
  }
}
