import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";
import { COLORS } from "../../lib/constants/styles.ts";
import ChatMessage from "../components/ChatMessage.tsx";

interface Message {
  text: string;
  type: 'user' | 'assistant';
  timestamp: number;
}

export default function PetuniaChat() {
  if (!IS_BROWSER) {
    return <div>Loading chat...</div>;
  }

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/petunia/ws`;
    console.log('Connecting to WebSocket at:', wsUrl);

    const wsInstance = new WebSocket(wsUrl);
    setWs(wsInstance);

    wsInstance.addEventListener('open', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    wsInstance.addEventListener('message', (event) => {
      const message = JSON.parse(event.data);
      setMessages(prev => [...prev, {
        text: message.text,
        type: 'assistant',
        timestamp: Date.now()
      }]);
      setIsLoading(false);
    });

    wsInstance.addEventListener('close', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    wsInstance.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    });

    return () => {
      if (wsInstance.readyState === WebSocket.OPEN) {
        wsInstance.close();
      }
    };
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!inputText.trim() || !ws || ws.readyState !== WebSocket.OPEN) return;

    const message = {
      text: inputText.trim(),
      type: 'user' as const,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, message]);
    setInputText('');
    setIsLoading(true);

    ws.send(JSON.stringify({ text: message.text }));
  };

  return (
    <div class="w-full max-w-4xl mx-auto p-6">
      <div class="bg-white rounded-lg mb-4 p-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              text={message.text}
              type={message.type}
              timestamp={message.timestamp}
            />
          ))}
          {isLoading && (
            <div class="flex justify-center items-center p-4">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: COLORS.brand.blue }}></div>
            </div>
          )}
        </div>
      </div>

      <form onSubmit={handleSubmit} class="flex gap-2">
        <input
          type="text"
          id="petunia-chat-input"
          name="petunia-chat-input"
          value={inputText}
          onInput={(e) => setInputText((e.target as HTMLInputElement).value)}
          placeholder="Ask about gardening, native plants, or ecological practices..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
          autocomplete="off"
          disabled={!isConnected}
        />
        <button
          type="submit"
          id="petunia-chat-submit"
          name="petunia-chat-submit"
          disabled={!isConnected || !inputText.trim()}
          class="px-6 py-2 text-white rounded-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          style={{ backgroundColor: COLORS.brand.blue }}
        >
          Send
        </button>
      </form>
    </div>
  );
}
