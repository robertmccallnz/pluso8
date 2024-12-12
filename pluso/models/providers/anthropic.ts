import { ChatAnthropic } from '@langchain/anthropic';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ModelConfig } from '../config';

export function createAnthropicModel(config: ModelConfig): BaseChatModel {
  return new ChatAnthropic({
    modelName: config.model,
    maxTokens: config.maxTokens,
    temperature: config.temperature ?? 0.7,
    anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  });
}