// Core types used across the application

export interface BaseConfig {
  id: string;
  name: string;
  description?: string;
  version: string;
  created: number;
  updated: number;
}

export interface AgentConfig extends BaseConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  stopSequences?: string[];
  systemPrompt: string;
  contextWindow: number;
  capabilities: string[];
  metadata: Record<string, unknown>;
}

export interface MetricConfig extends BaseConfig {
  type: 'counter' | 'gauge' | 'histogram';
  unit?: string;
  labels?: string[];
  thresholds?: {
    warning?: number;
    critical?: number;
  };
}

export interface StorageConfig extends BaseConfig {
  provider: 'kv' | 'supabase';
  options: Record<string, unknown>;
  collections: string[];
}

export interface WebSocketConfig extends BaseConfig {
  path: string;
  protocols?: string[];
  heartbeatInterval?: number;
  reconnectAttempts?: number;
}

export interface APIConfig extends BaseConfig {
  endpoint: string;
  version: string;
  auth?: {
    type: 'bearer' | 'api-key';
    token?: string;
  };
}

// Utility types
export type UUID = string;
export type ISODateTime = string;
export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };
