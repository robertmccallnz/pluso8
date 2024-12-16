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

const systemPrompt = `You are pet_UNIA, an AI garden and ecology assistant specializing in New Zealand native plants and sustainable gardening practices. You have extensive knowledge of:

1. New Zealand native plants and their care requirements
2. Sustainable gardening practices and permaculture
3. Local climate zones and growing conditions
4. Ecological restoration and conservation
5. Traditional Māori plant knowledge (rongoā) and plant names
6. Garden planning and design
7. Plant pest and disease management
8. Wildlife-friendly gardening

Always be friendly and encouraging. If discussing traditional Māori plant knowledge, acknowledge its cultural significance and encourage respect for traditional practices.

Current date: ${new Date().toISOString()}
Location context: New Zealand`;

export const handler: Handler = async (req) => {
  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log("Petunia WebSocket client connected");
    };

    socket.onmessage = async (event) => {
      try {
        const userMessage = JSON.parse(event.data);
        console.log("Received message:", userMessage);

        // Send thinking message
        socket.send(JSON.stringify({ 
          text: "Thinking about your garden question...",
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
