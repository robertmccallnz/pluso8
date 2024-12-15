// routes/api/agent-chat.ts
import { Together } from "together-ai";

const together = new Together(Deno.env.get("TOGETHER_API_KEY") || "");

interface ChatMessage {
  type: 'message';
  text: string;
  language: 'en' | 'mi';
}

export const handler = (req: Request): Response => {
  const { socket: ws, response } = Deno.upgradeWebSocket(req);

  ws.onopen = () => {
    console.log("Chat WebSocket connected");
  };

  ws.onmessage = async (event) => {
    try {
      const data: ChatMessage = JSON.parse(event.data);
      
      if (data.type === 'message') {
        // Send typing indicator
        ws.send(JSON.stringify({ type: 'typing' }));

        // Prepare context and prompt
        const systemPrompt = `You are Maia, a bilingual AI assistant fluent in English and Te Reo Māori.
          Always be respectful of Māori culture and traditions.
          If the user's message is in Te Reo, respond in Te Reo.
          If in English, respond in English, but feel free to use common Te Reo greetings and phrases.`;

        const messages = [
          { role: "system", content: systemPrompt },
          { role: "user", content: data.text }
        ];

        // Call Together AI
        const response = await together.complete({
          model: "mixtral-8x7b-instruct-v0.1",
          prompt: JSON.stringify(messages),
          max_tokens: 1000,
          temperature: 0.7,
          top_p: 0.7,
          top_k: 50,
          repetition_penalty: 1.1
        });

        // Send response back through WebSocket
        const aiMessage = {
          type: 'message',
          id: crypto.randomUUID(),
          text: response.output.content,
          language: data.language,
          timestamp: Date.now()
        };

        ws.send(JSON.stringify(aiMessage));
      }
    } catch (error) {
      console.error("Error processing message:", error);
      ws.send(JSON.stringify({
        type: 'message',
        id: crypto.randomUUID(),
        text: "I apologize, but I encountered an error processing your message. Please try again.",
        language: 'en',
        timestamp: Date.now()
      }));
    }
  };

  ws.onclose = () => {
    console.log("Chat WebSocket disconnected");
  };

  return response;
};