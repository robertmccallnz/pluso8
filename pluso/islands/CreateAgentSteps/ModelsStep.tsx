import { Signal } from "@preact/signals";

interface ModelsStepProps {
  formValues: Signal<{
    industry: string;
    template: string;
    tools: string[];
    toolsConfig: Record<string, Record<string, string | number | boolean>>;
    models: {
      primary: string[];
      fallback?: string[];
      embedding?: string[];
    };
    name: string;
    description: string;
    systemPrompt: string;
    evaluationCriteria: Array<{
      id: string;
      threshold: number;
      weight: number;
    }>;
  }>;
  onNext: () => void;
  onBack: () => void;
}

const AVAILABLE_MODELS = {
  primary: [
    { id: "gpt-4", name: "GPT-4", description: "Most capable model, best for complex tasks" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and cost-effective" },
    { id: "claude-2", name: "Claude 2", description: "Anthropic's advanced model" }
  ],
  fallback: [
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and cost-effective" },
    { id: "claude-instant-1", name: "Claude Instant", description: "Fast and cost-effective Claude model" }
  ],
  embedding: [
    { id: "text-embedding-ada-002", name: "Ada 002", description: "OpenAI's text embedding model" }
  ]
};

export default function ModelsStep({ formValues, onNext, onBack }: ModelsStepProps) {
  return (
    <div class="space-y-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900">Model Configuration</h2>
        <p class="mt-2 text-sm text-gray-600">
          Select the AI models that will power your agent
        </p>
      </div>

      <div class="max-w-3xl mx-auto space-y-6">
        {/* Primary Model */}
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Primary Model
          </label>
          <select
            value={formValues.value.models.primary[0] || ""}
            onChange={(e) => {
              formValues.value = {
                ...formValues.value,
                models: {
                  ...formValues.value.models,
                  primary: [e.target.value]
                }
              };
            }}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a model</option>
            {AVAILABLE_MODELS.primary.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>

        {/* Fallback Model */}
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Fallback Model (Optional)
          </label>
          <select
            value={formValues.value.models.fallback?.[0] || ""}
            onChange={(e) => {
              formValues.value = {
                ...formValues.value,
                models: {
                  ...formValues.value.models,
                  fallback: e.target.value ? [e.target.value] : undefined
                }
              };
            }}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a model</option>
            {AVAILABLE_MODELS.fallback.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>

        {/* Embedding Model */}
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Embedding Model (Optional)
          </label>
          <select
            value={formValues.value.models.embedding?.[0] || ""}
            onChange={(e) => {
              formValues.value = {
                ...formValues.value,
                models: {
                  ...formValues.value.models,
                  embedding: e.target.value ? [e.target.value] : undefined
                }
              };
            }}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="">Select a model</option>
            {AVAILABLE_MODELS.embedding.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name} - {model.description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div class="flex justify-between pt-8">
        <button
          onClick={onBack}
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!formValues.value.models.primary.length}
          class={`px-4 py-2 text-sm font-medium text-white ${
            formValues.value.models.primary.length
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
