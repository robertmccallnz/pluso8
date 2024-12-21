import { EventEmitter } from "../../../../events/emitter.ts";
import { MetaPromptingService } from "./meta-prompt.ts";
import { META_PROMPTING_STRATEGIES } from "./strategies.ts";
import { db } from "../../../../utils/db.ts";

interface AgentPromptRequest {
  sourceAgentId: string;
  targetAgentId: string;
  task: string;
  context?: string;
  strategy?: string;
  requirements?: {
    maxTokens?: number;
    temperature?: number;
    timeout?: number;
  };
  priority?: "high" | "medium" | "low";
}

interface AgentPromptResponse {
  requestId: string;
  sourceAgentId: string;
  targetAgentId: string;
  prompt: string;
  evaluation?: {
    score: number;
    feedback: string;
  };
  metadata: {
    strategy: string;
    generationTime: number;
    tokenCount: number;
    timestamp: Date;
  };
}

interface PromptOptimizationResult {
  originalPrompt: string;
  optimizedPrompt: string;
  improvements: string[];
  performanceMetrics: {
    responseQuality: number;
    tokenEfficiency: number;
    generationSpeed: number;
  };
}

export class AgentPromptingService {
  private static instance: AgentPromptingService;
  private metaPrompting: MetaPromptingService;
  private events: EventEmitter;
  private promptCache: Map<string, AgentPromptResponse>;
  private optimizationHistory: Map<string, PromptOptimizationResult[]>;
  private activeRequests: Map<string, Promise<AgentPromptResponse>>;

  private constructor() {
    this.metaPrompting = MetaPromptingService.getInstance();
    this.events = new EventEmitter();
    this.promptCache = new Map();
    this.optimizationHistory = new Map();
    this.activeRequests = new Map();
  }

  public static getInstance(): AgentPromptingService {
    if (!AgentPromptingService.instance) {
      AgentPromptingService.instance = new AgentPromptingService();
    }
    return AgentPromptingService.instance;
  }

  public async requestPrompt(request: AgentPromptRequest): Promise<AgentPromptResponse> {
    const requestId = crypto.randomUUID();
    
    try {
      // Check for existing similar requests
      const cachedResponse = this.findSimilarPrompt(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Generate prompt using meta-prompting service
      const generatedPrompt = await this.metaPrompting.generatePrompt(request.task, request.context ?? '', request.strategy ?? 'default');

      const response: AgentPromptResponse = {
        requestId,
        sourceAgentId: request.sourceAgentId,
        targetAgentId: request.targetAgentId,
        prompt: generatedPrompt,
        metadata: {
          strategy: request.strategy ?? 'default',
          generationTime: Date.now(),
          tokenCount: this.estimateTokenCount(generatedPrompt),
          timestamp: new Date()
        }
      };

      // Cache the response
      this.promptCache.set(requestId, response);

      // Emit event
      this.events.emit("agent-prompt:generated", {
        requestId,
        sourceAgentId: request.sourceAgentId,
        targetAgentId: request.targetAgentId
      });

      // Optimize prompt asynchronously if enabled
      if (this.shouldOptimizePrompt(response)) {
        this.optimizePromptAsync(response);
      }

      return response;
    } catch (error) {
      if (error instanceof Error) {
        this.events.emit("agent-prompt:error", {
          requestId,
          error: error.message,
          request
        });
      } else {
        this.events.emit("agent-prompt:error", {
          requestId,
          error: "Unknown error occurred",
          request
        });
      }
      throw error;
    }
  }

  public async optimizePrompt(promptId: string): Promise<PromptOptimizationResult> {
    const originalResponse = this.promptCache.get(promptId);
    if (!originalResponse) {
      throw new Error(`Prompt not found: ${promptId}`);
    }

    const optimizationResult = await this.metaPrompting.processRequest({
      type: "optimize",
      input: {
        task: "Optimize prompt for better performance",
        context: originalResponse.prompt,
        targetModel: "gpt-4",
        constraints: [
          "Maintain original intent",
          "Improve clarity",
          "Reduce token count",
          "Enhance specificity"
        ]
      }
    });

    const result: PromptOptimizationResult = {
      originalPrompt: originalResponse.prompt,
      optimizedPrompt: optimizationResult.prompt ?? "default optimized prompt",
      improvements: this.analyzeImprovements(originalResponse.prompt, optimizationResult.prompt ?? ""),
      performanceMetrics: {
        responseQuality: optimizationResult.evaluation?.score || 0,
        tokenEfficiency: this.calculateTokenEfficiency(
          originalResponse.prompt,
          optimizationResult.prompt ?? ""
        ),
        generationSpeed: Date.now() - new Date(optimizationResult.timestamp).getTime()
      }
    };

    // Store optimization history
    const history = this.optimizationHistory.get(promptId) || [];
    history.push(result);
    this.optimizationHistory.set(promptId, history);

    return result;
  }

  public async getPromptHistory(agentId: string): Promise<AgentPromptResponse[]> {
    const history: AgentPromptResponse[] = [];
    
    for (const response of this.promptCache.values()) {
      if (response.sourceAgentId === agentId || response.targetAgentId === agentId) {
        history.push(response);
      }
    }

    return history.sort((a, b) => 
      new Date(b.metadata.timestamp).getTime() - new Date(a.metadata.timestamp).getTime()
    );
  }

  public async getOptimizationHistory(promptId: string): Promise<PromptOptimizationResult[]> {
    return this.optimizationHistory.get(promptId) || [];
  }

  private findSimilarPrompt(request: AgentPromptRequest): AgentPromptResponse | null {
    // Implement semantic similarity search for existing prompts
    // This is a simplified version
    for (const response of this.promptCache.values()) {
      if (
        response.sourceAgentId === request.sourceAgentId &&
        response.targetAgentId === request.targetAgentId &&
        this.calculateSimilarity(response.prompt, request.task) > 0.9
      ) {
        return response;
      }
    }
    return null;
  }

  private calculateSimilarity(prompt: string, task: string): number {
    // Implement semantic similarity calculation
    // This is a placeholder implementation
    return 0;
  }

  private buildConstraints(request: AgentPromptRequest): string[] {
    const constraints: string[] = [];

    if (request.requirements?.maxTokens) {
      constraints.push(`Maximum tokens: ${request.requirements.maxTokens}`);
    }
    if (request.requirements?.temperature !== undefined) {
      constraints.push(`Temperature: ${request.requirements.temperature}`);
    }
    if (request.requirements?.timeout) {
      constraints.push(`Timeout: ${request.requirements.timeout}ms`);
    }

    return constraints;
  }

  private estimateTokenCount(text: string): number {
    // Implement token counting logic
    // This is a simplified version
    return Math.ceil(text.length / 4);
  }

  private shouldOptimizePrompt(response: AgentPromptResponse): boolean {
    return (
      response.evaluation?.score !== undefined &&
      response.evaluation.score < 0.8 &&
      response.metadata.tokenCount > 100
    );
  }

  private async optimizePromptAsync(response: AgentPromptResponse): Promise<void> {
    try {
      const optimizationResult = await this.optimizePrompt(response.requestId);
      
      // Update cache with optimized version if significantly better
      if ((optimizationResult.performanceMetrics.responseQuality > (response.evaluation?.score ?? 0))) {
        response.prompt = optimizationResult.optimizedPrompt;
        response.evaluation = {
          score: optimizationResult.performanceMetrics.responseQuality,
          feedback: optimizationResult.improvements.join(", ")
        };
        this.promptCache.set(response.requestId, response);
      }

      this.events.emit("agent-prompt:optimized", {
        requestId: response.requestId,
        improvements: optimizationResult.improvements,
        metrics: optimizationResult.performanceMetrics
      });
    } catch (error) {
      this.events.emit("agent-prompt:optimization-error", {
        requestId: response.requestId,
        error: error.message
      });
    }
  }

  private analyzeImprovements(original: string, optimized: string): string[] {
    const improvements: string[] = [];

    // Compare token counts
    const originalTokens = this.estimateTokenCount(original);
    const optimizedTokens = this.estimateTokenCount(optimized);
    if (optimizedTokens < originalTokens) {
      improvements.push(`Reduced token count by ${originalTokens - optimizedTokens}`);
    }

    // Analyze clarity improvements
    if (optimized.split(".").length < original.split(".").length) {
      improvements.push("Improved conciseness");
    }

    // Analyze specificity
    if (optimized.match(/\{.*?\}/g)?.length > (original.match(/\{.*?\}/g)?.length || 0)) {
      improvements.push("Enhanced parameter specificity");
    }

    return improvements;
  }

  private calculateTokenEfficiency(original: string, optimized: string): number {
    const originalTokens = this.estimateTokenCount(original);
    const optimizedTokens = this.estimateTokenCount(optimized);
    return optimizedTokens / originalTokens;
  }
}
