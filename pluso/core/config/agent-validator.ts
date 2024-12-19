import { AgentConfig } from "../../agents/types/agent.ts";

export interface ValidationResult {
  valid: boolean;
  errors?: string[];
}

export function validateAgentConfig(config: AgentConfig): ValidationResult {
  const errors: string[] = [];

  // Check required fields
  if (!config.id) {
    errors.push("id is required");
  }

  if (!config.name) {
    errors.push("name is required");
  }

  if (!config.provider) {
    errors.push("provider is required");
  } else if (!["openai", "anthropic"].includes(config.provider)) {
    errors.push("provider must be either 'openai' or 'anthropic'");
  }

  if (!config.modelId) {
    errors.push("modelId is required");
  }

  // Validate optional fields if present
  if (config.maxTokens !== undefined && (config.maxTokens <= 0 || !Number.isInteger(config.maxTokens))) {
    errors.push("maxTokens must be a positive integer");
  }

  if (config.temperature !== undefined && (config.temperature < 0 || config.temperature > 1)) {
    errors.push("temperature must be between 0 and 1");
  }

  return {
    valid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  };
}
