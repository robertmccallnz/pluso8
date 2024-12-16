// islands/components/ChatMessage.tsx
import { MessageFormatter } from "../../lib/utils/message-formatter.ts";
import type { FormattedMessage } from "../../lib/types/message-formatting.ts";

interface ChatMessageProps {
  content: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: number;
}

export default function ChatMessage({ content, type, timestamp }: ChatMessageProps) {
  // Format the message content
  const formattedMessage = MessageFormatter.formatContent(content);
  formattedMessage.type = type;
  formattedMessage.timestamp = timestamp;

  // Apply any emphasis if needed
  const finalMessage = MessageFormatter.applyEmphasis(formattedMessage);

  // Base styles for different message types
  const messageStyles = {
    user: "bg-white",
    assistant: "bg-blue-50 border-l-4 border-blue-500",
    system: "bg-gray-50 border-l-4 border-gray-500 italic",
  };

  return (
    <div 
      class={`rounded-lg p-4 mb-4 ${messageStyles[type]}`}
      data-message-type={type}
    >
      <div 
        class="prose prose-sm max-w-none"
        dangerouslySetInnerHTML={{ __html: finalMessage.content }}
      />
      <div class="text-xs text-gray-500 mt-2">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
}
