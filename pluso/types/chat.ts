// types/chat.ts
export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'agent';
    language: 'en' | 'mi';
    timestamp: number;
  }
  
  export interface ChatState {
    messages: ChatMessage[];
    isConnected: boolean;
    isTyping: boolean;
  }