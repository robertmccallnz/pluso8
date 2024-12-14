// core/async/event-loop.ts
import { EventEmitter } from "events";

interface Task {
  id: string;
  priority: number;  // 0-9, where 9 is highest
  execute: () => Promise<any>;
  timestamp: number;
  deadline?: number;
}

interface BatchConfig {
  maxSize: number;
  maxWaitMs: number;
  minPriority: number;
}

class AdvancedEventLoop {
  private static instance: AdvancedEventLoop;
  private emitter: EventEmitter;
  private taskQueue: PriorityQueue<Task>;
  private batchQueues: Map<string, Task[]>;
  private isProcessing: boolean;
  private saturationLimit: number;
  private currentLoad: number;

  // Metrics
  private metrics = {
    processedTasks: 0,
    averageLatency: 0,
    queueSize: 0,
    saturationLevel: 0,
    batchesProcessed: 0,
  };

  private constructor() {
    this.emitter = new EventEmitter();
    this.taskQueue = new PriorityQueue();
    this.batchQueues = new Map();
    this.isProcessing = false;
    this.saturationLimit = 1000; // Configurable
    this.currentLoad = 0;

    // Initialize batch queues for different types
    this.batchQueues.set('io', []);
    this.batchQueues.set('computation', []);
    this.batchQueues.set('network', []);
  }

  static getInstance(): AdvancedEventLoop {
    if (!AdvancedEventLoop.instance) {
      AdvancedEventLoop.instance = new AdvancedEventLoop();
    }
    return AdvancedEventLoop.instance;
  }

  async scheduleTask(
    execute: () => Promise<any>,
    priority: number = 5,
    deadline?: number
  ): Promise<any> {
    const task: Task = {
      id: crypto.randomUUID(),
      priority,
      execute,
      timestamp: Date.now(),
      deadline,
    };

    if (this.shouldApplyBackPressure()) {
      await this.waitForCapacity();
    }

    this.taskQueue.enqueue(task);
    this.updateMetrics();

    if (!this.isProcessing) {
      this.processQueue();
    }

    return new Promise((resolve, reject) => {
      this.emitter.once(`task-${task.id}`, ({ result, error }) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }

  async scheduleBatch(
    tasks: Array<() => Promise<any>>,
    config: BatchConfig
  ): Promise<any[]> {
    const batchId = crypto.randomUUID();
    const batchTasks = tasks.map((execute, index) => ({
      id: `${batchId}-${index}`,
      priority: config.minPriority,
      execute,
      timestamp: Date.now(),
    }));

    // Split into smaller batches if needed
    const batches = this.splitIntoBatches(batchTasks, config.maxSize);
    const results: any[] = [];

    for (const batch of batches) {
      const batchPromises = batch.map(task => 
        new Promise((resolve, reject) => {
          this.taskQueue.enqueue(task);
          this.emitter.once(`task-${task.id}`, ({ result, error }) => {
            if (error) reject(error);
            else resolve(result);
          });
        })
      );

      // Wait for batch timeout or completion
      const batchResults = await Promise.race([
        Promise.all(batchPromises),
        new Promise(resolve => setTimeout(resolve, config.maxWaitMs))
      ]);

      results.push(...(batchResults || []));
    }

    return results;
  }

  private async processQueue() {
    this.isProcessing = true;

    while (!this.taskQueue.isEmpty()) {
      const task = this.taskQueue.dequeue();
      if (!task) continue;

      try {
        // Check deadline
        if (task.deadline && Date.now() > task.deadline) {
          this.emitter.emit(`task-${task.id}`, { 
            error: new Error('Task deadline exceeded') 
          });
          continue;
        }

        const startTime = performance.now();
        const result = await task.execute();
        const duration = performance.now() - startTime;

        this.updateTaskMetrics(duration);
        this.emitter.emit(`task-${task.id}`, { result });
      } catch (error) {
        this.emitter.emit(`task-${task.id}`, { error });
      }

      this.currentLoad = this.taskQueue.size();
      await this.applyBackPressure();
    }

    this.isProcessing = false;
  }

  private splitIntoBatches(tasks: Task[], maxSize: number): Task[][] {
    const batches: Task[][] = [];
    for (let i = 0; i < tasks.length; i += maxSize) {
      batches.push(tasks.slice(i, i + maxSize));
    }
    return batches;
  }

  private shouldApplyBackPressure(): boolean {
    return this.currentLoad >= this.saturationLimit;
  }

  private async applyBackPressure() {
    if (this.shouldApplyBackPressure()) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  private async waitForCapacity(): Promise<void> {
    return new Promise(resolve => {
      const check = () => {
        if (!this.shouldApplyBackPressure()) {
          resolve();
        } else {
          setTimeout(check, 100);
        }
      };
      check();
    });
  }

  private updateTaskMetrics(duration: number) {
    this.metrics.processedTasks++;
    this.metrics.averageLatency = 
      (this.metrics.averageLatency * (this.metrics.processedTasks - 1) + duration) 
      / this.metrics.processedTasks;
  }

  private updateMetrics() {
    this.metrics.queueSize = this.taskQueue.size();
    this.metrics.saturationLevel = this.currentLoad / this.saturationLimit;
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

// Priority Queue Implementation
class PriorityQueue<T extends { priority: number }> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
    this.items.sort((a, b) => b.priority - a.priority);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }
}

export const eventLoop = AdvancedEventLoop.getInstance();