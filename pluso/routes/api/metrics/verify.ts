import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, _ctx: HandlerContext) {
    return new Response(JSON.stringify({ 
      status: "ok",
      collection_enabled: true
    }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
