// core/metrics/implementations/metrics-manager.ts

import { KVStorageManager } from "../../storage/kv-manager.ts";
import { 
  MetricData,
  AgentMetrics,
  SystemMetrics,
  MetricValidation,
  MetricAlert,
  AgentAnalytics,
  MetricStream,
  MetricKey,
  AgentMetricKey
} from "../types.ts";

export class MetricsManager {
  private kvStorage: KVStorageManager;
  private streams: Map<string, MetricStream> = new Map();
  private alertHandlers: Set<(alert: MetricAlert) => void> = new Set();

  constructor(kvStorage: KVStorageManager) {
    this.kvStorage = kvStorage;
  }

  async recordAgentMetric(agentId: string, metric: Partial<AgentMetrics>) {
    const timestamp = Date.now();
    const key: AgentMetricKey = ['agent_metrics', agentId, 'metrics', timestamp.toString()];

    // Validate metric before storing
    const validation = this.validateAgentMetric(metric);
    if (!validation.isValid) {
      throw new Error(`Invalid metric data: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Store metric in KV store
    await this.kvStorage.kv.atomic()
      .set(key, {
        ...metric,
        timestamp
      })
      .set(['agent_metrics', agentId, 'latest'], {
        ...metric,
        timestamp
      })
      .commit();

    // Check for alerts
    await this.checkAlerts(agentId, metric);
  }

  private validateAgentMetric(metric: Partial<AgentMetrics>): MetricValidation {
    const errors = [];
    const warnings = [];

    // Basic validation
    if (!metric.id) {
      errors.push({
        path: 'id',
        message: 'Agent ID is required',
        severity: 'error'
      });
    }

    if (!metric.metrics) {
      errors.push({
        path: 'metrics',
        message: 'Metrics object is required',
        severity: 'error'
      });
    }

    // Validate specific metrics
    if (metric.metrics?.performance) {
      if (metric.metrics.performance.memoryUsage < 0) {
        errors.push({
          path: 'metrics.performance.memoryUsage',
          message: 'Memory usage cannot be negative',
          severity: 'error'
        });
      }

      if (metric.metrics.performance.errorRate < 0 || metric.metrics.performance.errorRate > 1) {
        errors.push({
          path: 'metrics.performance.errorRate',
          message: 'Error rate must be between 0 and 1',
          severity: 'error'
        });
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  async getAgentMetricsHistory(
    agentId: string,
    timeRange: { start: number; end: number },
    limit = 100
  ): Promise<AgentMetrics[]> {
    const metrics = [];
    const prefix: AgentMetricKey = ['agent_metrics', agentId, 'metrics'];

    for await (const entry of this.kvStorage.kv.list({ prefix })) {
      const timestamp = parseInt(entry.key[3] as string);
      if (timestamp >= timeRange.start && timestamp <= timeRange.end) {
        metrics.push(entry.value as AgentMetrics);
      }
      if (metrics.length >= limit) break;
    }

    return metrics.sort((a, b) => 
      b.metrics.timestamps.created - a.metrics.timestamps.created
    );
  }

  async getAgentAnalytics(agentId: string, timeRange: { start: number; end: number }): Promise<AgentAnalytics> {
    const metrics = await this.getAgentMetricsHistory(agentId, timeRange);
    
    // Calculate analytics
    const analytics: AgentAnalytics = {
      timeRange,
      metrics: {
        usage: {
          totalRequests: 0,
          uniqueUsers: 0,
          peakConcurrent: 0,
          avgSessionDuration: 0
        },
        performance: {
          p50ResponseTime: 0,
          p95ResponseTime: 0,
          p99ResponseTime: 0,
          errorDistribution: {}
        },
        quality: {
          satisfactionScore: 0,
          accuracyScore: 0,
          clarityScore: 0,
          helpfulnessScore: 0
        },
        resources: {
          tokenUsage: 0,
          computeCost: 0,
          storageUsed: 0,
          bandwidthUsed: 0
        }
      },
      trends: []
    };

    // Calculate metrics
    if (metrics.length > 0) {
      analytics.metrics.usage.totalRequests = metrics.reduce(
        (sum, m) => sum + m.metrics.conversations.total, 0
      );

      // Calculate response times for percentiles
      const responseTimes = metrics
        .map(m => m.metrics.conversations.responseTime.avg)
        .sort((a, b) => a - b);

      analytics.metrics.performance.p50ResponseTime = 
        this.calculatePercentile(responseTimes, 50);
      analytics.metrics.performance.p95ResponseTime = 
        this.calculatePercentile(responseTimes, 95);
      analytics.metrics.performance.p99ResponseTime = 
        this.calculatePercentile(responseTimes, 99);

      // Calculate quality metrics
      analytics.metrics.quality.satisfactionScore = 
        this.calculateAverage(metrics.map(m => m.metrics.interaction.userSatisfaction));
      analytics.metrics.quality.accuracyScore = 
        this.calculateAverage(metrics.map(m => m.metrics.interaction.accuracyScore));
    }

    // Calculate trends
    analytics.trends = this.calculateTrends(metrics);

    return analytics;
  }

  private calculatePercentile(values: number[], percentile: number): number {
    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[index] || 0;
  }

  private calculateAverage(values: number[]): number {
    return values.length > 0 
      ? values.reduce((sum, val) => sum + val, 0) / values.length 
      : 0;
  }

  private calculateTrends(metrics: AgentMetrics[]): AgentAnalytics['trends'] {
    const trends: AgentAnalytics['trends'] = [];

    if (metrics.length < 2) return trends;

    // Calculate trends for key metrics
    const latestMetrics = metrics[metrics.length - 1];
    const previousMetrics = metrics[metrics.length - 2];

    // Response time trend
    const responseTimeDiff = 
      latestMetrics.metrics.conversations.responseTime.avg -
      previousMetrics.metrics.conversations.responseTime.avg;

    trends.push({
      metric: 'responseTime',
      change: Math.abs(responseTimeDiff),
      direction: responseTimeDiff > 0 ? 'up' : 'down',
      significance: Math.abs(responseTimeDiff) / previousMetrics.metrics.conversations.responseTime.avg
    });

    return trends;
  }

  private async checkAlerts(agentId: string, metric: Partial<AgentMetrics>) {
    // Example alert check
    if (metric.metrics?.performance.errorRate > 0.1) {
      const alert: MetricAlert = {
        id: crypto.randomUUID(),
        metricName: 'errorRate',
        threshold: {
          value: 0.1,
          operator: 'gt',
          severity: 'warning'
        },
        value: metric.metrics.performance.errorRate,
        timestamp: Date.now()
      };

      // Store alert
      await this.kvStorage.kv.set(
        ['alerts', agentId, alert.id],
        alert
      );

      // Notify alert handlers
      this.alertHandlers.forEach(handler => handler(alert));
    }
  }

  // Alert handling
  onAlert(handler: (alert: MetricAlert) => void) {
    this.alertHandlers.add(handler);
    return () => this.alertHandlers.delete(handler);
  }

  // Metric streaming
  createMetricStream(stream: MetricStream) {
    this.streams.set(stream.id, stream);
    return stream.id;
  }

  async startStream(streamId: string) {
    const stream = this.streams.get(streamId);
    if (!stream) throw new Error(`Stream ${streamId} not found`);

    // Implementation of metric streaming...
  }
}