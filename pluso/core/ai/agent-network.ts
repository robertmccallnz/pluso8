import { AgentConfig } from "../../agents/types/agent.ts";

export interface AgentPerformanceMetrics {
  responseTime: number;
  successRate: number;
  userSatisfaction: number;
  contextRelevance: number;
  memoryUsage: number;
}

export interface AgentNetworkConfig {
  agents: Record<string, AgentConfig>;
  maxConnections?: number;
  timeout?: number;
}

export class AgentNetwork {
  private agents: Map<string, WebSocket> = new Map();
  private config: AgentNetworkConfig;
  private static instance: AgentNetwork;
  private metrics: AgentPerformanceMetrics[] = [];

  private constructor(config: AgentNetworkConfig) {
    this.config = {
      maxConnections: 10,
      timeout: 30000,
      ...config
    };
  }

  static getInstance(config: AgentNetworkConfig): AgentNetwork {
    if (!AgentNetwork.instance) {
      AgentNetwork.instance = new AgentNetwork(config);
    }
    return AgentNetwork.instance;
  }

  async connect(agentId: string, socket: WebSocket): Promise<void> {
    if (this.agents.size >= this.config.maxConnections!) {
      throw new Error('Maximum number of agent connections reached');
    }

    const agentConfig = this.config.agents[agentId];
    if (!agentConfig) {
      throw new Error(`Unknown agent: ${agentId}`);
    }

    this.agents.set(agentId, socket);
  }

  disconnect(agentId: string): void {
    const ws = this.agents.get(agentId);
    if (ws) {
      ws.close();
      this.agents.delete(agentId);
    }
  }

  disconnectAll(): void {
    for (const [agentId] of this.agents) {
      this.disconnect(agentId);
    }
  }

  isConnected(agentId: string): boolean {
    const ws = this.agents.get(agentId);
    return ws?.readyState === WebSocket.OPEN;
  }

  getConnectedAgents(): string[] {
    return Array.from(this.agents.entries())
      .filter(([_, ws]) => ws.readyState === WebSocket.OPEN)
      .map(([agentId]) => agentId);
  }

  async train(metrics: AgentPerformanceMetrics[]): Promise<void> {
    this.metrics = metrics;
  }

  async predict(input: Partial<AgentPerformanceMetrics>): Promise<AgentPerformanceMetrics> {
    // Simple prediction based on averages from training data
    if (this.metrics.length === 0) {
      return {
        responseTime: 500,
        successRate: 0.95,
        userSatisfaction: 0.9,
        contextRelevance: 0.95,
        memoryUsage: 50
      };
    }

    const averages = this.metrics.reduce((acc, curr) => ({
      responseTime: acc.responseTime + curr.responseTime,
      successRate: acc.successRate + curr.successRate,
      userSatisfaction: acc.userSatisfaction + curr.userSatisfaction,
      contextRelevance: acc.contextRelevance + curr.contextRelevance,
      memoryUsage: acc.memoryUsage + curr.memoryUsage
    }));

    return {
      responseTime: averages.responseTime / this.metrics.length,
      successRate: averages.successRate / this.metrics.length,
      userSatisfaction: averages.userSatisfaction / this.metrics.length,
      contextRelevance: averages.contextRelevance / this.metrics.length,
      memoryUsage: averages.memoryUsage / this.metrics.length
    };
  }
}

export const agentNetwork = AgentNetwork.getInstance({ agents: {} });
