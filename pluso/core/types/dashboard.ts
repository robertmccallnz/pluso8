// Dashboard Types
export interface AgentStats {
  agentId: string;
  name: string;
  description: string;
  successRate: number;
  avgResponseTime: number;
  totalConversations: number;
  totalTokens: number;
  totalCost: number;
  lastActive: number;
  primaryModelUsage: number;
  fallbackModelUsage: number;
  evaluationResults: Record<string, number>;
}

export interface DashboardData {
  agents: AgentStats[];
  industries: IndustryCategory[];
  templates: AgentTemplate[];
}

export interface IndustryCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  industry: string;
  type: AgentType;
  systemPrompt: string;
  features: string[];
  requiredModels: {
    primary: string[];
    fallback?: string[];
    embedding?: string[];
    vision?: string[];
  };
  evaluationCriteria: {
    id: string;
    name: string;
    description: string;
    threshold: number;
    weight: number;
  }[];
}

export type AgentType = "chat" | "rag" | "multimodal" | "function" | "autonomous";

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  industry: string;
  template: string;
  features: string[];
  models: {
    primary: string;
    fallback?: string;
    embedding?: string;
    vision?: string;
  };
  systemPrompt: string;
  yaml: string;
  evaluations: {
    enabled: boolean;
    criteria?: string[];
    testCases?: Record<string, TestCase[]>;
  };
  metrics: {
    enabled: boolean;
    supabaseConfig?: {
      url: string;
      key: string;
      table: string;
    };
  };
}

export interface AgentCreationData {
  name: string;
  description: string;
  type: AgentType;
  industry: string;
  template: string;
  features: string[];
  models: {
    primary: string;
    fallback?: string;
    embedding?: string;
    vision?: string;
  };
  systemPrompt: string;
  evaluations: boolean;
  evaluationCriteria?: string[];
  testCases?: Record<string, TestCase[]>;
  metrics: boolean;
}

export interface TestCase {
  input: string;
  expected: string;
  description?: string;
}

export interface AgentMetrics {
  agentId: string;
  timestamp: number;
  success: boolean;
  responseTime: number;
  conversationId: string;
  tokens: number;
  cost: number;
}

export interface EvaluationResult {
  agentId: string;
  timestamp: number;
  criteriaName: string;
  score: number;
  passed: boolean;
  metadata?: Record<string, unknown>;
}
