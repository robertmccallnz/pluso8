export enum AIProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  COHERE = 'cohere',
  GOOGLE = 'google',
  AZURE = 'azure',
  LOCAL = 'local',
  HUGGINGFACE = 'huggingface',
  TOGETHER = 'together'
}

export enum ModelType {
  CODE_GENERATION = 'code_generation',
  PATTERN_RECOGNITION = 'pattern_recognition',
  CODE_ANALYSIS = 'code_analysis',
  ARCHITECTURE_DESIGN = 'architecture_design',
  CLASSIFICATION = 'classification',
  REGRESSION = 'regression',
  NLP = 'nlp',
  VISION = 'vision',
  RECOMMENDATION = 'recommendation'
}

export interface ModelPerformance {
  latency: number;
  costPer1kTokens: number;
  qualityScore: number;
}

export interface ModelRequirements {
  minMemory: number;
  minCPU: number;
  gpuRequired: boolean;
  cloudCompute?: boolean;
  minTokens?: number;
  maxTokens?: number;
  apiKey?: boolean;
}

export interface ModelCapability {
  id: string;
  name: string;
  provider: AIProvider;
  type: ModelType;
  version: string;
  accuracy: number;
  latency: number;
  memoryUsage: number;
  contextSize: number;
  specialties: string[];
  performance: ModelPerformance;
  requirements: ModelRequirements;
  detectPatterns?: (analysis: any) => Promise<string[]>;
  generateInsights?: (patterns: string[], metrics: any) => Promise<string[]>;
  generateImplementationPlan?: (insight: string) => Promise<any>;
}

export interface ModelResponse {
  result: any;
  metadata: {
    latency: number;
    tokens: number;
    cost: number;
  };
}

export interface ResourceUtilization {
  cpu: number;
  memory: number;
  gpu: number;
  total: number;
}

export interface HealthScore {
  errorRate: number;
  latency: number;
  availability: number;
}

export interface SystemScan {
  [Symbol.iterator](): Iterator<any>;
  issues: Array<{
    type: string;
    severity: string;
    description: string;
  }>;
}

export interface ModelMetrics {
  memoryUsage: number;
  requestsHandled: number;
  successRate: number;
  averageResponseTime: number;
  accuracy?: number;
  latency?: number;
  costEfficiency?: number;
  reliability?: number;
  lastUpdated?: Date;
}

export interface CloudResources {
  cpuUsage: number;
  memoryUsage: number;
  networkBandwidth: number;
  storageUsage: number;
  type?: string;
  provider?: string;
  specs?: {
    memory: string;
    compute: string;
    storage: string;
  };
  cost?: {
    perHour: number;
    currency: string;
  };
}
