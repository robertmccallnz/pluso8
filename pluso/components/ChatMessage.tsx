import { ComponentChildren } from "preact";

interface ChatMessageProps {
  message: string;
  type: 'user' | 'assistant' | 'system';
}

export default function ChatMessage({ message, type }: ChatMessageProps) {
  const isUser = type === 'user';
  const isSystem = type === 'system';

  return (
    <div
      class={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div
        class={`max-w-[80%] rounded-lg px-4 py-2 ${
          isSystem
            ? 'bg-gray-100 text-gray-600'
            : isUser
            ? 'bg-[#FF6B00] text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        <div class="whitespace-pre-wrap break-words">{message}</div>
      </div>
    </div>
  );
}
