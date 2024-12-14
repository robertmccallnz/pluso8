// core/storage/kv-manager.ts
import { AgentConfig } from "../../types/agent.ts";


interface KVStorageConfig {
  useCache: boolean;
  migrationMode?: boolean;
  legacySupport?: boolean;
}

// Define KV collections
const KV_COLLECTIONS = {
  AGENTS: "agents",
  CONVERSATIONS: "conversations",
  STATES: "states",
  METRICS: "metrics",
  CONFIG_HISTORY: "config_history"
} as const;

export class KVStorageManager {
  private kv: Deno.Kv;
  private config: KVStorageConfig;

  constructor(config: KVStorageConfig) {
    this.config = config;
  }

  async initialize() {
    try {
      this.kv = await Deno.openKv();
      // Initialize atomic counters and indices
      await this.initializeCollections();
    } catch (error) {
      console.error("Failed to initialize KV storage:", error);
      throw error;
    }
  }

  private async initializeCollections() {
    // Create collection structures if they don't exist
    for (const collection of Object.values(KV_COLLECTIONS)) {
      const key = [`${collection}_meta`, "initialized"];
      const existing = await this.kv.get(key);
      
      if (!existing.value) {
        await this.kv.set(key, true);
        // Set up indices for this collection
        await this.createIndices(collection);
      }
    }
  }

  private async createIndices(collection: string) {
    // Create secondary indices for efficient querying
    const indexKey = [`${collection}_indices`, "created"];
    await this.kv.atomic()
      .check({ key: indexKey, versionstamp: null })
      .set(indexKey, true)
      .commit();
  }

  async saveAgent(agent: Agent): Promise<string> {
    const agentKey = [KV_COLLECTIONS.AGENTS, agent.id];
    const timestamp = Date.now();

    // Save current config to history before updating
    if (agent.id) {
      const currentConfig = await this.kv.get([KV_COLLECTIONS.AGENTS, agent.id]);
      if (currentConfig.value) {
        await this.saveConfigHistory(agent.id, currentConfig.value);
      }
    }

    // Atomic operation for saving agent
    const result = await this.kv.atomic()
      .set(agentKey, {
        ...agent,
        updated_at: timestamp
      })
      .set([KV_COLLECTIONS.AGENTS, "index", agent.id], timestamp)
      .commit();

    if (!result.ok) {
      throw new Error("Failed to save agent");
    }

    return agent.id;
  }

  async getAgent(id: string): Promise<Agent | null> {
    const result = await this.kv.get([KV_COLLECTIONS.AGENTS, id]);
    return result.value as Agent || null;
  }

  async saveConversation(conversationId: string, agentId: string, messages: unknown[]) {
    const key = [KV_COLLECTIONS.CONVERSATIONS, conversationId];
    const timestamp = Date.now();

    await this.kv.atomic()
      .set(key, {
        agentId,
        messages,
        updated_at: timestamp
      })
      .set([KV_COLLECTIONS.CONVERSATIONS, "agent_index", agentId, conversationId], timestamp)
      .commit();
  }

  async getAgentConversations(agentId: string, limit = 10): Promise<unknown[]> {
    const conversations = [];
    const prefix = [KV_COLLECTIONS.CONVERSATIONS, "agent_index", agentId];
    
    for await (const entry of this.kv.list({ prefix })) {
      if (conversations.length >= limit) break;
      const conversationId = entry.key[entry.key.length - 1];
      const conversation = await this.kv.get([KV_COLLECTIONS.CONVERSATIONS, conversationId]);
      if (conversation.value) {
        conversations.push(conversation.value);
      }
    }

    return conversations;
  }

  private async saveConfigHistory(agentId: string, config: AgentConfig) {
    const historyKey = [
      KV_COLLECTIONS.CONFIG_HISTORY,
      agentId,
      Date.now().toString()
    ];
    await this.kv.set(historyKey, config);
  }

  async getConfigHistory(agentId: string): Promise<AgentConfig[]> {
    const history = [];
    const prefix = [KV_COLLECTIONS.CONFIG_HISTORY, agentId];
    
    for await (const entry of this.kv.list({ prefix })) {
      history.push(entry.value);
    }

    return history.sort((a, b) => b.timestamp - a.timestamp);
  }

  async close() {
    await this.kv.close();
  }
}