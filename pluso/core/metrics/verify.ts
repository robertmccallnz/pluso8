import supabase from "../database/client.ts";

interface AgentStatus {
  agentId: string;
  isConnected: boolean;
  lastMetricTime?: Date;
  lastErrorTime?: Date;
  metricsCount: number;
  errorCount: number;
}

export async function verifyAgentMetrics(agentIds: string[]): Promise<AgentStatus[]> {
  const status: AgentStatus[] = [];

  for (const agentId of agentIds) {
    try {
      // Check metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('agent_metrics')
        .select('created_at')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(1);

      // Check errors
      const { data: errors, error: errorsError } = await supabase
        .from('agent_error_logs')
        .select('created_at')
        .eq('agent_id', agentId)
        .order('created_at', { ascending: false })
        .limit(1);

      // Get counts
      const { count: metricsCount } = await supabase
        .from('agent_metrics')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', agentId);

      const { count: errorCount } = await supabase
        .from('agent_error_logs')
        .select('*', { count: 'exact', head: true })
        .eq('agent_id', agentId);

      status.push({
        agentId,
        isConnected: !metricsError && metrics && metrics.length > 0,
        lastMetricTime: metrics?.[0]?.created_at ? new Date(metrics[0].created_at) : undefined,
        lastErrorTime: errors?.[0]?.created_at ? new Date(errors[0].created_at) : undefined,
        metricsCount: metricsCount || 0,
        errorCount: errorCount || 0,
      });
    } catch (error) {
      console.error(`Error verifying metrics for agent ${agentId}:`, error);
      status.push({
        agentId,
        isConnected: false,
        metricsCount: 0,
        errorCount: 0,
      });
    }
  }

  return status;
}
