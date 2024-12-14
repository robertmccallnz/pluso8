// core/metrics/enhanced-transpile-metrics.ts
import { KVStorageManager } from "../storage/kv-manager.ts";

interface TranspileStageMetrics {
  duration: number;
  memoryDelta: number;
  startTimestamp: number;
  endTimestamp: number;
}

interface MetricsSnapshot {
  stages: Record<string, TranspileStageMetrics>;
  totalStages: number;
  activeStages: number;
  timestamp: number;
  processId: string;
}

export class EnhancedTranspileMetrics extends TranspileMetrics {
  private memoryUsage: Map<string, number> = new Map();
  private stageStartTimes: Map<string, number> = new Map();
  private processId: string;
  private kvStorage: KVStorageManager;

  constructor(kvStorage: KVStorageManager) {
    super();
    this.processId = crypto.randomUUID();
    this.kvStorage = kvStorage;
  }

  async startStage(stage: string) {
    const startTime = performance.now();
    this.stageStartTimes.set(stage, startTime);
    this.memoryUsage.set(stage, Deno.memoryUsage().heapUsed);

    // Store stage start in KV
    await this.kvStorage.kv.atomic()
      .set(
        ["metrics", "transpile", this.processId, stage, "start"],
        {
          timestamp: Date.now(),
          memoryStart: Deno.memoryUsage().heapUsed
        }
      )
      .commit();
  }

  async endStage(stage: string) {
    const startTime = this.stageStartTimes.get(stage);
    const startMemory = this.memoryUsage.get(stage);

    if (startTime && startMemory) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      const memoryDelta = Deno.memoryUsage().heapUsed - startMemory;

      await this.recordStageMetrics(stage, duration, memoryDelta);
      
      this.stageStartTimes.delete(stage);
      this.memoryUsage.delete(stage);

      // Store completed stage metrics
      await this.kvStorage.kv.atomic()
        .set(
          ["metrics", "transpile", this.processId, stage, "complete"],
          {
            duration,
            memoryDelta,
            endTimestamp: Date.now()
          }
        )
        .commit();
    }
  }

  private async recordStageMetrics(stage: string, duration: number, memoryDelta: number) {
    const metrics = await this.getMetrics();
    const stageMetrics: TranspileStageMetrics = {
      duration,
      memoryDelta,
      startTimestamp: this.stageStartTimes.get(stage) || 0,
      endTimestamp: Date.now()
    };

    // Atomic update of stage metrics
    await this.kvStorage.kv.atomic()
      .set(
        ["metrics", "transpile", this.processId, stage],
        stageMetrics
      )
      .commit();
  }

  async getMetrics(): Promise<MetricsSnapshot> {
    const baseMetrics = await super.getMetrics();
    const snapshot: MetricsSnapshot = {
      ...baseMetrics,
      totalStages: this.metrics.size,
      activeStages: this.stageStartTimes.size,
      timestamp: Date.now(),
      processId: this.processId
    };

    // Store snapshot
    await this.kvStorage.kv.atomic()
      .set(
        ["metrics", "transpile", this.processId, "snapshot"],
        snapshot
      )
      .commit();

    return snapshot;
  }

  // New methods for metrics analysis
  async getStageHistory(stage: string, limit = 100): Promise<TranspileStageMetrics[]> {
    const history: TranspileStageMetrics[] = [];
    const prefix = ["metrics", "transpile", this.processId, stage];
    
    for await (const entry of this.kvStorage.kv.list({ prefix })) {
      if (history.length >= limit) break;
      history.push(entry.value as TranspileStageMetrics);
    }

    return history;
  }

  async getAverageStageMetrics(stage: string): Promise<{
    avgDuration: number;
    avgMemoryDelta: number;
    sampleSize: number;
  }> {
    const history = await this.getStageHistory(stage);
    
    if (history.length === 0) {
      return { avgDuration: 0, avgMemoryDelta: 0, sampleSize: 0 };
    }

    const totals = history.reduce((acc, metrics) => ({
      duration: acc.duration + metrics.duration,
      memoryDelta: acc.memoryDelta + metrics.memoryDelta
    }), { duration: 0, memoryDelta: 0 });

    return {
      avgDuration: totals.duration / history.length,
      avgMemoryDelta: totals.memoryDelta / history.length,
      sampleSize: history.length
    };
  }

  // Cleanup method
  async cleanup(olderThan?: number) {
    const prefix = ["metrics", "transpile", this.processId];
    const threshold = olderThan || Date.now() - (7 * 24 * 60 * 60 * 1000); // Default 7 days

    for await (const entry of this.kvStorage.kv.list({ prefix })) {
      if (entry.value.timestamp < threshold) {
        await this.kvStorage.kv.delete(entry.key);
      }
    }
  }
}