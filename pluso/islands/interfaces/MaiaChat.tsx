import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";
import { useEffect, useCallback } from "preact/hooks";

interface MaiaConfig {
  name: string;
  version: string;
  description: string;
  appearance: {
    cultural_identity: string;
    features: string;
  };
  personality: {
    traits: string[];
    communication_style: string[];
  };
  language: {
    te_reo_greetings: Record<string, string | string[]>;
    te_reo_farewells: string[];
    te_reo_questions: Record<string, string>;
  };
}

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'agent';
  language: 'en' | 'mi';
  timestamp: number;
}

export default function MaiaChat() {
  // Initialize signals outside the component
  const messages = signal<ChatMessage[]>([]);
  const isConnected = signal(false);
  const isTyping = signal(false);
  const config = signal<MaiaConfig | null>(null);
  const configError = signal<string | null>(null);
  const inputText = signal("");
  const wsRef = signal<WebSocket | null>(null);

  const loadConfig = async () => {
    try {
      console.log('Loading Maia configuration...');
      const response = await fetch('/api/maia/config');
      if (!response.ok) {
        throw new Error('Failed to load Maia configuration');
      }
      config.value = await response.json();
      console.log('Configuration loaded:', config.value);
    } catch (error) {
      console.error('Error loading Maia config:', error);
      configError.value = error instanceof Error ? error.message : 'Unknown error loading config';
    }
  };

  const connectWebSocket = useCallback(() => {
    if (!IS_BROWSER) return;

    console.log('Attempting WebSocket connection...');

    const ws = new WebSocket(`${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/agents/ws-chat`);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      isConnected.value = true;
    };

    ws.onmessage = (event) => {
      console.log('Received WebSocket message:', event.data);
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'typing') {
          isTyping.value = true;
          return;
        }
        if (data.type === 'message') {
          messages.value = [...messages.value, {
            id: data.id,
            text: data.text,
            sender: 'agent',
            language: data.language || 'en',
            timestamp: data.timestamp
          }];
          isTyping.value = false;
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };

    ws.onclose = (event) => {
      console.log('WebSocket connection closed:', event.code, event.reason);
      isConnected.value = false;
      
      // Implement exponential backoff for reconnection
      setTimeout(connectWebSocket, 3000);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.value = ws;
  }, []);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    if (!inputText.value.trim() || !wsRef.value) {
      console.log('Submit prevented: no input or no WebSocket');
      return;
    }

    const message: ChatMessage = {
      id: crypto.randomUUID(),
      text: inputText.value,
      sender: 'user',
      language: 'en',
      timestamp: Date.now()
    };

    console.log('Sending message:', message);

    wsRef.value.send(JSON.stringify({
      type: 'message',
      text: inputText.value,
      language: 'en'
    }));

    messages.value = [...messages.value, message];
    isTyping.value = true;
    inputText.value = "";
  };

  // Initialize chat when component mounts
  useEffect(() => {
    if (IS_BROWSER) {
      loadConfig();
      connectWebSocket();
    }
  }, []);

  return (
    <div class="max-w-2xl mx-auto bg-white rounded-lg shadow-lg flex flex-col h-[600px]">
      <div class="p-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-[#1a4b8d] flex items-center gap-2">
          <div class={`w-2 h-2 rounded-full ${isConnected.value ? 'bg-green-500' : 'bg-red-500'}`} />
          Chat with {config.value?.name || 'Maia'}
        </h3>
        <p class="text-sm text-gray-500">
          {config.value?.description || 'Bilingual AI Assistant'}
        </p>
        {configError.value && (
          <div class="p-2 bg-red-100 text-red-700 text-sm">
            Configuration Error: {configError.value}
          </div>
        )}
      </div>

      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.value.map((message) => (
          <div
            key={message.id}
            class={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              class={`max-w-[80%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-[#1a4b8d] text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p>{message.text}</p>
              <p class={`text-xs mt-1 ${
                message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
              }`}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
        {isTyping.value && (
          <div class="flex items-center space-x-2 text-gray-500">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} class="p-4 border-t border-gray-200">
        <div class="flex gap-2">
          <input
            type="text"
            value={inputText.value}
            onInput={(e) => {
              inputText.value = (e.target as HTMLInputElement).value;
              console.log('Input changed:', inputText.value);
            }}
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#1a4b8d]"
            disabled={!isConnected.value}
          />
          <button
            type="submit"
            disabled={!isConnected.value || !inputText.value.trim()}
            class="px-4 py-2 bg-[#1a4b8d] text-white rounded-lg hover:bg-[#153d73] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}