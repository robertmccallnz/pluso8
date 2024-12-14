// core/providers/base/client.ts

import { ModelOptions, ModelRequestMessage, ModelResponse } from "./model.ts";

/**
 * Error class for model client operations
 */
export class ModelClientError extends Error {
  constructor(message: string, public readonly cause?: Error) {
    super(message);
    this.name = 'ModelClientError';
  }
}

/**
 * Interface defining required provider metadata
 */
export interface ProviderMetadata {
  id: string;                    // Unique identifier for the provider
  name: string;                  // Display name
  version: string;               // Provider version
  supportedModels: string[];     // List of supported model identifiers
  maxContextTokens: number;      // Maximum context window size
  supportedFeatures: Set<string>;// Supported capabilities
}

/**
 * Base configuration for model clients
 */
export interface BaseClientConfig {
  apiKey: string;
  model: string;
  baseUrl?: string;
  organizationId?: string;
  timeout?: number;
  maxRetries?: number;
}

/**
 * Abstract base client that all provider clients must implement
 */
export abstract class BaseModelClient {
  protected config: BaseClientConfig;
  protected metadata: ProviderMetadata;

  constructor(config: BaseClientConfig) {
    this.validateConfig(config);
    this.config = {
      timeout: 30000,  // 30 second default timeout
      maxRetries: 3,   // Default retry attempts
      ...config
    };
  }

  /**
   * Get provider metadata
   */
  getMetadata(): ProviderMetadata {
    return this.metadata;
  }

  /**
   * Validate if a specific model is supported
   */
  supportsModel(modelId: string): boolean {
    return this.metadata.supportedModels.includes(modelId);
  }

  /**
   * Check if a feature is supported
   */
  supportsFeature(feature: string): boolean {
    return this.metadata.supportedFeatures.has(feature);
  }

  /**
   * Send a chat completion request
   */
  abstract chat(
    messages: ModelRequestMessage[], 
    options?: ModelOptions
  ): Promise<ModelResponse>;

  /**
   * Stream a chat completion response
   */
  abstract streamChat(
    messages: ModelRequestMessage[],
    options?: ModelOptions
  ): AsyncGenerator<ModelResponse, void, unknown>;

  /**
   * Count tokens in the input
   */
  abstract countTokens(input: string): number;

  /**
   * Validate client configuration
   */
  protected validateConfig(config: BaseClientConfig): void {
    if (!config.apiKey) {
      throw new ModelClientError('API key is required');
    }
    if (!config.model) {
      throw new ModelClientError('Model identifier is required');
    }
  }

  /**
   * Validate messages before sending
   */
  protected validateMessages(messages: ModelRequestMessage[]): void {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new ModelClientError('Messages must be a non-empty array');
    }

    for (const message of messages) {
      if (!message.role || !message.content) {
        throw new ModelClientError(
          'Invalid message format: Each message must have role and content'
        );
      }
    }
  }

  /**
   * Handle retries with exponential backoff
   */
  protected async withRetry<T>(
    operation: () => Promise<T>,
    attempt = 1
  ): Promise<T> {
    try {
      return await operation();
    } catch (error) {
      if (attempt > this.config.maxRetries!) {
        throw error;
      }

      const delay = Math.min(100 * Math.pow(2, attempt), 2000);
      await new Promise(resolve => setTimeout(resolve, delay));
      
      return this.withRetry(operation, attempt + 1);
    }
  }

  /**
   * Create error with provider context
   */
  protected createError(message: string, cause?: Error): ModelClientError {
    return new ModelClientError(
      `[${this.metadata.name}] ${message}`,
      cause
    );
  }
}