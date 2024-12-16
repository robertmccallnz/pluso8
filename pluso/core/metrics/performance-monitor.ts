// core/metrics/performance-monitor.ts
import supabase from "../database/supabase/client.ts";
import { 
  PerformanceMetrics, 
  ResourceUsage,
  PerformanceAlert,
  AlertSeverity,
  AlertType
} from "./types.ts";

export class PerformanceMonitor {
  private alertHandlers: Set<(alert: PerformanceAlert) => void> = new Set();
  private metricsBuffer: Map<string, PerformanceMetrics[]> = new Map();
  private readonly bufferSize = 100;
  private readonly flushInterval = 60000; // 1 minute

  constructor() {
    // Set up periodic buffer flush
    setInterval(() => this.flushMetricsBuffer(), this.flushInterval);
  }

  async recordMetrics(agentId: string, metrics: Partial<PerformanceMetrics>) {
    const timestamp = Date.now();
    const fullMetrics: PerformanceMetrics = {
      timestamp,
      agentId,
      responseTime: metrics.responseTime || 0,
      memoryUsage: metrics.memoryUsage || 0,
      cpuUsage: metrics.cpuUsage || 0,
      errorCount: metrics.errorCount || 0,
      requestCount: metrics.requestCount || 0
    };

    // Add to buffer
    let buffer = this.metricsBuffer.get(agentId);
    if (!buffer) {
      buffer = [];
      this.metricsBuffer.set(agentId, buffer);
    }
    buffer.push(fullMetrics);

    // Check if buffer needs to be flushed
    if (buffer.length >= this.bufferSize) {
      await this.flushMetricsBuffer(agentId);
    }

    // Check for alerts
    await this.checkAlerts(agentId, fullMetrics);
  }

  private async flushMetricsBuffer(agentId?: string) {
    const agentsToFlush = agentId ? [agentId] : Array.from(this.metricsBuffer.keys());

    for (const aid of agentsToFlush) {
      const buffer = this.metricsBuffer.get(aid);
      if (!buffer || buffer.length === 0) continue;

      // Insert metrics in batch
      const { error } = await supabase
        .from('agent_metrics')
        .insert(
          buffer.map(metric => ({
            agent_id: metric.agentId,
            timestamp: metric.timestamp,
            response_time: metric.responseTime,
            memory_usage: metric.memoryUsage,
            cpu_usage: metric.cpuUsage,
            error_count: metric.errorCount,
            request_count: metric.requestCount
          }))
        );

      if (error) {
        console.error(`Failed to flush metrics for agent ${aid}:`, error);
        continue;
      }

      // Clear buffer after successful flush
      this.metricsBuffer.set(aid, []);
    }
  }

  async getAgentPerformance(agentId: string, timeRange: { start: number; end: number }) {
    const { data, error } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .gte('timestamp', timeRange.start)
      .lte('timestamp', timeRange.end)
      .order('timestamp', { ascending: true });

    if (error) {
      throw new Error(`Failed to fetch agent performance: ${error.message}`);
    }

    return data.map(metric => ({
      timestamp: metric.timestamp,
      agentId: metric.agent_id,
      responseTime: metric.response_time,
      memoryUsage: metric.memory_usage,
      cpuUsage: metric.cpu_usage,
      errorCount: metric.error_count,
      requestCount: metric.request_count
    }));
  }

  private async checkAlerts(agentId: string, metrics: PerformanceMetrics) {
    // Check response time
    if (metrics.responseTime > 2000) {
      this.emitAlert({
        type: 'high_latency',
        severity: 'warning',
        agentId,
        message: `High response time detected: ${metrics.responseTime}ms`,
        timestamp: Date.now(),
        data: { responseTime: metrics.responseTime }
      });
    }

    // Check error rate
    if (metrics.errorCount > 0) {
      const errorRate = metrics.errorCount / (metrics.requestCount || 1);
      if (errorRate > 0.1) {
        this.emitAlert({
          type: 'high_error_rate',
          severity: 'error',
          agentId,
          message: `High error rate detected: ${(errorRate * 100).toFixed(1)}%`,
          timestamp: Date.now(),
          data: { errorRate }
        });
      }
    }

    // Check resource usage
    if (metrics.memoryUsage > 1024 * 1024 * 100) { // 100MB
      this.emitAlert({
        type: 'high_memory_usage',
        severity: 'warning',
        agentId,
        message: `High memory usage: ${(metrics.memoryUsage / 1024 / 1024).toFixed(1)}MB`,
        timestamp: Date.now(),
        data: { memoryUsage: metrics.memoryUsage }
      });
    }

    if (metrics.cpuUsage > 80) {
      this.emitAlert({
        type: 'high_cpu_usage',
        severity: 'warning',
        agentId,
        message: `High CPU usage: ${metrics.cpuUsage}%`,
        timestamp: Date.now(),
        data: { cpuUsage: metrics.cpuUsage }
      });
    }
  }

  onAlert(handler: (alert: PerformanceAlert) => void) {
    this.alertHandlers.add(handler);
    return () => {
      this.alertHandlers.delete(handler);
    };
  }

  private emitAlert(alert: PerformanceAlert) {
    this.alertHandlers.forEach(handler => handler(alert));
  }
}