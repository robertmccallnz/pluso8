import { useRef, useEffect } from "preact/hooks";
import { signal } from "@preact/signals";
import { ChatMessage } from "../../types/chat.ts";
import { WebSocketClient } from "../../utils/websocket.ts";

interface MaiaChatProps {
  agentId: string;
  initialMessage?: string;
}

const messages = signal<ChatMessage[]>([]);
const isConnected = signal(false);
const isTyping = signal(false);

export default function MaiaChat({ agentId, initialMessage }: MaiaChatProps) {
  const wsClient = useRef<WebSocketClient | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    wsClient.current = new WebSocketClient(
      `/api/agents/${agentId}/ws`,
      {
        onOpen: () => {
          isConnected.value = true;
          if (initialMessage) {
            wsClient.current?.send(initialMessage);
          }
        },
        onClose: () => {
          isConnected.value = false;
        },
        onMessage: (message: ChatMessage) => {
          messages.value = [...messages.value, message];
          isTyping.value = false;
        },
        onError: (error) => {
          console.error("WebSocket error:", error);
          isConnected.value = false;
        }
      }
    );

    return () => {
      wsClient.current?.close();
    };
  }, [agentId, initialMessage]);

  const handleSend = (content: string) => {
    if (!wsClient.current || !isConnected.value) return;
    
    const message: ChatMessage = {
      role: "user",
      content,
      timestamp: new Date().toISOString()
    };
    
    messages.value = [...messages.value, message];
    wsClient.current.send(content);
    isTyping.value = true;
  };

  return (
    <div class="flex flex-col h-full">
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.value.map((message, index) => (
          <div
            key={index}
            class={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              class={`max-w-[70%] rounded-lg p-3 ${
                message.role === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        {isTyping.value && (
          <div class="flex justify-start">
            <div class="bg-gray-100 text-gray-800 rounded-lg p-3">
              <div class="flex space-x-2">
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                <div class="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div class="border-t p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.querySelector("input");
            if (input?.value) {
              handleSend(input.value);
              input.value = "";
            }
          }}
          class="flex space-x-2"
        >
          <input
            type="text"
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={!isConnected.value}
          />
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            disabled={!isConnected.value}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}