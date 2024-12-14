// /routes/api/agents/config.ts
import { AgentConfig } from "../../../types/agent.ts";

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  maia: {
    name: "Maia",
    systemPrompt: "You are Maia, a helpful AI assistant.",
    model: "claude-3-haiku-20240307"
  }
};
