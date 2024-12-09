// src/server.ts
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
}

const server = Deno.serve({ port: 3000 }, async (req) => {
  try {
    if (req.method === "POST" && new URL(req.url).pathname === "/api/chat") {
      const { messages } = await req.json();
      const apiKey = Deno.env.get("ANTHROPIC_API_KEY");

      // Format messages for Anthropic API by removing id field
      const formattedMessages = messages.map(({ role, content }: Message) => ({
        role,
        content,
      }));

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey || "",
          "anthropic-version": "2023-06-01",
          "content-type": "application/json",
        },
        body: JSON.stringify({
          messages: formattedMessages,
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Anthropic API error: ${errorData}`);
      }

      const anthropicResponse = await response.json();
      const textContent = anthropicResponse.content
        .filter(block => block.type === 'text')
        .map(block => block.text)
        .join(' ');

      return new Response(JSON.stringify({
        role: anthropicResponse.role,
        content: textContent,
        id: anthropicResponse.id,
      }), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // Rest of the server code remains the same...
    if (req.method === "GET" && new URL(req.url).pathname === "/") {
      const html = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Chat with Maia</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              .scroll-area {
                scrollbar-width: thin;
                scrollbar-color: rgba(26, 75, 141, 0.3) transparent;
              }
              .scroll-area::-webkit-scrollbar {
                width: 6px;
              }
              .scroll-area::-webkit-scrollbar-track {
                background: transparent;
              }
              .scroll-area::-webkit-scrollbar-thumb {
                background-color: rgba(26, 75, 141, 0.3);
                border-radius: 3px;
              }
            </style>
          </head>
          <body class="bg-gray-50 min-h-screen p-4">
            <div class="max-w-4xl mx-auto">
              <div class="bg-white rounded-lg shadow-lg p-6">
                <div class="space-y-4">
                  <div id="chat" class="scroll-area h-[400px] overflow-y-auto w-full rounded-md border p-4"></div>
                  
                  <form id="messageForm" class="flex gap-2">
                    <input
                      type="text"
                      id="messageInput"
                      class="flex-1 rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#1a4b8d] focus:border-transparent"
                      placeholder="Type your message..."
                    >
                    <button
                      type="submit"
                      class="bg-[#1a4b8d] text-white px-4 py-2 rounded-md hover:bg-[#153b6d] focus:outline-none focus:ring-2 focus:ring-[#1a4b8d] focus:ring-offset-2 disabled:opacity-50"
                    >
                      Send
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <script>
              const messages = [];
              let isLoading = false;

              function createMessageElement(message, isTyping = false) {
                const div = document.createElement('div');
                div.className = \`flex gap-3 mb-4 \${message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'}\`;
                
                const avatar = document.createElement('div');
                avatar.className = 'w-8 h-8 rounded-full overflow-hidden flex items-center justify-center';
                
                if (message.role === 'assistant') {
                  avatar.innerHTML = \`<div class="bg-[#1a4b8d] w-full h-full flex items-center justify-center text-white">M</div>\`;
                } else {
                  avatar.innerHTML = \`<div class="bg-blue-500 w-full h-full flex items-center justify-center text-white">U</div>\`;
                }

                const content = document.createElement('div');
                content.className = \`rounded-lg px-4 py-2 max-w-[80%] \${
                  message.role === 'assistant'
                    ? 'bg-[#1a4b8d]/10 text-[#1a4b8d]'
                    : 'bg-[#1a4b8d] text-white'
                }\`;
                content.textContent = isTyping ? 'Typing...' : message.content;

                div.appendChild(avatar);
                div.appendChild(content);
                return div;
              }

              async function sendMessage(e) {
                e.preventDefault();
                const input = document.getElementById('messageInput');
                const chat = document.getElementById('chat');
                
                if (!input.value.trim() || isLoading) return;

                const userMessage = {
                  role: 'user',
                  content: input.value.trim()
                };

                messages.push(userMessage);
                chat.appendChild(createMessageElement(userMessage));
                input.value = '';
                
                isLoading = true;
                const typingIndicator = createMessageElement({ role: 'assistant', content: '' }, true);
                chat.appendChild(typingIndicator);
                chat.scrollTop = chat.scrollHeight;

                try {
                  const res = await fetch('/api/chat', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ messages })
                  });
                  
                  if (!res.ok) throw new Error('Failed to send message');
                  
                  const data = await res.json();
                  messages.push({
                    role: data.role,
                    content: data.content
                  });

                  chat.removeChild(typingIndicator);
                  chat.appendChild(createMessageElement({
                    role: data.role,
                    content: data.content
                  }));
                } catch (error) {
                  console.error('Error:', error);
                  chat.removeChild(typingIndicator);
                  const errorDiv = document.createElement('div');
                  errorDiv.className = 'text-red-500 text-center my-2';
                  errorDiv.textContent = 'Error sending message. Please try again.';
                  chat.appendChild(errorDiv);
                } finally {
                  isLoading = false;
                  chat.scrollTop = chat.scrollHeight;
                }
              }

              document.getElementById('messageForm').addEventListener('submit', sendMessage);
              document.getElementById('messageInput').addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(e);
                }
              });
            </script>
          </body>
        </html>
      `;
      
      return new Response(html, {
        headers: { "Content-Type": "text/html" },
      });
    }

    return new Response("Not Found", { status: 404 });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});

// Load environment variables
await load({
  export: true,
  allowEmptyValues: true
});

console.log("Server running on http://localhost:3000");
await server.finished;