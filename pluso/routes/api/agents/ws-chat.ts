// routes/api/agents/ws-chat.ts
import { FreshContext } from "$fresh/server.ts";
import { Together } from "together-ai";

const TOGETHER_API_KEY = Deno.env.get("TOGETHER_API_KEY");
if (!TOGETHER_API_KEY) {
  console.error("❌ TOGETHER_API_KEY not set");
}

const together = new Together({
  apiKey: TOGETHER_API_KEY || "",
});

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

export const handler = async (req: Request, _ctx: FreshContext): Promise<Response> => {
  const url = new URL(req.url);
  console.log("🌐 WebSocket connection attempt from:", url.toString());
  
  if (req.headers.get("upgrade") !== "websocket") {
    return new Response("Expected WebSocket", { status: 400 });
  }

  try {
    const { socket, response } = Deno.upgradeWebSocket(req);
    let currentContext = "";
    
    socket.onopen = () => {
      console.log("🟢 WebSocket connected");
      socket.send("Hello! I am Jeff Legal, your property law expert. How can I assist you today?");
    };

    socket.onmessage = async (event) => {
      console.log("📩 Message received");
      
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
                socket.send("The PDF appears to be empty. Could you try uploading it again?");
                return;
              }
              
              // Format metadata if available
              const metadataStr = pdfData.metadata ? 
                `\nDocument Info:\n- Title: ${pdfData.metadata.title || 'Untitled'}\n- Author: ${pdfData.metadata.author || 'Unknown'}\n- Pages: ${pdfData.metadata.pages || 'Unknown'}` : '';
              
              messageContent = `I've uploaded a PDF file named "${pdfData.filename}". Here's its contents:${metadataStr}\n\nContent:\n${pdfData.content}`;
              currentContext = pdfData.content;
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
        socket.send("Thinking...");

        // Prepare system message with context if available
        const systemMessage = currentContext
          ? `You are Jeff Legal, a property law expert based in Christchurch, New Zealand. You specialize in property law, Maori land law, Te Tiriti o Waitangi, and have extensive knowledge of New Zealand's horse racing and sports betting regulations. You stay up-to-date with TAB NZ's rules and regulations, and can provide guidance on legal aspects of racing and sports betting in New Zealand. You have a formal and professional communication style but are known for your boisterous laugh and interests in golf and horse racing.

Context from uploaded document:
${currentContext}`
          : "You are Jeff Legal, a property law expert based in Christchurch, New Zealand. You specialize in property law, Maori land law, Te Tiriti o Waitangi, and have extensive knowledge of New Zealand's horse racing and sports betting regulations. You stay up-to-date with TAB NZ's rules and regulations, and can provide guidance on legal aspects of racing and sports betting in New Zealand. You have a formal and professional communication style but are known for your boisterous laugh and interests in golf and horse racing.";

        // Get AI response
        const aiResponse = await together.chat.completions.create({
          messages: [
            {
              role: "system",
              content: systemMessage
            },
            {
              role: "user",
              content: messageContent
            }
          ],
          model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
          temperature: 0.7,
          top_p: 0.7,
          max_tokens: 1000,
          repetition_penalty: 1.1,
        });

        if (aiResponse?.choices?.[0]?.message?.content) {
          const response = aiResponse.choices[0].message.content.trim();
          console.log("📤 Sending AI response");
          
          if (isPdfUpload) {
            socket.send("I've analyzed the document. " + response);
          } else {
            socket.send(response);
          }
        } else {
          throw new Error("Invalid AI response format");
        }
      } catch (error) {
        console.error("❌ Error processing message:", error);
        if (error.message.includes("PDF") || error.message.includes("document")) {
          socket.send("I apologize, but I encountered an issue while processing the document. Could you please try uploading it again? If the problem persists, you can also try describing the document's contents to me directly.");
        } else {
          socket.send("I apologize, but I'm having trouble understanding your message. Could you please rephrase it?");
        }
      }
    };

    socket.onerror = (e) => {
      console.error("🔴 WebSocket error:", e);
    };

    socket.onclose = () => {
      console.log("👋 WebSocket closed");
    };

    return response;
  } catch (err) {
    console.error("❌ WebSocket setup failed:", err);
    return new Response("WebSocket setup failed", { status: 500 });
  }
};