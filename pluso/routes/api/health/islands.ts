import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, _ctx: HandlerContext) {
    // This endpoint could provide information about Fresh islands status
    return new Response(JSON.stringify({ status: "ok", islands: [] }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
