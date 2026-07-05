/**
 * 统一 LLM 调用接口
 * 支持 OpenAI、Anthropic (Claude)、Google (Gemini) 等多提供商
 * 具备自动故障转移、重试、流式输出能力
 */

import { getLLMConfig, getProviderConfig, ProviderConfig } from './llm-config';

// ── 类型定义 ──────────────────────────────────────────────

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: Message[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  provider?: string;
}

export interface ChatResponse {
  success: boolean;
  provider: string;
  model: string;
  content: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  error?: string;
}

export interface StreamChunk {
  type: 'text' | 'usage' | 'error' | 'done';
  data: string | Record<string, unknown>;
}

export interface RateLimiterEntry {
  count: number;
  resetAt: number;
}

// 流式结果包装器
interface StreamResult {
  kind: 'stream';
  iterable: AsyncIterable<StreamChunk>;
}

interface ResponseResult {
  kind: 'response';
  response: ChatResponse;
}

type CallResult = StreamResult | ResponseResult;

// ── 请求体提取工具 ────────────────────────────────────────

function extractSystemAndUserMessages(messages: Message[]): {
  systemPrompt: string;
  chatMessages: Message[];
} {
  const systemPrompts: string[] = [];
  const chatMessages: Message[] = [];

  for (const msg of messages) {
    if (msg.role === 'system') {
      systemPrompts.push(msg.content);
    } else {
      chatMessages.push(msg);
    }
  }

  const systemPrompt = systemPrompts.join('\n\n');
  return { systemPrompt, chatMessages };
}

// ── 限流器（内存计数，每 IP 独立） ─────────────────────────

const rateLimitMap = new Map<string, RateLimiterEntry>();

export function checkRateLimit(ip: string, maxRequests: number = 10): boolean {
  const now = Date.now();
  const windowMs = 60_000;

  let entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    entry = { count: 0, resetAt: now + windowMs };
  }

  if (entry.count >= maxRequests) {
    return false;
  }

  entry.count++;
  rateLimitMap.set(ip, entry);

  // 清理过期的条目
  if (rateLimitMap.size > 1000) {
    const expiredKeys: string[] = [];
    for (const [k, v] of rateLimitMap.entries()) {
      if (now > v.resetAt) {
        expiredKeys.push(k);
      }
    }
    for (const k of expiredKeys) {
      rateLimitMap.delete(k);
    }
  }

  return true;
}

// ── 客户端 IP 提取 ────────────────────────────────────────

export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  const url = new URL(req.url);
  return url.hostname === 'localhost' ? '127.0.0.1' : 'unknown';
}

// ── 消息格式转换 ──────────────────────────────────────────

function toOpenAIMessages(messages: Message[]) {
  return messages.map(m => ({ role: m.role, content: m.content }));
}

function toAnthropicMessages(messages: Message[]) {
  return messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    }));
}

function toGoogleMessages(messages: Message[]) {
  return messages
    .filter(m => m.role !== 'system')
    .map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));
}

// ── OpenAI 流式解析 ──────────────────────────────────────

async function* parseOpenAIStream(
  body: ReadableStream<Uint8Array>,
): AsyncIterable<StreamChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || !trimmed.startsWith('data: ')) continue;

      const dataStr = trimmed.slice(6);
      if (dataStr === '[DONE]') {
        yield { type: 'done', data: '' };
        return;
      }

      try {
        const data = JSON.parse(dataStr) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const content = data.choices?.[0]?.delta?.content;
        if (content) {
          yield { type: 'text', data: content };
        }
      } catch {
        // 跳过解析失败的行
      }
    }
  }
}

// ── Anthropic 流式解析 ───────────────────────────────────

async function* parseAnthropicStream(
  body: ReadableStream<Uint8Array>,
): AsyncIterable<StreamChunk> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === 'event: ping') continue;
      if (trimmed.startsWith('event: ')) continue;
      if (!trimmed.startsWith('data: ')) continue;

      const dataStr = trimmed.slice(6);
      try {
        const data = JSON.parse(dataStr) as {
          type?: string;
          delta?: { text?: string };
        };

        if (data.type === 'content_block_delta' && data.delta?.text) {
          yield { type: 'text', data: data.delta.text };
        }

        if (data.type === 'message_stop') {
          yield { type: 'done', data: '' };
          return;
        }
      } catch {
        // 跳过解析失败的行
      }
    }
  }

  yield { type: 'done', data: '' };
}

// ── 各提供商调用实现 ──────────────────────────────────────

async function callOpenAI(
  config: ProviderConfig,
  messages: Message[],
  options: { temperature?: number; maxTokens?: number; stream?: boolean } = {},
): Promise<CallResult> {
  const { systemPrompt, chatMessages } = extractSystemAndUserMessages(messages);
  const firstModel = config.models[0]?.modelId || 'gpt-4o';

  const body: Record<string, unknown> = {
    model: firstModel,
    messages: systemPrompt
      ? [{ role: 'system' as const, content: systemPrompt }, ...toOpenAIMessages(chatMessages)]
      : toOpenAIMessages(chatMessages),
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4096,
    stream: options.stream ?? false,
  };

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
  };

  const baseUrl = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(getLLMConfig().timeoutMs),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errBody}`);
  }

  // 流式响应
  if (options.stream && response.body) {
    return {
      kind: 'stream',
      iterable: parseOpenAIStream(response.body),
    };
  }

  const data = await response.json() as {
    choices?: Array<{ message?: { content?: string } }>;
    usage?: { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number };
  };

  const choice = data.choices?.[0];
  if (!choice?.message?.content) {
    throw new Error('OpenAI returned empty response');
  }

  return {
    kind: 'response',
    response: {
      success: true,
      provider: 'openai',
      model: firstModel,
      content: choice.message.content,
      usage: data.usage
        ? {
            promptTokens: data.usage.prompt_tokens ?? 0,
            completionTokens: data.usage.completion_tokens ?? 0,
            totalTokens: data.usage.total_tokens ?? 0,
          }
        : undefined,
    },
  };
}

async function callAnthropic(
  config: ProviderConfig,
  messages: Message[],
  options: { temperature?: number; maxTokens?: number; stream?: boolean } = {},
): Promise<CallResult> {
  const { systemPrompt, chatMessages } = extractSystemAndUserMessages(messages);
  const firstModel = config.models[0]?.modelId || 'claude-sonnet-4-20250514';

  const body: Record<string, unknown> = {
    model: firstModel,
    messages: toAnthropicMessages(chatMessages),
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 4096,
    stream: options.stream ?? false,
  };

  if (systemPrompt) {
    body.system = systemPrompt;
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-api-key': process.env.ANTHROPIC_API_KEY || '',
    'anthropic-version': '2023-06-01',
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(getLLMConfig().timeoutMs),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Anthropic API error ${response.status}: ${errBody}`);
  }

  // 流式响应
  if (options.stream && response.body) {
    return {
      kind: 'stream',
      iterable: parseAnthropicStream(response.body),
    };
  }

  const data = await response.json() as {
    content?: Array<{ type?: string; text?: string }>;
    usage?: { input_tokens?: number; output_tokens?: number };
  };

  const textBlock = data.content?.find(c => c.type === 'text');
  if (!textBlock?.text) {
    throw new Error('Anthropic returned empty response');
  }

  return {
    kind: 'response',
    response: {
      success: true,
      provider: 'anthropic',
      model: firstModel,
      content: textBlock.text,
      usage: data.usage
        ? {
            promptTokens: data.usage.input_tokens ?? 0,
            completionTokens: data.usage.output_tokens ?? 0,
            totalTokens: (data.usage.input_tokens ?? 0) + (data.usage.output_tokens ?? 0),
          }
        : undefined,
    },
  };
}

async function callGoogle(
  config: ProviderConfig,
  messages: Message[],
  options: { temperature?: number; maxTokens?: number; stream?: boolean } = {},
): Promise<CallResult> {
  const { systemPrompt, chatMessages } = extractSystemAndUserMessages(messages);
  const firstModel = config.models[0]?.modelId || 'gemini-2.5-pro';

  const body: Record<string, unknown> = {
    contents: toGoogleMessages(chatMessages),
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 8192,
    },
  };

  if (systemPrompt) {
    body.systemInstruction = { parts: [{ text: systemPrompt }] };
  }

  const apiKey = process.env.GOOGLE_API_KEY;
  const baseUrl = process.env.GOOGLE_BASE_URL || 'https://generativelanguage.googleapis.com/v1beta';
  const url = `${baseUrl}/models/${firstModel}:generateContent${apiKey ? `?key=${apiKey}` : ''}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(getLLMConfig().timeoutMs),
  });

  if (!response.ok) {
    const errBody = await response.text();
    throw new Error(`Google API error ${response.status}: ${errBody}`);
  }

  const data = await response.json() as {
    candidates?: Array<{
      content?: { parts?: Array<{ text?: string }> };
    }>;
    usageMetadata?: {
      promptTokenCount?: number;
      candidatesTokenCount?: number;
      totalTokenCount?: number;
    };
  };

  const candidate = data.candidates?.[0];
  const text = candidate?.content?.parts?.[0]?.text;

  if (!text) {
    throw new Error('Google returned empty response');
  }

  return {
    kind: 'response',
    response: {
      success: true,
      provider: 'google',
      model: firstModel,
      content: text,
      usage: data.usageMetadata
        ? {
            promptTokens: data.usageMetadata.promptTokenCount ?? 0,
            completionTokens: data.usageMetadata.candidatesTokenCount ?? 0,
            totalTokens: data.usageMetadata.totalTokenCount ?? 0,
          }
        : undefined,
    },
  };
}

// ── 通用调用引擎 ──────────────────────────────────────────

async function callProvider(
  provider: ProviderConfig,
  messages: Message[],
  options: { temperature?: number; maxTokens?: number; stream?: boolean } = {},
): Promise<CallResult> {
  switch (provider.id) {
    case 'openai':
      return callOpenAI(provider, messages, options);
    case 'anthropic':
      return callAnthropic(provider, messages, options);
    case 'google':
      return callGoogle(provider, messages, options);
    case 'custom':
      return callOpenAI(provider, messages, options);
    default:
      throw new Error(`Unknown provider: ${provider.id}`);
  }
}

// ── 辅助：从 CallResult 收集流式文本 ──────────────────────

async function collectStream(iterable: AsyncIterable<StreamChunk>): Promise<string> {
  let collected = '';
  for await (const chunk of iterable) {
    if (chunk.type === 'text') {
      collected += chunk.data;
    }
    if (chunk.type === 'error') {
      throw new Error(typeof chunk.data === 'string' ? chunk.data : JSON.stringify(chunk.data));
    }
  }
  return collected;
}

// ── 主入口：调用单个提供商（带重试） ──────────────────────

async function callWithRetry(
  provider: ProviderConfig,
  messages: Message[],
  options: { temperature?: number; maxTokens?: number; stream?: boolean },
  attempt: number = 0,
): Promise<ChatResponse> {
  try {
    const result = await callProvider(provider, messages, options);

    if (result.kind === 'response') {
      return result.response;
    }

    const collected = await collectStream(result.iterable);
    return {
      success: true,
      provider: provider.id,
      model: provider.models[0]?.modelId || 'unknown',
      content: collected,
    };
  } catch (err: any) {
    const maxRetries = getLLMConfig().maxRetries;
    if (attempt < maxRetries) {
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return callWithRetry(provider, messages, options, attempt + 1);
    }
    throw err;
  }
}

// ── 主函数：统一聊天接口 ──────────────────────────────────

/**
 * 发送聊天请求，自动选择可用的提供商
 */
export async function chat(request: ChatRequest): Promise<ChatResponse> {
  const config = getLLMConfig();
  const providers = request.provider
    ? [getProviderConfig(request.provider)].filter(Boolean) as ProviderConfig[]
    : config.providers.filter(p => p.enabled);

  if (providers.length === 0) {
    return {
      success: false,
      provider: '',
      model: '',
      content: '',
      error: '没有可用的 LLM 提供商，请检查环境变量配置',
    };
  }

  const temperature = request.temperature ?? 0.7;
  const maxTokens = request.maxTokens ?? 4096;

  for (const provider of providers) {
    try {
      return await callWithRetry(provider, request.messages, {
        temperature,
        maxTokens,
        stream: false,
      });
    } catch (err: any) {
      console.warn(`[LLM] Provider ${provider.id} failed:`, err.message);
    }
  }

  return {
    success: false,
    provider: '',
    model: '',
    content: '',
    error: `所有 LLM 提供商均不可用。已尝试: ${providers.map(p => p.name).join(', ')}`,
  };
}

// ── 流式聊天接口 ──────────────────────────────────────────

/**
 * 发送流式聊天请求
 */
export async function* chatStream(request: ChatRequest): AsyncIterable<StreamChunk> {
  const config = getLLMConfig();
  const providers = request.provider
    ? [getProviderConfig(request.provider)].filter(Boolean) as ProviderConfig[]
    : config.providers.filter(p => p.enabled);

  if (providers.length === 0) {
    yield { type: 'error', data: '没有可用的 LLM 提供商' };
    return;
  }

  const temperature = request.temperature ?? 0.7;
  const maxTokens = request.maxTokens ?? 4096;

  for (const provider of providers) {
    try {
      const result = await callProvider(provider, request.messages, {
        temperature,
        maxTokens,
        stream: true,
      });

      if (result.kind === 'stream') {
        for await (const chunk of result.iterable) {
          yield chunk;
        }
        return;
      }
    } catch (err: any) {
      console.warn(`[LLM Stream] Provider ${provider.id} failed:`, err.message);
    }
  }

  yield { type: 'error', data: '所有 LLM 提供商均不可用' };
}

// ── 导出类型供外部使用 ────────────────────────────────────

export type { ProviderConfig } from './llm-config';