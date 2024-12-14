// src/models/factory.ts
import { ModelConfig, ModelProvider } from "./config.ts";
import { ConfigurationError } from "./config.ts";

// Define interface for chat models
export interface BaseChatModel {
  invoke(messages: Array<{role: string; content: string}>): Promise<{role: string; content: string}>;
  stream(messages: Array<{role: string; content: string}>): AsyncGenerator<{role: string; content: string}, void, unknown>;
}

// Custom factory error
export class ModelFactoryError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ModelFactoryError';
  }
}

export class ModelFactory {
  // Cache for model instances
  private static modelCache = new Map<string, BaseChatModel>();

  /**
   * Creates or retrieves a cached model instance
   * @param config Model configuration
   * @returns BaseChatModel instance
   * @throws ModelFactoryError if creation fails
   */
  static async createModel(config: ModelConfig): Promise<BaseChatModel> {
    try {
      // Generate cache key based on config
      const cacheKey = this.generateCacheKey(config);

      // Check cache first
      const cachedModel = this.modelCache.get(cacheKey);
      if (cachedModel) {
        return cachedModel;
      }

      // Dynamically import the appropriate provider
      const model = await this.loadModelProvider(config.provider, config);
      
      // Cache the instance
      this.modelCache.set(cacheKey, model);
      
      return model;

    } catch (error) {
      if (error instanceof ConfigurationError) {
        throw error;
      }
      throw new ModelFactoryError(
        `Failed to create model for provider ${config.provider}: ${error.message}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Dynamically loads the model provider module
   * @private
   */
  private static async loadModelProvider(
    provider: ModelProvider, 
    config: ModelConfig
  ): Promise<BaseChatModel> {
    try {
      switch (provider) {
        case 'openai': {
          const { createOpenAIModel } = await import("./providers/openai.ts");
          return await createOpenAIModel(config);
        }
        case 'anthropic': {
          const { createAnthropicModel } = await import("./providers/anthropic.ts");
          return await createAnthropicModel(config);
        }
        default:
          throw new ModelFactoryError(`Unsupported model provider: ${provider}`);
      }
    } catch (error) {
      throw new ModelFactoryError(
        `Failed to load model provider ${provider}: ${error.message}`,
        error instanceof Error ? error : undefined
      );
    }
  }

  /**
   * Generates a unique cache key for a model configuration
   * @private
   */
  private static generateCacheKey(config: ModelConfig): string {
    return `${config.provider}-${config.model}-${config.temperature ?? 0}`;
  }

  /**
   * Clears the model cache
   */
  static clearCache(): void {
    this.modelCache.clear();
  }

  /**
   * Validates model configuration
   * @private
   */
  private static validateConfig(config: ModelConfig): void {
    if (!config.provider) {
      throw new ModelFactoryError('Model provider is required');
    }
    if (!config.model) {
      throw new ModelFactoryError('Model name is required');
    }
    if (!config.apiKey) {
      throw new ModelFactoryError('API key is required');
    }
  }
}

/**
 * Helper function to create a model instance with error handling
 */
export async function createModelInstance(
  config: ModelConfig
): Promise<BaseChatModel> {
  try {
    return await ModelFactory.createModel(config);
  } catch (error) {
    console.error('Error creating model instance:', error);
    throw error;
  }
}