// core/tools/registry.ts
interface ToolRegistry {
    name: string;
    version: string;
    path: string;
    config: Record<string, unknown>;
    enabled: boolean;
  }
  
  export class AgentToolRegistry {
    private tools: Map<string, ToolRegistry>;
    private static instance: AgentToolRegistry;
  
    static getInstance(): AgentToolRegistry {
      if (!AgentToolRegistry.instance) {
        AgentToolRegistry.instance = new AgentToolRegistry();
      }
      return AgentToolRegistry.instance;
    }
  
    async registerTool(tool: ToolRegistry): Promise<void> {
      // Validate tool exists at path
      const toolModule = await import(tool.path);
      if (!toolModule) {
        throw new Error(`Tool not found at path: ${tool.path}`);
      }
      
      this.tools.set(tool.name, tool);
    }
  
    getEnabledTools(): ToolRegistry[] {
      return Array.from(this.tools.values())
        .filter(tool => tool.enabled);
    }
  }
  