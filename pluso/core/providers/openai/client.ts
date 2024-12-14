// core/providers/openai/client.ts
export class OpenAIClient extends BaseModelClient {
  constructor(config: BaseClientConfig) {
    super(config);
    this.metadata = {
      id: 'openai',
      name: 'OpenAI',
      version: '1.0.0',
      supportedModels: [
        'gpt-4-turbo-preview',
        'gpt-4-vision-preview',
        'gpt-4',
        'gpt-3.5-turbo'
      ],
      features: {
        streamingSupport: true,
        functionCalling: true,
        toolUse: true,
        contextWindowSize: 128000,
        longTermMemory: false,
        multimodalSupport: true,
        codeInterpreting: true,
        imageGeneration: true,
        imageAnalysis: true
      }
    };
  }

  async chat(messages: ModelRequestMessage[], options?: ModelOptions): Promise<ModelResponse> {
    return await this.withRetry(async () => {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages,
          temperature: options?.temperature ?? this.config.defaultTemperature,
          max_tokens: options?.maxTokens,
          stream: false
        })
      });

      if (!response.ok) {
        throw this.createError(`API request failed: ${response.statusText}`);
      }

      const data = await response.json();
      return this.formatResponse(data);
    });
  }
}