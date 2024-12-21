import { Handlers } from "$fresh/server.ts";

export default {
  async GET(_req: Request, _ctx) {
    return new Response(JSON.stringify({ status: "test" }), {
      headers: { "Content-Type": "application/json" },
    });
  },
} satisfies Handlers;
