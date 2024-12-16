import { useCallback, useState } from "preact/hooks";

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: string;
  requiredConfig: {
    name: string;
    type: "string" | "number" | "boolean";
    description: string;
    required: boolean;
    secret?: boolean;
  }[];
}

interface ToolsStepProps {
  config: Partial<{
    tools: string[];
    toolsConfig: Record<string, Record<string, string | number | boolean>>;
  }>;
  onUpdate: (update: Partial<{
    tools: string[];
    toolsConfig: Record<string, Record<string, string | number | boolean>>;
  }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TOOLS: Tool[] = [
  {
    id: "web-search",
    name: "Web Search",
    description: "Search the internet for up-to-date information",
    category: "Research",
    icon: "🔍",
    requiredConfig: [
      {
        name: "apiKey",
        type: "string",
        description: "Google Custom Search API Key",
        required: true,
        secret: true,
      },
      {
        name: "searchEngineId",
        type: "string",
        description: "Google Custom Search Engine ID",
        required: true,
      },
    ],
  },
  {
    id: "document-qa",
    name: "Document Q&A",
    description: "Answer questions based on uploaded documents",
    category: "Analysis",
    icon: "📄",
    requiredConfig: [
      {
        name: "maxTokens",
        type: "number",
        description: "Maximum tokens per response",
        required: false,
      },
    ],
  },
  {
    id: "email",
    name: "Email Integration",
    description: "Send and analyze emails",
    category: "Communication",
    icon: "📧",
    requiredConfig: [
      {
        name: "smtpServer",
        type: "string",
        description: "SMTP Server",
        required: true,
      },
      {
        name: "smtpPort",
        type: "number",
        description: "SMTP Port",
        required: true,
      },
      {
        name: "username",
        type: "string",
        description: "SMTP Username",
        required: true,
      },
      {
        name: "password",
        type: "string",
        description: "SMTP Password",
        required: true,
        secret: true,
      },
    ],
  },
];

function ToolCard({ 
  tool, 
  isSelected, 
  onToggle,
  onConfigChange,
  config = {},
}: { 
  tool: Tool;
  isSelected: boolean;
  onToggle: () => void;
  onConfigChange: (config: Record<string, string | number | boolean>) => void;
  config?: Record<string, string | number | boolean>;
}) {
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  const handleConfigChange = useCallback((key: string, value: string) => {
    const newConfig = { ...config };
    if (tool.requiredConfig.find(c => c.name === key)?.type === "number") {
      newConfig[key] = Number(value);
    } else {
      newConfig[key] = value;
    }
    onConfigChange(newConfig);
  }, [config, onConfigChange]);

  return (
    <div class={`border rounded-lg overflow-hidden transition-all ${
      isSelected ? "border-blue-500" : "border-gray-200"
    }`}>
      <div
        class={`p-4 cursor-pointer hover:bg-gray-50 ${isSelected ? "bg-blue-50" : ""}`}
        onClick={onToggle}
      >
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-3">
            <span class="text-2xl">{tool.icon}</span>
            <div>
              <h3 class="text-lg font-medium text-gray-900">{tool.name}</h3>
              <p class="text-sm text-gray-500">{tool.description}</p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            {isSelected && tool.requiredConfig.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsConfigOpen(!isConfigOpen);
                }}
                class="px-2 py-1 text-sm text-blue-600 hover:text-blue-700"
              >
                Configure
              </button>
            )}
            <div class="h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center">
              {isSelected && <div class="h-2 w-2 rounded-full bg-blue-600" />}
            </div>
          </div>
        </div>
      </div>

      {isSelected && isConfigOpen && tool.requiredConfig.length > 0 && (
        <div class="border-t border-gray-200 p-4 bg-gray-50">
          <div class="space-y-4">
            {tool.requiredConfig.map((configItem) => (
              <div key={configItem.name}>
                <label class="block text-sm font-medium text-gray-700">
                  {configItem.name}
                  {configItem.required && <span class="text-red-500 ml-1">*</span>}
                </label>
                <input
                  type={configItem.secret ? "password" : "text"}
                  value={config[configItem.name] || ""}
                  onChange={(e) => handleConfigChange(
                    configItem.name,
                    (e.target as HTMLInputElement).value
                  )}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder={configItem.description}
                />
                <p class="mt-1 text-xs text-gray-500">{configItem.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ToolsStep({ config, onUpdate, onNext }: ToolsStepProps) {
  const selectedTools = config.tools || [];
  const toolsConfig = config.toolsConfig || {};

  const toggleTool = useCallback((toolId: string) => {
    const newTools = selectedTools.includes(toolId)
      ? selectedTools.filter(id => id !== toolId)
      : [...selectedTools, toolId];
    
    onUpdate({ tools: newTools });
  }, [selectedTools, onUpdate]);

  const handleToolConfig = useCallback((toolId: string, config: Record<string, string | number | boolean>) => {
    onUpdate({
      toolsConfig: {
        ...toolsConfig,
        [toolId]: config,
      },
    });
  }, [toolsConfig, onUpdate]);

  const isToolConfigValid = useCallback((tool: Tool) => {
    const config = toolsConfig[tool.id];
    if (!config) return false;

    return tool.requiredConfig.every(configItem => {
      if (!configItem.required) return true;
      return config[configItem.name] !== undefined && config[configItem.name] !== "";
    });
  }, [toolsConfig]);

  const canContinue = selectedTools.every(toolId => {
    const tool = TOOLS.find(t => t.id === toolId);
    return tool ? isToolConfigValid(tool) : true;
  });

  return (
    <div class="max-w-4xl mx-auto p-6">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Add Tools</h2>
        <p class="text-gray-600">
          Select and configure the tools your agent will have access to.
        </p>
      </div>

      <div class="space-y-4">
        {TOOLS.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isSelected={selectedTools.includes(tool.id)}
            onToggle={() => toggleTool(tool.id)}
            onConfigChange={(config) => handleToolConfig(tool.id, config)}
            config={toolsConfig[tool.id]}
          />
        ))}
      </div>

      <div class="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!canContinue}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
