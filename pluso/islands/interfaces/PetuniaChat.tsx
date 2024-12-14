// islands/PetuniaChat.tsx
import { useSignal } from "@preact/signals";



interface Message {
  role: "user" | "assistant"; 
  content: string;
}

export default function ChatInterface() {
  const messages = useSignal<Message[]>([]);
  const inputValue = useSignal("");
  const isLoading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!inputValue.value.trim() || isLoading.value) return;

    const userMessage = inputValue.value.trim();
    messages.value = [...messages.value, { role: "user", content: userMessage }];
    inputValue.value = "";
    isLoading.value = true;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      
      const data = await response.json();
      messages.value = [...messages.value, { role: "assistant", content: data.response }];
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div class="w-full max-w-2xl mx-auto p-4">
      <div class="bg-white rounded-lg shadow-md mb-4 p-4 min-h-[300px] max-h-[500px] overflow-y-auto">
        {messages.value.map((message, index) => (
          <div
            key={index}
            class={`mb-4 p-3 rounded-lg ${
              message.role === "user" 
                ? "bg-blue-100 ml-auto max-w-[80%]" 
                : "bg-gray-100 mr-auto max-w-[80%]"
            }`}
          >
            {message.content}
          </div>
        ))}
        {isLoading.value && (
          <div class="flex justify-center items-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} class="flex gap-2">
        <input
          type="text"
          value={inputValue.value}
          onChange={(e) => inputValue.value = e.currentTarget.value}
          placeholder="Type your message..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={isLoading.value}
          class="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-blue-300"
        >
          Send
        </button>
      </form>
    </div>
  );
}
