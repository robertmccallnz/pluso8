// config.ts


export type ModelProvider = 'openai' | 'anthropic';

export interface ModelConfig {
  provider: ModelProvider;
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;  
  contextWindow?: number;
}

// Custom error class for configuration issues
export class ConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConfigurationError';
  }
}

// Validate environment access permission
async function validateEnvPermissions(): Promise<void> {
  const permissions = new PermissionsContainer();
  const hasEnvPermission = await permissions.query({ name: "env" });
  
  if (!hasEnvPermission.state) {
    throw new ConfigurationError(
      "Environment permission required. Please run with --allow-env flag"
    );
  }
}

// Safe environment variable getter
function getEnvOrThrow(key: string): string {
  const value = Deno.env.get(key);
  if (!value) {
    throw new ConfigurationError(`Missing required environment variable: ${key}`);
  }
  return value;
}

// Initialize configs with proper error handling
async function initializeModelConfigs(): Promise<Record<ModelProvider, ModelConfig>> {
  await validateEnvPermissions();

  return {
    openai: {
      provider: 'openai',
      apiKey: getEnvOrThrow('OPENAI_API_KEY'),
      model: 'gpt-4',
      temperature: 0.7,
      maxTokens: 2048,
      contextWindow: 8192
    },
    anthropic: {
      provider: 'anthropic', 
      apiKey: getEnvOrThrow('ANTHROPIC_API_KEY'),
      model: 'claude-3-opus-20240229',
      temperature: 0.7,
      maxTokens: 1024,
      contextWindow: 4096
    }
  };
}

// Cache the configs after initialization
let modelConfigsCache: Record<ModelProvider, ModelConfig> | null = null;

// Getter for model configs with initialization handling
export async function getModelConfigs(): Promise<Record<ModelProvider, ModelConfig>> {
  if (!modelConfigsCache) {
    try {
      modelConfigsCache = await initializeModelConfigs();
    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      throw new ConfigurationError(`Failed to initialize model configs: ${error.message}`);
    }
  }
  return modelConfigsCache;
}

// Model instance getter using async factory pattern
export async function createModelInstance(provider: ModelProvider) {
  const configs = await getModelConfigs();
  const config = configs[provider];
  
  if (!config) {
    throw new ConfigurationError(`Unsupported provider: ${provider}`);
  }

  // Dynamic imports for better module loading
  switch (provider) {
    case 'openai':
      const { OpenAIClient } = await import("../core/providers/openai/client.ts");
      return new OpenAIClient(config);
    case 'anthropic':
      const { AnthropicClient } = await import("../core/providers/anthropic/client.ts");
      return new AnthropicClient(config);
    default:
      throw new ConfigurationError(`Unsupported provider: ${provider}`);
  }
}

// Optional: Helper to validate a config object
export function validateConfig(config: ModelConfig): void {
  const requiredFields = ['provider', 'apiKey', 'model'];
  for (const field of requiredFields) {
    if (!config[field as keyof ModelConfig]) {
      throw new ConfigurationError(`Missing required field: ${field}`);
    }
  }

  if (config.temperature !== undefined && 
      (config.temperature < 0 || config.temperature > 1)) {
    throw new ConfigurationError('Temperature must be between 0 and 1');
  }
}