import { agentNetwork, AgentPerformanceMetrics } from "../ai/agent-network.ts";
import { AgentAnalytics } from "../types/agent-analytics.ts";

export interface AgentStats {
  agentId: string;
  name: string;
  type: "jeff" | "petunia" | "maia";
  performanceScore: number;
  metrics: AgentPerformanceMetrics;
  timestamp: string;
}

export class AgentAnalyticsService {
  private static instance: AgentAnalyticsService;
  private analytics: Map<string, AgentAnalytics>;

  private constructor() {
    this.analytics = new Map();
  }

  static getInstance(): AgentAnalyticsService {
    if (!AgentAnalyticsService.instance) {
      AgentAnalyticsService.instance = new AgentAnalyticsService();
    }
    return AgentAnalyticsService.instance;
  }

  async initializeNetwork(): Promise<void> {
    if (agentNetwork.isInitialized()) {
      return;
    }

    // Use baseline metrics for initial training
    const baselineMetrics: AgentPerformanceMetrics[] = [
      {
        responseTime: 500, // 500ms
        successRate: 0.95,
        userSatisfaction: 0.9,
        contextRelevance: 0.95,
        memoryUsage: 50 // 50%
      },
      {
        responseTime: 1000,
        successRate: 0.8,
        userSatisfaction: 0.7,
        contextRelevance: 0.8,
        memoryUsage: 70
      }
    ];
    await agentNetwork.train(baselineMetrics);
  }

  async recordAnalytics(agentId: string, data: Partial<AgentAnalytics>): Promise<void> {
    const current = this.analytics.get(agentId) || {
      totalRequests: 0,
      totalTokens: 0,
      averageLatency: 0,
      errorRate: 0,
      errors: [],
    };

    const newAnalytics = {
      totalRequests: current.totalRequests + (data.totalRequests || 0),
      totalTokens: current.totalTokens + (data.totalTokens || 0),
      averageLatency: data.averageLatency || current.averageLatency,
      errorRate: data.errorRate || current.errorRate,
      errors: [...current.errors, ...(data.errors || [])],
    };

    this.analytics.set(agentId, newAnalytics);
  }

  async getAnalytics(agentId: string): Promise<AgentAnalytics | null> {
    return this.analytics.get(agentId) || null;
  }

  async clearAnalytics(agentId: string): Promise<void> {
    this.analytics.delete(agentId);
  }

  async getCurrentStats(): Promise<AgentStats[]> {
    const agents = await this.getAgents();

    return agents.map(agent => {
      const metrics = this.analytics.get(agent.id) || {
        totalRequests: 0,
        totalTokens: 0,
        averageLatency: 0,
        errorRate: 0,
        errors: [],
      };

      return {
        agentId: agent.id,
        name: agent.name,
        type: agent.type as "jeff" | "petunia" | "maia",
        performanceScore: 0.95, // Default score
        metrics: metrics as AgentPerformanceMetrics,
        timestamp: new Date().toISOString()
      };
    });
  }

  async analyzeAgent(
    agentId: string,
    name: string,
    type: "jeff" | "petunia" | "maia",
    metrics: AgentPerformanceMetrics
  ): Promise<AgentStats> {
    await this.initializeNetwork();

    const performanceScore = await agentNetwork.predictPerformance(metrics);

    const stats: AgentStats = {
      agentId,
      name,
      type,
      performanceScore,
      metrics,
      timestamp: new Date().toISOString()
    };

    // Store stats in in-memory storage
    await this.recordAnalytics(agentId, metrics);

    return stats;
  }

  private async getAgents(): Promise<{ id: string; name: string; type: "jeff" | "petunia" | "maia" }[]> {
    // This method should be implemented to return a list of agents
    // For demonstration purposes, it returns an empty array
    return [];
  }
}

export const agentAnalytics = AgentAnalyticsService.getInstance();
