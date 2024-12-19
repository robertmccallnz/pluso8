import { Signal } from "@preact/signals";

interface ConfigurationStepProps {
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

export default function ConfigurationStep({ formValues, onNext, onBack }: ConfigurationStepProps) {
  return (
    <div class="space-y-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900">Basic Configuration</h2>
        <p class="mt-2 text-sm text-gray-600">
          Configure your agent's basic settings
        </p>
      </div>

      <div class="max-w-3xl mx-auto space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            value={formValues.value.name}
            onChange={(e) => {
              formValues.value = {
                ...formValues.value,
                name: (e.target as HTMLInputElement).value
              };
            }}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Enter agent name"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={formValues.value.description}
            onChange={(e) => {
              formValues.value = {
                ...formValues.value,
                description: (e.target as HTMLTextAreaElement).value
              };
            }}
            rows={4}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            placeholder="Describe what your agent does"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">
            System Prompt
          </label>
          <textarea
            value={formValues.value.systemPrompt}
            onChange={(e) => {
              formValues.value = {
                ...formValues.value,
                systemPrompt: (e.target as HTMLTextAreaElement).value
              };
            }}
            rows={8}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm font-mono"
            placeholder="Enter the system prompt that defines your agent's behavior"
          />
          <p class="mt-2 text-sm text-gray-500">
            The system prompt defines your agent's personality, capabilities, and constraints.
          </p>
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
          disabled={!formValues.value.name || !formValues.value.systemPrompt}
          class={`px-4 py-2 text-sm font-medium text-white ${
            formValues.value.name && formValues.value.systemPrompt
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
