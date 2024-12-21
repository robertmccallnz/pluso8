import { metaPromptingService } from "./meta-prompting.ts";
import { db } from "../utils/db.ts";
import { FileSystem } from "../utils/file-system.ts";

export interface ErrorPattern {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  frequency: number;
  context: Record<string, unknown>;
  suggestedFixes: string[];
  relatedFiles: string[];
  metaAnalysis: string;
}

export interface ErrorContext {
  error: Error;
  stackTrace: string;
  component: string;
  timestamp: Date;
  systemState: Record<string, unknown>;
  relatedErrors?: Array<{
    error: Error;
    context: Record<string, unknown>;
  }>;
}

interface FileChange {
  file: string;
  content: string;
}

interface DbErrorPattern {
  id: string;
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  frequency: number;
  context: Record<string, unknown>;
  suggestedFixes: string[];
  relatedFiles: string[];
  metaAnalysis: string;
}

interface MetaPromptAnalysis {
  type: string;
  severity: "low" | "medium" | "high" | "critical";
  fixes: string[];
  files: string[];
  explanation: string;
}

type DbQueryResult<T> = {
  rows: T[];
  rowCount: number;
};

export class ErrorAnalysisService {
  private static instance: ErrorAnalysisService;
  private fileSystem: FileSystem;
  private patterns: Map<string, ErrorPattern>;
  private learningThreshold = 3; // Number of similar errors before learning
  
  private constructor() {
    this.fileSystem = new FileSystem();
    this.patterns = new Map();
    this.loadPatterns();
  }

  public static getInstance(): ErrorAnalysisService {
    if (!ErrorAnalysisService.instance) {
      ErrorAnalysisService.instance = new ErrorAnalysisService();
    }
    return ErrorAnalysisService.instance;
  }

  private async loadPatterns() {
    const result = await db.query("SELECT * FROM error_patterns") as DbQueryResult<DbErrorPattern>;
    const patterns = result.rows || [];
    
    for (const pattern of patterns) {
      this.patterns.set(pattern.id, {
        type: pattern.type,
        severity: pattern.severity,
        frequency: pattern.frequency,
        context: pattern.context,
        suggestedFixes: pattern.suggestedFixes,
        relatedFiles: pattern.relatedFiles,
        metaAnalysis: pattern.metaAnalysis
      });
    }
  }

  private async checkExistingPatterns(error: Error): Promise<ErrorPattern[]> {
    const result = await db.query("SELECT * FROM error_patterns WHERE type = $1", [error.name]) as DbQueryResult<DbErrorPattern>;
    return result.rows.map(pattern => ({
      type: pattern.type,
      severity: pattern.severity,
      frequency: pattern.frequency,
      context: pattern.context,
      suggestedFixes: pattern.suggestedFixes,
      relatedFiles: pattern.relatedFiles,
      metaAnalysis: pattern.metaAnalysis
    }));
  }

  private async updatePatternDatabase(pattern: ErrorPattern): Promise<void> {
    await db.query(
      "UPDATE error_patterns SET frequency = $1, context = $2 WHERE type = $3",
      [pattern.frequency, pattern.context, pattern.type]
    );
  }

  async analyzeError(context: ErrorContext): Promise<ErrorPattern> {
    // Check for existing patterns first
    const patterns = await this.checkExistingPatterns(context.error);
    if (patterns && patterns.length > 0) {
      // Update frequency of existing pattern
      const pattern = patterns[0];
      pattern.frequency += 1;
      await this.updatePatternDatabase(pattern);
      return pattern;
    }

    // Get related files content
    const files = await this.getRelatedFiles(context);
    
    // Analyze pattern using meta-prompting
    const patternAnalysis = await metaPromptingService.analyze({
      query: "Analyze error pattern",
      context: {
        error: context.error,
        files,
        systemState: context.systemState
      },
      strategy: "chain-of-thought"
    }) as MetaPromptAnalysis;

    // Create error pattern with default values for required fields
    return {
      type: patternAnalysis.type,
      severity: patternAnalysis.severity,
      frequency: 1,
      context: {
        component: context.component,
        timestamp: context.timestamp,
        systemState: context.systemState
      },
      suggestedFixes: patternAnalysis.fixes,
      relatedFiles: patternAnalysis.files,
      metaAnalysis: patternAnalysis.explanation
    };
  }

  private async getRelatedFiles(context: ErrorContext): Promise<Array<{path: string; content: string}>> {
    // Get files from stack trace
    const stackFiles = this.extractFilesFromStack(context.stackTrace);
    
    // Get component files
    const componentFiles = await this.findRelatedFiles(context.component);
    
    // Get files from related errors
    const errorFiles = context.relatedErrors?.map(error => 
      this.extractFilesFromStack(error.error.stack || error.error.message)
    ).flat() || [];
    
    // Combine and deduplicate files
    const allFiles = [...new Set([...stackFiles, ...componentFiles, ...errorFiles])];
    
    // Read file contents
    const filesWithContent = await Promise.all(
      allFiles.map(async file => ({
        path: file,
        content: await this.fileSystem.readFile(file)
      }))
    );
    
    return filesWithContent;
  }

  private extractFilesFromStack(stack: string): string[] {
    const files: string[] = [];
    const lines = stack.split('\n');
    
    for (const line of lines) {
      const match = line.match(/at\s+(?:\w+\s+)?\(?([^:]+):\d+:\d+\)?/);
      if (match) {
        files.push(match[1]);
      }
    }
    
    return files;
  }

  private async extractPattern(analysis: any, context: ErrorContext): Promise<ErrorPattern> {
    // Use meta-prompting to extract pattern
    const patternAnalysis = await metaPromptingService.analyze({
      query: "Extract error pattern from analysis",
      context: {
        analysis,
        error: context.error,
        relatedErrors: context.relatedErrors
      },
      strategy: "zero-shot-decomposition"
    }) as MetaPromptAnalysis;

    return {
      type: patternAnalysis.type,
      severity: patternAnalysis.severity,
      frequency: 1,
      context: context.systemState,
      suggestedFixes: patternAnalysis.fixes,
      relatedFiles: patternAnalysis.files,
      metaAnalysis: patternAnalysis.explanation
    };
  }

  private async learnFromPattern(pattern: ErrorPattern) {
    if (pattern.frequency >= this.learningThreshold) {
      // Generate meta-prompt for learning
      const learning = await metaPromptingService.analyze({
        query: "Learn from error pattern and generate preventive measures",
        context: {
          pattern,
          files: await this.getRelatedFiles({
            error: new Error(pattern.type),
            stackTrace: "",
            component: "",
            timestamp: new Date(),
            systemState: pattern.context,
            relatedErrors: []
          })
        },
        strategy: "iterative-refinement"
      }) as MetaPromptAnalysis;

      // Apply learned improvements
      await this.applyLearning(learning);
    }
  }

  private async applyLearning(learning: MetaPromptAnalysis) {
    // Generate code fixes
    const fixes = await metaPromptingService.analyze({
      query: "Generate code fixes from learning",
      context: { learning },
      strategy: "few-shot-learning"
    }) as { changes?: FileChange[] };

    // Apply fixes to files
    await this.applyFixes(fixes);

    // Update documentation
    await this.updateDocumentation(fixes);
  }

  public async applyFixes(fixes: { changes?: FileChange[] }) {
    if (!fixes.changes) return;
    
    for (const fix of fixes.changes) {
      await this.fileSystem.writeFile(fix.file, fix.content);
    }
  }

  private async updateDocumentation(docChanges: { changes?: FileChange[] }) {
    if (!docChanges.changes) return;
    
    for (const change of docChanges.changes) {
      await this.fileSystem.writeFile(change.file, change.content);
    }
  }

  public async findRelatedFiles(component: string): Promise<string[]> {
    return this.fileSystem.findFiles(".", new RegExp(component, "i"));
  }
}
