// islands/interfaces/MaiaChat.tsx
import { useEffect, useRef, useState } from "preact/hooks";
import { Signal } from "@preact/signals";


// If you want to keep the types in the same file until you set up the types directory:
interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  language: 'en' | 'mi';
  timestamp: number;
}

interface ChatState {
  messages: ChatMessage[];
  isConnected: boolean;
  isTyping: boolean;
}

export default function MaiaChat() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    isTyping: false
  });
  const [inputText, setInputText] = useState("");
  const wsRef = useRef<WebSocket | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll effect
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatState.messages]);

  // WebSocket connection management
  useEffect(() => {
    const connectWebSocket = () => {
      const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/agent-chat`);
      
      ws.onopen = () => {
        setChatState(prev => ({ ...prev, isConnected: true }));
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'typing') {
          setChatState(prev => ({ ...prev, isTyping: true }));
          return;
        }
        if (data.type === 'message') {
          setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, {
              id: data.id,
              text: data.text,
              sender: 'agent',
              language: data.language || 'en',
              timestamp: data.timestamp
            }],
            isTyping: false
          }));
        }
      };

      ws.onclose = () => {
        setChatState(prev => ({ ...prev, isConnected: false }));
        // Attempt to reconnect after 3 seconds
        setTimeout(connectWebSocket, 3000);
      };

      wsRef.current = ws;
    };

    connectWebSocket();
    return () => wsRef.current?.close();
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!inputText.trim() || !wsRef.current) return;

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text: inputText,
      sender: 'user',
      language: 'en',
      timestamp: Date.now()
    };

    wsRef.current.send(JSON.stringify({
      type: 'message',
      text: inputText,
      language: 'en'
    }));

    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, message],
      isTyping: true
    }));
    setInputText("");
  };

  return (
    <div class="max-w-2xl mx-auto mt-8 bg-white rounded-lg shadow-lg">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-[#1a4b8d]">Chat with Maia</h3>
        <p class="text-sm text-gray-500">Bilingual AI Assistant</p>
      </div>

      {/* Chat Messages */}
      <div class="h-96 overflow-y-auto p-4 space-y-4">
        {chatState.messages.map((message) => (
          <div
            key={message.id}
            class={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              class={`max-w-[80%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-[#1a4b8d] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <span class="text-xs opacity-70">
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {chatState.isTyping && (
          <div class="flex justify-start">
            <div class="bg-gray-100 rounded-lg p-3">
              <p class="text-gray-500">Maia is typing...</p>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} class="p-4 border-t border-gray-200">
        <div class="flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.currentTarget.value)}
            placeholder="Type your message..."
            class="flex-1 rounded-lg border border-gray-300 p-2 focus:outline-none focus:border-[#1a4b8d]"
          />
          <button
            type="submit"
            disabled={!chatState.isConnected}
            class="bg-[#1a4b8d] text-white px-4 py-2 rounded-lg disabled:opacity-50"
          >
            Send
          </button>
        </div>
        {!chatState.isConnected && (
          <p class="text-red-500 text-sm mt-2">
            Reconnecting to chat service...
          </p>
        )}
      </form>
    </div>
  );
}