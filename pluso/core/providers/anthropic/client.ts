// core/providers/anthropic/client.ts
export class AnthropicClient extends BaseModelClient {
  constructor(config: BaseClientConfig) {
    super(config);
    this.metadata = {
      id: 'anthropic',
      name: 'Anthropic',
      version: '1.0.0',
      supportedModels: [
        'claude-3-opus-20240229',
        'claude-3-sonnet-20240229',
        'claude-3-haiku-20240307'
      ],
      features: {
        streamingSupport: true,
        functionCalling: true,
        toolUse: true,
        contextWindowSize: 200000,
        longTermMemory: false,
        multimodalSupport: true,
        codeInterpreting: true,
        imageAnalysis: true
      }
    };
  }
}