import { ModelProvider } from "../models/config.ts";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface ChatResponse {
  content: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export class ChatService {
  private openaiKey: string;
  private togetherKey: string;
  private anthropicKey: string;

  constructor() {
    this.openaiKey = Deno.env.get("OPENAI_API_KEY") || "";
    this.togetherKey = Deno.env.get("TOGETHER_API_KEY") || "";
    this.anthropicKey = Deno.env.get("ANTHROPIC_API_KEY") || "";
  }

  async chat(
    provider: ModelProvider,
    model: string,
    messages: ChatMessage[],
    options = { temperature: 0.7, maxTokens: 1000 }
  ): Promise<ChatResponse> {
    switch (provider) {
      case "openai":
        return this.openaiChat(model, messages, options);
      case "anthropic":
        return this.anthropicChat(model, messages, options);
      default:
        return this.togetherChat(model, messages, options);
    }
  }

  private async openaiChat(
    model: string,
    messages: ChatMessage[],
    options: { temperature: number; maxTokens: number }
  ): Promise<ChatResponse> {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.openaiKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      usage: data.usage,
    };
  }

  private async anthropicChat(
    model: string,
    messages: ChatMessage[],
    options: { temperature: number; maxTokens: number }
  ): Promise<ChatResponse> {
    const systemMessage = messages.find(m => m.role === "system");
    const userMessages = messages.filter(m => m.role === "user");
    const lastUserMessage = userMessages[userMessages.length - 1];

    const prompt = systemMessage 
      ? `${systemMessage.content}\n\nHuman: ${lastUserMessage.content}\n\nAssistant:`
      : `Human: ${lastUserMessage.content}\n\nAssistant:`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.anthropicKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        max_tokens: options.maxTokens,
        temperature: options.temperature,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.content[0].text,
      usage: data.usage,
    };
  }

  private async togetherChat(
    model: string,
    messages: ChatMessage[],
    options: { temperature: number; maxTokens: number }
  ): Promise<ChatResponse> {
    const response = await fetch("https://api.together.xyz/inference", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.togetherKey}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: options.temperature,
        max_tokens: options.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`Together AI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      content: data.output.choices[0].message.content,
      usage: data.output.usage,
    };
  }
}
