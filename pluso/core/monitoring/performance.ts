// core/metrics/performance-monitor.ts
export class PerformanceMonitor {
    private metrics: Map<string, MetricData> = new Map();
    private readonly historySize: number;
  
    constructor(historySize = 100) {
      this.historySize = historySize;
    }
  
    record(metric: string, value: number) {
      const existing = this.metrics.get(metric) || {
        current: 0,
        min: value,
        max: value,
        avg: value,
        history: []
      };
  
      existing.current = value;
      existing.min = Math.min(existing.min, value);
      existing.max = Math.max(existing.max, value);
      existing.history.push(value);
  
      if (existing.history.length > this.historySize) {
        existing.history.shift();
      }
  
      existing.avg = existing.history.reduce((a, b) => a + b) / existing.history.length;
      this.metrics.set(metric, existing);
    }
  
    getMetrics(metric?: string) {
      if (metric) {
        return this.metrics.get(metric);
      }
      return Object.fromEntries(this.metrics);
    }
  }