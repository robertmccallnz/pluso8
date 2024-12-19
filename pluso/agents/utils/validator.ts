// core/config/agent-validator.ts
import { parse, stringify } from "jsr:@std/yaml";
import { AgentConfig, AgentConfigurationError } from "../../agents/types/agent.ts";

// Export both class names for backward compatibility
export { AgentConfigValidator as AgentValidator };
export class AgentConfigValidator {
  static async validateYamlConfig(yamlPath: string): Promise<AgentConfig> {
    try {
      // Read and parse YAML
      const yaml = await Deno.readTextFile(yamlPath);
      const config = parse(yaml) as AgentConfig;
      
      // Use existing validation from types/agent.ts
      validateAgentConfig(config);
      
      // Additional validation specific to YAML format
      await this.validateRequiredFiles(config);
      await this.validateToolPaths(config);
      
      return config;
    } catch (error) {
      if (error instanceof AgentConfigurationError) {
        throw error;
      }
      throw new AgentConfigurationError(
        `YAML configuration validation failed: ${error.message}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  private static async validateRequiredFiles(config: AgentConfig): Promise<void> {
    // Validate system prompt file exists if specified as path
    if (config.systemPrompt.startsWith('./') || config.systemPrompt.startsWith('/')) {
      try {
        await Deno.stat(config.systemPrompt);
      } catch {
        throw new AgentConfigurationError(`System prompt file not found: ${config.systemPrompt}`);
      }
    }
  }

  private static async validateToolPaths(config: AgentConfig): Promise<void> {
    if (config.tools) {
      for (const tool of config.tools) {
        // Validate tool implementation files exist
        if (tool.type === 'function' && tool.config.function?.parameters) {
          // Additional tool-specific validation
          const parameterTypes = Object.values(tool.config.function.parameters);
          for (const type of parameterTypes) {
            if (!['string', 'number', 'boolean', 'object', 'array'].includes(String(type))) {
              throw new AgentConfigurationError(`Invalid parameter type in tool ${tool.name}`);
            }
          }
        }
      }
    }
  }

  static async saveAgentConfig(config: AgentConfig, path: string): Promise<void> {
    // Validate before saving
    validateAgentConfig(config);
    
    // Convert to YAML and save
    const yaml = this.convertToYaml(config);
    await Deno.writeTextFile(path, yaml);
  }

  private static convertToYaml(config: AgentConfig): string {
    // Remove sensitive data before saving
    const sanitizedConfig = {
      ...config,
      model: {
        ...config.model,
        apiKey: '**********' // Hide API key
      }
    };
    
    return stringify(sanitizedConfig, {
      indent: 2,
      lineWidth: -1
    });
  }

  // Validate agent config object directly
  async validate(config: AgentConfig): Promise<{ isValid: boolean; errors: string[] }> {
    try {
      validateAgentConfig(config);
      await this.validateRequiredFiles(config);
      await this.validateToolPaths(config);
      return { isValid: true, errors: [] };
    } catch (error) {
      return {
        isValid: false,
        errors: [error instanceof Error ? error.message : String(error)]
      };
    }
  }
}
