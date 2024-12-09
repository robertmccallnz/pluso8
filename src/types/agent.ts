import { ModelConfig } from '../models/config';

export interface AgentConfig {
  model: ModelConfig;
  systemPrompt: string;
  tools: AgentTool[];
  memory: {
    type: 'buffer' | 'summary' | 'vector';
    config: Record<string, unknown>;
  };
  fallbackModel?: ModelConfig; // Backup model if primary fails
}

export interface AgentTool {
  name: string;
  description: string;
  type: 'function' | 'retrieval' | 'action';
  config: Record<string, unknown>;
  enabled: boolean;
}