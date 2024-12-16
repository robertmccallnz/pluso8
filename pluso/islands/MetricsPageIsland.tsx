import { useState, useEffect } from "preact/hooks";
import { COLORS, TYPOGRAPHY, COMPONENTS } from "../lib/constants/styles.ts";
import supabase from "../core/database/supabase/client.ts";

interface MetricsSummary {
  agentId: string;
  totalConversations: number;
  avgResponseTime: number;
  successRate: number;
  metricsCount: number;
  errorCount: number;
  lastActive: string;
  isConnected: boolean;
}

export default function MetricsPageIsland() {
  const [metrics, setMetrics] = useState<MetricsSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMetrics();
  }, []);

  async function fetchMetrics() {
    try {
      const { data: agentMetrics, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) throw error;

      // Process metrics into summary
      const metricsByAgent = new Map<string, MetricsSummary>();
      
      agentMetrics?.forEach(metric => {
        const existing = metricsByAgent.get(metric.agent_id) || {
          agentId: metric.agent_id,
          totalConversations: 0,
          avgResponseTime: 0,
          successRate: 0,
          metricsCount: 0,
          errorCount: 0,
          lastActive: metric.timestamp,
          isConnected: Date.now() - metric.timestamp < 5 * 60 * 1000 // Connected if active in last 5 minutes
        };

        existing.metricsCount++;
        existing.totalConversations = metric.conversation_id ? 1 : 0;
        existing.avgResponseTime = (existing.avgResponseTime * (existing.metricsCount - 1) + metric.response_time) / existing.metricsCount;
        if (!metric.success) existing.errorCount++;
        existing.successRate = ((existing.metricsCount - existing.errorCount) / existing.metricsCount) * 100;

        metricsByAgent.set(metric.agent_id, existing);
      });

      setMetrics(Array.from(metricsByAgent.values()));
      setLoading(false);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div class="flex justify-center items-center min-h-screen">
        <div class={`animate-spin rounded-full h-12 w-12 border-b-2 border-${COLORS.primary[500]}`}></div>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col gap-6">
        <div class={`${COMPONENTS.card.base} p-6`}>
          <h1 class={`text-${TYPOGRAPHY.fontSize["3xl"]} font-${TYPOGRAPHY.fontWeight.bold} mb-4 text-${COLORS.gray[900]}`}>
            Agent Performance Metrics
          </h1>
          <p class={`text-${TYPOGRAPHY.fontSize.lg} mb-6 text-${COLORS.gray[600]}`}>
            Monitor and analyze agent performance across various metrics
          </p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {metrics.map((metric) => (
              <div key={metric.agentId} class={`${COMPONENTS.card.base} ${COMPONENTS.card.hover} p-6`}>
                <div class="flex justify-between items-start mb-4">
                  <h3 class={`text-${TYPOGRAPHY.fontSize.lg} font-${TYPOGRAPHY.fontWeight.semibold} text-${COLORS.gray[900]}`}>
                    {metric.agentId}
                  </h3>
                  <span 
                    class={`px-2 py-1 rounded text-${TYPOGRAPHY.fontSize.sm} ${
                      metric.isConnected 
                        ? `bg-${COLORS.green[100]} text-${COLORS.green[800]}` 
                        : `bg-${COLORS.red[100]} text-${COLORS.red[800]}`
                    }`}
                  >
                    {metric.isConnected ? 'Connected' : 'Not Connected'}
                  </span>
                </div>
                <div class="space-y-2">
                  <div class="flex justify-between">
                    <span class={`text-${COLORS.gray[600]}`}>Success Rate</span>
                    <span 
                      class={metric.successRate < 95 
                        ? `text-${COLORS.red[500]}` 
                        : `text-${COLORS.green[500]}`}
                    >
                      {metric.successRate.toFixed(1)}%
                    </span>
                  </div>
                  <div class="flex justify-between">
                    <span class={`text-${COLORS.gray[600]}`}>Response Time</span>
                    <span class={`text-${COLORS.gray[900]}`}>{metric.avgResponseTime.toFixed(2)}ms</span>
                  </div>
                  <div class="flex justify-between">
                    <span class={`text-${COLORS.gray[600]}`}>Conversations</span>
                    <span class={`text-${COLORS.gray[900]}`}>{metric.totalConversations}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class={`text-${COLORS.gray[600]}`}>Errors</span>
                    <span class={metric.errorCount > 0 
                      ? `text-${COLORS.red[500]}` 
                      : `text-${COLORS.green[500]}`}
                    >
                      {metric.errorCount}
                    </span>
                  </div>
                  <div class={`mt-4 text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[500]}`}>
                    Last Active: {new Date(metric.lastActive).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {metrics.length === 0 && (
          <div class={`text-center py-8 text-${COLORS.gray[600]}`}>
            No metrics data available yet. Start using the agents to see their performance metrics.
          </div>
        )}
      </div>
    </div>
  );
}
