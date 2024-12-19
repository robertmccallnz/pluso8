    // core/storage/agent-store.ts
import { KVStorageManager } from "./manager.ts";
import { AgentConfig, validateAgentConfig } from "../../agents/types/agent.ts";

export class AgentStore {
  private kvManager: KVStorageManager;

  constructor() {
    this.kvManager = new KVStorageManager({
      useCache: true,
      migrationMode: false
    });
  }

  async initialize() {
    await this.kvManager.initialize();
  }

  async saveAgent(config: AgentConfig): Promise<string> {
    // Validate config before saving
    validateAgentConfig(config);
    
    // Save to KV storage
    const agentId = await this.kvManager.saveAgent({
      id: crypto.randomUUID(),
      config,
      created_at: Date.now(),
      updated_at: Date.now()
    });

    return agentId;
  }

  async getAgent(id: string) {
    return await this.kvManager.getAgent(id);
  }

  async getAgentConversations(agentId: string, limit = 10) {
    return await this.kvManager.getAgentConversations(agentId, limit);
  }

  async getConfigHistory(agentId: string) {
    return await this.kvManager.getConfigHistory(agentId);
  }
}
