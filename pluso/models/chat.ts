import { ModelConfig } from './config.ts';
import { ModelFactory } from './factory.ts';
import { ChatResponse, BaseMessage, ChatServiceError } from './types.ts';

export class ChatService {
  private model: BaseChatModel;

  constructor(config: ModelConfig) {
    this.model = ModelFactory.createModel(config);
  }

  async sendMessage(messages: BaseMessage[]): Promise<ChatResponse> {
    try {
      const response = await this.model.invoke(messages);
      return response;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new ChatServiceError(`Failed to send message: ${errorMessage}`, error instanceof Error ? error : undefined);
    }
  }

  async *streamMessage(messages: BaseMessage[]): AsyncGenerator<ChatResponse, void, unknown> {
    try {
      const stream = await this.model.stream(messages);
      for await (const chunk of stream) {
        yield chunk;
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new ChatServiceError(`Failed to stream message: ${errorMessage}`, error instanceof Error ? error : undefined);
    }
  }

  // Add method to validate messages before sending
  private validateMessages(messages: BaseMessage[]): void {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new ChatServiceError('Messages must be a non-empty array');
    }

    for (const message of messages) {
      if (!message.role || !message.content) {
        throw new ChatServiceError('Invalid message format: Each message must have role and content');
      }
    }
  }
}