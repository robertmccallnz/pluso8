// core/metrics/metrics-manager.ts

import supabase from "../database/supabase/client.ts";
import { AgentConfig } from "../types.ts";
import { 
  AgentMetrics,
  AgentAnalytics,
  MetricStream,
  MetricValidation,
  MetricAlert,
  AgentMetricKey 
} from "./types.ts";

export class MetricsManager {
  private streams: Map<string, MetricStream> = new Map();
  private alertHandlers: Set<(alert: MetricAlert) => void> = new Set();

  async recordAgentMetric(agentId: string, metric: Partial<AgentMetrics>) {
    const timestamp = Date.now();

    // Validate metric before storing
    const validation = this.validateAgentMetric(metric);
    if (!validation.isValid) {
      throw new Error(`Invalid metric data: ${validation.errors.map(e => e.message).join(', ')}`);
    }

    // Store metric in Supabase
    const { error } = await supabase
      .from('agent_metrics')
      .insert({
        agent_id: agentId,
        timestamp,
        response_time: metric.responseTime || 0,
        success: metric.success || false,
        error_count: metric.errorCount || 0,
        conversation_id: metric.conversationId || '',
        tokens_used: metric.tokensUsed || 0,
        cost: metric.cost || 0,
      });

    if (error) {
      throw new Error(`Failed to store metric: ${error.message}`);
    }

    // Notify any metric streams
    const stream = this.streams.get(agentId);
    if (stream) {
      stream.onMetric({
        ...metric,
        timestamp,
        agentId
      });
    }
  }

  async getLatestMetrics(agentId: string): Promise<AgentMetrics | null> {
    const { data, error } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .order('timestamp', { ascending: false })
      .limit(1)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      responseTime: data.response_time,
      success: data.success,
      errorCount: data.error_count,
      conversationId: data.conversation_id,
      tokensUsed: data.tokens_used,
      cost: data.cost,
      timestamp: data.timestamp,
      agentId: data.agent_id
    };
  }

  async getMetricsHistory(agentId: string, limit = 100): Promise<AgentMetrics[]> {
    const { data, error } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('agent_id', agentId)
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data.map(metric => ({
      responseTime: metric.response_time,
      success: metric.success,
      errorCount: metric.error_count,
      conversationId: metric.conversation_id,
      tokensUsed: metric.tokens_used,
      cost: metric.cost,
      timestamp: metric.timestamp,
      agentId: metric.agent_id
    }));
  }

  async getAgentAnalytics(agentId: string): Promise<AgentAnalytics | null> {
    const { data, error } = await supabase
      .from('agent_analytics')
      .select('*')
      .eq('agent_id', agentId)
      .single();

    if (error || !data) {
      return null;
    }

    return {
      totalConversations: data.total_conversations,
      avgResponseTime: data.avg_response_time,
      successRate: data.success_rate,
      totalTokens: data.total_tokens,
      totalCost: data.total_cost,
      errorRate: data.error_rate,
      lastActive: data.last_active
    };
  }

  private validateAgentMetric(metric: Partial<AgentMetrics>): MetricValidation {
    const errors = [];
    
    if (metric.responseTime !== undefined && metric.responseTime < 0) {
      errors.push({ field: 'responseTime', message: 'Response time cannot be negative' });
    }
    
    if (metric.tokensUsed !== undefined && metric.tokensUsed < 0) {
      errors.push({ field: 'tokensUsed', message: 'Tokens used cannot be negative' });
    }
    
    if (metric.cost !== undefined && metric.cost < 0) {
      errors.push({ field: 'cost', message: 'Cost cannot be negative' });
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Stream management methods
  subscribeToMetrics(agentId: string, stream: MetricStream) {
    this.streams.set(agentId, stream);
  }

  unsubscribeFromMetrics(agentId: string) {
    this.streams.delete(agentId);
  }

  // Alert management methods
  onAlert(handler: (alert: MetricAlert) => void) {
    this.alertHandlers.add(handler);
  }

  offAlert(handler: (alert: MetricAlert) => void) {
    this.alertHandlers.delete(handler);
  }

  private notifyAlertHandlers(alert: MetricAlert) {
    this.alertHandlers.forEach(handler => handler(alert));
  }
}