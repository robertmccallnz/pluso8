// routes/api/agents/ws-chat.ts
import { Anthropic } from "https://esm.sh/@anthropic-ai/sdk@0.18.0";
import { AGENT_CONFIGS } from "./config.ts";

interface WebSocketMessage {
  type: 'message' | 'typing' | 'error';
  content: string;
  agent?: string;
  conversationHistory?: Array<{ role: string; content: string }>;
}

export const handler = (req: Request): Response => {
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  const anthropic = new Anthropic({
    apiKey: Deno.env.get("ANTHROPIC_API_KEY")
  });

  socket.onopen = () => {
    console.log("WebSocket Client connected");
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data) as WebSocketMessage;
      const agent = data.agent || 'maia';
      const agentConfig = AGENT_CONFIGS[agent];

      if (!agentConfig) {
        socket.send(JSON.stringify({
          type: 'error',
          content: 'Invalid agent specified'
        }));
        return;
      }

      // Send typing indicator
      socket.send(JSON.stringify({
        type: 'typing',
        content: `${agentConfig.name} is thinking...`
      }));

      // Prepare messages array
      const messages = [
        { role: "system", content: agentConfig.systemPrompt },
        ...(data.conversationHistory || []),
        { role: "user", content: data.content }
      ];

      // Get response from Claude
      const response = await anthropic.messages.create({
        model: agentConfig.model || "claude-3-haiku-20240307",
        max_tokens: 300,
        messages: messages
      });

      // Send response back through WebSocket
      socket.send(JSON.stringify({
        type: 'message',
        content: response.content[0]?.text || "I apologize, I couldn't generate a response.",
        agent: agentConfig.name,
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

  socket.onclose = () => {
    console.log("WebSocket Client disconnected");
  };

  return response;
};