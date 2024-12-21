import { Handlers } from "$fresh/server.ts";
import { TriageAgent } from "../../../core/agents/services/triage/triage-agent.ts";
import { ServiceAgentRegistry } from "../../../core/agents/services/registry.ts";
import { ServiceAgentType } from "../../../core/agents/services/types.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const triageRequest = await req.json();
      console.log('Received triage request:', triageRequest);
      
      // Get the triage agent instance
      const registry = await ServiceAgentRegistry.getInstance();
      const triageAgent = await registry.getAgent(ServiceAgentType.TRIAGE);
      
      if (!triageAgent) {
        console.error('Triage agent not available');
        return new Response(JSON.stringify({ error: "Triage agent not available" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        });
      }

      console.log('Processing triage request with agent:', triageAgent.id);

      // Handle the triage request
      const result = await (triageAgent as TriageAgent).handleRequest(triageRequest);
      console.log('Triage request processed:', result);
      
      return new Response(JSON.stringify(result), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error('Error processing triage request:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
};
