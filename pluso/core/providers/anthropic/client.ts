// core/providers/anthropic/client.ts
import { BaseModelClient, BaseClientConfig, Message } from "../base.ts";

export class AnthropicClient extends BaseModelClient {
  constructor(config: string | BaseClientConfig) {
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

  messages = {
    create: async (params: {
      model: string;
      max_tokens: number;
      messages: Message[];
      system?: string;
    }) => {
      const response = await fetch(`${this.baseUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: params.model,
          max_tokens: params.max_tokens,
          messages: params.messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          system: params.system
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: response.statusText }));
        console.error('Anthropic API error:', error);
        throw new Error(`Anthropic API error: ${error.error || response.statusText}`);
      }

      const data = await response.json();
      return data;
    }
  };
}