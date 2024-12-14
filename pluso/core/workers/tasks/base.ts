// core/workers/task-worker.ts

import { WorkerErrorHandler, WorkerErrorType, WorkerError } from './error-handler.ts';

export class TaskWorker {
  private id: string;
  private errorHandler: WorkerErrorHandler;

  constructor() {
    this.id = crypto.randomUUID();
    this.errorHandler = new WorkerErrorHandler({
      maxAttempts: 3,
      baseDelay: 1000,
      maxDelay: 10000
    });
    this.initialize();
  }

  private async handleTaskExecution(taskId: string, payload: unknown): Promise<void> {
    try {
      const result = await this.executeTask(payload);
      self.postMessage({ type: 'result', taskId, data: result });
    } catch (error) {
      const shouldRetry = await this.errorHandler.handleError(this.id, error);
      
      if (shouldRetry) {
        // Requeue the task
        self.postMessage({
          type: 'retry',
          taskId,
          workerId: this.id
        });
      } else {
        // Report final failure
        self.postMessage({
          type: 'error',
          taskId,
          error: error instanceof WorkerError ? error : new WorkerError(
            WorkerErrorType.TASK_FAILED,
            'Task execution failed',
            error
          )
        });
      }
    }
  }

  private async executeTask(payload: unknown): Promise<unknown> {
    if (!payload || typeof payload !== 'object') {
      throw new WorkerError(
        WorkerErrorType.INVALID_MESSAGE,
        'Invalid task payload'
      );
    }

    const task = payload as { type: string; data: unknown };
    
    // Add memory check
    const memoryUsage = performance.memory?.usedJSHeapSize;
    if (memoryUsage && memoryUsage > 500 * 1024 * 1024) { // 500MB limit
      throw new WorkerError(
        WorkerErrorType.MEMORY_LIMIT,
        'Worker memory limit exceeded'
      );
    }

    try {
      switch (task.type) {
        case 'agentProcessing':
          return await this.handleAgentProcessing(task.data);
        case 'imageGeneration':
          return await this.handleImageGeneration(task.data);
        case 'textProcessing':
          return await this.handleTextProcessing(task.data);
        default:
          throw new WorkerError(
            WorkerErrorType.INVALID_MESSAGE,
            `Unknown task type: ${task.type}`
          );
      }
    } catch (error) {
      if (error instanceof WorkerError) {
        throw error;
      }
      throw new WorkerError(
        WorkerErrorType.TASK_FAILED,
        'Task execution failed',
        error
      );
    }
  }

  // ... rest of the TaskWorker implementation ...
}