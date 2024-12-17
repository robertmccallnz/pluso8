import { FreshContext } from "$fresh/server.ts";
import { NetsaurWebSocketClient } from "../../../utils/netsaur_ws_client.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
if (!ANTHROPIC_API_KEY) {
  console.error("ANTHROPIC_API_KEY not set");
}

interface ChatMessage {
  text: string;
  type?: 'user' | 'assistant' | 'system';
}

async function generateChatResponse(message: string): Promise<string> {
  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": ANTHROPIC_API_KEY || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(`Anthropic API error: ${response.statusText} ${errorData ? JSON.stringify(errorData) : ''}`);
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error("Error generating chat response:", error);
    throw new Error(error instanceof Error ? error.message : "Unknown error occurred");
  }
}

function sendMessage(ws: WebSocket, message: ChatMessage) {
  try {
    ws.send(JSON.stringify(message));
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

export async function handler(req: Request, _ctx: FreshContext): Promise<Response> {
  console.log("[Maia] Received WebSocket connection request");
  
  try {
    const { socket: ws, response } = Deno.upgradeWebSocket(req, {
      protocol: "maia-chat",
      idleTimeout: 60000, // 1 minute timeout
    });

    // Create a WebSocket client for server-side communication
    const wsClient = new NetsaurWebSocketClient(
      "wss://api.example.com/agent", // Replace with your actual agent endpoint
      {
        onMessage: (message) => {
          sendMessage(ws, message);
        },
        onStatusChange: (connected) => {
          if (connected) {
            sendMessage(ws, { text: "Connected to Maia chat server", type: "system" });
          } else {
            sendMessage(ws, { text: "Disconnected from Maia chat server", type: "system" });
          }
        },
        onReconnecting: () => {
          sendMessage(ws, { text: "Reconnecting to Maia chat server...", type: "system" });
        }
      },
      "maia"
    );

    ws.onopen = () => {
      console.log("[Maia] WebSocket client connected");
      sendMessage(ws, {
        text: "Connected to Maia chat server",
        type: "system",
      });
    };

    ws.onclose = (event) => {
      console.log("[Maia] WebSocket client disconnected", event.code, event.reason);
      wsClient.close();
    };

    ws.onmessage = async (event) => {
      console.log("[Maia] Received message:", event.data);
      let message: ChatMessage;
      try {
        message = JSON.parse(event.data);
        console.log("[Maia] Parsed message:", message);
      } catch (error) {
        console.error("[Maia] Error parsing message:", error);
        sendMessage(ws, {
          text: "Invalid message format. Please send a JSON object with a 'text' field.",
          type: "system",
        });
        return;
      }

      if (!message.text?.trim()) {
        console.log("[Maia] Empty message received");
        sendMessage(ws, {
          text: "Message cannot be empty",
          type: "system",
        });
        return;
      }

      try {
        console.log("[Maia] Processing message:", message.text);
        sendMessage(ws, {
          text: "Processing your development question...",
          type: "system",
        });

        const response = await generateChatResponse(message.text);
        console.log("[Maia] Generated response");
        sendMessage(ws, {
          text: response,
          type: "assistant",
        });
      } catch (error) {
        console.error("[Maia] Error processing message:", error);
        sendMessage(ws, {
          text: "An error occurred while processing your message. Please try again.",
          type: "system",
        });
      }
    };

    ws.onerror = (error) => {
      console.error("[Maia] WebSocket error:", error);
      try {
        sendMessage(ws, {
          text: "A connection error occurred. Please try refreshing the page.",
          type: "system",
        });
      } catch (e) {
        console.error("[Maia] Error sending error message:", e);
      }
    };

    return response;
  } catch (error) {
    console.error("[Maia] Error upgrading WebSocket connection:", error);
    return new Response("WebSocket upgrade failed", { status: 400 });
  }
}
