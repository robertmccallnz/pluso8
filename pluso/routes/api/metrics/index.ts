import { HandlerContext } from "$fresh/server.ts";
import { generateMockMetrics } from "../../../core/metrics/mock-metrics.ts";

export const handler = async (
  req: Request,
  _ctx: HandlerContext,
): Promise<Response> => {
  const url = new URL(req.url);
  const agentId = url.searchParams.get("agentId");

  if (!agentId) {
    return new Response("Missing agentId parameter", { status: 400 });
  }

  try {
    const metrics = generateMockMetrics(agentId);
    return new Response(JSON.stringify(metrics), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Error generating metrics for agent ${agentId}:`, error);
    return new Response(
      JSON.stringify({
        error: "Failed to generate metrics",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
