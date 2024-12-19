export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
  tools?: AgentTool[];
  memory?: AgentMemoryConfig;
}

export interface AgentTool {
  name: string;
  description: string;
  type: 'function' | 'retrieval' | 'action';
  parameters?: Record<string, unknown>;
}

export type AgentMemoryConfig = {
  type: 'buffer' | 'summary' | 'vector';
  maxSize?: number;
  windowSize?: number;
  parameters?: Record<string, unknown>;
}

export interface AgentResponse {
  id: string;
  content: string;
  role: 'assistant';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface AgentMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}
