// models/providers/base.ts
export interface LLMProvider {
    id: string;
    name: string;
    supportedModels: string[];
    chat(messages: Message[], options: ChatOptions): Promise<ChatResponse>;
  }