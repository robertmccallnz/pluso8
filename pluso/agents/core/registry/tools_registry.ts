import { AgentTool } from "../../config/tools.ts";
import { AgentType } from "../../types/agent.ts";

class ToolsRegistry {
  private tools: Map<string, AgentTool> = new Map();

  registerTool(tool: AgentTool) {
    this.tools.set(tool.id, tool);
  }

  registerTools(tools: Record<string, AgentTool>) {
    Object.values(tools).forEach(tool => this.registerTool(tool));
  }

  getTool(id: string): AgentTool | undefined {
    return this.tools.get(id);
  }

  getToolsByAgentType(type: AgentType): AgentTool[] {
    return Array.from(this.tools.values())
      .filter(tool => tool.agentTypes.includes(type));
  }

  getToolsByFeature(feature: string): AgentTool[] {
    return Array.from(this.tools.values())
      .filter(tool => tool.features.includes(feature));
  }

  getAllTools(): AgentTool[] {
    return Array.from(this.tools.values());
  }
}

export const toolsRegistry = new ToolsRegistry();

// Initialize with web tools
import { WEB_TOOLS } from "../../config/tools.ts";
toolsRegistry.registerTools(WEB_TOOLS);
