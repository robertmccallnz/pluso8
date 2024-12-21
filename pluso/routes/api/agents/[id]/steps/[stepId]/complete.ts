import { Handlers } from "$fresh/server.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    try {
      const { id, stepId } = ctx.params;
      
      if (!id || !stepId) {
        return new Response(JSON.stringify({ error: "Agent ID and Step ID are required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // TODO: Mark step as complete in database
      // This should:
      // 1. Update the step's status
      // 2. Record completion timestamp
      // 3. Update the agent's current step if this was the active step

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
