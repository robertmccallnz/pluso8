import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  async GET(_req: Request, _ctx: HandlerContext) {
    return new Response(JSON.stringify({ status: "test" }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
