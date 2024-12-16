import { IS_BROWSER } from "$fresh/runtime.ts";
import { useEffect, useState } from "preact/hooks";
import ChatMessage from "../components/ChatMessage.tsx";

interface Message {
  text: string;
  type: 'user' | 'assistant';
  timestamp: number;
}

export default function MaiaChat() {
  if (!IS_BROWSER) {
    return <div>Loading chat...</div>;
  }

  const [isConnected, setIsConnected] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [ws, setWs] = useState<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/api/maia/ws-chat`;
    console.log('Connecting to WebSocket at:', wsUrl);

    const wsInstance = new WebSocket(wsUrl);
    setWs(wsInstance);

    wsInstance.addEventListener('open', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    wsInstance.addEventListener('message', (event) => {
      console.log('Message received:', event.data);
      
      if (event.data === "Thinking...") {
        // Optional: Add a loading indicator here
        return;
      }

      setMessages(prev => [...prev, {
        text: event.data,
        type: 'assistant',
        timestamp: Date.now()
      }]);
    });

    wsInstance.addEventListener('error', (error) => {
      console.error('WebSocket error:', error);
      setIsConnected(false);
    });

    wsInstance.addEventListener('close', (event) => {
      console.log('WebSocket closed:', event.code, event.reason);
      setIsConnected(false);
      setWs(null);
    });

    return () => {
      console.log('Cleaning up WebSocket connection');
      if (wsInstance.readyState === WebSocket.OPEN) {
        wsInstance.close();
      }
      setWs(null);
      setIsConnected(false);
    };
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.log('WebSocket not connected, cannot send message');
      return;
    }

    if (!inputText.trim()) {
      console.log('Empty message, not sending');
      return;
    }

    console.log('Sending message:', inputText);
    ws.send(inputText);
    setMessages(prev => [...prev, {
      text: inputText,
      type: 'user',
      timestamp: Date.now()
    }]);
    setInputText('');
  };

  return (
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <div class="w-2 h-2 rounded-full" style={{ backgroundColor: isConnected ? '#22c55e' : '#ef4444' }} />
          Chat with mai_A
        </h3>
        <p class="text-sm text-gray-500">
          Your bilingual AI assistant
        </p>
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.timestamp}
            content={msg.text}
            type={msg.type}
            timestamp={msg.timestamp}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} class="p-4 border-t border-gray-200">
        <div class="flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText((e.target as HTMLInputElement).value)}
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a4b8d]"
            disabled={!isConnected}
          />
          <button
            type="submit"
            disabled={!isConnected || !inputText.trim()}
            class="px-4 py-2 bg-[#1a4b8d] text-white rounded-lg hover:bg-[#153d73] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}