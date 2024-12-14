// routes/api/agents/index.ts
import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async GET(_req: Request) {
    return new Response(JSON.stringify({
      endpoints: [
        "/api/agents/chat",
        "/api/agents/management"
      ]
    }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};