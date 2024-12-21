import { useSignal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { AgentConfig } from "../types.ts";

interface ModelOption {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  pricing: string;
  modes: Array<AgentConfig["mode"]>;
  context_length: number;
  features: string[];
}

const MODELS: ModelOption[] = [
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Most capable model for complex tasks and reasoning",
    capabilities: ["text", "code", "analysis", "creative-writing"],
    pricing: "$0.03/1K tokens",
    modes: ["text"],
    context_length: 8192,
    features: [
      "Advanced reasoning",
      "Complex instruction following",
      "Nuanced analysis",
      "Code generation and analysis"
    ]
  },
  {
    id: "gpt-4-vision",
    name: "GPT-4 Vision",
    description: "Visual understanding and analysis capabilities",
    capabilities: ["image-analysis", "text", "multimodal"],
    pricing: "$0.04/1K tokens",
    modes: ["image", "multimodal"],
    context_length: 8192,
    features: [
      "Image understanding",
      "Visual analysis",
      "Object detection",
      "Scene description"
    ]
  },
  {
    id: "claude-2",
    name: "Claude 2",
    description: "Strong performance on analysis and writing tasks",
    capabilities: ["text", "code", "analysis"],
    pricing: "$0.02/1K tokens",
    modes: ["text"],
    context_length: 100000,
    features: [
      "Long context window",
      "Detailed analysis",
      "Code understanding",
      "Academic writing"
    ]
  },
  {
    id: "whisper",
    name: "Whisper",
    description: "Advanced speech recognition and transcription",
    capabilities: ["speech-to-text", "translation"],
    pricing: "$0.01/minute",
    modes: ["voice"],
    context_length: 0,
    features: [
      "Multi-language support",
      "Robust noise handling",
      "Speaker diarization",
      "Real-time processing"
    ]
  }
];

interface Props {
  config: AgentConfig;
  onUpdate: (update: Partial<AgentConfig>) => void;
}

const ModelSelection = ({ config, onUpdate }: Props) => {
  const compatibleModels = useSignal<ModelOption[]>([]);
  const selectedModel = useSignal<string | null>(null);

  // Filter models based on mode and YAML configuration
  useEffect(() => {
    const filtered = MODELS.filter(model => {
      // Check if model supports the selected mode
      if (!model.modes.includes(config.mode!)) return false;

      // If we have YAML config, check capabilities match
      if (config.yaml) {
        try {
          const yamlConfig = JSON.parse(config.yaml);
          const requiredCapabilities = yamlConfig.capabilities || [];
          return requiredCapabilities.every((cap: string) =>
            model.capabilities.includes(cap)
          );
        } catch {
          // If YAML parsing fails, just filter by mode
          return true;
        }
      }

      return true;
    });

    compatibleModels.value = filtered;
    
    // Auto-select first compatible model if none selected
    if (!selectedModel.value && filtered.length > 0) {
      selectedModel.value = filtered[0].id;
      onUpdate({ model: filtered[0].id });
    }
  }, [config.mode, config.yaml]);

  const handleModelSelect = useCallback((modelId: string) => {
    selectedModel.value = modelId;
    onUpdate({ model: modelId });
  }, [onUpdate]);

  if (compatibleModels.value.length === 0) {
    return (
      <div class="text-center text-gray-600 py-8">
        <p>No compatible models found for the selected configuration.</p>
        <p class="mt-2">Please review your mode and capability requirements.</p>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      <div class="bg-gray-50 p-4 rounded-lg">
        <h3 class="text-lg font-semibold mb-2">Compatible Models</h3>
        <p class="text-gray-600">
          These models are compatible with your agent's mode ({config.mode}) and required capabilities.
          Select the most appropriate model for your use case.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {compatibleModels.value.map((model) => (
          <button
            key={model.id}
            onClick={() => handleModelSelect(model.id)}
            class={`
              p-6 rounded-lg border-2 transition-all duration-200
              flex flex-col items-start text-left
              ${selectedModel.value === model.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
              }
            `}
          >
            <div class="flex justify-between items-start w-full">
              <h3 class="text-xl font-semibold">{model.name}</h3>
              <span class="text-sm text-gray-500">{model.pricing}</span>
            </div>
            
            <p class="text-gray-600 mt-2 mb-4">{model.description}</p>
            
            <div class="grid grid-cols-2 gap-4 w-full">
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">Capabilities</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                  {model.capabilities.map(cap => (
                    <li key={cap}>{cap}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 class="text-sm font-medium text-gray-700 mb-2">Features</h4>
                <ul class="text-sm text-gray-600 space-y-1">
                  {model.features.map(feature => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200 w-full">
              <div class="flex justify-between text-sm text-gray-500">
                <span>Context: {model.context_length.toLocaleString()} tokens</span>
                <span>Modes: {model.modes.join(", ")}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModelSelection;
