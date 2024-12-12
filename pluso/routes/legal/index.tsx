// routes/legal/index.tsx
import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const message = form.get("message")?.toString() || "";

    // Example response structure
    const response = {
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: "I'll help you with your property law query..." }
      ]
    };

    return new Response(JSON.stringify(response));
  }
};

function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newMessage = { role: "user", content: inputValue };
    setMessages([...messages, newMessage]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/legal", {
        method: "POST",
        body: new FormData(e.target as HTMLFormElement),
      });
      
      const data = await response.json();
      setMessages([...messages, newMessage, data.messages[1]]);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div class="border rounded-lg shadow-sm bg-white">
      <div class="p-4 border-b">
        <h2 class="font-mono">
          <span class="text-[#FF6B00]">chat_</span>
          <span class="text-gray-900">WITH LEGAL</span>
        </h2>
      </div>

      <div class="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            class={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              class={`
                max-w-[80%] rounded-lg p-3 
                ${message.role === "user" 
                  ? "bg-[#FF6B00] text-white" 
                  : "bg-gray-100 text-gray-900"}
              `}
            >
              <p class="font-mono text-sm">{message.content}</p>
            </div>
          </div>
        ))}
        {isLoading && (
          <div class="flex justify-start">
            <div class="bg-gray-100 rounded-lg p-3">
              <p class="font-mono text-sm">Analyzing your query...</p>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} class="border-t p-4">
        <div class="flex gap-2">
          <input
            type="text"
            name="message"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about property law in New Zealand..."
            class="
              flex-1 px-4 py-2 rounded-lg
              border border-gray-200
              font-mono text-sm
              focus:outline-none focus:border-[#FF6B00]
            "
          />
          <button
            type="submit"
            disabled={isLoading}
            class="
              px-6 py-2 rounded-lg
              bg-[#FF6B00] text-white
              font-mono text-sm
              hover:bg-[#F44D00]
              disabled:opacity-50
              transition-colors
            "
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

export default function LegalPage() {
  return (
    <>
      <Head>
        <title>Legal - PluSO Property Law Specialist</title>
        <meta name="description" content="New Zealand Property Law Expert" />
      </Head>

      <div class="min-h-screen bg-white">
        {/* Legal Introduction */}
        <div class="max-w-4xl mx-auto pt-24 px-4">
          {/* ... rest of the component remains the same ... */}
          
          {/* Chat Interface */}
          <div class="max-w-3xl mx-auto mb-12">
            <ChatInterface />
          </div>
        </div>
      </div>
    </>
  );
}