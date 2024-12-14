// core/metrics/system-monitor.ts
import { KVStorageManager } from "../storage/manager.ts";


interface SystemMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
  };
  latency: number;
  disk?: {
    read: number;
    write: number;
  };
  network?: {
    rx: number;
    tx: number;
  };
  timestamp: number;
}

interface MetricThresholds {
  cpu: number;
  memory: number;
  latency: number;
}

export class SystemMonitor {
  private performanceMonitor: PerformanceMonitor;
  private lastCheck: number = 0;
  private checkInterval: number = 5000; // 5 seconds
  private kvStorage: KVStorageManager;
  private monitorId: string;
  private thresholds: MetricThresholds;

  constructor(
    kvStorage: KVStorageManager,
    historySize = 100,
    thresholds: Partial<MetricThresholds> = {}
  ) {
    this.performanceMonitor = new PerformanceMonitor(historySize);
    this.kvStorage = kvStorage;
    this.monitorId = crypto.randomUUID();
    this.thresholds = {
      cpu: thresholds.cpu || 80, // 80% CPU threshold
      memory: thresholds.memory || 85, // 85% memory threshold
      latency: thresholds.latency || 100, // 100ms latency threshold
    };
  }

  async initialize() {
    await this.kvStorage.kv.set(
      ["system_monitor", this.monitorId, "config"],
      {
        startTime: Date.now(),
        checkInterval: this.checkInterval,
        thresholds: this.thresholds,
      }
    );
  }

  async collectSystemMetrics(): Promise<SystemMetrics | undefined> {
    const now = Date.now();
    
    if (now - this.lastCheck < this.checkInterval) {
      return;
    }

    const metrics: SystemMetrics = {
      cpu: await this.getCPUMetrics(),
      memory: await this.getMemoryMetrics(),
      latency: await this.getLatency(),
      disk: await this.getDiskMetrics(),
      network: await this.getNetworkMetrics(),
      timestamp: now
    };

    // Store metrics in KV
    await this.storeMetrics(metrics);

    // Check for threshold violations
    await this.checkThresholds(metrics);

    // Record in performance monitor
    this.recordMetrics(metrics);

    this.lastCheck = now;
    return metrics;
  }

  private async getCPUMetrics(): Promise<SystemMetrics['cpu']> {
    const usage = await this.calculateCPUUsage();
    return {
      usage,
      loadAverage: Deno.loadavg(),
    };
  }

  private async calculateCPUUsage(): Promise<number> {
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 100));
    return (performance.now() - start) / 100;
  }

  private async getMemoryMetrics(): Promise<SystemMetrics['memory']> {
    const memory = Deno.memoryUsage();
    return {
      heapUsed: memory.heapUsed,
      heapTotal: memory.heapTotal,
      external: memory.external,
      rss: memory.rss,
    };
  }

  private async getLatency(): Promise<number> {
    const start = performance.now();
    await new Promise(resolve => setTimeout(resolve, 0));
    return performance.now() - start;
  }

  private async getDiskMetrics(): Promise<SystemMetrics['disk']> {
    // Note: This is a placeholder. Actual implementation would depend
    // on Deno's file system API capabilities
    return {
      read: 0,
      write: 0
    };
  }

  private async getNetworkMetrics(): Promise<SystemMetrics['network']> {
    // Note: This is a placeholder. Actual implementation would depend
    // on Deno's network API capabilities
    return {
      rx: 0,
      tx: 0
    };
  }

  private async storeMetrics(metrics: SystemMetrics) {
    const atomic = this.kvStorage.kv.atomic();
    
    // Store detailed metrics
    atomic.set(
      ["system_monitor", this.monitorId, "metrics", metrics.timestamp.toString()],
      metrics
    );

    // Update latest metrics summary
    atomic.set(
      ["system_monitor", this.monitorId, "latest"],
      metrics
    );

    await atomic.commit();
  }

  private async checkThresholds(metrics: SystemMetrics) {
    const violations = [];

    if (metrics.cpu.usage > this.thresholds.cpu) {
      violations.push({
        type: 'cpu',
        value: metrics.cpu.usage,
        threshold: this.thresholds.cpu
      });
    }

    if (metrics.memory.heapUsed / metrics.memory.heapTotal * 100 > this.thresholds.memory) {
      violations.push({
        type: 'memory',
        value: metrics.memory.heapUsed / metrics.memory.heapTotal * 100,
        threshold: this.thresholds.memory
      });
    }

    if (metrics.latency > this.thresholds.latency) {
      violations.push({
        type: 'latency',
        value: metrics.latency,
        threshold: this.thresholds.latency
      });
    }

    if (violations.length > 0) {
      await this.kvStorage.kv.set(
        ["system_monitor", this.monitorId, "alerts", Date.now().toString()],
        violations
      );
    }
  }

  private recordMetrics(metrics: SystemMetrics) {
    Object.entries(metrics).forEach(([key, value]) => {
      if (typeof value === 'object') {
        Object.entries(value).forEach(([subKey, subValue]) => {
          this.performanceMonitor.record(`system.${key}.${subKey}`, subValue);
        });
      } else {
        this.performanceMonitor.record(`system.${key}`, value);
      }
    });
  }

  async getMetricsHistory(
    timeRange?: { start: number; end: number },
    limit = 100
  ): Promise<SystemMetrics[]> {
    const metrics = [];
    const prefix = ["system_monitor", this.monitorId, "metrics"];
    
    for await (const entry of this.kvStorage.kv.list({ prefix })) {
      if (timeRange) {
        const timestamp = parseInt(entry.key[3] as string);
        if (timestamp >= timeRange.start && timestamp <= timeRange.end) {
          metrics.push(entry.value);
        }
      } else {
        metrics.push(entry.value);
      }
      if (metrics.length >= limit) break;
    }

    return metrics.sort((a, b) => b.timestamp - a.timestamp);
  }

  async getAlerts(
    timeRange?: { start: number; end: number }
  ) {
    const alerts = [];
    const prefix = ["system_monitor", this.monitorId, "alerts"];
    
    for await (const entry of this.kvStorage.kv.list({ prefix })) {
      if (timeRange) {
        const timestamp = parseInt(entry.key[3] as string);
        if (timestamp >= timeRange.start && timestamp <= timeRange.end) {
          alerts.push({
            timestamp,
            violations: entry.value
          });
        }
      } else {
        alerts.push({
          timestamp: parseInt(entry.key[3] as string),
          violations: entry.value
        });
      }
    }

    return alerts.sort((a, b) => b.timestamp - a.timestamp);
  }

  getMetrics() {
    return this.performanceMonitor.getMetrics();
  }
}