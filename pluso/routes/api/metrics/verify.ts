import { HandlerContext } from "$fresh/server.ts";
import { verifyAgentMetrics } from "../../../core/metrics/verify.ts";

export async function handler(
  _req: Request,
  _ctx: HandlerContext,
): Promise<Response> {
  try {
    const agentIds = ["pet_UNIA", "leg_AL", "mai_A"];
    const status = await verifyAgentMetrics(agentIds);

    return new Response(JSON.stringify({ status }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "An error occurred" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
