import { AgentConfig } from "../types/agent.ts";

// This is a temporary registry for built-in agents
// In production, this would be fetched from a database
export const REGISTERED_AGENTS: Record<string, AgentConfig> = {
  maia: {
    id: "maia",
    name: "Maia",
    description: "Your AI companion focused on emotional intelligence and personal growth",
    model: "gpt-4",
    useCase: "assistant",
    systemPrompt: "You are Maia, an emotionally intelligent AI companion...",
    status: "active",
  },
};
