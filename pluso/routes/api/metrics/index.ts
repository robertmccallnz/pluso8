import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, _ctx: HandlerContext) {
    return new Response(JSON.stringify({ 
      metrics: [
        "response_time",
        "memory_usage",
        "cpu_usage"
      ]
    }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
