//pluso/core/v8/agent-isolate.ts
import { AgentConfig } from "../../../types/agent.ts";


export class AgentIsolate extends V8Isolate {
  private config: AgentConfig;

  constructor(config: AgentConfig) {
    super({
      namespace: `agent-${config.name}`,
      memoryLimit: 256  // Agents get more memory
    });
    this.config = config;
  }

  async initialize(): Promise<void> {
    // Load agent-specific modules
    const moduleCache = ModuleCache.getInstance();
    await moduleCache.getModule(this.config.model.path);

    // Initialize agent context
    await this.evaluate(`
      globalThis.agentConfig = ${JSON.stringify(this.config)};
      globalThis.gc(); // Explicit GC after initialization
    `);
  }

  async process(input: string): Promise<string> {
    return await this.evaluate(`
      // Use lightweight parsing/serialization
      JSON.parse(JSON.stringify(
        await processInput(${JSON.stringify(input)})
      ));
    `);
  }
}