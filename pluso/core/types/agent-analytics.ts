export interface AgentAnalytics {
  totalRequests: number;
  totalTokens: number;
  averageLatency: number;
  errorRate: number;
  errors: string[];
}

export interface AgentStats {
  agentId: string;
  name: string;
  type: "jeff" | "petunia" | "maia";
  metrics: {
    totalRequests: number;
    totalTokens: number;
    averageLatency: number;
    errorRate: number;
    errors: string[];
  };
  timestamp: string;
}
