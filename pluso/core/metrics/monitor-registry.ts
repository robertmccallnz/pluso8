// core/metrics/monitor-registry.ts
import { KVStorageManager } from "../storage/kv-manager.ts";

interface MonitorMetadata {
  name: string;
  lastCollection: number;
  collectionCount: number;
  status: 'active' | 'inactive';
}

export class MonitorRegistry {
  private static instance: MonitorRegistry;
  private monitors: Map<string, any> = new Map();
  private kvStorage: KVStorageManager;
  private registryId: string;

  private constructor(kvStorage: KVStorageManager) {
    this.kvStorage = kvStorage;
    this.registryId = crypto.randomUUID();
  }

  static async getInstance(kvStorage: KVStorageManager): Promise<MonitorRegistry> {
    if (!MonitorRegistry.instance) {
      MonitorRegistry.instance = new MonitorRegistry(kvStorage);
      await MonitorRegistry.instance.initialize();
    }
    return MonitorRegistry.instance;
  }

  private async initialize() {
    // Initialize registry in KV store
    await this.kvStorage.kv.atomic()
      .set(
        ["monitor_registry", this.registryId, "metadata"],
        {
          created: Date.now(),
          lastActive: Date.now()
        }
      )
      .commit();
  }

  async register(name: string, monitor: any) {
    this.monitors.set(name, monitor);

    const metadata: MonitorMetadata = {
      name,
      lastCollection: Date.now(),
      collectionCount: 0,
      status: 'active'
    };

    // Register monitor in KV store
    await this.kvStorage.kv.atomic()
      .set(
        ["monitor_registry", this.registryId, "monitors", name],
        metadata
      )
      .commit();
  }

  getMonitor(name: string) {
    return this.monitors.get(name);
  }

  async collectAllMetrics() {
    const timestamp = Date.now();
    const allMetrics: Record<string, any> = {};
    const atomic = this.kvStorage.kv.atomic();
    
    for (const [name, monitor] of this.monitors) {
      if (typeof monitor.getMetrics === 'function') {
        try {
          const metrics = await monitor.getMetrics();
          allMetrics[name] = metrics;

          // Store metrics in KV with timestamp
          atomic.set(
            ["metrics", "collection", timestamp, name],
            {
              metrics,
              collectedAt: timestamp
            }
          );

          // Update monitor metadata
          atomic.set(
            ["monitor_registry", this.registryId, "monitors", name],
            {
              name,
              lastCollection: timestamp,
              collectionCount: (await this.getMonitorMetadata(name))?.collectionCount + 1 || 1,
              status: 'active'
            }
          );
        } catch (error) {
          console.error(`Error collecting metrics for ${name}:`, error);
          
          // Mark monitor as inactive due to error
          atomic.set(
            ["monitor_registry", this.registryId, "monitors", name],
            {
              name,
              lastCollection: timestamp,
              collectionCount: (await this.getMonitorMetadata(name))?.collectionCount || 0,
              status: 'inactive',
              lastError: error.message
            }
          );
        }
      }
    }

    // Commit all changes atomically
    await atomic.commit();

    return allMetrics;
  }

  // New methods for metric analysis and management

  async getMonitorMetadata(name: string): Promise<MonitorMetadata | null> {
    const result = await this.kvStorage.kv.get(
      ["monitor_registry", this.registryId, "monitors", name]
    );
    return result.value as MonitorMetadata || null;
  }

  async getMetricsHistory(
    monitorName: string,
    timeRange?: { start: number; end: number },
    limit = 100
  ) {
    const history = [];
    const prefix = ["metrics", "collection"];
    
    for await (const entry of this.kvStorage.kv.list({ prefix })) {
      if (entry.key[3] === monitorName) {
        const metrics = entry.value;
        if (timeRange) {
          if (metrics.collectedAt >= timeRange.start && 
              metrics.collectedAt <= timeRange.end) {
            history.push(metrics);
          }
        } else {
          history.push(metrics);
        }
        if (history.length >= limit) break;
      }
    }

    return history.sort((a, b) => b.collectedAt - a.collectedAt);
  }

  async getActiveMonitors() {
    const activeMonitors = [];
    const prefix = ["monitor_registry", this.registryId, "monitors"];
    
    for await (const entry of this.kvStorage.kv.list({ prefix })) {
      const metadata = entry.value as MonitorMetadata;
      if (metadata.status === 'active') {
        activeMonitors.push(metadata);
      }
    }

    return activeMonitors;
  }

  async cleanupOldMetrics(retentionPeriod = 30 * 24 * 60 * 60 * 1000) { // 30 days default
    const cutoff = Date.now() - retentionPeriod;
    const prefix = ["metrics", "collection"];
    
    for await (const entry of this.kvStorage.kv.list({ prefix })) {
      if (entry.value.collectedAt < cutoff) {
        await this.kvStorage.kv.delete(entry.key);
      }
    }
  }
}