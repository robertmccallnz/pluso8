import { AgentConfig } from "../types.ts";
import { createAgent } from "./factory/agent_factory.ts";

// Initialize agent handlers
export function initializeAgentHandlers(configs: Record<string, AgentConfig>) {
  const handlers: Record<string, unknown> = {};
  
  for (const [agentId, config] of Object.entries(configs)) {
    const agent = createAgent(config);
    handlers[agentId] = agent.createHandler();
  }
  
  return handlers;
}
