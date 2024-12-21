// pluso/types/message.ts
export interface Message {
    id: string;
    content: string;
    role: "user" | "assistant";
    timestamp: number;
  }