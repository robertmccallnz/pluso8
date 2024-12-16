interface ModelConfigStepProps {
  config: Partial<{
    template: string;
    industry: string;
    models: {
      primary: string;
      fallback?: string;
      embedding?: string;
    };
  }>;
  onUpdate: (update: Partial<{
    models: {
      primary: string;
      fallback?: string;
      embedding?: string;
    };
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const MODELS = {
  primary: [
    {
      id: "gpt-4",
      name: "GPT-4",
      description: "Most capable model, best for complex tasks",
      costPer1kTokens: 0.03,
      contextWindow: 8192,
    },
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "Fast and cost-effective",
      costPer1kTokens: 0.002,
      contextWindow: 4096,
    },
    {
      id: "claude-2",
      name: "Claude 2",
      description: "Anthropic's advanced model",
      costPer1kTokens: 0.024,
      contextWindow: 100000,
    },
  ],
  fallback: [
    {
      id: "gpt-3.5-turbo",
      name: "GPT-3.5 Turbo",
      description: "Fast and cost-effective",
      costPer1kTokens: 0.002,
      contextWindow: 4096,
    },
    {
      id: "claude-instant-1",
      name: "Claude Instant",
      description: "Fast and cost-effective Claude model",
      costPer1kTokens: 0.0016,
      contextWindow: 100000,
    },
  ],
  embedding: [
    {
      id: "text-embedding-ada-002",
      name: "Ada 002",
      description: "OpenAI's text embedding model",
      costPer1kTokens: 0.0001,
      contextWindow: 8191,
    },
  ],
};

function ModelSelector({ 
  label, 
  models, 
  selectedModel, 
  onChange,
  required = false,
}: { 
  label: string;
  models: typeof MODELS.primary;
  selectedModel?: string;
  onChange: (modelId: string) => void;
  required?: boolean;
}) {
  return (
    <div class="space-y-2">
      <label class="block text-sm font-medium text-gray-900">
        {label}
        {required && <span class="text-red-500 ml-1">*</span>}
      </label>
      <div class="grid grid-cols-1 gap-4">
        {models.map((model) => (
          <div
            key={model.id}
            class={`relative rounded-lg border p-4 cursor-pointer transition-all hover:shadow-md ${
              selectedModel === model.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
            onClick={() => onChange(model.id)}
          >
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{model.name}</h4>
                <p class="text-sm text-gray-500 mt-1">{model.description}</p>
                <div class="mt-2 flex flex-wrap gap-4 text-xs text-gray-500">
                  <span>Cost: ${model.costPer1kTokens}/1k tokens</span>
                  <span>Context: {model.contextWindow.toLocaleString()} tokens</span>
                </div>
              </div>
              <div class="h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center">
                {selectedModel === model.id && (
                  <div class="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ModelConfigStep({ config, onUpdate, onNext }: ModelConfigStepProps) {
  const handleModelChange = (type: 'primary' | 'fallback' | 'embedding') => (modelId: string) => {
    onUpdate({
      models: {
        ...config.models,
        [type]: modelId,
      },
    });
  };

  return (
    <div class="max-w-3xl mx-auto p-6">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Configure Models</h2>
        <p class="text-gray-600">
          Select the AI models that will power your agent. Choose models based on your needs for
          performance, cost, and capabilities.
        </p>
      </div>

      <div class="space-y-8">
        <ModelSelector
          label="Primary Model"
          models={MODELS.primary}
          selectedModel={config.models?.primary}
          onChange={handleModelChange('primary')}
          required
        />

        <ModelSelector
          label="Fallback Model (Optional)"
          models={MODELS.fallback}
          selectedModel={config.models?.fallback}
          onChange={handleModelChange('fallback')}
        />

        <ModelSelector
          label="Embedding Model (Optional)"
          models={MODELS.embedding}
          selectedModel={config.models?.embedding}
          onChange={handleModelChange('embedding')}
        />

        <div class="mt-8 flex justify-end">
          <button
            onClick={onNext}
            disabled={!config.models?.primary}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
