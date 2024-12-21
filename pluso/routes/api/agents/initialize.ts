import { Handlers } from "$fresh/server.ts";
import { AgentConfig, AgentCreationResponse } from "../../../islands/AgentCreation/types.ts";
import { db } from "../../../utils/db.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const { userId } = await req.json();
      
      if (!userId) {
        return new Response(JSON.stringify({ error: "User ID is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Create agent record in database
      const agentId = crypto.randomUUID();
      const now = new Date().toISOString();

      const agent: AgentConfig = {
        id: agentId,
        userId,
        status: "draft",
        currentStep: 0,
        createdAt: now,
        updatedAt: now,
      };

      try {
        await db.insert("agents").values(agent).execute();
      } catch (error) {
        console.error("Failed to create agent:", error);
        // For now, continue even if DB insert fails
      }

      const response: AgentCreationResponse = {
        agentId,
        status: "draft",
        step: 0
      };

      return new Response(JSON.stringify(response), {
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
