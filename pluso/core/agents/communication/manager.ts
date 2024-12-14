// core/agents/communication.ts
import { runtime } from "../../async/runtime.ts";
import { V8Isolate } from "../../runtime/isolates/base.ts";

interface AgentMessage {
  id: string;
  from: string;
  to: string;
  content: unknown;
  type: 'request' | 'response' | 'broadcast';
  timestamp: number;
}

interface AgentChannel {
  id: string;
  members: Set<string>;
  messages: AgentMessage[];
}

class AgentCommunicationManager {
  private static instance: AgentCommunicationManager;
  private channels: Map<string, AgentChannel>;
  private isolates: Map<string, V8Isolate>;
  private messageHandlers: Map<string, (message: AgentMessage) => Promise<void>>;

  private constructor() {
    this.channels = new Map();
    this.isolates = new Map();
    this.messageHandlers = new Map();
  }

  static getInstance(): AgentCommunicationManager {
    if (!AgentCommunicationManager.instance) {
      AgentCommunicationManager.instance = new AgentCommunicationManager();
    }
    return AgentCommunicationManager.instance;
  }

  async createIsolate(agentId: string): Promise<V8Isolate> {
    const isolate = new V8Isolate({
      memoryLimit: 128, // MB
      timeout: 5000,    // ms
    });

    await isolate.initialize();
    this.isolates.set(agentId, isolate);
    return isolate;
  }

  async createChannel(channelId: string, members: string[]): Promise<void> {
    const channel: AgentChannel = {
      id: channelId,
      members: new Set(members),
      messages: [],
    };

    this.channels.set(channelId, channel);

    // Create isolates for new agents if needed
    await Promise.all(
      members.map(async (memberId) => {
        if (!this.isolates.has(memberId)) {
          await this.createIsolate(memberId);
        }
      })
    );
  }

  async sendMessage(message: Omit<AgentMessage, 'id' | 'timestamp'>): Promise<void> {
    const fullMessage: AgentMessage = {
      ...message,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };

    await runtime.spawn(async () => {
      const sourceIsolate = this.isolates.get(message.from);
      const targetIsolate = this.isolates.get(message.to);

      if (!sourceIsolate || !targetIsolate) {
        throw new Error('Source or target isolate not found');
      }

      // Validate message in source isolate context
      await sourceIsolate.run(`
        const message = ${JSON.stringify(fullMessage)};
        if (!validateMessage(message)) {
          throw new Error('Invalid message format');
        }
      `);

      // Process message in target isolate
      const handler = this.messageHandlers.get(message.to);
      if (handler) {
        await handler(fullMessage);
      }

      // Store message in appropriate channels
      for (const [_, channel] of this.channels) {
        if (channel.members.has(message.from) && channel.members.has(message.to)) {
          channel.messages.push(fullMessage);
        }
      }
    });
  }

  async broadcast(
    fromAgentId: string,
    channelId: string,
    content: unknown
  ): Promise<void> {
    const channel = this.channels.get(channelId);
    if (!channel) {
      throw new Error(`Channel ${channelId} not found`);
    }

    const broadcastPromises: Promise<void>[] = [];

    for (const memberId of channel.members) {
      if (memberId !== fromAgentId) {
        broadcastPromises.push(
          this.sendMessage({
            from: fromAgentId,
            to: memberId,
            content,
            type: 'broadcast',
          })
        );
      }
    }

    await Promise.all(broadcastPromises);
  }

  registerMessageHandler(
    agentId: string,
    handler: (message: AgentMessage) => Promise<void>
  ): void {
    this.messageHandlers.set(agentId, handler);
  }

  // Memory management and cleanup
  async destroyIsolate(agentId: string): Promise<void> {
    const isolate = this.isolates.get(agentId);
    if (isolate) {
      await isolate.dispose();
      this.isolates.delete(agentId);
    }
  }

  async cleanupChannel(channelId: string): Promise<void> {
    const channel = this.channels.get(channelId);
    if (channel) {
      // Cleanup isolates for agents only in this channel
      for (const memberId of channel.members) {
        let memberInOtherChannels = false;
        for (const [otherChannelId, otherChannel] of this.channels) {
          if (otherChannelId !== channelId && otherChannel.members.has(memberId)) {
            memberInOtherChannels = true;
            break;
          }
        }
        if (!memberInOtherChannels) {
          await this.destroyIsolate(memberId);
        }
      }
      this.channels.delete(channelId);
    }
  }
}

// Example agent implementation
class Agent {
  private id: string;
  private manager: AgentCommunicationManager;

  constructor(id: string) {
    this.id = id;
    this.manager = AgentCommunicationManager.getInstance();
  }

  async initialize(): Promise<void> {
    // Register message handler
    this.manager.registerMessageHandler(this.id, async (message) => {
      await this.handleMessage(message);
    });
  }

  private async handleMessage(message: AgentMessage): Promise<void> {
    // Example message handling logic
    switch (message.type) {
      case 'request':
        await this.handleRequest(message);
        break;
      case 'response':
        await this.handleResponse(message);
        break;
      case 'broadcast':
        await this.handleBroadcast(message);
        break;
    }
  }

  private async handleRequest(message: AgentMessage): Promise<void> {
    // Process request and send response
    const response = await this.processRequest(message.content);
    await this.manager.sendMessage({
      from: this.id,
      to: message.from,
      content: response,
      type: 'response',
    });
  }

  private async handleResponse(message: AgentMessage): Promise<void> {
    // Handle response logic
    console.log(`Agent ${this.id} received response:`, message.content);
  }

  private async handleBroadcast(message: AgentMessage): Promise<void> {
    // Handle broadcast message
    console.log(`Agent ${this.id} received broadcast:`, message.content);
  }

  private async processRequest(content: unknown): Promise<unknown> {
    // Example request processing logic
    return { processed: content };
  }
}

export { AgentCommunicationManager, Agent, type AgentMessage };