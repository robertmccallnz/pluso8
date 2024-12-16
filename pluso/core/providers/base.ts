// core/providers/base.ts

export interface BaseClientConfig {
  apiKey: string;
  baseUrl?: string;
}

export interface ClientMetadata {
  id: string;
  name: string;
  version: string;
  supportedModels: string[];
  features: {
    streamingSupport: boolean;
    functionCalling: boolean;
    toolUse: boolean;
    contextWindowSize: number;
    longTermMemory: boolean;
    multimodalSupport: boolean;
    codeInterpreting: boolean;
    imageAnalysis: boolean;
  };
}

export interface Message {
  role: string;
  content: string;
}

export class BaseModelClient {
  protected apiKey: string;
  protected baseUrl: string;
  protected metadata: ClientMetadata;

  constructor(config: string | BaseClientConfig) {
    if (typeof config === 'string') {
      this.apiKey = config;
      this.baseUrl = 'https://api.anthropic.com';
    } else {
      this.apiKey = config.apiKey;
      this.baseUrl = config.baseUrl || 'https://api.anthropic.com';
    }
  }

  async messages() {
    throw new Error('Not implemented');
  }
}
