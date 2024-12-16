// routes/api/agents/ws-chat.ts
import { FreshContext } from "$fresh/server.ts";

const TOGETHER_API_KEY = Deno.env.get("TOGETHER_API_KEY");
if (!TOGETHER_API_KEY) {
  console.error("❌ TOGETHER_API_KEY not set");
}

interface PdfUpload {
  type: 'pdf_upload';
  filename: string;
  content: string;
  metadata?: {
    title?: string;
    author?: string;
    pages?: number;
  };
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

export async function handler(req: Request, _ctx: FreshContext): Promise<Response> {
  const { socket: ws, response } = Deno.upgradeWebSocket(req);

  ws.onopen = () => {
    console.log("WebSocket opened");
    ws.send("Hello! I am Jeff Legal, your property law expert. How can I assist you today?");
  };

  ws.onmessage = async (event) => {
    try {
      let messageContent: string;
      let isPdfUpload = false;
      let pdfMetadata = {};

      // Check if message is JSON (potential PDF upload)
      if (event.data.startsWith('{')) {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'pdf_upload') {
            isPdfUpload = true;
            const pdfData = data as PdfUpload;
            
            if (!pdfData.content) {
              ws.send("The PDF appears to be empty. Could you try uploading it again?");
              return;
            }
            
            // Format metadata if available
            const metadataStr = pdfData.metadata ? 
              `\nDocument Info:\n- Title: ${pdfData.metadata.title || 'Untitled'}\n- Author: ${pdfData.metadata.author || 'Unknown'}\n- Pages: ${pdfData.metadata.pages || 'Unknown'}` : '';
            
            messageContent = `I've uploaded a PDF file named "${pdfData.filename}". Here's its contents:${metadataStr}\n\nContent:\n${pdfData.content}`;
            pdfMetadata = pdfData.metadata || {};
          } else {
            messageContent = event.data;
          }
        } catch (parseError) {
          console.log("Invalid JSON message:", parseError);
          messageContent = event.data;
        }
      } else {
        // Regular text message
        messageContent = event.data;
      }

      // Send a typing indicator
      ws.send("Thinking...");

      // Prepare system message with context if available
      const systemMessage = pdfMetadata
        ? `You are Jeff Legal, a property law expert based in Christchurch, New Zealand. You specialize in property law, Maori land law, Te Tiriti o Waitangi, and have extensive knowledge of New Zealand's horse racing and sports betting regulations. You stay up-to-date with TAB NZ's rules and regulations, and can provide guidance on legal aspects of racing and sports betting in New Zealand. You have a formal and professional communication style but are known for your boisterous laugh and interests in golf and horse racing.

Context from uploaded document:
${messageContent}`
        : "You are Jeff Legal, a property law expert based in Christchurch, New Zealand. You specialize in property law, Maori land law, Te Tiriti o Waitangi, and have extensive knowledge of New Zealand's horse racing and sports betting regulations. You stay up-to-date with TAB NZ's rules and regulations, and can provide guidance on legal aspects of racing and sports betting in New Zealand. You have a formal and professional communication style but are known for your boisterous laugh and interests in golf and horse racing.";

      // Get AI response
      const aiResponse = await generateChatResponse(systemMessage + "\n\n" + messageContent);

      if (aiResponse) {
        console.log("📤 Sending AI response");
        
        if (isPdfUpload) {
          ws.send("I've analyzed the document. " + aiResponse);
        } else {
          ws.send(aiResponse);
        }
      } else {
        throw new Error("Invalid AI response format");
      }
    } catch (error) {
      console.error("❌ Error processing message:", error);
      if (error.message.includes("PDF") || error.message.includes("document")) {
        ws.send("I apologize, but I encountered an issue while processing the document. Could you please try uploading it again? If the problem persists, you can also try describing the document's contents to me directly.");
      } else {
        ws.send("I apologize, but I'm having trouble understanding your message. Could you please rephrase it?");
      }
    }
  };

  ws.onerror = (e) => {
    console.error("🔴 WebSocket error:", e);
  };

  ws.onclose = () => {
    console.log("👋 WebSocket closed");
  };

  return response;
}