import { Signal, useSignal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { AVAILABLE_MODELS } from "../../lib/constants/models.ts";
import { DashboardData } from "../../types/dashboard.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface PlaygroundProps {
  data?: DashboardData;
}

interface PromptResult {
  completion: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  modelProvider: string;
  latency: number;
}

export default function PlaygroundIsland({ data }: PlaygroundProps) {
  if (!IS_BROWSER) return null;

  const defaultConfig = {
    systemPrompt: "You are a helpful AI assistant.",
    model: {
      model: "gpt-4",
      temperature: 0.7
    }
  };

  const selectedModel = useSignal<string>("");
  const systemPrompt = useSignal<string>(
    data?.agent?.config?.systemPrompt || defaultConfig.systemPrompt
  );
  const testInput = useSignal<string>("");
  const result = useSignal<PromptResult | null>(null);
  const isLoading = useSignal<boolean>(false);
  const error = useSignal<string | null>(null);
  const temperature = useSignal<number>(
    data?.agent?.config?.model?.temperature || defaultConfig.model.temperature
  );

  useEffect(() => {
    // Set default model to GPT-4 if available, or use the agent's model if set
    const defaultModel = data?.agent?.config?.model?.model || 
                        AVAILABLE_MODELS.find(m => m.id === "gpt-4-turbo")?.id || 
                        AVAILABLE_MODELS.find(m => m.type === "chat")?.id ||
                        defaultConfig.model.model;
    
    if (defaultModel) {
      selectedModel.value = defaultModel;
    }
  }, [data]);

  const handleTest = useCallback(async () => {
    if (!systemPrompt.value.trim() || !testInput.value.trim()) {
      error.value = "Please provide both system prompt and test input";
      return;
    }

    isLoading.value = true;
    error.value = null;
    result.value = null;

    try {
      const response = await fetch("/api/playground/evaluate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          systemPrompt: systemPrompt.value,
          input: testInput.value,
          model: selectedModel.value,
          temperature: temperature.value,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate prompt");
      }

      const data = await response.json();
      result.value = data;
    } catch (err) {
      error.value = err.message || "An error occurred while evaluating the prompt";
    } finally {
      isLoading.value = false;
    }
  }, [systemPrompt.value, testInput.value, selectedModel.value, temperature.value]);

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Model
            </label>
            <select
              value={selectedModel.value}
              onChange={(e) => selectedModel.value = (e.target as HTMLSelectElement).value}
              class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {AVAILABLE_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Temperature
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={temperature.value}
              onChange={(e) => temperature.value = parseFloat((e.target as HTMLInputElement).value)}
              class="mt-1 block w-full"
            />
            <div class="mt-1 text-sm text-gray-500">
              {temperature.value.toFixed(1)}
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              System Prompt
            </label>
            <textarea
              value={systemPrompt.value}
              onChange={(e) => systemPrompt.value = (e.target as HTMLTextAreaElement).value}
              rows={3}
              class="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Test Input
            </label>
            <textarea
              value={testInput.value}
              onChange={(e) => testInput.value = (e.target as HTMLTextAreaElement).value}
              rows={3}
              class="mt-1 block w-full shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border border-gray-300 rounded-md"
            />
          </div>

          <div>
            <button
              onClick={handleTest}
              disabled={isLoading.value}
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading.value ? "Testing..." : "Test"}
            </button>
          </div>

          {error.value && (
            <div class="rounded-md bg-red-50 p-4">
              <div class="flex">
                <div class="ml-3">
                  <h3 class="text-sm font-medium text-red-800">Error</h3>
                  <div class="mt-2 text-sm text-red-700">
                    <p>{error.value}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {result.value && (
            <div class="rounded-md bg-gray-50 p-4">
              <div class="space-y-2">
                <h3 class="text-sm font-medium text-gray-900">Result</h3>
                <pre class="mt-2 text-sm text-gray-700 whitespace-pre-wrap">
                  {result.value.completion}
                </pre>
                <div class="mt-2 text-xs text-gray-500">
                  <p>Model: {result.value.modelProvider}</p>
                  <p>Latency: {result.value.latency.toFixed(2)}ms</p>
                  <p>
                    Tokens: {result.value.usage.promptTokens} (prompt) +{" "}
                    {result.value.usage.completionTokens} (completion) ={" "}
                    {result.value.usage.totalTokens} (total)
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
