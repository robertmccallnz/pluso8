// types/agent.ts
import { ModelConfig, ModelProvider } from "../models/config.ts";

/** 
 * Custom error class for agent-related errors
 */
export class AgentConfigurationError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'AgentConfigurationError';
  }
}

/**
 * Supported memory types for agent configuration
 */
export type MemoryType = 'buffer' | 'summary' | 'vector';

/**
 * Tool types supported by the agent
 */
export type ToolType = 'function' | 'retrieval' | 'action';

/**
 * Base configuration for agent memory systems
 */
export interface BaseMemoryConfig {
  maxTokens?: number;
  persistenceKey?: string;
}

/**
 * Buffer memory specific configuration
 */
export interface BufferMemoryConfig extends BaseMemoryConfig {
  type: 'buffer';
  maxMessages: number;
}

/**
 * Summary memory specific configuration
 */
export interface SummaryMemoryConfig extends BaseMemoryConfig {
  type: 'summary';
  summaryInterval: number;
  summaryPrompt?: string;
}

/**
 * Vector memory specific configuration
 */
export interface VectorMemoryConfig extends BaseMemoryConfig {
  type: 'vector';
  dimensions: number;
  similarity: 'cosine' | 'euclidean' | 'dot';
}

/**
 * Union type for all memory configurations
 */
export type AgentMemoryConfig = 
  | BufferMemoryConfig 
  | SummaryMemoryConfig 
  | VectorMemoryConfig;

/**
 * Configuration for agent tools
 */
export interface AgentTool {
  name: string;
  description: string;
  type: ToolType;
  config: {
    // Function tool specific config
    function?: {
      parameters: Record<string, unknown>;
      returns: Record<string, unknown>;
    };
    // Retrieval tool specific config
    retrieval?: {
      sources: string[];
      maxResults: number;
    };
    // Action tool specific config
    action?: {
      permissions: string[];
      timeout: number;
    };
  };
  enabled: boolean;
}

/**
 * Runtime configuration that can be modified per request
 */
export interface AgentRuntimeConfig {
  temperature?: number;
  maxTokens?: number;
  stopSequences?: string[];
  timeoutMs?: number;
  debugging?: boolean;
}

/**
 * Complete agent configuration interface
 */
export interface AgentConfig {
  // Basic properties
  name: string;
  description?: string;
  version?: string;
  systemPrompt: string;
  
  // Model configuration
  model: ModelConfig;
  fallbackModel?: ModelConfig;
  
  // Memory configuration
  memory: AgentMemoryConfig;
  
  // Tools configuration
  tools: AgentTool[];

  // Optional configurations
  metadata?: Record<string, unknown>;
  runtimeDefaults?: AgentRuntimeConfig;
}

/**
 * Validates an agent configuration
 * @throws AgentConfigurationError if validation fails
 */
export function validateAgentConfig(config: AgentConfig): void {
  try {
    // Validate basic properties
    if (!config.name || !config.systemPrompt) {
      throw new AgentConfigurationError('Missing required fields: name or systemPrompt');
    }

    // Validate model configuration
    if (!config.model || !config.model.provider || !config.model.apiKey) {
      throw new AgentConfigurationError('Invalid model configuration');
    }

    // Validate memory configuration
    validateMemoryConfig(config.memory);

    // Validate tools
    if (config.tools) {
      config.tools.forEach(validateTool);
    }

  } catch (error) {
    throw new AgentConfigurationError(
      `Agent configuration validation failed: ${error.message}`,
      error
    );
  }
}

/**
 * Validates memory configuration
 * @private
 */
function validateMemoryConfig(memory: AgentMemoryConfig): void {
  if (!memory || !memory.type) {
    throw new AgentConfigurationError('Invalid memory configuration');
  }

  switch (memory.type) {
    case 'buffer':
      if (!('maxMessages' in memory)) {
        throw new AgentConfigurationError('Buffer memory requires maxMessages');
      }
      break;
    case 'vector':
      if (!('dimensions' in memory)) {
        throw new AgentConfigurationError('Vector memory requires dimensions');
      }
      break;
    case 'summary':
      if (!('summaryInterval' in memory)) {
        throw new AgentConfigurationError('Summary memory requires summaryInterval');
      }
      break;
  }
}

/**
 * Validates a tool configuration
 * @private
 */
function validateTool(tool: AgentTool): void {
  if (!tool.name || !tool.description || !tool.type) {
    throw new AgentConfigurationError('Tool missing required fields');
  }

  switch (tool.type) {
    case 'function':
      if (!tool.config.function?.parameters) {
        throw new AgentConfigurationError('Function tool requires parameters');
      }
      break;
    case 'retrieval':
      if (!tool.config.retrieval?.sources) {
        throw new AgentConfigurationError('Retrieval tool requires sources');
      }
      break;
    case 'action':
      if (!tool.config.action?.permissions) {
        throw new AgentConfigurationError('Action tool requires permissions');
      }
      break;
  }
}

/**
 * Creates a default runtime configuration
 */
export function createDefaultRuntimeConfig(): AgentRuntimeConfig {
  return {
    temperature: 0.7,
    maxTokens: 2048,
    timeoutMs: 30000,
    debugging: false
  };
}