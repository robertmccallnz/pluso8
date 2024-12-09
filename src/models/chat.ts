
import { BaseMessage } from '@langchain/core/messages';
import { BaseChatModel } from '@langchain/core/language_models/chat_models';
import { ModelConfig } from './config';
import { ModelFactory } from './factory';

export class ChatService {
  private model: BaseChatModel;

  constructor(config: ModelConfig) {
    this.model = ModelFactory.createModel(config);
  }

  async sendMessage(messages: BaseMessage[]) {
    try {
      const response = await this.model.invoke(messages);
      return response;
    } catch (error) {
      console.error('Error in chat service:', error);
      throw error;
    }
  }

  async *streamMessage(messages: BaseMessage[]) {
    try {
      const stream = await this.model.stream(messages);
      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      console.error('Error in chat service stream:', error);
      throw error;
    }
  }
}