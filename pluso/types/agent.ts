/ pluso/types/agent.ts
import { ModelConfig } from '../models/config';

export interface AgentConfig {
  // Basic agent properties
  name: string;
  systemPrompt: string;
  
  // Model configuration
  model: ModelConfig;
  fallbackModel?: ModelConfig;
  
  // Memory configuration
  memory: AgentMemoryConfig;
  
  // Tools and capabilities
  tools: AgentTool[];
}

export interface AgentMemoryConfig {
  type: 'buffer' | 'summary' | 'vector';
  config: Record<string, unknown>;
}

export interface AgentTool {
  name: string;
  description: string;
  type: 'function' | 'retrieval' | 'action';
  config: Record<string, unknown>;
  enabled: boolean;
}

// Runtime configurations that can be overridden per request
export interface AgentRuntimeConfig {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
}