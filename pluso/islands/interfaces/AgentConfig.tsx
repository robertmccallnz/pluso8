// islands/interfaces/AgentConfig.tsx
import { type useSignal } from "@preact/signals";

import type { AgentConfig, ModelConfig } from "../../agents/types/agent.ts";
import { AgentToolRegistry } from "../../core/tools/registry.ts";

interface AgentConfigUIProps {
  initialConfig?: AgentConfig;
  onSave: (config: AgentConfig) => void;
}

export default function AgentConfigUI({ initialConfig, onSave }: AgentConfigUIProps) {
  const config = useSignal<AgentConfig>(initialConfig ?? {
    name: "",
    description: "",
    version: "1.0.0",
    systemPrompt: "",
    model: {
      provider: "openai",
      apiKey: "",
      model: "gpt-4"
    } as ModelConfig,
    memory: {
      type: "buffer",
      maxMessages: 100
    },
    tools: [],
    runtimeDefaults: {
      temperature: 0.7,
      maxTokens: 2048
    }
  });

  const toolRegistry = AgentToolRegistry.getInstance();
  const availableTools = toolRegistry.getEnabledTools();
  const isLoading = useSignal(false);
  const errorMessage = useSignal("");

  const handleToolToggle = (toolName: string) => {
    const tools = [...config.value.tools];
    const toolIndex = tools.findIndex(t => t.name === toolName);
    
    if (toolIndex >= 0) {
      tools.splice(toolIndex, 1);
    } else {
      const tool = availableTools.find(t => t.name === toolName);
      if (tool) {
        tools.push({
          name: tool.name,
          description: tool.description,
          type: "function",
          config: tool.config,
          enabled: true
        });
      }
    }
    
    config.value = { ...config.value, tools };
  };

  return (
    <div class="max-w-4xl mx-auto p-4">
      {errorMessage.value && (
        <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorMessage.value}
        </div>
      )}

      <form onSubmit={async (e) => {
        e.preventDefault();
        isLoading.value = true;
        try {
          await onSave(config.value);
        } catch (error) {
          errorMessage.value = error.message;
        } finally {
          isLoading.value = false;
        }
      }}>
        {/* Basic Information */}
        <section class="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Basic Configuration</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                value={config.value.name}
                onChange={(e) => config.value = { ...config.value, name: e.currentTarget.value }}
                class="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={config.value.description}
                onChange={(e) => config.value = { ...config.value, description: e.currentTarget.value }}
                class="w-full p-2 border rounded"
                rows={3}
              />
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">System Prompt</label>
              <textarea
                value={config.value.systemPrompt}
                onChange={(e) => config.value = { ...config.value, systemPrompt: e.currentTarget.value }}
                class="w-full p-2 border rounded"
                rows={5}
                required
              />
            </div>
          </div>
        </section>

        {/* Model Configuration */}
        <section class="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Model Configuration</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Provider</label>
              <select
                value={config.value.model.provider}
                onChange={(e) => config.value = {
                  ...config.value,
                  model: { ...config.value.model, provider: e.currentTarget.value }
                }}
                class="w-full p-2 border rounded"
                required
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">Model</label>
              <select
                value={config.value.model.model}
                onChange={(e) => config.value = {
                  ...config.value,
                  model: { ...config.value.model, model: e.currentTarget.value }
                }}
                class="w-full p-2 border rounded"
                required
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                <option value="claude-2">Claude 2</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium mb-1">API Key</label>
              <input
                type="password"
                value={config.value.model.apiKey}
                onChange={(e) => config.value = {
                  ...config.value,
                  model: { ...config.value.model, apiKey: e.currentTarget.value }
                }}
                class="w-full p-2 border rounded"
                required
              />
            </div>
          </div>
        </section>

        {/* Memory Configuration */}
        <section class="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Memory Configuration</h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-1">Memory Type</label>
              <select
                value={config.value.memory.type}
                onChange={(e) => config.value = {
                  ...config.value,
                  memory: { ...config.value.memory, type: e.currentTarget.value }
                }}
                class="w-full p-2 border rounded"
              >
                <option value="buffer">Buffer</option>
                <option value="summary">Summary</option>
                <option value="vector">Vector</option>
              </select>
            </div>
            {config.value.memory.type === "buffer" && (
              <div>
                <label class="block text-sm font-medium mb-1">Max Messages</label>
                <input
                  type="number"
                  value={config.value.memory.maxMessages}
                  onChange={(e) => config.value = {
                    ...config.value,
                    memory: { ...config.value.memory, maxMessages: parseInt(e.currentTarget.value) }
                  }}
                  class="w-full p-2 border rounded"
                  min="1"
                />
              </div>
            )}
          </div>
        </section>

        {/* Tools Configuration */}
        <section class="mb-8 bg-white p-6 rounded-lg shadow">
          <h2 class="text-xl font-bold mb-4">Tools</h2>
          <div class="space-y-2">
            {availableTools.map(tool => (
              <label key={tool.name} class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={config.value.tools.some(t => t.name === tool.name)}
                  onChange={() => handleToolToggle(tool.name)}
                  class="form-checkbox"
                />
              
              </label>
            ))}
          </div>
        </section>

        <button 
          type="submit"
          disabled={isLoading.value}
          class="w-full bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300"
        >
          {isLoading.value ? "Saving..." : "Save Configuration"}
        </button>
      </form>
    </div>
  );
}
