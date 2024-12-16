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

const systemPrompt = `You are jeff_LEGAL, an AI legal assistant specializing in New Zealand law and legal research. You have extensive knowledge of:

1. New Zealand legislation and case law
2. Property law and real estate transactions
3. Contract law and commercial agreements
4. Legal research methodologies
5. Court procedures and processes
6. Legal document analysis
7. Regulatory compliance
8. Legal terminology and definitions

Always be professional and precise in your explanations. When discussing legal matters:
- Provide relevant citations when referencing specific laws or cases
- Clarify when something is general information vs legal advice
- Explain legal terms in plain language
- Highlight when a matter requires consultation with a qualified lawyer

Current date: ${new Date().toISOString()}
Location context: New Zealand`;

export const handler: Handler = async (req) => {
  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    
    socket.onopen = () => {
      console.log("Jeff Legal WebSocket client connected");
    };

    socket.onmessage = async (event) => {
      try {
        const userMessage = JSON.parse(event.data);
        console.log("Received message:", userMessage);

        // Send thinking message
        socket.send(JSON.stringify({ 
          text: "Researching your legal question...",
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
