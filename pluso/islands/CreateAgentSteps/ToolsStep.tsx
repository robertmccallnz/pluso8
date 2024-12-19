import { useCallback, useState } from "preact/hooks";
import { AgentTool, ToolType } from "../../agents/types/agent.ts";
import { AVAILABLE_TOOLS, TOOL_TYPE_LABELS } from "../../lib/constants/tools.ts";
import { INDUSTRY_TEMPLATES } from "../../types/templates.ts";

interface ToolsStepProps {
  config: Partial<{
    tools: {
      function?: string[];
      retrieval?: string[];
      action?: string[];
    };
    toolsConfig: Record<string, Record<string, unknown>>;
    template: string;
    industry: string;
  }>;
  onUpdate: (update: Partial<{
    tools: {
      function?: string[];
      retrieval?: string[];
      action?: string[];
    };
    toolsConfig: Record<string, Record<string, unknown>>;
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

function ToolCard({ 
  tool, 
  isSelected, 
  onToggle,
  onConfigChange,
  config = {},
}: { 
  tool: AgentTool;
  isSelected: boolean;
  onToggle: () => void;
  onConfigChange: (config: Record<string, unknown>) => void;
  config?: Record<string, unknown>;
}) {
  const handleConfigChange = useCallback((key: string, value: unknown) => {
    onConfigChange({
      ...config,
      [key]: value,
    });
  }, [config, onConfigChange]);

  return (
    <div
      class={`relative rounded-lg border p-6 transition-all hover:shadow-md ${
        isSelected ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-200"
      }`}
    >
      <div class="flex items-center justify-between mb-4">
        <div class="flex-grow">
          <div class="flex items-center gap-2">
            <h3 class="text-lg font-medium text-gray-900">{tool.name}</h3>
            <button
              onClick={onToggle}
              class={`px-3 py-1 rounded-full text-sm ${
                isSelected
                  ? "bg-blue-100 text-blue-800"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {isSelected ? "Enabled" : "Disabled"}
            </button>
          </div>
          <p class="text-sm text-gray-500">{tool.type}</p>
        </div>
      </div>

      <p class="text-gray-600 mb-4">{tool.description}</p>

      {isSelected && (
        <div class="mt-4 space-y-4">
          {tool.type === 'function' && tool.config.function && (
            Object.entries(tool.config.function.parameters).map(([key, param]) => (
              <div key={key} class="space-y-1">
                <label class="block text-sm font-medium text-gray-700">
                  {key}
                  {param.required && <span class="text-red-500">*</span>}
                </label>
                <input
                  type={param.secret ? "password" : "text"}
                  value={config[key] as string}
                  onChange={(e) => handleConfigChange(key, e.currentTarget.value)}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={param.description}
                  required={param.required}
                />
                <p class="text-sm text-gray-500">{param.description}</p>
              </div>
            ))
          )}
          {tool.type === 'retrieval' && tool.config.retrieval && (
            <div class="space-y-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Max Results</label>
                <input
                  type="number"
                  value={tool.config.retrieval.maxResults}
                  onChange={(e) => handleConfigChange('maxResults', parseInt(e.currentTarget.value))}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}
          {tool.type === 'action' && tool.config.action && (
            <div class="space-y-2">
              <div>
                <label class="block text-sm font-medium text-gray-700">Timeout (ms)</label>
                <input
                  type="number"
                  value={tool.config.action.timeout}
                  onChange={(e) => handleConfigChange('timeout', parseInt(e.currentTarget.value))}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ToolsStep({ config, onUpdate, onNext, onBack }: ToolsStepProps) {
  const [selectedTools, setSelectedTools] = useState<Record<ToolType, string[]>>(
    config.tools || {
      function: [],
      retrieval: [],
      action: [],
    }
  );
  
  const [toolsConfig, setToolsConfig] = useState<Record<string, Record<string, unknown>>>(
    config.toolsConfig || {}
  );

  const toggleTool = (tool: AgentTool) => {
    const currentSelected = selectedTools[tool.type] || [];
    const newSelected = currentSelected.includes(tool.name)
      ? currentSelected.filter(name => name !== tool.name)
      : [...currentSelected, tool.name];

    const newSelectedTools = {
      ...selectedTools,
      [tool.type]: newSelected,
    };

    setSelectedTools(newSelectedTools);
    onUpdate({
      tools: newSelectedTools,
      toolsConfig,
    });
  };

  const handleConfigChange = (toolName: string, newConfig: Record<string, unknown>) => {
    const updatedConfig = {
      ...toolsConfig,
      [toolName]: newConfig,
    };
    setToolsConfig(updatedConfig);
    onUpdate({
      tools: selectedTools,
      toolsConfig: updatedConfig,
    });
  };

  // Group tools by type
  const toolsByType = AVAILABLE_TOOLS.reduce((acc, tool) => {
    if (!acc[tool.type]) {
      acc[tool.type] = [];
    }
    acc[tool.type].push(tool);
    return acc;
  }, {} as Record<ToolType, AgentTool[]>);

  const hasSelectedTools = Object.values(selectedTools).some(tools => tools.length > 0);

  return (
    <div class="space-y-8">
      <div>
        <h2 class="text-2xl font-semibold mb-4">Configure Tools</h2>
        <p class="text-gray-600">
          Select and configure the tools your agent will have access to.
        </p>
      </div>

      {Object.entries(toolsByType).map(([type, tools]) => (
        <div key={type} class="space-y-4">
          <h3 class="text-xl font-medium">{TOOL_TYPE_LABELS[type as ToolType]}</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tools.map((tool) => (
              <ToolCard
                key={tool.name}
                tool={tool}
                isSelected={(selectedTools[tool.type] || []).includes(tool.name)}
                onToggle={() => toggleTool(tool)}
                onConfigChange={(config) => handleConfigChange(tool.name, config)}
                config={toolsConfig[tool.name]}
              />
            ))}
          </div>
        </div>
      ))}

      <div class="flex justify-between pt-6">
        <button
          onClick={onBack}
          class="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!hasSelectedTools}
          class={`px-4 py-2 rounded-lg ${
            hasSelectedTools
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
