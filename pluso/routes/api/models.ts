import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  GET(_req: Request, _ctx: HandlerContext) {
    // This endpoint returns available models
    return new Response(JSON.stringify({ 
      models: [
        {
          id: "gpt-4",
          name: "GPT-4",
          description: "Most capable model, best at tasks that require creativity and advanced reasoning"
        },
        {
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo",
          description: "Fast and cost-effective model for most tasks"
        }
      ]
    }), {
      headers: { "Content-Type": "application/json" },
    });
  },
};
