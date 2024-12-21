import { Handlers } from "$fresh/server.ts";
import { StepData } from "../../../../islands/AgentCreation/types.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const stepData: StepData = await req.json();
      
      if (!stepData.agentId || !stepData.userId || !stepData.stepId) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // TODO: Save step data to database
      // This should save both the step data and update the agent's current step

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
