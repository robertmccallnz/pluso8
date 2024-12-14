import { useEffect, useRef, useState } from "preact/hooks";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface LegalChatProps {
  endpoint: string;
  agentName?: string;
  allowFiles?: boolean;
}

export default function LegalChat({ 
  endpoint,
  agentName = "LEGAL",
  allowFiles = false 
}: LegalChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("message", input);

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const data = await response.json();
      setMessages(prev => [...prev, ...data.messages]);
    } catch (error) {
      console.error("Error:", error);
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again."
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="bg-[#333333]/10 rounded-lg overflow-hidden">
      <div class="p-4 bg-[#333333] text-[#F5F5F5]">
        <h2 class="text-xl font-semibold">{agentName} Assistant</h2>
      </div>

      <div class="h-[400px] overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            class={`flex ${
              message.role === "assistant" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              class={`max-w-[80%] rounded-lg p-3 ${
                message.role === "assistant"
                  ? "bg-[#333333] text-[#F5F5F5]"
                  : "bg-[#F5F5F5] text-[#333333] border border-[#333333]"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div class="flex justify-start">
            <div class="bg-[#333333] text-[#F5F5F5] rounded-lg p-3">
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} class="p-4 border-t border-[#333333]/20">
        <div class="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.currentTarget.value)}
            placeholder="Ask a legal question..."
            class="flex-1 px-4 py-2 rounded-lg border border-[#333333]/20 focus:outline-none focus:border-[#333333]"
          />
          <button
            type="submit"
            disabled={isLoading}
            class="px-4 py-2 bg-[#333333] text-[#F5F5F5] rounded-lg hover:bg-[#333333]/90 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
export {LegalChat};