export type {
  ModelCapability,
  ModelMetrics,
  CloudResources,
  ModelResponse,
} from "../../../../../types/ml.ts";

export { AIProvider, ModelType } from "../../../../../types/ml.ts";

export enum AIProvider {
  OPENAI = "openai",
  ANTHROPIC = "anthropic",
  HUGGINGFACE = "huggingface",
  TOGETHER = "together",
}

export enum ModelType {
  CODE_GENERATION = "code_generation",
  CODE_ANALYSIS = "code_analysis",
  ARCHITECTURE_DESIGN = "architecture_design",
  OPTIMIZATION = "optimization",
  DOCUMENTATION = "documentation",
  TESTING = "testing",
}

export interface ModelCapability {
  id: string;
  name: string;
  provider: AIProvider;
  type: ModelType;
  contextSize: number;
  specialties: string[];
  performance: {
    latency: number;
    costPer1kTokens: number;
    qualityScore: number;
  };
  requirements: {
    minTokens: number;
    maxTokens: number;
    apiKey: boolean;
    cloudCompute?: boolean;
  };
  version: string;
  accuracy: number;
  latency: number;
  memoryUsage: number;
}

export interface ModelResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  metadata: {
    model: string;
    provider: AIProvider;
    latency: number;
    timestamp: Date;
  };
}

export interface CloudResources {
  type: "cpu" | "gpu" | "tpu";
  provider: "aws" | "gcp" | "azure";
  specs: {
    memory: string;
    compute: string;
    storage: string;
  };
  cost: {
    perHour: number;
    currency: string;
  };
}

export interface ModelMetrics {
  accuracy: number;
  latency: number;
  costEfficiency: number;
  reliability: number;
  lastUpdated: Date;
}

export interface ProviderConfig {
  provider: AIProvider;
  apiKey: string;
  models: {
    [key in ModelType]?: string[];
  };
  endpoints?: {
    [key: string]: string;
  };
  rateLimit?: {
    requestsPerMinute: number;
    tokensPerMinute: number;
  };
}
