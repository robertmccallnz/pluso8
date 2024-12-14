// islands/Dashboard/ToolSelector.tsx
import { useSignal } from "@preact/signals";
import { AgentToolRegistry } from "../../core/tools/registry.ts";
import type { AgentTool } from "../../types/agent.ts";

interface ToolSelectorProps {
  onToolsSelected: (tools: AgentTool[]) => void;
}

export default function ToolSelector({ onToolsSelected }: ToolSelectorProps) {
  const toolRegistry = AgentToolRegistry.getInstance();
  const availableTools = toolRegistry.getEnabledTools();
  const selectedTools = useSignal<AgentTool[]>([]);

  const handleToolToggle = (tool: ToolRegistry) => {
    const toolConfig: AgentTool = {
      name: tool.name,
      description: tool.description || "",
      type: "function",
      config: tool.config,
      enabled: true
    };

    const isSelected = selectedTools.value.some(t => t.name === tool.name);
    if (isSelected) {
      selectedTools.value = selectedTools.value.filter(t => t.name !== tool.name);
    } else {
      selectedTools.value = [...selectedTools.value, toolConfig];
    }
  };

  return (
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-xl font-semibold mb-4">Select Agent Tools</h3>
      <div class="space-y-4">
        {availableTools.map(tool => (
          <label key={tool.name} class="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={selectedTools.value.some(t => t.name === tool.name)}
              onChange={() => handleToolToggle(tool)}
              class="form-checkbox h-5 w-5 text-[#1a4b8d]"
            />
            <div>
              <p class="font-medium">{tool.name}</p>
              <p class="text-sm text-gray-600">{tool.description}</p>
            </div>
          </label>
        ))}
      </div>
      <button
        onClick={() => onToolsSelected(selectedTools.value)}
        class="mt-4 bg-[#1a4b8d] text-white px-4 py-2 rounded"
      >
        Add Selected Tools
      </button>
    </div>
  );
}
