import { INDUSTRY_TEMPLATES } from "../../types/templates.ts";
import { AVAILABLE_TOOLS, TOOL_TYPE_LABELS } from "../../lib/constants/tools.ts";
import { AVAILABLE_MODELS } from "../../lib/constants/models.ts";
import { AgentTool, ToolType } from "../../agents/types/agent.ts";
import { Model, ModelType } from "../../lib/constants/models.ts";

interface ConfirmationStepProps {
  config: {
    industry: string;
    template: string;
    tools: {
      function?: string[];
      retrieval?: string[];
      action?: string[];
    };
    toolsConfig: Record<string, Record<string, unknown>>;
    models: {
      chat?: string[];
      completion?: string[];
      embedding?: string[];
      image?: string[];
      audio?: string[];
      multimodal?: string[];
    };
    name: string;
    description: string;
  };
  onUpdate: (update: Partial<typeof ConfirmationStepProps['config']>) => void;
  onNext: () => void;
  onBack: () => void;
}

function ConfigSection({ 
  title, 
  children 
}: { 
  title: string;
  children: preact.ComponentChildren;
}) {
  return (
    <div class="bg-white rounded-lg border border-gray-200 p-6">
      <h3 class="text-lg font-medium text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function ModelsList({ 
  models, 
  selectedModels 
}: {
  models: Model[];
  selectedModels: string[];
}) {
  const selected = models.filter(model => selectedModels.includes(model.id));
  if (selected.length === 0) return null;

  return (
    <div class="space-y-2">
      {selected.map(model => (
        <div key={model.id} class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
          <div>
            <p class="font-medium text-gray-900">{model.name}</p>
            <p class="text-sm text-gray-500">{model.description}</p>
          </div>
          <div class="text-sm text-gray-500">
            ${model.costPer1kTokens.toFixed(4)}/1k tokens
          </div>
        </div>
      ))}
    </div>
  );
}

function ToolsList({ 
  tools, 
  selectedTools,
  toolsConfig 
}: {
  tools: AgentTool[];
  selectedTools: string[];
  toolsConfig: Record<string, Record<string, unknown>>;
}) {
  const selected = tools.filter(tool => selectedTools.includes(tool.name));
  if (selected.length === 0) return null;

  return (
    <div class="space-y-2">
      {selected.map(tool => (
        <div key={tool.name} class="py-2 border-b border-gray-100 last:border-0">
          <div class="flex justify-between items-center">
            <p class="font-medium text-gray-900">{tool.name}</p>
            <span class="text-sm text-gray-500">{tool.type}</span>
          </div>
          <p class="text-sm text-gray-500 mb-2">{tool.description}</p>
          {toolsConfig[tool.name] && Object.keys(toolsConfig[tool.name]).length > 0 && (
            <div class="mt-2 bg-gray-50 rounded p-2">
              <p class="text-sm font-medium text-gray-700 mb-1">Configuration:</p>
              <div class="space-y-1">
                {Object.entries(toolsConfig[tool.name]).map(([key, value]) => (
                  <div key={key} class="flex justify-between text-sm">
                    <span class="text-gray-600">{key}:</span>
                    <span class="text-gray-900">
                      {typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value.toString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ConfirmationStep({ config, onUpdate, onNext, onBack }: ConfirmationStepProps) {
  const template = config.industry && config.template
    ? INDUSTRY_TEMPLATES[config.industry]?.find(t => t.id === config.template)
    : null;

  const allSelectedTools = Object.values(config.tools).flat();
  const allSelectedModels = Object.values(config.models).flat();

  const handleNameChange = (name: string) => {
    onUpdate({ name });
  };

  const handleDescriptionChange = (description: string) => {
    onUpdate({ description });
  };

  const handleDeploy = async () => {
    try {
      // Create the agent and get its ID
      const response = await fetch("/api/agents/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        throw new Error("Failed to create agent");
      }

      const { agentId } = await response.json();

      // Redirect to the deployment page
      window.location.href = `/deploy/${agentId}`;
    } catch (error) {
      console.error("Failed to create agent:", error);
      // Handle error (you might want to show an error message to the user)
    }
  };

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Confirm Agent Configuration</h2>
        <p class="text-gray-600">
          Review and confirm your agent's configuration before deployment.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ConfigSection title="Basic Information">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                value={config.name}
                onChange={(e) => handleNameChange(e.currentTarget.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter agent name"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={config.description}
                onChange={(e) => handleDescriptionChange(e.currentTarget.value)}
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter agent description"
              />
            </div>
          </div>
        </ConfigSection>

        <ConfigSection title="Template">
          <div class="space-y-2">
            <p class="font-medium text-gray-900">{template?.name || 'No template selected'}</p>
            <p class="text-sm text-gray-500">{template?.description}</p>
            <div class="flex items-center mt-2">
              <span class="text-sm text-gray-500 mr-2">Industry:</span>
              <span class="text-sm font-medium text-gray-900">{config.industry}</span>
            </div>
          </div>
        </ConfigSection>
      </div>

      <div class="space-y-6">
        <ConfigSection title="Selected Models">
          <div class="space-y-4">
            {Object.entries(config.models).map(([type, models]) => {
              if (!models || models.length === 0) return null;
              return (
                <div key={type}>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">
                    {type.charAt(0).toUpperCase() + type.slice(1)} Models
                  </h4>
                  <ModelsList
                    models={AVAILABLE_MODELS.filter(m => m.type === type)}
                    selectedModels={models}
                  />
                </div>
              );
            })}
          </div>
        </ConfigSection>

        <ConfigSection title="Selected Tools">
          <div class="space-y-4">
            {Object.entries(config.tools).map(([type, tools]) => {
              if (!tools || tools.length === 0) return null;
              return (
                <div key={type}>
                  <h4 class="text-sm font-medium text-gray-700 mb-2">
                    {TOOL_TYPE_LABELS[type as ToolType]}
                  </h4>
                  <ToolsList
                    tools={AVAILABLE_TOOLS.filter(t => t.type === type)}
                    selectedTools={tools}
                    toolsConfig={config.toolsConfig}
                  />
                </div>
              );
            })}
          </div>
        </ConfigSection>
      </div>

      <div class="flex justify-between pt-6">
        <button
          onClick={onBack}
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={handleDeploy}
          disabled={!config.name || allSelectedTools.length === 0 || allSelectedModels.length === 0}
          class={`px-4 py-2 rounded-lg ${
            config.name && allSelectedTools.length > 0 && allSelectedModels.length > 0
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Deploy Agent
        </button>
      </div>
    </div>
  );
}
