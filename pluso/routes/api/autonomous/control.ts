import { Handlers } from "$fresh/server.ts";
import { AutonomousController } from "../../../core/agents/services/autonomous/autonomous-controller.ts";

const controller = new AutonomousController();

export const handler: Handlers = {
  async GET(req) {
    const status = await controller.getStatus();
    return new Response(JSON.stringify(status), {
      headers: { "Content-Type": "application/json" }
    });
  },

  async POST(req) {
    const body = await req.json();
    const { action, value } = body;

    switch (action) {
      case "adjust_autonomy":
        await controller.adjustAutonomy(value);
        break;
      case "add_safety_protocol":
        await controller.addSafetyProtocol(value);
        break;
      default:
        return new Response("Invalid action", { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
