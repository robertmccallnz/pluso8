// core/workers/worker-pool.ts
import { AgentIsolate } from "../../runtime/isolates/agent.ts";
import { MemoryManager } from "../../memory/manager.ts";
import { PerformanceMonitor } from "../../monitoring/performance.ts";


export class ChatAgentWorker {
  constructor(
    private isolate: AgentIsolate,
    private memoryManager: MemoryManager
  ) {}

  async terminate(): Promise<void> {
    await this.isolate.terminate();
    await this.memoryManager.releaseResources(this.isolate.id);
  }

  async getState(): Promise<Record<string, unknown>> {
    return await this.isolate.getState();
  }

  async updateConfig(config: Record<string, unknown>): Promise<void> {
    await this.isolate.updateConfig(config);
  }

  async getChatHistory(): Promise<Array<Record<string, unknown>>> {
    return await this.isolate.getChatHistory();
  }
}

export class WorkerPool {
  private workers: Map<string, ChatAgentWorker>;
  private memoryManager: MemoryManager;
  private performanceMonitor: PerformanceMonitor;

  constructor(
    private maxWorkers = 10,
    memoryManager?: MemoryManager,
    performanceMonitor?: PerformanceMonitor
  ) {
    this.workers = new Map();
    this.memoryManager = memoryManager || new MemoryManager();
    this.performanceMonitor = performanceMonitor || new PerformanceMonitor();
  }

  findWorker(agentId: string): ChatAgentWorker | undefined {
    return this.workers.get(agentId);
  }

  async allocateWorker(isolate: AgentIsolate): Promise<ChatAgentWorker> {
    this.performanceMonitor.startOperation("worker_allocation");

    try {
      if (this.workers.size >= this.maxWorkers) {
        throw new Error("Worker pool at capacity");
      }

      const worker = new ChatAgentWorker(isolate, this.memoryManager);
      this.workers.set(isolate.id, worker);
      
      this.performanceMonitor.endOperation("worker_allocation");
      return worker;
    } catch (error) {
      this.performanceMonitor.endOperation("worker_allocation", error);
      throw error;
    }
  }

  async freeWorker(agentId: string): Promise<void> {
    const worker = this.workers.get(agentId);
    if (worker) {
      await worker.terminate();
      this.workers.delete(agentId);
    }
  }

  async cleanup(): Promise<void> {
    const terminationPromises = Array.from(this.workers.values()).map(
      worker => worker.terminate()
    );
    await Promise.all(terminationPromises);
    this.workers.clear();
  }

  getActiveWorkerCount(): number {
    return this.workers.size;
  }

  hasCapacity(): boolean {
    return this.workers.size < this.maxWorkers;
  }
}