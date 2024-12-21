import { useSignal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { AgentConfig } from "../types.ts";
import { validateYaml } from "../utils/yamlValidator.ts";

interface Props {
  config: AgentConfig;
  onUpdate: (update: Partial<AgentConfig>) => void;
  onSubmit: () => Promise<void>;
}

const ReviewAndCreate = ({ config, onUpdate, onSubmit }: Props) => {
  const loading = useSignal(false);
  const error = useSignal<string | null>(null);
  const validationResult = useSignal(validateYaml(config.yaml || ""));

  const handleCreate = useCallback(async () => {
    try {
      loading.value = true;
      error.value = null;
      await onSubmit();
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  }, [onSubmit]);

  return (
    <div class="space-y-8">
      {/* Summary Header */}
      <div class="bg-gray-50 p-6 rounded-lg">
        <h3 class="text-xl font-semibold mb-4">Agent Configuration Summary</h3>
        <p class="text-gray-600">
          Review your agent configuration before creation. Make sure all settings are correct.
        </p>
      </div>

      {/* Configuration Overview */}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h4 class="text-lg font-semibold mb-4">Basic Configuration</h4>
            <dl class="space-y-2">
              <div class="flex justify-between">
                <dt class="text-gray-600">Mode</dt>
                <dd class="font-medium">{config.mode}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Industry</dt>
                <dd class="font-medium">{config.industry}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Type</dt>
                <dd class="font-medium">{config.type}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-gray-600">Model</dt>
                <dd class="font-medium">{config.model}</dd>
              </div>
            </dl>
          </div>

          <div class="bg-white p-6 rounded-lg border border-gray-200">
            <h4 class="text-lg font-semibold mb-4">Validation Status</h4>
            {validationResult.value.isValid ? (
              <div class="text-green-600">
                <svg class="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Configuration is valid
              </div>
            ) : (
              <div class="text-red-600">
                <svg class="w-6 h-6 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Configuration has errors
              </div>
            )}

            {/* Validation Warnings */}
            {validationResult.value.warnings.length > 0 && (
              <div class="mt-4">
                <h5 class="text-sm font-medium text-yellow-800 mb-2">Recommendations:</h5>
                <ul class="list-disc list-inside text-sm text-yellow-700">
                  {validationResult.value.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div class="bg-white p-6 rounded-lg border border-gray-200">
          <h4 class="text-lg font-semibold mb-4">YAML Preview</h4>
          <pre class="bg-gray-50 p-4 rounded-lg text-sm font-mono overflow-auto max-h-[400px]">
            {config.yaml}
          </pre>
        </div>
      </div>

      {/* Error Display */}
      {error.value && (
        <div class="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error creating agent</h3>
              <p class="text-sm text-red-700 mt-1">{error.value}</p>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div class="flex justify-end space-x-4">
        <button
          type="button"
          onClick={handleCreate}
          disabled={loading.value || !validationResult.value.isValid}
          class={`
            px-6 py-2 rounded-lg font-medium
            ${loading.value || !validationResult.value.isValid
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
            }
          `}
        >
          {loading.value ? (
            <span class="flex items-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Agent...
            </span>
          ) : (
            "Create Agent"
          )}
        </button>
      </div>
    </div>
  );
};

export default ReviewAndCreate;
