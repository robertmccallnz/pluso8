/**
 * Supported model providers
 */
export type ModelProvider = 'openai' | 'anthropic' | 'ultravox';

/**
 * Base configuration for language models
 */
export interface BaseModelConfig {
  provider: ModelProvider;
  modelId: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

/**
 * OpenAI-specific model configuration
 */
export interface OpenAIModelConfig extends BaseModelConfig {
  provider: 'openai';
  apiKey?: string;
  organization?: string;
  functions?: Array<{
    name: string;
    description?: string;
    parameters: Record<string, unknown>;
  }>;
}

/**
 * Anthropic-specific model configuration
 */
export interface AnthropicModelConfig extends BaseModelConfig {
  provider: 'anthropic';
  modelId: string;
  apiKey?: string;
  systemPrompt?: string;
}

/**
 * Ultravox-specific model configuration
 */
export interface UltravoxModelConfig extends BaseModelConfig {
  provider: 'ultravox';
  modelId: string;
  iceServers?: Array<{
    urls: string;
  }>;
  enableDataChannel?: boolean;
  enableAudio?: boolean;
}

/**
 * Union type for all model configurations
 */
export type ModelConfig = OpenAIModelConfig | AnthropicModelConfig | UltravoxModelConfig;

/**
 * Validates a model configuration
 * @throws Error if validation fails
 */
export function validateModelConfig(config: ModelConfig): void {
  if (!config.provider) {
    throw new Error('Model provider is required');
  }

  if (!config.modelId) {
    throw new Error('Model ID is required');
  }

  switch (config.provider) {
    case 'openai':
      validateOpenAIConfig(config as OpenAIModelConfig);
      break;
    case 'anthropic':
      validateAnthropicConfig(config as AnthropicModelConfig);
      break;
    case 'ultravox':
      validateUltravoxConfig(config as UltravoxModelConfig);
      break;
    default:
      throw new Error(`Unsupported model provider: ${config.provider}`);
  }
}

function validateOpenAIConfig(config: OpenAIModelConfig): void {
  // OpenAI-specific validation
}

function validateAnthropicConfig(config: AnthropicModelConfig): void {
  // Anthropic-specific validation
}

function validateUltravoxConfig(config: UltravoxModelConfig): void {
  // Ultravox-specific validation
  if (config.enableAudio && !config.iceServers?.length) {
    throw new Error('ICE servers are required when audio is enabled');
  }
}
