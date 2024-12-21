import { EventEmitter } from "node:events";
import { ErrorAnalysisService, ErrorContext } from "./error-analysis.ts";
import { db } from "../utils/db.ts";
import { metaPromptingService } from "./meta-prompting.ts";
import { RouteAnalyzer } from "./route-analyzer.ts"; // Import RouteAnalyzer

interface ErrorMetadata {
  component: string;
  timestamp: Date;
  severity: "low" | "medium" | "high" | "critical";
  tags: string[];
  userId?: string;
  route?: string;
  requestId?: string;
}

interface ErrorInterceptorConfig {
  enableMetaAnalysis: boolean;
  enableRealTimeAlerts: boolean;
  minSeverityForAlert: "low" | "medium" | "high" | "critical";
  samplingRate: number; // 0-1, for high-volume errors
  alertThreshold: {
    severity: "low" | "medium" | "high" | "critical";
    count: number;
  };
}

export class ErrorInterceptor {
  private static instance: ErrorInterceptor;
  private events: EventEmitter;
  private errorAnalysisService: ErrorAnalysisService;
  private config: ErrorInterceptorConfig;
  private errorBuffer: Map<string, Array<{ error: Error; metadata: ErrorMetadata }>>;
  private processingInterval: number = 5000; // 5 seconds

  private constructor() {
    this.events = new EventEmitter();
    this.errorAnalysisService = ErrorAnalysisService.getInstance();
    this.errorBuffer = new Map();
    this.config = {
      enableMetaAnalysis: true,
      enableRealTimeAlerts: true,
      minSeverityForAlert: "high",
      samplingRate: 1.0,
      alertThreshold: {
        severity: "high",
        count: 10
      }
    };

    // Start error processing
    this.setupErrorHandlers();
    setInterval(() => this.processErrorBuffer(), this.processingInterval);
  }

  public static getInstance(): ErrorInterceptor {
    if (!ErrorInterceptor.instance) {
      ErrorInterceptor.instance = new ErrorInterceptor();
    }
    return ErrorInterceptor.instance;
  }

  private setupErrorHandlers() {
    // Global unhandled error handler
    if (typeof window !== 'undefined') {
      window.onerror = (event: ErrorEvent) => {
        this.handleError(event.error || new Error(event.message), {
          component: 'frontend',
          timestamp: new Date(),
          severity: 'high',
          tags: ['unhandled', 'frontend']
        });
      };

      // Promise rejection handler
      window.onunhandledrejection = (event: PromiseRejectionEvent) => {
        this.handleError(event.reason, {
          component: 'frontend',
          timestamp: new Date(),
          severity: 'high',
          tags: ['unhandled', 'promise-rejection']
        });
      };
    }

    // Server-side error handlers (Deno)
    if (typeof Deno !== 'undefined') {
      addEventListener('error', (event: ErrorEvent) => {
        this.handleError(event.error, {
          component: 'backend',
          timestamp: new Date(),
          severity: 'high',
          tags: ['unhandled', 'backend']
        });
      });

      addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        this.handleError(event.reason, {
          component: 'backend',
          timestamp: new Date(),
          severity: 'high',
          tags: ['unhandled', 'promise-rejection', 'backend']
        });
      });
    }
  }

  private async handleError(error: Error, metadata: ErrorMetadata): Promise<void> {
    // Get stack trace
    const stackTrace = error.stack || error.message;

    // Get system state
    const systemState = await this.getSystemState();

    // Create error context
    const errorContext: ErrorContext = {
      error,
      stackTrace,
      component: metadata.component,
      timestamp: metadata.timestamp,
      systemState,
      relatedErrors: []
    };

    // Analyze error
    const analysis = await this.errorAnalysisService.analyzeError(errorContext);

    // Store analysis
    const errorKey = this.getErrorKey(error);
    await this.storeAnalysis(errorKey, analysis);

    // Apply fixes if available
    if (analysis.suggestedFixes.length > 0) {
      await this.errorAnalysisService.applyFixes({
        changes: analysis.suggestedFixes.map(fix => ({
          file: fix.split(':')[0],
          content: fix.split(':')[1]
        }))
      });
    }
  }

  private async processErrorBuffer(): Promise<void> {
    for (const [errorKey, errors] of this.errorBuffer.entries()) {
      if (errors.length === 0) continue;

      // Group errors by component
      const componentGroups = new Map<string, Array<{ error: Error; metadata: ErrorMetadata }>>();
      for (const { error, metadata } of errors) {
        const group = componentGroups.get(metadata.component) || [];
        group.push({ error, metadata });
        componentGroups.set(metadata.component, group);
      }

      // Process each component group
      for (const [component, groupErrors] of componentGroups.entries()) {
        const metadata = groupErrors[0].metadata;
        
        // Convert errors to proper Error objects with context
        const relatedErrors = groupErrors.slice(1).map(({ error, metadata }) => {
          const err = new Error(error instanceof Error ? error.message : String(error));
          if (error instanceof Error) {
            err.name = error.name;
            err.stack = error.stack;
          }
          return {
            error: err,
            context: {
              component: metadata.component,
              timestamp: metadata.timestamp,
              severity: metadata.severity,
              tags: metadata.tags
            } as Record<string, unknown>
          };
        });

        // Create error context with related errors
        const mainError = groupErrors[0].error;
        const errorContext: ErrorContext = {
          error: mainError instanceof Error ? mainError : new Error(String(mainError)),
          stackTrace: mainError instanceof Error ? mainError.stack || mainError.message : String(mainError),
          component,
          timestamp: metadata.timestamp,
          systemState: await this.getSystemState(),
          relatedErrors: relatedErrors as Array<{ error: Error; context: Record<string, unknown> }>
        };

        // Analyze error pattern
        const analysis = await this.errorAnalysisService.analyzeError(errorContext);

        // Store analysis
        await this.storeAnalysis(errorKey, analysis);
      }

      // Clear processed errors
      this.errorBuffer.delete(errorKey);
    }
  }

  private getErrorKey(error: Error): string {
    return `${error.name}:${error.message}`;
  }

  private async storeAnalysis(errorKey: string, analysis: any) {
    await db.query(
      "INSERT INTO error_analysis (error_key, analysis) VALUES ($1, $2) ON CONFLICT (error_key) DO UPDATE SET analysis = $2",
      [errorKey, analysis]
    );
  }

  private async getSystemState(): Promise<Record<string, unknown>> {
    return {
      memory: Deno.memoryUsage(),
      openResources: await Deno.osRelease(),
      timestamp: new Date()
    };
  }

  private async analyzeErrorPatterns(
    groupedErrors: Record<string, Array<{ error: Error; metadata: ErrorMetadata }>>
  ) {
    const routeAnalyzer = RouteAnalyzer.getInstance();
    
    for (const [key, errors] of Object.entries(groupedErrors)) {
      // First, group by routes
      await Promise.all(errors.map(({ error, metadata }) => 
        routeAnalyzer.groupError(error, {
          component: metadata.component,
          route: metadata.route,
          userId: metadata.userId,
          timestamp: metadata.timestamp
        })
      ));

      // Then analyze the error context
      const context: ErrorContext = {
        error: errors[0].error,
        stackTrace: errors[0].error.stack || '',
        component: errors[0].metadata.component || 'unknown',
        timestamp: new Date(),
        systemState: await this.getSystemState(),
        relatedErrors: errors.map(e => ({
          id: crypto.randomUUID(),
          message: e.error.message,
          timestamp: e.metadata.timestamp
        }))
      };

      // Get route-based analysis
      const routeAnalysis = await routeAnalyzer.getErrorImpactAnalysis(key);

      // Use meta-prompting for comprehensive analysis
      const analysis = await metaPromptingService.analyze({
        query: "Analyze error patterns and suggest preventive measures",
        context: {
          errors: errors.map(e => ({
            message: e.error.message,
            stack: e.error.stack,
            metadata: e.metadata
          })),
          systemState: context.systemState,
          routeAnalysis // Include route analysis in context
        },
        strategy: "chain-of-thought"
      });

      // Store analysis results with route information
      await this.storeAnalysis(key, {
        ...analysis,
        routeImpact: routeAnalysis
      });
    }
  }

  private async logErrors(
    groupedErrors: Record<string, Array<{ error: Error; metadata: ErrorMetadata }>>
  ) {
    for (const errors of Object.values(groupedErrors)) {
      await Promise.all(errors.map(({ error, metadata }) => 
        this.logError(error, metadata)
      ));
    }
  }

  private async logError(error: Error, metadata: ErrorMetadata) {
    await db.query(
      `INSERT INTO error_logs (
        error_message,
        error_stack,
        component,
        user_id,
        route,
        request_id,
        severity,
        tags,
        timestamp
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        error.message,
        error.stack,
        metadata.component,
        metadata.userId,
        metadata.route,
        metadata.requestId,
        metadata.severity,
        metadata.tags,
        metadata.timestamp
      ]
    );
  }

  private shouldAlert(severity: string): boolean {
    const severityLevels = {
      low: 0,
      medium: 1,
      high: 2,
      critical: 3
    };
    return severityLevels[severity as keyof typeof severityLevels] >= 
           severityLevels[this.config.minSeverityForAlert];
  }

  private async sendAlert(error: Error, metadata: ErrorMetadata) {
    this.events.emit('error:alert', {
      error,
      metadata,
      timestamp: new Date()
    });
  }

  public updateConfig(newConfig: Partial<ErrorInterceptorConfig>) {
    this.config = { ...this.config, ...newConfig };
  }
}
