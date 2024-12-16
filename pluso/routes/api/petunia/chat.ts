import { HandlerContext } from "$fresh/server.ts";
import { BaseAgent } from "../../../core/agents/base.ts";
import { AgentConfig } from "../../../core/types.ts";
import { AnthropicClient } from "../../../core/providers/anthropic/client.ts";

class PetuniaAgent extends BaseAgent {
  private client: AnthropicClient;

  constructor() {
    const config: AgentConfig = {
      id: "pet_UNIA",
      name: "pet_UNIA",
      description: "PluSO's garden and ecology assistant",
      version: "1.0.0",
      created: Date.now(),
      updated: Date.now(),
      model: "claude-3-haiku-20240307",
      temperature: 0.7,
      maxTokens: 2000,
      systemPrompt: `You are pet_UNIA, PluSO's garden and ecology assistant. You help users with:
        - New Zealand native plants and gardening
        - Sustainable gardening practices
        - Environmental conservation
        - Traditional Māori plant knowledge (Mātauranga Māori)
        - Creating wildlife-friendly gardens`,
      contextWindow: 4000,
      capabilities: ["chat", "gardening", "ecology"],
      metadata: {}
    };
    super("pet_UNIA", config);
    
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

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (req.method !== "POST") {
    return new Response(null, { status: 405 });
  }

  try {
    const body = await req.json();
    const message = body.message;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Invalid message" }), { 
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const agent = new PetuniaAgent();
    const response = await agent.process(message);

    return new Response(JSON.stringify({ response }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
