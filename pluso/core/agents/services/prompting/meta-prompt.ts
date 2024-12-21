import { EventEmitter } from "../../../../events/emitter.ts";
import { ServiceAgent, ServiceAgentType, MetaPromptRequest, MetaPromptResponse } from "../types.ts";
import { db } from "../../../../utils/db.ts";

export class MetaPromptingService implements ServiceAgent {
  private static instance: MetaPromptingService;
  private events: EventEmitter;
  private templates: Map<string, string>;
  private strategies: Map<string, (input: MetaPromptRequest) => Promise<string>>;
  private evaluationHistory: Map<string, Array<{ score: number; feedback: string }>>;

  public id: string;
  public type: ServiceAgentType;
  public status: "active" | "inactive" | "error" | "terminated";
  public lastHeartbeat: Date;
  public metrics: {
    requestsHandled: number;
    successRate: number;
    averageResponseTime: number;
    promptsGenerated: number;
    averageScore: number;
  };

  private constructor() {
    this.id = "meta-prompting-service";
    this.type = ServiceAgentType.META_PROMPT;
    this.status = "inactive";
    this.lastHeartbeat = new Date();
    this.metrics = {
      requestsHandled: 0,
      successRate: 0,
      averageResponseTime: 0,
      promptsGenerated: 0,
      averageScore: 0
    };

    this.events = new EventEmitter();
    this.templates = new Map();
    this.strategies = new Map();
    this.evaluationHistory = new Map();

    this.initializeStrategies();
  }

  public static getInstance(): MetaPromptingService {
    if (!MetaPromptingService.instance) {
      MetaPromptingService.instance = new MetaPromptingService();
    }
    return MetaPromptingService.instance;
  }

  public async start(): Promise<void> {
    try {
      await this.loadTemplates();
      this.status = "active";
      this.lastHeartbeat = new Date();
      this.events.emit("service:started", { serviceId: this.id });
    } catch (error) {
      this.status = "error";
      this.events.emit("service:error", {
        serviceId: this.id,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  private async loadTemplates(): Promise<void> {
    const result = await db.query("SELECT * FROM prompt_templates");
    for (const row of result.rows) {
      this.templates.set(row.name, row.template);
    }
  }

  private initializeStrategies(): void {
    this.strategies.set("chain-of-thought", this.chainOfThoughtStrategy.bind(this));
    this.strategies.set("few-shot", this.fewShotStrategy.bind(this));
    this.strategies.set("zero-shot", this.zeroShotStrategy.bind(this));
  }

  public async processRequest(request: MetaPromptRequest): Promise<MetaPromptResponse> {
    const startTime = Date.now();
    try {
      this.lastHeartbeat = new Date();
      this.metrics.requestsHandled++;

      let result: MetaPromptResponse;
      switch (request.type) {
        case "generate":
          result = await this.generatePrompt(request);
          break;
        case "optimize":
          result = await this.optimizePrompt(request);
          break;
        case "evaluate":
          result = await this.evaluatePrompt(request);
          break;
        default:
          throw new Error("Invalid request type");
      }

      const processingTime = Date.now() - startTime;
      this.updateMetrics(result, processingTime);

      return {
        ...result,
        metadata: {
          ...result.metadata,
          processingTime
        }
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        this.events.emit("meta-prompt:error", {
          serviceId: this.id,
          error: error.message
        });
      } else {
        this.events.emit("meta-prompt:error", {
          serviceId: this.id,
          error: "Unknown error"
        });
      }
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: errorMessage,
        metadata: {
          processingTime: Date.now() - startTime,
          strategy: request.input.strategy || "default",
          optimizationAttempts: 0
        }
      };
    }
  }

  private async generatePrompt(request: MetaPromptRequest): Promise<MetaPromptResponse> {
    const strategy = this.strategies.get(request.input.strategy || "zero-shot");
    if (!strategy) {
      throw new Error("Invalid strategy");
    }

    const prompt = await strategy(request);
    const evaluation = await this.evaluatePromptQuality(prompt, request.input);

    this.metrics.promptsGenerated++;

    return {
      success: true,
      prompt,
      evaluation,
      metadata: {
        processingTime: 0,
        strategy: request.input.strategy || "zero-shot",
        optimizationAttempts: 0
      }
    };
  }

  private async chainOfThoughtStrategy(request: MetaPromptRequest): Promise<string> {
    const template = this.templates.get("chain-of-thought") || "";
    return template
      .replace("{{task}}", request.input.task)
      .replace("{{context}}", request.input.context || "")
      .replace("{{constraints}}", request.input.constraints?.join("\n") || "");
  }

  private async fewShotStrategy(request: MetaPromptRequest): Promise<string> {
    const template = this.templates.get("few-shot") || "";
    const examples = request.input.examples
      ?.map(ex => `Input: ${JSON.stringify(ex.input)}\nOutput: ${ex.output}`)
      .join("\n\n");

    return template
      .replace("{{task}}", request.input.task)
      .replace("{{examples}}", examples || "")
      .replace("{{context}}", request.input.context || "");
  }

  private async zeroShotStrategy(request: MetaPromptRequest): Promise<string> {
    const template = this.templates.get("zero-shot") || "";
    return template
      .replace("{{task}}", request.input.task)
      .replace("{{context}}", request.input.context || "");
  }

  private async evaluatePromptQuality(
    prompt: string,
    input: MetaPromptRequest["input"]
  ): Promise<MetaPromptResponse["evaluation"]> {
    // Implement prompt quality evaluation logic
    const score = Math.random() * 100;
    const feedback = "Prompt evaluation feedback";
    const suggestions = ["Suggestion 1", "Suggestion 2"];

    this.evaluationHistory.set(prompt, [
      ...(this.evaluationHistory.get(prompt) || []),
      { score, feedback }
    ]);

    return {
      score,
      feedback,
      suggestions
    };
  }

  private updateMetrics(result: MetaPromptResponse, processingTime: number): void {
    const totalRequests = this.metrics.requestsHandled;
    const successfulRequests = this.metrics.successRate * totalRequests + (result.success ? 1 : 0);

    this.metrics.successRate = successfulRequests / totalRequests;
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (totalRequests - 1) + processingTime) / totalRequests;

    if (result.evaluation?.score) {
      const totalScore = this.metrics.averageScore * this.metrics.promptsGenerated;
      this.metrics.averageScore = (totalScore + result.evaluation.score) / (this.metrics.promptsGenerated + 1);
    }
  }
}
