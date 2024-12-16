// core/metrics/collector.ts

import { AgentMetrics, MetricData, StageMetrics, SystemMetrics } from "./types.ts";
import supabase from "../database/supabase/client.ts";

export class MetricsCollector {
  private static instance: MetricsCollector;
  private metricsBuffer: Map<string, AgentMetrics>;
  private flushInterval: number;
  private lastFlush: number;

  private constructor() {
    this.metricsBuffer = new Map();
    this.flushInterval = 60000; // 1 minute
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

  async recordAgentMetric(
    agentId: string,
    metric: Partial<AgentMetrics>
  ): Promise<void> {
    let agentMetrics = this.metricsBuffer.get(agentId);
    
    if (!agentMetrics) {
      agentMetrics = {
        id: agentId,
        name: metric.name || agentId,
        metrics: {
          conversations: {
            total: 0,
            active: 0,
            completed: 0,
            avgDuration: 0,
            responseTime: {
              avg: 0,
              min: Infinity,
              max: 0,
            },
          },
          performance: {
            memoryUsage: 0,
            cpuUsage: 0,
            latency: 0,
            errorRate: 0,
            successRate: 100,
          },
          knowledge: {
            totalTokens: 0,
            uniqueTopics: 0,
            contextSize: 0,
            embeddingCount: 0,
          },
          interaction: {
            userSatisfaction: 0,
            clarificationRequests: 0,
            accuracyScore: 0,
            engagementLevel: 0,
          },
          timestamps: {
            created: Date.now(),
            lastActive: Date.now(),
            lastError: 0,
          },
        },
      };
    }

    // Update metrics
    if (metric.metrics) {
      // Update conversation metrics
      if (metric.metrics.conversations) {
        const conv = agentMetrics.metrics.conversations;
        const newConv = metric.metrics.conversations;
        
        conv.total += newConv.total || 0;
        conv.active = newConv.active || conv.active;
        conv.completed += newConv.completed || 0;
        
        // Update response time metrics
        if (newConv.responseTime) {
          const rt = conv.responseTime;
          rt.min = Math.min(rt.min, newConv.responseTime.min || Infinity);
          rt.max = Math.max(rt.max, newConv.responseTime.max || 0);
          rt.avg = (rt.avg * conv.total + (newConv.responseTime.avg || 0)) / (conv.total + 1);
        }
      }

      // Update performance metrics
      if (metric.metrics.performance) {
        Object.assign(agentMetrics.metrics.performance, metric.metrics.performance);
      }

      // Update knowledge metrics
      if (metric.metrics.knowledge) {
        const know = agentMetrics.metrics.knowledge;
        know.totalTokens += metric.metrics.knowledge.totalTokens || 0;
        know.uniqueTopics = metric.metrics.knowledge.uniqueTopics || know.uniqueTopics;
        know.contextSize = metric.metrics.knowledge.contextSize || know.contextSize;
        know.embeddingCount += metric.metrics.knowledge.embeddingCount || 0;
      }

      // Update interaction metrics
      if (metric.metrics.interaction) {
        const inter = agentMetrics.metrics.interaction;
        const newInter = metric.metrics.interaction;
        
        inter.userSatisfaction = (inter.userSatisfaction + (newInter.userSatisfaction || 0)) / 2;
        inter.clarificationRequests += newInter.clarificationRequests || 0;
        inter.accuracyScore = (inter.accuracyScore + (newInter.accuracyScore || 0)) / 2;
        inter.engagementLevel = (inter.engagementLevel + (newInter.engagementLevel || 0)) / 2;
      }

      // Update timestamps
      agentMetrics.metrics.timestamps.lastActive = Date.now();
      if (metric.metrics.timestamps?.lastError) {
        agentMetrics.metrics.timestamps.lastError = metric.metrics.timestamps.lastError;
      }
    }

    this.metricsBuffer.set(agentId, agentMetrics);

    // Check if we should flush
    if (Date.now() - this.lastFlush >= this.flushInterval) {
      await this.flush();
    }
  }

  async recordError(agentId: string, error: Error): Promise<void> {
    // Record error in error logs
    const { error: dbError } = await supabase
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
      metrics.metrics.timestamps.lastError = Date.now();
      this.metricsBuffer.set(agentId, metrics);
    }
  }

  async flush(): Promise<void> {
    const timestamp = new Date().toISOString();
    
    for (const [agentId, metrics] of this.metricsBuffer.entries()) {
      const { error } = await supabase
        .from('agent_metrics')
        .insert({
          agent_id: agentId,
          timestamp,
          total_conversations: metrics.metrics.conversations.total,
          active_conversations: metrics.metrics.conversations.active,
          completed_conversations: metrics.metrics.conversations.completed,
          avg_response_time: metrics.metrics.conversations.responseTime.avg,
          min_response_time: metrics.metrics.conversations.responseTime.min,
          max_response_time: metrics.metrics.conversations.responseTime.max,
          memory_usage: metrics.metrics.performance.memoryUsage,
          cpu_usage: metrics.metrics.performance.cpuUsage,
          latency: metrics.metrics.performance.latency,
          error_rate: metrics.metrics.performance.errorRate,
          success_rate: metrics.metrics.performance.successRate,
          total_tokens: metrics.metrics.knowledge.totalTokens,
          unique_topics: metrics.metrics.knowledge.uniqueTopics,
          context_size: metrics.metrics.knowledge.contextSize,
          embedding_count: metrics.metrics.knowledge.embeddingCount,
          user_satisfaction: metrics.metrics.interaction.userSatisfaction,
          clarification_requests: metrics.metrics.interaction.clarificationRequests,
          accuracy_score: metrics.metrics.interaction.accuracyScore,
          engagement_level: metrics.metrics.interaction.engagementLevel,
          metadata: {
            created: metrics.metrics.timestamps.created,
            lastActive: metrics.metrics.timestamps.lastActive,
            lastError: metrics.metrics.timestamps.lastError
          }
        });

      if (error) {
        console.error(`Failed to flush metrics for agent ${agentId}:`, error);
      }
    }

    // Create performance snapshot
    for (const [agentId, metrics] of this.metricsBuffer.entries()) {
      const { error } = await supabase
        .from('agent_performance_snapshots')
        .insert({
          agent_id: agentId,
          timestamp,
          interval: '1m',
          avg_response_time: metrics.metrics.conversations.responseTime.avg,
          total_requests: metrics.metrics.conversations.total,
          error_count: metrics.metrics.performance.errorRate,
          success_rate: metrics.metrics.performance.successRate,
          avg_memory_usage: metrics.metrics.performance.memoryUsage,
          total_tokens_used: metrics.metrics.knowledge.totalTokens
        });

      if (error) {
        console.error(`Failed to create performance snapshot for agent ${agentId}:`, error);
      }
    }

    this.metricsBuffer.clear();
    this.lastFlush = Date.now();
  }

  async getAgentMetrics(
    agentId: string, 
    timeRange?: { start: Date; end: Date }
  ): Promise<AgentMetrics[]> {
    let query = supabase
      .from('agent_metrics')
      .select('*')
      .eq('agent_id', agentId);
    
    if (timeRange) {
      query = query
        .gte('timestamp', timeRange.start.toISOString())
        .lte('timestamp', timeRange.end.toISOString());
    }
    
    const { data, error } = await query.order('timestamp', { ascending: false });
    
    if (error) {
      console.error('Failed to fetch agent metrics:', error);
      return [];
    }
    
    return data.map(row => ({
      id: row.agent_id,
      name: row.agent_id,
      metrics: {
        conversations: {
          total: row.total_conversations,
          active: row.active_conversations,
          completed: row.completed_conversations,
          avgDuration: 0,
          responseTime: {
            avg: row.avg_response_time,
            min: row.min_response_time,
            max: row.max_response_time,
          },
        },
        performance: {
          memoryUsage: row.memory_usage,
          cpuUsage: row.cpu_usage,
          latency: row.latency,
          errorRate: row.error_rate,
          successRate: row.success_rate,
        },
        knowledge: {
          totalTokens: row.total_tokens,
          uniqueTopics: row.unique_topics,
          contextSize: row.context_size,
          embeddingCount: row.embedding_count,
        },
        interaction: {
          userSatisfaction: row.user_satisfaction,
          clarificationRequests: row.clarification_requests,
          accuracyScore: row.accuracy_score,
          engagementLevel: row.engagement_level,
        },
        timestamps: row.metadata,
      },
    }));
  }
}
