// routes/api/agent-chat.ts
import { Handler } from "$fresh/server.ts";

// The correct type for Fresh handlers
export const handler: Handler = async (req: Request, _ctx) => {
  // Upgrade to WebSocket if requested
  if (req.headers.get("upgrade") === "websocket") {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log("WebSocket connection established");
    };

    socket.onmessage = async (event) => {
      // Handle incoming messages
      const message = JSON.parse(event.data);
      const agent = await MaiaAgent.create();
      const response = await agent.processMessage(message);
      socket.send(JSON.stringify(response));
    };

    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    socket.onclose = () => {
      console.log("WebSocket connection closed");
    };

    return response;
  }

  // Handle regular HTTP requests
  try {
    const { message } = await req.json();
    const agent = await MaiaAgent.create();
    const response = await agent.processMessage(message);
    
    return new Response(JSON.stringify(response), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: "Failed to process message",
      details: error.message
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
};