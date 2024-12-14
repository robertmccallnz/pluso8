// routes/api/agent-chat.ts
import { Handler } from "$fresh/server.ts";

export const handler: Handler = async (req: Request, _ctx: HandlerContext): Promise<Response> => {
  if (req.headers.get("upgrade") != "websocket") {
    return new Response(null, { status: 501 });
  }

  const { socket, response } = Deno.upgradeWebSocket(req);
  
  socket.onopen = () => {
    console.log("Client connected");
  };

  socket.onmessage = async (event) => {
    try {
      const data = JSON.parse(event.data);
      
      // Send typing indicator
      socket.send(JSON.stringify({
        type: 'typing',
        content: 'Maia is thinking...'
      }));

      // Forward to your existing agent chat handler
      const agentResponse = await fetch('/api/agents/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: data.text,
          agent: 'maia',
          conversationHistory: data.conversationHistory || []
        })
      });

      const responseData = await agentResponse.json();
      
      socket.send(JSON.stringify({
        type: 'message',
        id: crypto.randomUUID(),
        text: responseData.message,
        sender: 'agent',
        language: 'en',
        timestamp: Date.now()
      }));

    } catch (error) {
      console.error("Error processing message:", error);
      socket.send(JSON.stringify({
        type: 'error',
        content: error instanceof Error ? error.message : "An error occurred"
      }));
    }
  };

  socket.onclose = () => {
    console.log("Client disconnected");
  };

  return response;
};