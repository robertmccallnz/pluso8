import { AgentConfig } from "../types/agent.ts";
import { WebSocketHandler } from "../core/communication/websocket.ts";

export function createWSHandler(agentType: string) {
  return async (req: Request) => {
    if (req.headers.get("upgrade") !== "websocket") {
      return new Response("Expected WebSocket", { status: 400 });
    }
    
    const handler = new WebSocketHandler(agentType);
    return handler.handle(req);
  };
}