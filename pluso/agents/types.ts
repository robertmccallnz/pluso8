export interface AgentConfig {
  id: string;
  name: string;
  provider: "openai" | "anthropic";
  modelId: string;
  maxTokens?: number;
  temperature?: number;
  systemPrompt?: string;
}

export interface AgentResponse {
  content: string;
  timestamp: string;
  metadata?: {
    tokens?: number;
    latency?: number;
    model?: string;
  };
}

export interface AgentHandler {
  process: (input: string) => Promise<string>;
}

export interface AgentMetrics {
  requestCount: number;
  successCount: number;
  errorCount: number;
  avgResponseTime: number;
  lastError?: string;
  lastErrorTime?: string;
}
