// core/workers/worker-pool.ts
export class WorkerPool {
  private workers: Map<string, ChatAgentWorker>;
  private maxWorkers: number;

  constructor(maxWorkers = 10) {
    this.workers = new Map();
    this.maxWorkers = maxWorkers;
  }

  // Get worker by ID
  findWorker(agentId: string): ChatAgentWorker | undefined {
    return this.workers.get(agentId);
  }

  // Add worker to pool
  async allocateWorker(isolate: AgentIsolate): Promise<ChatAgentWorker> {
    if (this.workers.size >= this.maxWorkers) {
      throw new Error("Worker pool at capacity");
    }

    const worker = new ChatAgentWorker(isolate);
    this.workers.set(isolate.id, worker);
    return worker;
  }

  // Remove worker from pool
  async freeWorker(agentId: string): Promise<void> {
    const worker = this.workers.get(agentId);
    if (worker) {
      await worker.terminate();
      this.workers.delete(agentId);
    }
  }
}