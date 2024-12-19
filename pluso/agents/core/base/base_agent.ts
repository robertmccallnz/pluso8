// pluso/agents/core/base/base_agent.ts
import { AgentConfig } from "../../types.ts";

export abstract class BaseAgent {
  protected id: string;
  protected config: AgentConfig;

  constructor(id: string, config: AgentConfig) {
    this.id = id;
    this.config = config;
  }

  getId(): string {
    return this.id;
  }

  getConfig(): AgentConfig {
    return { ...this.config };
  }

  abstract process(input: string): Promise<string>;

  createHandler() {
    return {
      process: (input: string) => this.process(input),
    };
  }
}