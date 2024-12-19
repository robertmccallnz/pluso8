// core/metrics/collector.ts

import { AgentMetrics, MetricData, StageMetrics, SystemMetrics } from "./types.ts";
import { supabaseAdmin } from "../database/client.ts";

export class MetricsCollector {
  private static instance: MetricsCollector;
  private metricsBuffer: Map<string, AgentMetrics>;
  private flushInterval: number;
  private lastFlush: number;

  private constructor() {
    this.metricsBuffer = new Map();
    this.flushInterval = 5000; // Reduce to 5 seconds
    this.lastFlush = Date.now();
    this.startAutoFlush();
  }

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  private async startAutoFlush() {
    setInterval(async () => {
      await this.flush();
    }, this.flushInterval);
  }

  async getAgentMetrics(agentId: string): Promise<AgentMetrics[]> {
    try {
      const { data, error } = await supabaseAdmin
        .from('agent_metrics')
        .select('*')
        .eq('agent_id', agentId)
        .order('recorded_at', { ascending: false })
        .limit(24);

      if (error) {
        console.error(`Failed to fetch metrics for agent ${agentId}:`, error);
        return [];
      }

      return data.map(row => ({
        recorded_at: row.recorded_at,
        metrics: {
          conversations: {
            total: row.total_conversations || 0,
            active: row.active_conversations || 0,
            completed: row.completed_conversations || 0,
            responseTime: {
              avg: row.avg_response_time || 0,
              min: row.min_response_time || 0,
              max: row.max_response_time || 0
            }
          },
          performance: {
            successRate: row.success_rate || 0,
            errorRate: row.error_rate || 0,
            latency: row.latency || 0,
            memoryUsage: row.memory_usage || 0,
            cpuUsage: row.cpu_usage || 0
          }
        }
      }));
    } catch (error) {
      console.error(`Error fetching metrics for agent ${agentId}:`, error);
      return [];
    }
  }

  async recordAgentMetric(
    agentId: string,
    metric: Partial<AgentMetrics>,
    userId?: string
  ): Promise<void> {
    const timestamp = new Date().toISOString();
    const { error } = await supabaseAdmin
      .from('agent_metrics')
      .insert({
        agent_id: agentId,
        recorded_at: timestamp,
        total_conversations: metric.metrics?.conversations?.total || 0,
        active_conversations: metric.metrics?.conversations?.active || 0,
        completed_conversations: metric.metrics?.conversations?.completed || 0,
        avg_response_time: metric.metrics?.conversations?.responseTime?.avg || 0,
        success_rate: metric.metrics?.performance?.successRate || 0,
        error_rate: metric.metrics?.performance?.errorRate || 0,
        memory_usage: metric.metrics?.performance?.memoryUsage || 0,
        cpu_usage: metric.metrics?.performance?.cpuUsage || 0,
        latency: metric.metrics?.performance?.latency || 0
      });

    if (error) {
      console.error(`Failed to record metric for agent ${agentId}:`, error);
    }
  }

  async recordError(agentId: string, error: Error): Promise<void> {
    // Record error in error logs
    const { error: dbError } = await supabaseAdmin
      .from('agent_error_logs')
      .insert({
        agent_id: agentId,
        error_type: error.name,
        error_message: error.message,
        stack_trace: error.stack,
        metadata: { timestamp: Date.now() }
      });

    if (dbError) {
      console.error('Failed to record error:', dbError);
    }

    // Update metrics
    const metrics = this.metricsBuffer.get(agentId);
    if (metrics) {
      metrics.metrics.performance.errorRate++;
      metrics.metrics.performance.successRate = 
        (metrics.metrics.conversations.total - metrics.metrics.performance.errorRate) / 
        metrics.metrics.conversations.total * 100;
      this.metricsBuffer.set(agentId, metrics);
    }
  }

  async flush(): Promise<void> {
    const timestamp = new Date().toISOString();
    
    for (const [agentId, metrics] of this.metricsBuffer.entries()) {
      const { error } = await supabaseAdmin
        .from('agent_metrics')
        .insert({
          agent_id: agentId,
          recorded_at: timestamp,
          total_conversations: metrics.metrics.conversations.total,
          active_conversations: metrics.metrics.conversations.active,
          completed_conversations: metrics.metrics.conversations.completed,
          avg_response_time: metrics.metrics.conversations.responseTime.avg,
          success_rate: metrics.metrics.performance.successRate,
          error_rate: metrics.metrics.performance.errorRate,
          memory_usage: metrics.metrics.performance.memoryUsage,
          cpu_usage: metrics.metrics.performance.cpuUsage,
          latency: metrics.metrics.performance.latency
        });

      if (error) {
        console.error(`Failed to flush metrics for agent ${agentId}:`, error);
      }
    }

    this.metricsBuffer.clear();
    this.lastFlush = Date.now();
  }
}
