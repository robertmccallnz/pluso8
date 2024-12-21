import { ServiceAgent, ServiceAgentType } from "../types";
import { EventEmitter } from "../../../../events/emitter";
import { db } from "../../../../utils/db";
import { WebScraper } from "../scraper/web-scraper";
import { AutonomousController } from "../autonomous/autonomous-controller";
import { EnhancementManager } from "../autonomous/enhancement-manager";
import { AutoArchitectAgent } from "../architect/auto-architect";
import { ErrorAnalysisService, ErrorContext } from "../../../../services/error-analysis";
import { metaPromptingService } from "../../../../services/meta-prompting";

export interface TriageRequest {
  type: "enhancement" | "architecture" | "autonomous" | "scraping";
  priority: number;
  data: Record<string, unknown>;
  source: string;
}

export interface TriageResult {
  success: boolean;
  assignedAgent: string;
  result: any;
  timestamp: Date;
}

export class TriageAgent implements ServiceAgent {
  private static instance: TriageAgent;
  id: string;
  type: ServiceAgentType;
  status: "active" | "inactive" | "error";
  lastHeartbeat: Date;
  metrics: {
    requestsHandled: number;
    successRate: number;
    averageResponseTime: number;
  };
  private events: EventEmitter;
  private webScraper: WebScraper;
  private autonomousController: AutonomousController;
  private enhancementManager: EnhancementManager;
  private autoArchitect: AutoArchitectAgent;

  private constructor() {
    this.id = crypto.randomUUID();
    this.type = ServiceAgentType.TRIAGE;
    this.status = "active";
    this.lastHeartbeat = new Date();
    this.metrics = {
      requestsHandled: 0,
      successRate: 1,
      averageResponseTime: 0
    };
    this.events = new EventEmitter();
    
    // Initialize connections to other agents
    this.webScraper = WebScraper.getInstance();
    this.autonomousController = new AutonomousController();
    this.enhancementManager = EnhancementManager.getInstance();
    this.autoArchitect = new AutoArchitectAgent();

    this.setupEventListeners();
    
    // Verify database connection
    this.verifyConnection();
  }

  private async verifyConnection() {
    try {
      await db.query('SELECT NOW()');
      console.log('TriageAgent: Database connection verified');
    } catch (error) {
      console.error('TriageAgent: Database connection failed:', error);
      this.status = "error";
    }
  }

  public static getInstance(): TriageAgent {
    if (!TriageAgent.instance) {
      TriageAgent.instance = new TriageAgent();
    }
    return TriageAgent.instance;
  }

  private setupEventListeners(): void {
    this.events.on("triage:request", async (request: TriageRequest) => {
      await this.handleRequest(request);
    });

    // Listen for events from other agents
    this.events.on("autonomous:error", this.handleAgentError.bind(this));
    this.events.on("enhancement:error", this.handleAgentError.bind(this));
    this.events.on("architect:error", this.handleAgentError.bind(this));
    this.events.on("scraper:error", this.handleAgentError.bind(this));
  }

  private async handleAgentError(error: any): Promise<void> {
    await db.query(
      "INSERT INTO triage_errors (agent_type, error_message, timestamp) VALUES ($1, $2, $3)",
      [error.source, error.message, new Date()]
    );
    this.events.emit("triage:error", error);
  }

  async handleRequest(request: TriageRequest): Promise<TriageResult> {
    const startTime = Date.now();
    let result: TriageResult;
    let attempts = 0;
    const MAX_ATTEMPTS = 3;
    const RETRY_DELAY = 5000; // 5 seconds

    // Initialize error analysis
    const errorAnalysis = ErrorAnalysisService.getInstance();
    const errorContext: ErrorContext = await this.buildErrorContext(request);

    while (attempts < MAX_ATTEMPTS) {
      try {
        // Analyze error pattern before attempt
        const pattern = await errorAnalysis.analyzeError(errorContext);
        
        // Use meta-prompting to determine best resolution strategy
        const strategy = await this.determineStrategy(pattern);
        
        // Attempt resolution with enhanced context
        result = await this.attemptResolution(request, attempts, pattern, strategy);
        
        if (result.success) {
          // Update metrics and log success
          this.updateMetrics(startTime, true);
          await this.logRequest(request, result);
          
          // Learn from successful resolution
          await this.learnFromSuccess(request, result, pattern);
          
          return result;
        }

        // If not successful but no error thrown, try next agent
        attempts++;
        if (attempts < MAX_ATTEMPTS) {
          await this.sleep(RETRY_DELAY);
          request = await this.escalateRequest(request, attempts, pattern);
        }

      } catch (error) {
        // Update error context with new information
        errorContext.relatedErrors.push({
          id: crypto.randomUUID(),
          message: error.message,
          timestamp: new Date()
        });
        
        // Log the error but continue the loop
        await this.logError(request, error);
        attempts++;
        if (attempts < MAX_ATTEMPTS) {
          await this.sleep(RETRY_DELAY);
          request = await this.escalateRequest(request, attempts, pattern);
        } else {
          throw error;
        }
      }
    }

    // If we've exhausted all attempts, create a high-priority architect request
    return await this.createArchitectRequest(request, errorContext);
  }

  private async buildErrorContext(request: TriageRequest): Promise<ErrorContext> {
    const error = new Error(request.data.error || "Unknown error");
    const stackTrace = error.stack || "";
    
    // Get system state
    const systemState = await this.getSystemState();
    
    // Get related errors
    const relatedErrors = await db.query(
      `SELECT id, error_message as message, timestamp 
       FROM triage_errors 
       WHERE component = $1 
       ORDER BY timestamp DESC 
       LIMIT 5`,
      [request.data.component]
    );

    return {
      error,
      stackTrace,
      component: request.data.component,
      timestamp: new Date(),
      systemState,
      relatedErrors
    };
  }

  private async determineStrategy(pattern: ErrorPattern): Promise<string> {
    // Use meta-prompting to determine best strategy
    const analysis = await metaPromptingService.analyze({
      query: "Determine best resolution strategy",
      context: {
        pattern,
        availableAgents: [
          "enhancement_manager",
          "autonomous_controller",
          "auto_architect"
        ]
      },
      strategy: "chain-of-thought"
    });

    return analysis.recommendedStrategy;
  }

  private async attemptResolution(
    request: TriageRequest, 
    attempt: number,
    pattern: ErrorPattern,
    strategy: string
  ): Promise<TriageResult> {
    // Enhance request with pattern analysis
    const enhancedRequest = {
      ...request,
      data: {
        ...request.data,
        errorPattern: pattern,
        resolutionStrategy: strategy
      }
    };

    switch (attempt) {
      case 0:
        // First try: Enhancement Manager with pattern context
        return await this.handleEnhancement(enhancedRequest);
      case 1:
        // Second try: Autonomous Controller with learned patterns
        return await this.handleAutonomous(enhancedRequest);
      case 2:
        // Final try: Auto Architect with full error history
        return await this.handleArchitecture(enhancedRequest);
      default:
        throw new Error("Invalid attempt number");
    }
  }

  private async learnFromSuccess(
    request: TriageRequest,
    result: TriageResult,
    pattern: ErrorPattern
  ): Promise<void> {
    // Use meta-prompting to extract learnings
    const learning = await metaPromptingService.analyze({
      query: "Extract learnings from successful resolution",
      context: {
        request,
        result,
        pattern
      },
      strategy: "iterative-refinement"
    });

    // Store learnings in database
    await db.query(
      `INSERT INTO resolution_learnings 
       (pattern_type, resolution_strategy, success_factors, improvements)
       VALUES ($1, $2, $3, $4)`,
      [
        pattern.type,
        result.assignedAgent,
        learning.successFactors,
        learning.improvements
      ]
    );

    // Update agent knowledge base
    await this.updateAgentKnowledge(learning);
  }

  private async updateAgentKnowledge(learning: any): Promise<void> {
    // Update each agent's knowledge base
    await Promise.all([
      this.enhancementManager.updateKnowledge(learning),
      this.autonomousController.updateKnowledge(learning),
      this.autoArchitect.updateKnowledge(learning)
    ]);
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async getErrorHistory(request: TriageRequest): Promise<any[]> {
    return await db.query(
      `SELECT * FROM triage_errors 
       WHERE request_type = $1 AND source = $2 
       ORDER BY timestamp DESC LIMIT 5`,
      [request.type, request.source]
    );
  }

  private async getSystemState(): Promise<any> {
    return {
      enhancementManager: await this.enhancementManager.getStatus(),
      autonomousController: await this.autonomousController.getStatus(),
      autoArchitect: await this.autoArchitect.getStatus(),
      webScraper: await this.webScraper.getStatus()
    };
  }

  private async analyzeFailures(request: TriageRequest): Promise<string[]> {
    const errors = await this.getErrorHistory(request);
    const patterns = errors.map(e => e.error_message);
    return await this.autoArchitect.analyzeErrorPatterns(patterns);
  }

  private async handleEnhancement(request: TriageRequest): Promise<TriageResult> {
    const result = await this.enhancementManager.queueEnhancement({
      id: crypto.randomUUID(),
      type: request.type,
      source: request.source,
      target: request.data.component || 'unknown',
      priority: request.priority,
      metadata: request.data
    });

    return {
      success: true,
      assignedAgent: "enhancement_manager",
      result,
      timestamp: new Date()
    };
  }

  private async handleAutonomous(request: TriageRequest): Promise<TriageResult> {
    return {
      success: true,
      assignedAgent: "autonomous_controller",
      result: await this.autonomousController.handleRequest(request.data),
      timestamp: new Date()
    };
  }

  private async handleArchitecture(request: TriageRequest): Promise<TriageResult> {
    return {
      success: true,
      assignedAgent: "auto_architect",
      result: await this.autoArchitect.analyzeArchitecture(request.data),
      timestamp: new Date()
    };
  }

  private async logRequest(request: TriageRequest, result: TriageResult): Promise<void> {
    try {
      // Log to triage_logs
      const [triageLog] = await db.query(
        `INSERT INTO triage_logs 
        (request_type, priority, source, success, assigned_agent, data, timestamp) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING id`,
        [
          request.type,
          request.priority,
          request.source,
          result.success,
          result.assignedAgent,
          JSON.stringify(request.data),
          result.timestamp
        ]
      );

      // Log to activity_log for tracking
      await db.query(
        `INSERT INTO activity_log 
        (action_type, description, triage_id, created_at) 
        VALUES ($1, $2, $3, $4)`,
        [
          'TRIAGE_REQUEST',
          `${request.type} request processed by ${result.assignedAgent}`,
          triageLog.id,
          result.timestamp
        ]
      );

      // Emit event for monitoring
      this.events.emit('triage:request', {
        type: request.type,
        success: result.success,
        agent: result.assignedAgent,
        timestamp: result.timestamp
      });
    } catch (error) {
      console.error('Failed to log triage request:', error);
      // Don't throw - we don't want logging failures to affect the main flow
    }
  }

  private async logError(request: TriageRequest, error: Error): Promise<void> {
    try {
      // Log to triage_errors
      const [errorLog] = await db.query(
        `INSERT INTO triage_errors 
        (request_type, error_message, stack_trace, context, timestamp) 
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`,
        [
          request.type,
          error.message,
          error.stack,
          JSON.stringify({
            source: request.source,
            data: request.data,
            priority: request.priority
          }),
          new Date()
        ]
      );

      // Log to activity_log for tracking
      await db.query(
        `INSERT INTO activity_log 
        (action_type, description, error_id, created_at) 
        VALUES ($1, $2, $3, $4)`,
        [
          'TRIAGE_ERROR',
          `Error in ${request.type} request: ${error.message}`,
          errorLog.id,
          new Date()
        ]
      );

      // Emit event for monitoring
      this.events.emit('triage:error', {
        type: request.type,
        error: error.message,
        context: request.data,
        timestamp: new Date()
      });
    } catch (dbError) {
      console.error('Failed to log triage error:', dbError);
      // Don't throw - we don't want logging failures to affect the main flow
    }
  }

  private updateMetrics(startTime: number, success: boolean): void {
    const endTime = Date.now();
    this.metrics.requestsHandled++;
    this.metrics.averageResponseTime = 
      (this.metrics.averageResponseTime * (this.metrics.requestsHandled - 1) + 
      (endTime - startTime)) / this.metrics.requestsHandled;
    if (!success) {
      this.metrics.successRate = 
        (this.metrics.successRate * this.metrics.requestsHandled) / 
        (this.metrics.requestsHandled + 1);
    }
  }

  public async getAgentStatus(): Promise<Record<string, any>> {
    return {
      autonomous: {
        id: this.autonomousController.id,
        status: this.autonomousController.status,
        metrics: this.autonomousController.metrics
      },
      enhancement: {
        id: this.enhancementManager.id,
        status: this.enhancementManager.status,
        metrics: this.enhancementManager.metrics
      },
      architect: {
        id: this.autoArchitect.id,
        status: this.autoArchitect.status,
        metrics: this.autoArchitect.metrics
      },
      scraper: {
        id: this.webScraper.id,
        status: this.webScraper.status,
        metrics: this.webScraper.metrics
      }
    };
  }

  private async createArchitectRequest(request: TriageRequest, errorContext: ErrorContext): Promise<TriageResult> {
    // Create a high-priority architecture analysis request
    const architectRequest = {
      type: "architecture",
      priority: 10, // Highest priority
      data: {
        ...request.data,
        errorHistory: await this.getErrorHistory(request),
        systemState: await this.getSystemState(),
        recommendedActions: await this.analyzeFailures(request),
        errorContext
      },
      source: "triage_escalation"
    };

    return await this.handleArchitecture(architectRequest);
  }

  private async escalateRequest(request: TriageRequest, attempt: number, pattern: ErrorPattern): Promise<TriageRequest> {
    // Increase priority and add context from previous attempts
    return {
      ...request,
      priority: request.priority + 1,
      data: {
        ...request.data,
        previousAttempts: attempt,
        escalationLevel: attempt + 1,
        timestamp: new Date().toISOString(),
        errorPattern: pattern
      }
    };
  }
}
