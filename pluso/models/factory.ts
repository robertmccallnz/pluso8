// src/models/factory.ts
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ModelConfig } from './config';
import { createOpenAIModel } from './providers/openai';
import { createAnthropicModel } from './providers/anthropic';


export class ModelFactory {
  static createModel(config: ModelConfig): BaseChatModel {
    switch (config.provider) {
      case 'openai':
        return createOpenAIModel(config);
      case 'anthropic':
        return createAnthropicModel(config);
      default:
        throw new Error(`Unsupported model provider: ${config.provider}`);
    }
  }
}