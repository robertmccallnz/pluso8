// routes/api/maia/ws-chat.ts
import { Handler } from "$fresh/server.ts";
import { AnthropicClient } from "../../../core/providers/anthropic/client.ts";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");
if (!ANTHROPIC_API_KEY) {
  console.error(" ANTHROPIC_API_KEY not set");
}

const anthropic = new AnthropicClient(ANTHROPIC_API_KEY || "");

interface Message {
  role: "system" | "assistant" | "user";
  content: string;
}

const systemPrompt = `You are mai_A, an AI development assistant specializing in creating and customizing chat agents. You have extensive knowledge of:

1. AI and Machine Learning concepts
2. Natural Language Processing
3. Chat agent architecture and design
4. API integration and implementation
5. Best practices for AI development
6. Bilingual support (English and te reo Māori)
7. Code optimization and debugging
8. User experience design for chat interfaces

Always be professional and precise in your explanations. When appropriate, provide code examples and technical details. If using te reo Māori terms, provide translations and context.

Current date: ${new Date().toISOString()}
Location context: New Zealand`;

export const handler: Handler = async (req) => {
  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log("Maia WebSocket client connected");
    };

    socket.onmessage = async (event) => {
      try {
        const userMessage = JSON.parse(event.data);
        console.log("Received message:", userMessage);

        // Send thinking message
        socket.send(JSON.stringify({ 
          text: "Processing your development question...",
          type: "system"
        }));

        // Call Anthropic API
        const completion = await anthropic.messages.create({
          model: "claude-3-haiku-20240307",
          max_tokens: 1024,
          messages: [
            { role: "assistant", content: systemPrompt },
            { role: "user", content: userMessage.text }
          ],
          system: systemPrompt
        });

        if (!completion?.content?.[0]?.text) {
          throw new Error("Invalid AI response");
        }

        const reply = completion.content[0].text;
        socket.send(JSON.stringify({ text: reply }));
      } catch (error) {
        console.error("Error processing message:", error);
        socket.send(JSON.stringify({ 
          text: "I apologize, but I'm having trouble processing your request right now. Please try again.",
          type: "error"
        }));
      }
    };

    socket.onerror = (e) => {
      console.error("WebSocket error:", e);
    };

    socket.onclose = () => {
      console.log("Client disconnected");
    };

    return response;
  } catch (error) {
    console.error("WebSocket upgrade error:", error);
    return new Response("WebSocket upgrade failed", { status: 400 });
  }
};
