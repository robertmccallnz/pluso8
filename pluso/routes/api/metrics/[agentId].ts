// routes/api/metrics/[agentId].ts
import { HandlerContext } from "$fresh/server.ts";
import { MetricsCollector } from "../../../core/metrics/collector.ts";

export async function handler(
  req: Request,
  ctx: HandlerContext
): Promise<Response> {
  const { agentId } = ctx.params;
  const url = new URL(req.url);
  
  // Get time range from query parameters
  const start = parseInt(url.searchParams.get("start") || "0");
  const end = parseInt(url.searchParams.get("end") || Date.now().toString());

  try {
    const collector = MetricsCollector.getInstance();
    const metrics = await collector.getAgentMetrics(agentId, { start, end });

    return new Response(JSON.stringify(metrics), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error fetching metrics for agent ${agentId}:`, error);
    return new Response(JSON.stringify({ error: "Failed to fetch metrics" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
