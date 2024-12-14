/ core/metrics/transpile-metrics.ts
export class TranspileMetrics {
  private metrics: Map<string, StageMetrics> = new Map();
  private errors: Error[] = [];

  recordStageMetrics(stage: string, duration: number) {
    const existing = this.metrics.get(stage) || { count: 0, totalTime: 0, avgTime: 0 };
    existing.count++;
    existing.totalTime += duration;
    existing.avgTime = existing.totalTime / existing.count;
    this.metrics.set(stage, existing);
  }

  recordError(error: Error) {
    this.errors.push(error);
  }

  getMetrics() {
    return {
      stages: Object.fromEntries(this.metrics),
      errors: this.errors.length,
      lastError: this.errors[this.errors.length - 1]?.message
    };
  }
}// Record in performance monitor
Object.entries(metrics).forEach(([key, value]) => {
  this.performanceMonitor.record(`system.${key}`, value);
});

this.lastCheck = now;
return metrics;
}

private async getCPUUsage(): Promise<number> {
// Deno-specific CPU measurement
const start = performance.now();
await new Promise(resolve => setTimeout(resolve, 100));
return (performance.now() - start) / 100;
}

private getMemoryUsage(): number {
return Deno.memoryUsage().heapUsed;
}

private async getLatency(): Promise<number> {
const start = performance.now();
await new Promise(resolve => setTimeout(resolve, 0));
return performance.now() - start;
}

getMetrics() {
return this.performanceMonitor.getMetrics();
}
}