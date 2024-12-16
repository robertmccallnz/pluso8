import { useSignal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { COLORS } from "../lib/constants/styles.ts";
import { AVAILABLE_MODELS, Model, ModelType } from "../lib/constants/models.ts";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export default function Playground() {
  const selectedModel = useSignal<string>("gpt-4-turbo");
  const selectedType = useSignal<ModelType>("chat");
  const systemPrompt = useSignal<string>("");
  const messages = useSignal<Message[]>([]);
  const currentMessage = useSignal<string>("");
  const isLoading = useSignal<boolean>(false);

  const handleModelChange = useCallback((e: Event) => {
    const select = e.target as HTMLSelectElement;
    selectedModel.value = select.value;
  }, []);

  const handleTypeChange = useCallback((type: ModelType) => {
    selectedType.value = type;
    // Select the first model of the selected type
    const firstModelOfType = AVAILABLE_MODELS.find(m => m.type === type);
    if (firstModelOfType) {
      selectedModel.value = firstModelOfType.id;
    }
  }, []);

  const handleSystemPromptChange = useCallback((e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    systemPrompt.value = textarea.value;
  }, []);

  const handleMessageChange = useCallback((e: Event) => {
    const textarea = e.target as HTMLTextAreaElement;
    currentMessage.value = textarea.value;
  }, []);

  const handleCopySystemPrompt = useCallback(() => {
    navigator.clipboard.writeText(systemPrompt.value);
  }, []);

  const handleSendMessage = useCallback(async () => {
    if (!currentMessage.value.trim()) return;

    const newMessages = [...messages.value];
    
    // Add system prompt if it's the first message
    if (newMessages.length === 0 && systemPrompt.value.trim()) {
      newMessages.push({
        role: "system",
        content: systemPrompt.value,
      });
    }

    // Add user message
    newMessages.push({
      role: "user",
      content: currentMessage.value,
    });

    messages.value = newMessages;
    currentMessage.value = "";
    isLoading.value = true;

    try {
      const response = await fetch("/api/playground/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: newMessages,
          model: selectedModel.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to get response");
      }

      const result = await response.json();
      messages.value = [...newMessages, {
        role: "assistant",
        content: result.message,
      }];
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      isLoading.value = false;
    }
  }, []);

  return (
    <div class="grid grid-cols-5 gap-6 mb-8 h-[calc(100vh-12rem)]">
      {/* System Prompt Panel */}
      <div class="col-span-2 bg-white rounded-lg shadow-sm p-6 flex flex-col">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-gray-900">System Prompt</h2>
          <button
            onClick={handleCopySystemPrompt}
            class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>Copy</span>
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
            </svg>
          </button>
        </div>
        <textarea
          value={systemPrompt.value}
          onChange={handleSystemPromptChange}
          placeholder="Enter your system prompt here..."
          class="flex-1 w-full p-3 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Chat Interface */}
      <div class="col-span-3 bg-white rounded-lg shadow-sm flex flex-col">
        {/* Model Type and Selector */}
        <div class="p-4 border-b space-y-4">
          {/* Model Types */}
          <div class="flex flex-wrap gap-2">
            {(["chat", "completion", "embedding", "image", "audio", "multimodal"] as ModelType[]).map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                class={`px-3 py-1 rounded-full text-sm ${
                  selectedType.value === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>

          {/* Model Selector */}
          <select
            value={selectedModel.value}
            onChange={handleModelChange}
            class="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {AVAILABLE_MODELS
              .filter(model => model.type === selectedType.value)
              .map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
          </select>

          {/* Model Info */}
          {AVAILABLE_MODELS
            .filter(model => model.id === selectedModel.value)
            .map(model => (
              <div key={model.id} class="text-sm text-gray-600 space-y-1">
                <div class="flex items-center space-x-2">
                  <span class="font-medium">Provider:</span>
                  <span class="px-2 py-0.5 bg-gray-100 rounded-full text-xs capitalize">
                    {model.provider}
                  </span>
                </div>
                <p>Context Window: {model.contextWindow.toLocaleString()} tokens</p>
                <p>Cost: ${model.costPer1kTokens} per 1k tokens</p>
              </div>
            ))}
        </div>

        {/* Messages */}
        <div class="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.value.map((message, index) => (
            <div
              key={index}
              class={`flex ${message.role === "assistant" ? "justify-start" : "justify-end"}`}
            >
              <div
                class={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === "assistant"
                    ? "bg-gray-100 text-gray-900"
                    : "bg-blue-600 text-white"
                }`}
              >
                <p class="text-sm whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          ))}
          {isLoading.value && (
            <div class="flex justify-start">
              <div class="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100">
                <div class="flex space-x-2">
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s" />
                  <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        <div class="p-4 border-t">
          <div class="flex space-x-4">
            <textarea
              value={currentMessage.value}
              onChange={handleMessageChange}
              placeholder="Type your message..."
              class="flex-1 p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading.value || !currentMessage.value.trim()}
              class="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
