import { HandlerContext } from "$fresh/server.ts";

export const handler = {
  async POST(req: Request, _ctx: HandlerContext) {
    try {
      const body = await req.json();
      const { agentId, metric, value } = body;

      if (!agentId || !metric || value === undefined) {
        return new Response(JSON.stringify({ 
          error: "Missing required fields" 
        }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Here you would typically store the metric in your database
      return new Response(JSON.stringify({ 
        status: "ok",
        recorded: { agentId, metric, value }
      }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ 
        error: "Invalid request body" 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
