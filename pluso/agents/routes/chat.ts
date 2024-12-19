import { AgentConfig } from "../types/agent.ts";
import { BaseAgent } from "../core/base/base_agent.ts";

export function createChatHandler(agentType: string) {
  return async (req: Request) => {
    const config: AgentConfig = {
      type: agentType,
      // Common config
    };
    
    const agent = new BaseAgent(config);
    const response = await agent.processMessage(req);
    return response;
  };
}