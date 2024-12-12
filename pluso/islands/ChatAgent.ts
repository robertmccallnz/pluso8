// pluso/islands/ChatAgent.tsx
import { useState } from "preact/hooks";

interface ChatAgentProps {
  agentId: string;
  initialPrompt?: string;
}

export default function ChatAgent({ agentId, initialPrompt }: ChatAgentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    // Implementation
  };

  return (
    <div class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} class="mb-4">
            {msg.content}
          </div>
        ))}
      </div>
      <div class="border-t p-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          class="w-full p-2 border rounded"
        />
      </div>
    </div>
  );
}