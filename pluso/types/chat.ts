// types/chat.ts
export interface ChatMessage {
  id: string;
  text: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: number;
  metadata?: {
    model?: string;
    tokenUsage?: number;
    sentAt?: number;
    language?: 'en' | 'mi';
    [key: string]: unknown;
  };
}

export interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
}

export interface ChatMetrics {
  latency: number;
  tokenUsage: number;
  messageCount: number;
  errorCount: number;
}