import { BaseAgent } from "../base.ts";
import { AgentConfig } from "../../types.ts";
import { AnthropicClient } from "../../providers/anthropic/client.ts";

export abstract class MetricsEnabledAgent extends BaseAgent {
  protected client: AnthropicClient;
  protected abstract readonly agentPrefix: string;

  constructor(config: AgentConfig) {
    super(config.id, config);
    
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    this.client = new AnthropicClient(apiKey);
  }

  protected async processWithMetrics(input: string): Promise<string> {
    const startTime = Date.now();
    let startMemory = 0;
    try {
      startMemory = Deno.memoryUsage().heapUsed;
    } catch {
      // Memory usage not available
    }

    try {
      const response = await this.client.sendMessage({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        messages: [
          { role: "system", content: this.config.systemPrompt },
          { role: "user", content: input }
        ],
        temperature: this.config.temperature,
      });

      const endTime = Date.now();
      let endMemory = 0;
      try {
        endMemory = Deno.memoryUsage().heapUsed;
      } catch {
        // Memory usage not available
      }
      const duration = endTime - startTime;

      // Record metrics
      await this.recordMetrics({
        name: this.config.name,
        metrics: {
          conversations: {
            total: 1,
            active: 1,
            completed: 1,
            responseTime: {
              min: duration,
              max: duration,
              avg: duration,
            },
          },
          performance: {
            memoryUsage: endMemory - startMemory,
            latency: duration,
            successRate: 100,
          },
          knowledge: {
            totalTokens: response.usage?.total_tokens || 0,
            contextSize: input.length,
          },
          timestamps: {
            lastActive: endTime,
          },
        },
      });

      return response.content;
    } catch (error) {
      await this.recordError(error);
      throw error;
    }
  }

  // Template method pattern - subclasses must implement process
  abstract process(input: string): Promise<string>;
}
