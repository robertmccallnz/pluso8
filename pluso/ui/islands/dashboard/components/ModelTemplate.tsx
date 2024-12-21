import { JSX } from "preact";
import { useState } from "preact/hooks";
import { ModelSelector } from "./ModelSelector.tsx";
import { modelPresets, type ModelPreset, presetStore } from "./ModelPresets.ts";
import { validateModelConfig, type ValidationError } from "./ModelValidation.ts";
import { ModelPreview } from "./ModelPreview.tsx";
import { BatchTesting } from "./BatchTesting";

interface ModelTemplateProps {
  onSubmit: (data: ModelConfig) => void;
}

interface ModelConfig {
  model: string;
  temperature: number;
  maxTokens: number;
  topP: number;
  frequencyPenalty: number;
  presencePenalty: number;
  systemPrompt: string;
}

interface SavePresetModalProps {
  config: ModelConfig;
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}

function SavePresetModal({ config, onSave, onClose }: SavePresetModalProps): JSX.Element {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    onSave(name, description);
    onClose();
  };

  return (
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div class="bg-white rounded-lg p-6 w-96">
        <h3 class="text-lg font-medium mb-4">Save Custom Preset</h3>
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={name}
              onInput={(e) => setName((e.target as HTMLInputElement).value)}
              class="mt-1 w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={description}
              onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)}
              class="mt-1 w-full px-3 py-2 border rounded-md"
              rows={3}
              required
            />
          </div>
          <div class="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              class="px-4 py-2 text-gray-600 hover:text-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function ModelTemplate({ onSubmit }: ModelTemplateProps): JSX.Element {
  const [config, setConfig] = useState<ModelConfig>({
    model: "",
    temperature: 0.7,
    maxTokens: 1000,
    topP: 1,
    frequencyPenalty: 0,
    presencePenalty: 0,
    systemPrompt: "",
  });

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [activePreset, setActivePreset] = useState<string>("");
  const [showPreview, setShowPreview] = useState(false);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [showBatchTesting, setShowBatchTesting] = useState(false);
  const [estimatedCost, setEstimatedCost] = useState(0);

  const handlePresetSelect = (presetKey: string) => {
    const preset = modelPresets[presetKey];
    if (preset) {
      setConfig({ ...config, ...preset.config });
      setActivePreset(presetKey);
      updateCostEstimate(preset.config.maxTokens, preset.costPerToken || 0.002);
    }
  };

  const updateCostEstimate = (tokens: number, costPerToken: number) => {
    setEstimatedCost(tokens * costPerToken);
  };

  const handleSavePreset = (name: string, description: string) => {
    const presetKey = name.toLowerCase().replace(/\s+/g, "_");
    const newPreset: ModelPreset = {
      name,
      description,
      category: "custom",
      config: { ...config },
      costPerToken: 0.002,
    };
    presetStore.savePreset(presetKey, newPreset);
    setActivePreset(presetKey);
  };

  const handleDeletePreset = (presetKey: string) => {
    if (modelPresets[presetKey]?.category === "custom") {
      presetStore.deletePreset(presetKey);
      setActivePreset("");
    }
  };

  const validateAndSubmit = (e: Event) => {
    e.preventDefault();
    const validationErrors = validateModelConfig(config.model, config);
    setErrors(validationErrors);

    if (validationErrors.length === 0) {
      onSubmit(config);
    }
  };

  const getFieldError = (field: string): string => {
    const error = errors.find((e) => e.field === field);
    return error ? error.message : "";
  };

  return (
    <div class="bg-white rounded-lg shadow-sm p-6">
      <h2 class="text-lg font-semibold mb-6">Model Configuration</h2>

      <form onSubmit={validateAndSubmit} class="space-y-6">
        {/* Model Selection */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Model
          </label>
          <ModelSelector
            selectedModel={config.model}
            onModelSelect={(model) => {
              setConfig({ ...config, model });
              setErrors([]);
            }}
          />
          {getFieldError("model") && (
            <p class="mt-1 text-sm text-red-600">{getFieldError("model")}</p>
          )}
        </div>

        {/* Presets */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Configuration Presets
          </label>
          <div class="flex flex-wrap gap-2">
            {Object.entries(modelPresets).map(([key, preset]) => (
              <button
                type="button"
                key={key}
                onClick={() => handlePresetSelect(key)}
                class={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  activePreset === key
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
          {activePreset && (
            <p class="mt-1 text-sm text-gray-500">
              {modelPresets[activePreset].description}
            </p>
          )}
        </div>

        {/* Temperature */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Temperature
            <span class="ml-2 text-sm text-gray-500">
              (Higher values make output more random)
            </span>
          </label>
          <div class="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="2"
              step="0.1"
              value={config.temperature}
              onInput={(e) =>
                setConfig({
                  ...config,
                  temperature: parseFloat((e.target as HTMLInputElement).value),
                })
              }
              class="flex-1"
            />
            <span class="text-sm text-gray-600 w-12">{config.temperature}</span>
          </div>
          {getFieldError("temperature") && (
            <p class="mt-1 text-sm text-red-600">{getFieldError("temperature")}</p>
          )}
        </div>

        {/* Max Tokens */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Max Tokens
            <span class="ml-2 text-sm text-gray-500">
              (Maximum length of generated text)
            </span>
          </label>
          <input
            type="number"
            min="1"
            max="32000"
            value={config.maxTokens}
            onInput={(e) =>
              setConfig({
                ...config,
                maxTokens: parseInt((e.target as HTMLInputElement).value),
              })
            }
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
          {getFieldError("maxTokens") && (
            <p class="mt-1 text-sm text-red-600">{getFieldError("maxTokens")}</p>
          )}
        </div>

        {/* Top P */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Top P
            <span class="ml-2 text-sm text-gray-500">
              (Nucleus sampling threshold)
            </span>
          </label>
          <div class="flex items-center space-x-4">
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={config.topP}
              onInput={(e) =>
                setConfig({
                  ...config,
                  topP: parseFloat((e.target as HTMLInputElement).value),
                })
              }
              class="flex-1"
            />
            <span class="text-sm text-gray-600 w-12">{config.topP}</span>
          </div>
          {getFieldError("topP") && (
            <p class="mt-1 text-sm text-red-600">{getFieldError("topP")}</p>
          )}
        </div>

        {/* Frequency Penalty */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Frequency Penalty
            <span class="ml-2 text-sm text-gray-500">
              (Reduces repetition)
            </span>
          </label>
          <div class="flex items-center space-x-4">
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={config.frequencyPenalty}
              onInput={(e) =>
                setConfig({
                  ...config,
                  frequencyPenalty: parseFloat((e.target as HTMLInputElement).value),
                })
              }
              class="flex-1"
            />
            <span class="text-sm text-gray-600 w-12">
              {config.frequencyPenalty}
            </span>
          </div>
          {getFieldError("frequencyPenalty") && (
            <p class="mt-1 text-sm text-red-600">{getFieldError("frequencyPenalty")}</p>
          )}
        </div>

        {/* Presence Penalty */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Presence Penalty
            <span class="ml-2 text-sm text-gray-500">
              (Encourages new topics)
            </span>
          </label>
          <div class="flex items-center space-x-4">
            <input
              type="range"
              min="-2"
              max="2"
              step="0.1"
              value={config.presencePenalty}
              onInput={(e) =>
                setConfig({
                  ...config,
                  presencePenalty: parseFloat((e.target as HTMLInputElement).value),
                })
              }
              class="flex-1"
            />
            <span class="text-sm text-gray-600 w-12">
              {config.presencePenalty}
            </span>
          </div>
          {getFieldError("presencePenalty") && (
            <p class="mt-1 text-sm text-red-600">{getFieldError("presencePenalty")}</p>
          )}
        </div>

        {/* System Prompt */}
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            System Prompt
            <span class="ml-2 text-sm text-gray-500">
              (Instructions for the model)
            </span>
          </label>
          <textarea
            value={config.systemPrompt}
            onInput={(e) =>
              setConfig({
                ...config,
                systemPrompt: (e.target as HTMLTextAreaElement).value,
              })
            }
            rows={4}
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="You are a helpful assistant..."
          />
          {getFieldError("systemPrompt") && (
            <p class="mt-1 text-sm text-red-600">{getFieldError("systemPrompt")}</p>
          )}
        </div>

        {/* Cost Estimation */}
        <div class="mt-4 p-4 bg-gray-50 rounded-md">
          <h3 class="text-sm font-medium text-gray-700">Estimated Cost</h3>
          <p class="mt-1 text-sm text-gray-600">
            Based on max tokens: ${estimatedCost.toFixed(4)}
          </p>
        </div>

        {/* Preset Management */}
        <div class="mt-4 flex justify-between">
          <button
            type="button"
            onClick={() => setShowSavePresetModal(true)}
            class="text-blue-600 hover:text-blue-700"
          >
            Save as Custom Preset
          </button>
          {activePreset && modelPresets[activePreset]?.category === "custom" && (
            <button
              type="button"
              onClick={() => handleDeletePreset(activePreset)}
              class="text-red-600 hover:text-red-700"
            >
              Delete Custom Preset
            </button>
          )}
        </div>

        {/* Batch Testing Toggle */}
        <div class="mt-4">
          <button
            type="button"
            onClick={() => setShowBatchTesting(!showBatchTesting)}
            class="text-blue-600 hover:text-blue-700"
          >
            {showBatchTesting ? "Hide Batch Testing" : "Show Batch Testing"}
          </button>
        </div>

        {/* Preview Toggle */}
        <div class="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            class="text-blue-600 hover:text-blue-700"
          >
            {showPreview ? "Hide Preview" : "Show Preview"}
          </button>

          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Save Configuration
          </button>
        </div>
      </form>

      {/* Preview Section */}
      {showPreview && (
        <div class="mt-8 border-t pt-6">
          <h3 class="text-lg font-medium mb-4">Test Configuration</h3>
          <ModelPreview model={config.model} config={config} />
        </div>
      )}

      {showBatchTesting && (
        <div class="mt-4">
          <BatchTesting
            model={config.model}
            config={config}
            costPerToken={modelPresets[activePreset]?.costPerToken || 0.002}
          />
        </div>
      )}

      {showSavePresetModal && (
        <SavePresetModal
          config={config}
          onSave={handleSavePreset}
          onClose={() => setShowSavePresetModal(false)}
        />
      )}
    </div>
  );
}
