// core/workers/error-handler.ts

export enum WorkerErrorType {
    TASK_FAILED = 'TASK_FAILED',
    WORKER_CRASHED = 'WORKER_CRASHED',
    TIMEOUT = 'TIMEOUT',
    MEMORY_LIMIT = 'MEMORY_LIMIT',
    INVALID_MESSAGE = 'INVALID_MESSAGE',
    API_ERROR = 'API_ERROR',
    RUNTIME_ERROR = 'RUNTIME_ERROR'
  }
  
  export class WorkerError extends Error {
    constructor(
      public type: WorkerErrorType,
      public message: string,
      public details?: unknown
    ) {
      super(message);
      this.name = 'WorkerError';
    }
  }
  
  export interface RetryConfig {
    maxAttempts: number;
    baseDelay: number;
    maxDelay: number;
    backoffFactor: number;
  }
  
  export class WorkerErrorHandler {
    private retryConfig: RetryConfig;
    private errors: Map<string, WorkerError[]> = new Map();
  
    constructor(config: Partial<RetryConfig> = {}) {
      this.retryConfig = {
        maxAttempts: config.maxAttempts || 3,
        baseDelay: config.baseDelay || 1000,
        maxDelay: config.maxDelay || 10000,
        backoffFactor: config.backoffFactor || 2
      };
    }
  
    async handleError(workerId: string, error: unknown): Promise<boolean> {
      const workerError = this.normalizeError(error);
      this.logError(workerId, workerError);
  
      // Check if the error is retryable
      if (this.isRetryable(workerError)) {
        return await this.retryOperation(workerId, workerError);
      }
  
      // Handle fatal errors
      this.handleFatalError(workerId, workerError);
      return false;
    }
  
    private normalizeError(error: unknown): WorkerError {
      if (error instanceof WorkerError) {
        return error;
      }
  
      if (error instanceof Error) {
        return new WorkerError(
          WorkerErrorType.RUNTIME_ERROR,
          error.message,
          error
        );
      }
  
      return new WorkerError(
        WorkerErrorType.RUNTIME_ERROR,
        'Unknown error occurred',
        error
      );
    }
  
    private isRetryable(error: WorkerError): boolean {
      const retryableTypes = [
        WorkerErrorType.TASK_FAILED,
        WorkerErrorType.TIMEOUT,
        WorkerErrorType.API_ERROR
      ];
  
      return retryableTypes.includes(error.type);
    }
  
    private async retryOperation(workerId: string, error: WorkerError): Promise<boolean> {
      const attempts = this.getErrorCount(workerId);
  
      if (attempts >= this.retryConfig.maxAttempts) {
        this.handleFatalError(workerId, error);
        return false;
      }
  
      const delay = this.calculateBackoff(attempts);
      await new Promise(resolve => setTimeout(resolve, delay));
  
      return true;
    }
  
    private calculateBackoff(attempt: number): number {
      const delay = this.retryConfig.baseDelay * 
        Math.pow(this.retryConfig.backoffFactor, attempt);
      return Math.min(delay, this.retryConfig.maxDelay);
    }
  
    private logError(workerId: string, error: WorkerError): void {
      const workerErrors = this.errors.get(workerId) || [];
      workerErrors.push(error);
      this.errors.set(workerId, workerErrors);
  
      console.error(`Worker ${workerId} error:`, {
        type: error.type,
        message: error.message,
        details: error.details
      });
    }
  
    private getErrorCount(workerId: string): number {
      return this.errors.get(workerId)?.length || 0;
    }
  
    private handleFatalError(workerId: string, error: WorkerError): void {
      // Log fatal error
      console.error(`Fatal error in worker ${workerId}:`, error);
  
      // Clean up worker errors
      this.errors.delete(workerId);
  
      // Emit event for worker recycling
      self.postMessage({
        type: 'fatalError',
        workerId,
        error: {
          type: error.type,
          message: error.message
        }
      });
    }
  
    public clearErrors(workerId: string): void {
      this.errors.delete(workerId);
    }
  
    public getWorkerErrors(workerId: string): WorkerError[] {
      return this.errors.get(workerId) || [];
    }
  }