import { ModelProvider } from "../models/config.ts";

export interface AgentModelConfig {
  provider: ModelProvider;
  model: string;
  temperature: number;
  maxTokens: number;
}

export const AGENT_MODELS: Record<string, AgentModelConfig> = {
  // Maia - Using Anthropic's Claude
  "TECH_ASST_MAIA_0001": {
    provider: "anthropic",
    model: "claude-2.1",
    temperature: 0.7,
    maxTokens: 2000,
  },

  // Petunia - Using Together AI's Mistral
  "AGR_SPEC_PETUNIA_0001": {
    provider: "together",
    model: "mistralai/Mistral-7B-Instruct-v0.1",
    temperature: 0.7,
    maxTokens: 2000,
  },

  // Jeff - Using OpenAI's GPT-4
  "LEG_ADVR_JEFF_0001": {
    provider: "openai",
    model: "gpt-4-1106-preview",
    temperature: 0.7,
    maxTokens: 2000,
  },
};
