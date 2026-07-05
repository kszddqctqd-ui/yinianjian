import { NextResponse } from 'next/server';
import { chat, ChatRequest, checkRateLimit, getClientIp } from '@/lib/llm';

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
    if (!checkRateLimit(ip, 10)) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 },
      );
    }

    // 解析请求体
    const body = await req.json() as Record<string, unknown>;
    const messages = body.messages as ChatRequest['messages'];

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: '请提供消息列表' },
        { status: 400 },
      );
    }

    // 消息长度校验
    if (messages.length > 50) {
      return NextResponse.json(
        { error: '消息数量过多' },
        { status: 400 },
      );
    }

    // 构建请求
    const request: ChatRequest = {
      messages,
      model: typeof body.model === 'string' ? body.model : undefined,
      temperature: typeof body.temperature === 'number'
        ? Math.max(0, Math.min(2, body.temperature))
        : 0.7,
      maxTokens: typeof body.maxTokens === 'number'
        ? Math.max(1, body.maxTokens)
        : 4096,
      stream: false,
      provider: typeof body.provider === 'string' ? body.provider : undefined,
    };

    // 调用 LLM
    const response = await chat(request);

    if (!response.success) {
      return NextResponse.json(
        { error: response.error || 'LLM 调用失败' },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      content: response.content,
      provider: response.provider,
      model: response.model,
      usage: response.usage,
    });
  } catch (e: any) {
    console.error('[API /chat] Error:', e);
    return NextResponse.json(
      { error: e.message || '服务器内部错误' },
      { status: 500 },
    );
  }
}
