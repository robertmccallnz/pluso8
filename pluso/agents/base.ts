// pluso/agents/base.ts
export abstract class BaseAgent {
    protected id: string;
    protected config: AgentConfig;
  
    constructor(id: string, config: AgentConfig) {
      this.id = id;
      this.config = config;
    }
  
    abstract process(input: string): Promise<string>;
  }
  