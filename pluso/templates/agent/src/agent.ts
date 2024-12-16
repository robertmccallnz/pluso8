import { MetricsEnabledAgent } from "../../../core/agents/templates/base-agent.ts";
import { AgentConfig } from "../../../core/types.ts";
import { loadConfig } from "./config.ts";
import { CustomTool } from "./tools/types.ts";

export class TemplateAgent extends MetricsEnabledAgent {
  private tools: Map<string, CustomTool>;
  protected readonly agentPrefix: string;

  constructor(configPath: string) {
    // Load configuration from YAML
    const config = loadConfig(configPath);
    super(config);
    
    this.agentPrefix = config.name;
    this.tools = new Map();
    
    // Initialize tools
    this.initializeTools();
  }

  private async initializeTools() {
    const toolsConfig = await loadConfig("./config/tools.yaml");
    
    // Initialize built-in tools
    for (const tool of toolsConfig.builtin_tools) {
      if (tool.enabled) {
        await this.initializeBuiltinTool(tool);
      }
    }
    
    // Initialize custom tools
    for (const tool of toolsConfig.custom_tools) {
      await this.initializeCustomTool(tool);
    }
  }

  private async initializeBuiltinTool(toolConfig: any) {
    // Implementation for initializing built-in tools
    const startTime = Date.now();
    try {
      // Tool initialization logic here
      
      await this.recordMetrics({
        name: this.config.name,
        metrics: {
          performance: {
            toolInitTime: Date.now() - startTime,
          },
        },
      });
    } catch (error) {
      await this.recordError(error);
      throw error;
    }
  }

  private async initializeCustomTool(toolConfig: any) {
    // Implementation for initializing custom tools
    const startTime = Date.now();
    try {
      const module = await import(toolConfig.path);
      const tool = new module.default(toolConfig.config);
      this.tools.set(toolConfig.name, tool);
      
      await this.recordMetrics({
        name: this.config.name,
        metrics: {
          performance: {
            toolInitTime: Date.now() - startTime,
          },
        },
      });
    } catch (error) {
      await this.recordError(error);
      throw error;
    }
  }

  async process(input: string): Promise<string> {
    // Use the template method from base class
    return this.processWithMetrics(input);
  }

  // WebAssembly export
  static async initWasm(): Promise<TemplateAgent> {
    // Initialize the agent for WebAssembly
    const agent = new TemplateAgent("./config/agent.yaml");
    return agent;
  }
}
