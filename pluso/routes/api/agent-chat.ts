// routes/api/agent-chat.ts

const TOGETHER_API_KEY = Deno.env.get("TOGETHER_API_KEY");
if (!TOGETHER_API_KEY) {
  throw new Error("TOGETHER_API_KEY environment variable is required");
}

interface ChatMessage {
  type: 'message';
  text: string;
  language: 'en' | 'mi';
}

async function generateChatResponse(message: string, model = "togethercomputer/llama-2-70b-chat") {
  const response = await fetch("https://api.together.xyz/inference", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${TOGETHER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      prompt: message,
      max_tokens: 512,
      temperature: 0.7,
      top_p: 0.7,
      top_k: 50,
      repetition_penalty: 1,
      stop: ["</s>", "Human:", "Assistant:"],
    }),
  });

  if (!response.ok) {
    throw new Error(`Together AI API error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.output.text.trim();
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

        try {
          const response = await generateChatResponse(data.text);
          ws.send(JSON.stringify({
            type: 'message',
            text: response,
            language: data.language,
          }));
        } catch (error) {
          console.error('Error generating response:', error);
          ws.send(JSON.stringify({
            type: 'error',
            message: 'Failed to generate response',
          }));
        }
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Invalid message format',
      }));
    }
  };

  ws.onclose = () => {
    console.log("Chat WebSocket closed");
  };

  return response;
};