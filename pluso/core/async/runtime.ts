// core/async/runtime.ts
import { EventEmitter } from "events";

interface TaskOptions {
  priority?: 'high' | 'normal' | 'low';
  timeout?: number;
  retries?: number;
}

interface Task<T> {
  id: string;
  execute: () => Promise<T>;
  options: TaskOptions;
}

class AsyncRuntime {
  private static instance: AsyncRuntime;
  private eventEmitter: EventEmitter;
  private taskQueue: Map<string, Task<any>>;
  private concurrencyLimit: number;
  private activeTaskCount: number;

  private constructor() {
    this.eventEmitter = new EventEmitter();
    this.taskQueue = new Map();
    this.concurrencyLimit = 100; // Configurable
    this.activeTaskCount = 0;
  }

  static getInstance(): AsyncRuntime {
    if (!AsyncRuntime.instance) {
      AsyncRuntime.instance = new AsyncRuntime();
    }
    return AsyncRuntime.instance;
  }

  async spawn<T>(
    task: () => Promise<T>,
    options: TaskOptions = {}
  ): Promise<T> {
    const taskId = crypto.randomUUID();
    const newTask: Task<T> = {
      id: taskId,
      execute: task,
      options: {
        priority: options.priority || 'normal',
        timeout: options.timeout || 30000,
        retries: options.retries || 0
      }
    };

    this.taskQueue.set(taskId, newTask);
    return this.executeTask(newTask);
  }

  private async executeTask<T>(task: Task<T>): Promise<T> {
    if (this.activeTaskCount >= this.concurrencyLimit) {
      await this.waitForAvailableSlot();
    }

    this.activeTaskCount++;

    try {
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Task timeout')), task.options.timeout);
      });

      const result = await Promise.race([
        task.execute(),
        timeoutPromise
      ]);

      this.taskQueue.delete(task.id);
      return result;
    } catch (error) {
      if (task.options.retries > 0) {
        task.options.retries--;
        return this.executeTask(task);
      }
      throw error;
    } finally {
      this.activeTaskCount--;
      this.eventEmitter.emit('taskCompleted');
    }
  }

  private waitForAvailableSlot(): Promise<void> {
    return new Promise(resolve => {
      this.eventEmitter.once('taskCompleted', resolve);
    });
  }

  // IO Operations
  async readFile(path: string): Promise<Uint8Array> {
    return this.spawn(async () => {
      const file = await Deno.readFile(path);
      return file;
    });
  }

  async writeFile(path: string, data: Uint8Array): Promise<void> {
    return this.spawn(async () => {
      await Deno.writeFile(path, data);
    });
  }

  // Network Operations
  async fetch(input: string, init?: RequestInit): Promise<Response> {
    return this.spawn(async () => {
      const response = await fetch(input, init);
      return response;
    }, { timeout: 5000 });
  }

  // Worker Pool Management
  private workerPool: Worker[] = [];

  async initializeWorkerPool(size: number) {
    for (let i = 0; i < size; i++) {
      const worker = new Worker(
        new URL("../workers/task-worker.ts", import.meta.url).href,
        { type: "module" }
      );
      this.workerPool.push(worker);
    }
  }

  async executeInWorker<T>(
    taskFn: string,
    data: any
  ): Promise<T> {
    return this.spawn(async () => {
      const worker = this.getAvailableWorker();
      const result = await this.sendTaskToWorker(worker, taskFn, data);
      return result as T;
    });
  }

  private getAvailableWorker(): Worker {
    // Simple round-robin for now
    const worker = this.workerPool.shift();
    if (worker) {
      this.workerPool.push(worker);
      return worker;
    }
    throw new Error('No workers available');
  }

  private async sendTaskToWorker(
    worker: Worker,
    taskFn: string,
    data: any
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const messageHandler = (e: MessageEvent) => {
        worker.removeEventListener('message', messageHandler);
        worker.removeEventListener('error', errorHandler);
        resolve(e.data);
      };

      const errorHandler = (e: ErrorEvent) => {
        worker.removeEventListener('message', messageHandler);
        worker.removeEventListener('error', errorHandler);
        reject(e.error);
      };

      worker.addEventListener('message', messageHandler);
      worker.addEventListener('error', errorHandler);
      worker.postMessage({ taskFn, data });
    });
  }
}

// Export singleton instance
export const runtime = AsyncRuntime.getInstance();