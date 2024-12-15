// /Users/robertmccall/pluso8/pluso/core/providers/together/client.ts
import { BaseClient } from "../base/client.ts";
import { BaseModelConfig } from "../base/model.ts";

interface TogetherAIConfig extends BaseModelConfig {
  apiKey: string;
}

export class TogetherAIClient extends BaseClient {
  private config: TogetherAIConfig;

  constructor(config: TogetherAIConfig) {
    super(config);
    this.config = config;
  }

  async chat(messages: any[]) {
    try {
      const response = await fetch('https://api.together.xyz/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: this.config.model,
          messages: messages
        })
      });

      if (!response.ok) {
        throw new Error('Together AI API request failed');
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Together AI Chat Error:', error);
      throw error;
    }
  }
}