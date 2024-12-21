import { AgentConfig } from "../agents/types/agent.ts";

export interface AgentVersion {
  id: string;
  timestamp: string;
  config: AgentConfig;
  createdBy: string;
  changes: string[];
}

export interface AgentMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  lastUsed: string;
  tokenUsage: {
    prompt: number;
    completion: number;
    total: number;
    cost: number;
  };
  dailyStats: {
    date: string;
    requests: number;
    errors: number;
    tokenUsage: number;
    cost: number;
  }[];
}

export interface AgentCollaborator {
  id: string;
  email: string;
  role: "viewer" | "editor" | "admin";
  addedAt: string;
  lastActive: string;
}

export interface AgentTest {
  id: string;
  name: string;
  description: string;
  testCases: {
    input: string;
    expectedOutput: string;
    evaluation: {
      accuracy: number;
      latency: number;
      tokenUsage: number;
    };
  }[];
  lastRun: string;
  overallScore: number;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: Array<"request" | "response" | "error" | "status_change">;
  secret: string;
  enabled: boolean;
  lastTriggered?: string;
  failureCount: number;
}

export interface RateLimitConfig {
  requests: {
    perSecond: number;
    perMinute: number;
    perHour: number;
    perDay: number;
  };
  tokens: {
    perDay: number;
    perMonth: number;
  };
  cost: {
    perDay: number;
    perMonth: number;
  };
}

export interface OptimizationConfig {
  caching: {
    enabled: boolean;
    ttl: number;
    maxSize: number;
  };
  batching: {
    enabled: boolean;
    maxSize: number;
    maxWait: number;
  };
  compression: boolean;
  priorityQueue: {
    enabled: boolean;
    levels: number;
  };
}

export interface AgentEvaluation {
  id: string;
  timestamp: string;
  metrics: {
    accuracy: number;
    consistency: number;
    latency: number;
    reliability: number;
    safety: number;
  };
  tests: {
    passed: number;
    failed: number;
    total: number;
  };
  recommendations: {
    type: "critical" | "warning" | "suggestion";
    message: string;
    impact: number;
  }[];
}

export interface ApiKey {
  id: string;
  name: string;
  prefix: string;
  lastUsed: string | null;
  createdAt: string;
  expiresAt: string | null;
  status: "active" | "expired" | "revoked";
  permissions: {
    read: boolean;
    write: boolean;
    deploy: boolean;
    manage: boolean;
  };
  metadata: {
    createdBy: string;
    environment: "development" | "production";
    description?: string;
  };
}

export interface DashboardData {
  agent: {
    id: string;
    config: AgentConfig;
    status: "online" | "offline" | "error";
    lastDeployed: string;
  };
  versions: AgentVersion[];
  metrics: AgentMetrics;
  collaborators: AgentCollaborator[];
  tests: AgentTest[];
  webhooks: WebhookConfig[];
  rateLimits: RateLimitConfig;
  optimization: OptimizationConfig;
  evaluations: AgentEvaluation[];
  apiKeys: ApiKey[];
}
