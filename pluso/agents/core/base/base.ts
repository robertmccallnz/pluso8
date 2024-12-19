import { AgentConfig } from "../../types/agent.ts";
import { MetricsCollector } from "../../monitoring/metrics.ts";

export abstract class BaseAgent {
  protected id: string;
  protected config: AgentConfig;
  protected metrics: MetricsCollector;

  constructor(id: string, config: AgentConfig) {
    this.id = id;
    this.config = config;
    this.metrics = MetricsCollector.getInstance();
  }

  abstract process(message: string): Promise<{
    response: string;
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  }>;

  protected async recordMetrics(
    startTime: number,
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    }
  ) {
    const processingTime = Date.now() - startTime;
    const metrics = this.metrics.getRouteMetrics(this.id);
    
    if (metrics) {
      metrics.recordLatency(processingTime);
      if (usage) {
        metrics.recordTokenUsage(usage.total_tokens);
      }
      metrics.recordEvent("process_complete", {
        processingTime,
        usage,
      });
    }
  }

  protected async handleError(error: Error) {
    const metrics = this.metrics.getRouteMetrics(this.id);
    if (metrics) {
      metrics.recordError();
      metrics.recordEvent("process_error", {
        error: error.message,
        stack: error.stack,
      });
    }
    throw error;
  }

  getId(): string {
    return this.id;
  }

  getConfig(): AgentConfig {
    return { ...this.config };
  }

  protected validateConfig() {
    const requiredFields = ["type", "model", "maxTokens", "temperature"];
    for (const field of requiredFields) {
      if (!this.config[field as keyof AgentConfig]) {
        throw new Error(`Missing required config field: ${field}`);
      }
    }

    if (this.config.temperature < 0 || this.config.temperature > 1) {
      throw new Error("Temperature must be between 0 and 1");
    }

    if (this.config.maxTokens < 1) {
      throw new Error("maxTokens must be greater than 0");
    }
  }
}
