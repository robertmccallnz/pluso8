import { h } from "preact";
import { Signal, useSignal } from "@preact/signals";
import { Model, ModelType, ModelProvider } from "../lib/constants/models.ts";
import { COLORS } from "../lib/constants/styles.ts";

interface ModelsPageProps {
  models: Model[];
  providers: ModelProvider[];
  types: ModelType[];
}

// Global signals for models state
function getModelTypeIcon(type: ModelType): string {
  switch (type) {
    case "chat": return "💬";
    case "completion": return "✍️";
    case "embedding": return "🔤";
    case "image": return "🖼️";
    case "audio": return "🔊";
    case "multimodal": return "🎯";
    case "voice": return "🎙️";
    default: return "❓";
  }
}

function getModelTypeDescription(type: ModelType): string {
  switch (type) {
    case "chat": return "Chat-based interaction";
    case "completion": return "Text completion";
    case "embedding": return "Text embeddings";
    case "image": return "Image generation";
    case "audio": return "Audio processing";
    case "multimodal": return "Multi-modal processing";
    case "voice": return "Voice interaction";
    default: return "Unknown type";
  }
}

function getProviderIcon(provider: ModelProvider): string {
  switch (provider) {
    case "together": return "🤝";
    case "openai": return "🧠";
    case "anthropic": return "🌟";
    case "mistral": return "🌪️";
    case "cohere": return "🔄";
    case "ultravox": return "🎵";
    default: return "❓";
  }
}

export default function ModelsPage({ models: initialModels, providers, types }: ModelsPageProps) {
  // Initialize signals within the component
  const selectedProvider = useSignal<ModelProvider | null>(null);
  const selectedType = useSignal<ModelType | null>(null);
  const searchQuery = useSignal("");
  const sortBy = useSignal<keyof Model>("name");
  const sortDirection = useSignal<"asc" | "desc">("asc");
  const modelsList = useSignal<Model[]>(initialModels);

  // Filter and sort models
  const filteredModels = modelsList.value.filter(model => {
    const matchesProvider = !selectedProvider.value || model.provider === selectedProvider.value;
    const matchesType = !selectedType.value || model.type === selectedType.value;
    const matchesSearch = !searchQuery.value || 
      model.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.value.toLowerCase());
    return matchesProvider && matchesType && matchesSearch;
  }).sort((a, b) => {
    const aValue = a[sortBy.value];
    const bValue = b[sortBy.value];
    const direction = sortDirection.value === "asc" ? 1 : -1;
    return aValue < bValue ? -direction : direction;
  });

  return (
    <div class="space-y-8">
      <div class="text-center">
        <h1 class="text-3xl font-bold text-gray-900">AI Models</h1>
        <p class="mt-4 text-lg text-gray-600">
          Explore our collection of AI models and try them out in the playground
        </p>
      </div>

      {/* Filters */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Provider</label>
          <select
            value={selectedProvider.value || ""}
            onChange={(e) => selectedProvider.value = e.currentTarget.value as ModelProvider || null}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Providers</option>
            {providers.map((provider) => (
              <option key={provider} value={provider}>
                {getProviderIcon(provider)} {provider}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Type</label>
          <select
            value={selectedType.value || ""}
            onChange={(e) => selectedType.value = e.currentTarget.value as ModelType || null}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">All Types</option>
            {types.map((type) => (
              <option key={type} value={type}>
                {getModelTypeIcon(type)} {type}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Search</label>
          <input
            type="text"
            value={searchQuery.value}
            onChange={(e) => searchQuery.value = e.currentTarget.value}
            placeholder="Search models..."
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Models Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div key={model.id} class="bg-white rounded-lg shadow overflow-hidden">
            <div class="p-6">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-medium text-gray-900">{model.name}</h3>
                <span class="text-2xl">{getModelTypeIcon(model.type)}</span>
              </div>
              <p class="mt-2 text-sm text-gray-500">{model.description}</p>
              <div class="mt-4 flex items-center justify-between">
                <div class="flex items-center space-x-2">
                  <span class="text-2xl">{getProviderIcon(model.provider)}</span>
                  <span class="text-sm text-gray-600">{model.provider}</span>
                </div>
                <div class="text-sm text-gray-500">
                  {model.contextWindow.toLocaleString()} tokens
                </div>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-200">
                <dl class="grid grid-cols-2 gap-4">
                  <div>
                    <dt class="text-xs text-gray-500">Type</dt>
                    <dd class="mt-1 text-sm text-gray-900">{getModelTypeDescription(model.type)}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-gray-500">Cost per 1k tokens</dt>
                    <dd class="mt-1 text-sm text-gray-900">${model.costPer1kTokens.toFixed(4)}</dd>
                  </div>
                </dl>
              </div>
              <div class="mt-4 pt-4 border-t">
                <a
                  href={`/dashboard/playground?model=${model.id}`}
                  class="block w-full text-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Try in Playground →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}