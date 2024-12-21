import { load as loadEnv } from "std/dotenv/mod.ts";

const env = await loadEnv();
const HUGGING_FACE_API_KEY = env["HUGGING_FACE_API_KEY"];

export class MLIntegrations {
  private static instance: MLIntegrations;
  
  private constructor() {}

  static getInstance(): MLIntegrations {
    if (!MLIntegrations.instance) {
      MLIntegrations.instance = new MLIntegrations();
    }
    return MLIntegrations.instance;
  }

  async analyzeArchitecture(codebase: string): Promise<{
    patterns: string[];
    suggestions: string[];
    confidence: number;
  }> {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/code-llama",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `Analyze this codebase architecture and suggest improvements:
                    ${codebase}`,
            parameters: {
              max_length: 500,
              temperature: 0.7,
              top_p: 0.9,
            },
          }),
        }
      );

      const result = await response.json();
      return this.parseArchitectureAnalysis(result[0].generated_text);
    } catch (error) {
      console.error("Error analyzing architecture:", error);
      throw error;
    }
  }

  async suggestOptimizations(metrics: string): Promise<{
    optimizations: string[];
    priority: "high" | "medium" | "low";
    impact: string;
  }> {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/code-llama",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `Given these system metrics, suggest optimizations:
                    ${metrics}`,
            parameters: {
              max_length: 300,
              temperature: 0.5,
            },
          }),
        }
      );

      const result = await response.json();
      return this.parseOptimizationSuggestions(result[0].generated_text);
    } catch (error) {
      console.error("Error suggesting optimizations:", error);
      throw error;
    }
  }

  async generateAgentCode(spec: string): Promise<{
    code: string;
    tests: string;
    documentation: string;
  }> {
    try {
      const response = await fetch(
        "https://api-inference.huggingface.co/models/facebook/code-llama",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${HUGGING_FACE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputs: `Generate TypeScript code, tests, and documentation for this agent specification:
                    ${spec}`,
            parameters: {
              max_length: 1000,
              temperature: 0.3,
            },
          }),
        }
      );

      const result = await response.json();
      return this.parseGeneratedCode(result[0].generated_text);
    } catch (error) {
      console.error("Error generating agent code:", error);
      throw error;
    }
  }

  private parseArchitectureAnalysis(text: string) {
    // Parse the LLM output into structured format
    const lines = text.split("\n");
    const patterns = [];
    const suggestions = [];
    let confidence = 0.0;

    for (const line of lines) {
      if (line.startsWith("Pattern:")) {
        patterns.push(line.replace("Pattern:", "").trim());
      } else if (line.startsWith("Suggestion:")) {
        suggestions.push(line.replace("Suggestion:", "").trim());
      } else if (line.startsWith("Confidence:")) {
        confidence = parseFloat(line.replace("Confidence:", "").trim());
      }
    }

    return { patterns, suggestions, confidence };
  }

  private parseOptimizationSuggestions(text: string) {
    // Parse the LLM output into structured format
    const lines = text.split("\n");
    const optimizations = [];
    let priority: "high" | "medium" | "low" = "medium";
    let impact = "";

    for (const line of lines) {
      if (line.startsWith("Optimization:")) {
        optimizations.push(line.replace("Optimization:", "").trim());
      } else if (line.startsWith("Priority:")) {
        const p = line.replace("Priority:", "").trim().toLowerCase();
        if (p === "high" || p === "medium" || p === "low") {
          priority = p;
        }
      } else if (line.startsWith("Impact:")) {
        impact = line.replace("Impact:", "").trim();
      }
    }

    return { optimizations, priority, impact };
  }

  private parseGeneratedCode(text: string) {
    // Split the generated text into code, tests, and documentation
    const sections = text.split("---");
    let code = "";
    let tests = "";
    let documentation = "";

    for (const section of sections) {
      if (section.includes("// Code")) {
        code = section.replace("// Code", "").trim();
      } else if (section.includes("// Tests")) {
        tests = section.replace("// Tests", "").trim();
      } else if (section.includes("// Documentation")) {
        documentation = section.replace("// Documentation", "").trim();
      }
    }

    return { code, tests, documentation };
  }
}
