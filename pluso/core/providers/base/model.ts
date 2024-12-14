// core/providers/base/model.ts

export interface ModelResponse {
    content: string;
    role: string;
    metadata?: Record<string, unknown>;
  }
  
  export interface ModelRequestMessage {
    role: string;
    content: string;
    name?: string;
  }
  
  export interface ModelOptions {
    temperature?: number;
    maxTokens?: number;
    stopSequences?: string[];
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
  }
  
  /**
   * Base model class that defines the interface for all model implementations
   */
  export abstract class BaseModel {
    protected options: ModelOptions;
  
    constructor(options: ModelOptions = {}) {
      this.options = {
        temperature: 0.7,
        maxTokens: 2048,
        ...options
      };
    }
  
    /**
     * Send a single message and get a response
     */
    abstract chat(messages: ModelRequestMessage[]): Promise<ModelResponse>;
  
    /**
     * Stream a response message token by token
     */
    abstract streamChat(messages: ModelRequestMessage[]): AsyncGenerator<ModelResponse, void, unknown>;
  
    /**
     * Get the number of tokens in the input
     */
    abstract countTokens(input: string): number;
  
    /**
     * Validate messages before sending
     */
    protected validateMessages(messages: ModelRequestMessage[]): void {
      if (!Array.isArray(messages) || messages.length === 0) {
        throw new Error('Messages must be a non-empty array');
      }
  
      for (const message of messages) {
        if (!message.role || !message.content) {
          throw new Error('Invalid message format: Each message must have role and content');
        }
      }
    }
  }