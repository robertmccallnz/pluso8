import { ChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';

export type ModelProvider = 'openai' | 'anthropic';

export interface ModelConfig {
  provider: ModelProvider;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  contextWindow?: number;
}

export const modelConfigs: Record<ModelProvider, ModelConfig> = {
  openai: {
    provider: 'openai',
    apiKey: process.env.OPENAI_API_KEY || '',
    model: 'gpt-4',
    temperature: 0.7,
    maxTokens: 2048,
    contextWindow: 8192
  },
  anthropic: {
    provider: 'anthropic',
    apiKey: process.env.ANTHROPIC_API_KEY || '',
    model: 'claude-3-opus-20240229',
    temperature: 0.7,
    maxTokens: 1024,
    contextWindow: 4096
  }
};

// Model instance getter function
export function getModelInstance(provider: ModelProvider) {
  const config = modelConfigs[provider];
  
  switch (provider) {
    case 'openai':
      return new ChatOpenAI({
        openAIApiKey: config.apiKey,
        modelName: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      });
    case 'anthropic':
      return new ChatAnthropic({
        anthropicApiKey: config.apiKey,
        modelName: config.model,
        temperature: config.temperature,
        maxTokens: config.maxTokens
      });
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}