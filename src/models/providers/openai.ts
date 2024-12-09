import { ChatOpenAI } from '@langchain/openai';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ModelConfig } from '../config';

export function createOpenAIModel(config: ModelConfig): BaseChatModel {
  return new ChatOpenAI({
    modelName: config.model,
    maxTokens: config.maxTokens,
    temperature: config.temperature ?? 0.7,
    openAIApiKey: process.env.OPENAI_API_KEY,
  });
}