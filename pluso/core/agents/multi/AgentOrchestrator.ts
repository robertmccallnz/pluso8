import { PermissionManager, AgentPermission } from './AgentPermissions';

export interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: any;
  timestamp: string;
  type: 'request' | 'response' | 'notification';
  metadata?: {
    conversationId?: string;
    replyTo?: string;
    priority?: number;
  };
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  capabilities: string[];
  model: string;
  systemPrompt: string;
  maxTokens?: number;
  temperature?: number;
}

export class AgentOrchestrator {
  private static instance: AgentOrchestrator;
  private agents: Map<string, AgentConfig> = new Map();
  private messageQueue: AgentMessage[] = [];
  private conversations: Map<string, AgentMessage[]> = new Map();
  private permissionManager: PermissionManager;

  private constructor() {
    this.permissionManager = PermissionManager.getInstance();
  }

  static getInstance(): AgentOrchestrator {
    if (!this.instance) {
      this.instance = new AgentOrchestrator();
    }
    return this.instance;
  }

  registerAgent(config: AgentConfig): void {
    this.agents.set(config.id, config);
  }

  async sendMessage(message: AgentMessage): Promise<boolean> {
    const validation = this.permissionManager.validateInteraction(
      message.from,
      message.to,
      'interact' as AgentPermission
    );

    if (!validation.allowed) {
      console.error(`Message rejected: ${validation.reason}`);
      return false;
    }

    // Add to conversation history
    const conversationId = message.metadata?.conversationId || `conv_${Date.now()}`;
    if (!this.conversations.has(conversationId)) {
      this.conversations.set(conversationId, []);
    }
    this.conversations.get(conversationId)?.push(message);

    // Add to message queue
    this.messageQueue.push(message);
    return true;
  }

  async getConversationHistory(conversationId: string): Promise<AgentMessage[]> {
    return this.conversations.get(conversationId) || [];
  }

  getAgentConfig(agentId: string): AgentConfig | undefined {
    return this.agents.get(agentId);
  }

  getActiveAgents(): AgentConfig[] {
    return Array.from(this.agents.values());
  }

  async createAgentGroup(configs: AgentConfig[]): Promise<string[]> {
    const groupIds: string[] = [];
    
    for (const config of configs) {
      this.registerAgent(config);
      groupIds.push(config.id);
    }

    return groupIds;
  }

  async dissolveAgentGroup(groupIds: string[]): Promise<void> {
    for (const id of groupIds) {
      this.agents.delete(id);
    }
  }
}

// Agent interaction patterns
export const INTERACTION_PATTERNS = {
  CHAIN: 'chain',           // Sequential execution
  BROADCAST: 'broadcast',   // One-to-many communication
  PEER: 'peer',            // Many-to-many communication
  HIERARCHY: 'hierarchy'    // Tree-structured communication
};

// Default agent roles and their relationships
export const DEFAULT_AGENT_ROLES = {
  ORCHESTRATOR: 'orchestrator',
  WORKER: 'worker',
  VALIDATOR: 'validator',
  SPECIALIST: 'specialist'
};
