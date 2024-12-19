import { signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { ChatMessage } from "../../../types/chat.ts";

// Global signals for state management
export const messages = signal<ChatMessage[]>([]);
export const inputValue = signal("");
export const isLoading = signal(false);

export default function JeffWidget() {
  if (!IS_BROWSER) {
    return <div class="flex flex-col h-[600px] bg-white rounded-lg shadow" />;
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!inputValue.value.trim() || isLoading.value) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      text: inputValue.value.trim(),
      type: "user",
      timestamp: Date.now(),
    };
    
    messages.value = [...messages.value, userMessage];
    inputValue.value = "";
    isLoading.value = true;

    try {
      const response = await fetch("/api/chat/jeff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.text,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      const data = await response.json();
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: data.response,
        type: "assistant",
        timestamp: Date.now(),
      };

      messages.value = [...messages.value, assistantMessage];
    } catch (error) {
      console.error("Error sending message:", error);
      messages.value = [...messages.value, {
        id: crypto.randomUUID(),
        text: "Sorry, I encountered an error. Please try again.",
        type: "assistant",
        timestamp: Date.now(),
      }];
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div class="flex flex-col h-[600px] bg-white rounded-lg shadow">
      <div class="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.value.map((message) => (
          <div
            key={message.id}
            class={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              class={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.type === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
        {isLoading.value && (
          <div class="flex justify-start">
            <div class="bg-gray-100 rounded-lg px-4 py-2 animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} class="p-4 border-t">
        <div class="flex space-x-4">
          <input
            type="text"
            value={inputValue.value}
            onInput={(e) => inputValue.value = e.currentTarget.value}
            placeholder="Type your message..."
            class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
            disabled={isLoading.value}
          />
          <button
            type="submit"
            disabled={isLoading.value}
            class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
