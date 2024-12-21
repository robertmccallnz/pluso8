import { JSX } from "preact";
import { useState } from "preact/hooks";

interface Model {
  name: string;
  description: string;
  type: string;
  provider: string;
  parameters?: string;
  context?: string;
  pricing?: string;
  icon: string;
}

interface ModelSelectorProps {
  selectedModel?: string;
  onModelSelect: (modelName: string) => void;
}

export function ModelSelector({ selectedModel, onModelSelect }: ModelSelectorProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const popularModels: Model[] = [
    {
      name: "GPT-4 Turbo",
      description: "Most capable model, best for complex tasks",
      type: "Chat",
      provider: "Corporate",
      icon: "/icons/openai.svg",
    },
    {
      name: "Claude 3 Opus",
      description: "Advanced reasoning and analysis",
      type: "Chat",
      provider: "Corporate",
      icon: "/icons/anthropic.svg",
    },
    {
      name: "Gemini Pro Vision",
      description: "Multimodal understanding and generation",
      type: "Multimodal",
      provider: "Corporate",
      icon: "/icons/google.svg",
    },
  ];

  const recentModels: Model[] = [
    {
      name: "Llama 3 Vision",
      description: "Open source vision understanding",
      type: "Vision",
      provider: "Open Source",
      icon: "/icons/meta.svg",
    },
    {
      name: "Whisper v3",
      description: "Advanced speech recognition",
      type: "Voice",
      provider: "Corporate",
      icon: "/icons/openai.svg",
    },
  ];

  return (
    <div class="relative">
      {/* Selected Model Display */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        class="flex items-center justify-between w-full px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:border-gray-400"
      >
        <div class="flex items-center space-x-3">
          {selectedModel ? (
            <>
              <img
                src={popularModels.find(m => m.name === selectedModel)?.icon || recentModels.find(m => m.name === selectedModel)?.icon}
                alt={selectedModel}
                class="w-6 h-6"
              />
              <span class="text-sm font-medium">{selectedModel}</span>
            </>
          ) : (
            <span class="text-sm text-gray-500">Select a model</span>
          )}
        </div>
        <svg
          class={`w-5 h-5 text-gray-400 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Model Selection Dropdown */}
      {isOpen && (
        <div class="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
          {/* Search */}
          <div class="p-3 border-b">
            <input
              type="text"
              class="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search models..."
              value={searchQuery}
              onInput={(e) => setSearchQuery((e.target as HTMLInputElement).value)}
            />
          </div>

          <div class="max-h-96 overflow-y-auto">
            {/* Popular Models */}
            <div class="p-2">
              <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Popular Models</h3>
              {popularModels
                .filter(model => 
                  model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  model.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(model => (
                  <div
                    key={model.name}
                    class={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
                      selectedModel === model.name
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onModelSelect(model.name);
                      setIsOpen(false);
                    }}
                  >
                    <img src={model.icon} alt={model.name} class="w-6 h-6 mr-3" />
                    <div>
                      <div class="text-sm font-medium">{model.name}</div>
                      <div class="text-xs text-gray-500">{model.description}</div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Recent Models */}
            <div class="p-2 border-t">
              <h3 class="px-3 py-2 text-xs font-semibold text-gray-500 uppercase">Recent Models</h3>
              {recentModels
                .filter(model => 
                  model.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  model.description.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map(model => (
                  <div
                    key={model.name}
                    class={`flex items-center px-3 py-2 rounded-md cursor-pointer ${
                      selectedModel === model.name
                        ? "bg-blue-50 text-blue-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      onModelSelect(model.name);
                      setIsOpen(false);
                    }}
                  >
                    <img src={model.icon} alt={model.name} class="w-6 h-6 mr-3" />
                    <div>
                      <div class="text-sm font-medium">{model.name}</div>
                      <div class="text-xs text-gray-500">{model.description}</div>
                    </div>
                  </div>
                ))}
            </div>

            {/* View All Link */}
            <div class="p-2 border-t">
              <a
                href="/models"
                class="block px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-gray-50 rounded-md"
              >
                View all models →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
