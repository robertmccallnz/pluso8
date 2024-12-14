// routes/api/agents/chat.ts
import { Handler } from "$fresh/server.ts";
import { AgentConfigValidator } from "../../../core/config/agent-validator.ts";
import { AgentCommunicationManager } from "../../../core/agents/communication/manager.ts";

export const handler: Handler = async (req: Request): Promise<Response> => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  const commManager = AgentCommunicationManager.getInstance();
  
  socket.onopen = () => {
    console.log("Client connected to agent chat");
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      const { agentId, message } = data;

      // Send typing indicator
      socket.send(JSON.stringify({
        type: 'typing',
        agentId,
        content: 'Agent is thinking...'
      }));

      // Process message through communication manager
      const response = await commManager.sendMessage({
        from: 'user',
        to: agentId,
        content: message,
        type: 'request'
      });

      socket.send(JSON.stringify({
        type: 'message',
        agentId,
        content: response.content,
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error("WebSocket message processing error:", error);
      socket.send(JSON.stringify({
        type: 'error',
        content: error instanceof Error ? error.message : "Unknown error occurred"
      }));
    }
  };

  return response;
};
