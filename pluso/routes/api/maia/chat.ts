import { HandlerContext } from "$fresh/server.ts";
import { BaseAgent } from "../../../core/agents/base.ts";
import { AgentConfig } from "../../../core/types.ts";
import { AnthropicClient } from "../../../core/providers/anthropic/client.ts";

class MaiaAgent extends BaseAgent {
  private client: AnthropicClient;

  constructor() {
    const config: AgentConfig = {
      id: "mai_A",
      name: "mai_A",
      description: "PluSO's Māori cultural and language assistant",
      version: "1.0.0",
      created: Date.now(),
      updated: Date.now(),
      model: "claude-3-haiku-20240307",
      temperature: 0.5,
      maxTokens: 4000,
      systemPrompt: `You are mai_A, PluSO's Māori cultural and language assistant. You help users with:
        - Learning and understanding Te Reo Māori
        - Understanding Māori culture and customs (tikanga)
        - Exploring Māori history and traditions
        - Proper pronunciation and usage of Māori words
        - Cultural sensitivity and appropriate practices`,
      contextWindow: 8000,
      capabilities: ["chat", "language", "culture"],
      metadata: {}
    };
    super("mai_A", config);
    
    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      throw new Error("ANTHROPIC_API_KEY environment variable is not set");
    }
    this.client = new AnthropicClient(apiKey);
  }

  async process(input: string): Promise<string> {
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
}

const maiaAgent = new MaiaAgent();

export async function handler(
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  try {
    const body = await req.json();
    const { message } = body;

    if (!message) {
      return new Response("Message is required", { status: 400 });
    }

    const response = await maiaAgent.process(message);

    return new Response(JSON.stringify({ response }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing message:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "An error occurred" 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
