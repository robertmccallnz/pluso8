import { HandlerContext } from "$fresh/server.ts";
import supabase from "../../../../core/database/supabase/client.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext
): Promise<Response> {
  const { id } = ctx.params;
  
  try {
    // Get metrics for the last 24 hours
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Get metrics data
    const { data: metricsData, error: metricsError } = await supabase
      .from('agent_metrics')
      .select('*')
      .eq('agent_id', id)
      .gte('created_at', twentyFourHoursAgo.toISOString())
      .order('created_at', { ascending: false });

    if (metricsError) throw metricsError;

    // Get performance snapshots
    const { data: performanceData, error: perfError } = await supabase
      .from('agent_performance_snapshots')
      .select('*')
      .eq('agent_id', id)
      .gte('created_at', twentyFourHoursAgo.toISOString())
      .order('created_at', { ascending: false });

    if (perfError) throw perfError;

    // Get evaluations
    const { data: evaluationsData, error: evalError } = await supabase
      .from('agent_evaluations')
      .select('*')
      .eq('agent_id', id)
      .gte('created_at', twentyFourHoursAgo.toISOString())
      .order('created_at', { ascending: false });

    if (evalError) throw evalError;

    // Process metrics
    const metrics = metricsData || [];
    const snapshots = performanceData || [];
    const evaluations = evaluationsData || [];

    const processedMetrics = {
      agentId: id,
      metrics: metrics.map(m => ({
        ...m.metrics,
        created_at: m.created_at,
        id: m.id
      })),
      performance: {
        avgMemoryUsage: snapshots.length ? 
          Math.round(snapshots.reduce((sum, s) => sum + (s.memory_usage || 0), 0) / snapshots.length) : 0,
        avgCpuUsage: snapshots.length ? 
          Number((snapshots.reduce((sum, s) => sum + (s.cpu_usage || 0), 0) / snapshots.length).toFixed(2)) : 0,
        avgResponseTime: snapshots.length ? 
          Math.round(snapshots.reduce((sum, s) => sum + (s.response_time_ms || 0), 0) / snapshots.length) : 0,
        successRate: snapshots.length ? 
          Number((snapshots.reduce((sum, s) => sum + (s.success_rate || 0), 0) / snapshots.length).toFixed(2)) : 0,
        totalRequests: snapshots.reduce((sum, s) => sum + (s.total_requests || 0), 0),
        errorCount: snapshots.reduce((sum, s) => sum + (s.error_count || 0), 0)
      },
      evaluations: evaluations.map(e => ({
        criteria: e.criteria,
        score: e.score,
        feedback: e.feedback,
        created_at: e.created_at
      })),
      summary: {
        avgResponseTime: metrics.length ? 
          Math.round(metrics.reduce((sum, m) => sum + (m.metrics.response_time || 0), 0) / metrics.length) : 0,
        totalTokens: metrics.reduce((sum, m) => sum + (m.metrics.tokens || 0), 0),
        totalCost: Number(metrics.reduce((sum, m) => sum + (m.metrics.cost || 0), 0).toFixed(2)),
        avgScore: evaluations.length ?
          Math.round(evaluations.reduce((sum, e) => sum + e.score, 0) / evaluations.length) : 0,
        lastActive: metrics.length > 0 ? metrics[0].created_at : null
      }
    };
    
    return new Response(JSON.stringify(processedMetrics), {
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error) {
    console.error(`Error fetching metrics for agent ${id}:`, error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch metrics",
      details: error.message 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }
}
