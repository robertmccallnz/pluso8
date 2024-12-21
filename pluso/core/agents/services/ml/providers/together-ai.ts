import { load as loadEnv } from "std/dotenv/mod.ts";
import { AIProvider, ModelResponse } from "./types.ts";

export class TogetherAIProvider {
  private static instance: TogetherAIProvider;
  private apiKey: string;

  private constructor() {
    this.apiKey = "";
    this.initialize();
  }

  static getInstance(): TogetherAIProvider {
    if (!TogetherAIProvider.instance) {
      TogetherAIProvider.instance = new TogetherAIProvider();
    }
    return TogetherAIProvider.instance;
  }

  private async initialize() {
    const env = await loadEnv();
    this.apiKey = env["TOGETHER_API_KEY"] || "";
  }

  async generateCode(prompt: string): Promise<ModelResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch("https://api.together.xyz/inference", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "togethercomputer/CodeLlama-34b-Instruct",
          prompt,
          max_tokens: 2048,
          temperature: 0.7,
          top_p: 0.95,
        }),
      });

      const result = await response.json();
      
      return {
        content: result.output.text,
        usage: {
          promptTokens: result.prompt_tokens,
          completionTokens: result.completion_tokens,
          totalTokens: result.total_tokens,
        },
        metadata: {
          model: "CodeLlama-34b-Instruct",
          provider: AIProvider.TOGETHER,
          latency: Date.now() - startTime,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      console.error("Error calling Together AI:", error);
      throw error;
    }
  }

  async analyzeCode(code: string): Promise<ModelResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch("https://api.together.xyz/inference", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "togethercomputer/CodeLlama-34b-Instruct",
          prompt: `Analyze this code and suggest improvements:
                  ${code}`,
          max_tokens: 1024,
          temperature: 0.3,
        }),
      });

      const result = await response.json();
      
      return {
        content: result.output.text,
        usage: {
          promptTokens: result.prompt_tokens,
          completionTokens: result.completion_tokens,
          totalTokens: result.total_tokens,
        },
        metadata: {
          model: "CodeLlama-34b-Instruct",
          provider: AIProvider.TOGETHER,
          latency: Date.now() - startTime,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      console.error("Error analyzing code with Together AI:", error);
      throw error;
    }
  }

  async optimizeCode(code: string, requirements: string): Promise<ModelResponse> {
    const startTime = Date.now();
    
    try {
      const response = await fetch("https://api.together.xyz/inference", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "togethercomputer/CodeLlama-34b-Instruct",
          prompt: `Optimize this code according to these requirements:
                  Requirements: ${requirements}
                  
                  Code:
                  ${code}`,
          max_tokens: 2048,
          temperature: 0.2,
        }),
      });

      const result = await response.json();
      
      return {
        content: result.output.text,
        usage: {
          promptTokens: result.prompt_tokens,
          completionTokens: result.completion_tokens,
          totalTokens: result.total_tokens,
        },
        metadata: {
          model: "CodeLlama-34b-Instruct",
          provider: AIProvider.TOGETHER,
          latency: Date.now() - startTime,
          timestamp: new Date(),
        },
      };
    } catch (error) {
      console.error("Error optimizing code with Together AI:", error);
      throw error;
    }
  }
}
