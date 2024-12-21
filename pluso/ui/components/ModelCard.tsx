import { JSX } from "preact";

interface ModelCardProps {
  model: {
    name: string;
    description: string;
    type: "Chat" | "Image" | "Code" | "Language" | "Embeddings" | "Rerank" | "Vision" | "Voice" | "Multimodal";
    provider: string;
    parameters?: string;
    context?: string;
    pricing?: string;
    icon: string;
  };
}

export function ModelCard({ model }: ModelCardProps): JSX.Element {
  const typeColors = {
    Chat: "bg-blue-100 text-blue-800",
    Image: "bg-purple-100 text-purple-800",
    Code: "bg-green-100 text-green-800",
    Language: "bg-yellow-100 text-yellow-800",
    Embeddings: "bg-red-100 text-red-800",
    Rerank: "bg-indigo-100 text-indigo-800",
    Vision: "bg-pink-100 text-pink-800",
    Voice: "bg-orange-100 text-orange-800",
    Multimodal: "bg-teal-100 text-teal-800"
  };

  return (
    <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div class="p-6">
        <div class="flex items-center mb-4">
          <img
            src={model.icon}
            alt={`${model.name} icon`}
            class="w-8 h-8 mr-3"
          />
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{model.name}</h3>
            <span class={`inline-block px-2 py-1 text-xs font-medium rounded-full ${
              typeColors[model.type as keyof typeof typeColors]
            }`}>
              {model.type}
            </span>
          </div>
        </div>

        <p class="text-gray-600 text-sm mb-4">{model.description}</p>

        <div class="space-y-2">
          {model.parameters && (
            <div class="flex items-center text-sm">
              <span class="text-gray-500 w-24">Parameters:</span>
              <span class="text-gray-900">{model.parameters}</span>
            </div>
          )}
          {model.context && (
            <div class="flex items-center text-sm">
              <span class="text-gray-500 w-24">Context:</span>
              <span class="text-gray-900">{model.context}</span>
            </div>
          )}
          <div class="flex items-center text-sm">
            <span class="text-gray-500 w-24">Provider:</span>
            <span class="text-gray-900">{model.provider}</span>
          </div>
          {model.pricing && (
            <div class="flex items-center text-sm">
              <span class="text-gray-500 w-24">Pricing:</span>
              <span class="text-gray-900">{model.pricing}</span>
            </div>
          )}
        </div>

        <button class="mt-4 w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 transition-colors duration-300">
          Try This Model
        </button>
      </div>
    </div>
  );
}
