/**
 * LLM 多提供商配置管理
 * 从环境变量读取各模型的 API Key 和基础 URL
 */

// ── 类型定义 ──────────────────────────────────────────────

export interface ProviderConfig {
  /** 提供商标识 */
  id: string;
  /** 显示名称 */
  name: string;
  /** 是否启用 */
  enabled: boolean;
  /** 默认模型列表（按优先级排列） */
  models: ModelEntry[];
}

export interface ModelEntry {
  /** 模型 ID */
  modelId: string;
  /** 最大 token 数 */
  maxTokens: number;
  /** 温度范围 [min, max] */
  temperatureRange: [number, number];
}

export interface LLMConfig {
  providers: ProviderConfig[];
  /** 默认提供商 ID */
  defaultProvider: string;
  /** 全局超时（毫秒） */
  timeoutMs: number;
  /** 最大重试次数 */
  maxRetries: number;
}

// ── 环境变量读取 ──────────────────────────────────────────

function getEnv(key: string): string | undefined {
  return process.env[key];
}

function bool(env: string | undefined, fallback = false): boolean {
  if (env === undefined) return fallback;
  return env !== '0' && env.toLowerCase() !== 'false' && env !== '';
}

// ── 构建配置 ──────────────────────────────────────────────

function buildConfig(): LLMConfig {
  const providers: ProviderConfig[] = [];

  // OpenAI (兼容 gpt-4 / gpt-4o / o1 等)
  const openaiKey = getEnv('OPENAI_API_KEY');
  if (openaiKey) {
    providers.push({
      id: 'openai',
      name: 'OpenAI',
      enabled: true,
      models: [
        { modelId: 'gpt-4o', maxTokens: 8192, temperatureRange: [0, 2] },
        { modelId: 'gpt-4-turbo', maxTokens: 128000, temperatureRange: [0, 2] },
        { modelId: 'gpt-4', maxTokens: 8192, temperatureRange: [0, 2] },
        { modelId: 'gpt-3.5-turbo', maxTokens: 4096, temperatureRange: [0, 2] },
      ],
    });
  } else {
    // 即使没有 key 也注册 provider（enabled=false），用于优雅降级提示
    providers.push({
      id: 'openai',
      name: 'OpenAI',
      enabled: false,
      models: [
        { modelId: 'gpt-4o', maxTokens: 8192, temperatureRange: [0, 2] },
      ],
    });
  }

  // Anthropic (Claude)
  const anthropicKey = getEnv('ANTHROPIC_API_KEY');
  if (anthropicKey) {
    providers.push({
      id: 'anthropic',
      name: 'Anthropic (Claude)',
      enabled: true,
      models: [
        { modelId: 'claude-sonnet-4-20250514', maxTokens: 200000, temperatureRange: [0, 1] },
        { modelId: 'claude-opus-4-20250514', maxTokens: 200000, temperatureRange: [0, 1] },
        { modelId: 'claude-3-5-sonnet-latest', maxTokens: 200000, temperatureRange: [0, 1] },
      ],
    });
  } else {
    providers.push({
      id: 'anthropic',
      name: 'Anthropic (Claude)',
      enabled: false,
      models: [
        { modelId: 'claude-sonnet-4-20250514', maxTokens: 200000, temperatureRange: [0, 1] },
      ],
    });
  }

  // Google (Gemini)
  const googleKey = getEnv('GOOGLE_API_KEY');
  if (googleKey) {
    providers.push({
      id: 'google',
      name: 'Google (Gemini)',
      enabled: true,
      models: [
        { modelId: 'gemini-2.5-pro', maxTokens: 1048576, temperatureRange: [0, 2] },
        { modelId: 'gemini-2.0-flash', maxTokens: 1048576, temperatureRange: [0, 2] },
        { modelId: 'gemini-1.5-pro', maxTokens: 2000000, temperatureRange: [0, 2] },
      ],
    });
  } else {
    providers.push({
      id: 'google',
      name: 'Google (Gemini)',
      enabled: false,
      models: [
        { modelId: 'gemini-2.5-pro', maxTokens: 1048576, temperatureRange: [0, 2] },
      ],
    });
  }

  // 自定义提供商（通过环境变量注入）
  const customBase = getEnv('CUSTOM_LLM_BASE_URL');
  if (customBase) {
    const customKey = getEnv('CUSTOM_LLM_API_KEY') || '';
    const customModel = getEnv('CUSTOM_LLM_MODEL') || 'qwen-turbo';
    providers.push({
      id: 'custom',
      name: 'Custom LLM',
      enabled: !!customKey,
      models: [
        { modelId: customModel, maxTokens: 8192, temperatureRange: [0, 2] },
      ],
    });
  }

  // 默认优先顺序：anthropic > openai > google > custom
  const defaultProvider = providers.find(p => p.enabled)?.id || 'openai';

  return {
    providers,
    defaultProvider,
    timeoutMs: Number(getEnv('LLM_TIMEOUT_MS')) || 30000,
    maxRetries: Number(getEnv('LLM_MAX_RETRIES')) || 2,
  };
}

// ── 单例缓存 ──────────────────────────────────────────────

let _config: LLMConfig | null = null;

export function getLLMConfig(): LLMConfig {
  if (!_config) {
    _config = buildConfig();
  }
  return _config;
}

export function resetLLMConfig(): void {
  _config = null;
}

/** 获取所有已启用的提供商 */
export function getEnabledProviders(): ProviderConfig[] {
  return getLLMConfig().providers.filter(p => p.enabled);
}

/** 检查是否有可用的提供商 */
export function isAnyProviderAvailable(): boolean {
  return getEnabledProviders().length > 0;
}

/** 按提供商 ID 获取配置 */
export function getProviderConfig(providerId: string): ProviderConfig | undefined {
  return getLLMConfig().providers.find(p => p.id === providerId);
}
