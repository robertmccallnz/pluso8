// pluso/agents/base.ts
import { AgentConfig } from "../types.ts";
import { MetricsCollector } from "../metrics/collector.ts";
import { AgentMetrics } from "../metrics/types.ts";

export abstract class BaseAgent {
  protected id: string;
  protected config: AgentConfig;
  protected metricsCollector: MetricsCollector;
  
  constructor(id: string, config: AgentConfig) {
    this.id = id;
    // Basic validation of required fields
    if (!config.name || !config.model || !config.systemPrompt) {
      throw new Error("Invalid agent config: missing required fields");
    }
    this.config = config;
    this.metricsCollector = MetricsCollector.getInstance();
  }

  protected async recordMetrics(metrics: Partial<AgentMetrics>): Promise<void> {
    await this.metricsCollector.recordAgentMetric(this.id, metrics);
  }

  protected async recordError(error: Error): Promise<void> {
    await this.metricsCollector.recordError(this.id, error);
  }

  abstract process(input: string): Promise<string>;
}