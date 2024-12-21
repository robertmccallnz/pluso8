import { EventEmitter } from "../../../../events/emitter.ts";
import { ServiceAgent, ServiceAgentType, AgentPromptRequest, AgentPromptResponse } from "../types.ts";
import { ServiceRegistry } from "../registry.ts";

export class AgentCommunicationService implements ServiceAgent {
  private static instance: AgentCommunicationService;
  private events: EventEmitter;
  private registry: ServiceRegistry;
  private messageQueue: Map<string, AgentPromptRequest[]>;
  private processingTasks: Map<string, Promise<void>>;

  public id: string;
  public type: ServiceAgentType;
  public status: "active" | "inactive" | "error" | "terminated";
  public lastHeartbeat: Date;
  public metrics: {
    requestsHandled: number;
    successRate: number;
    averageResponseTime: number;
    messageQueueSize: number;
    averageQueueWaitTime: number;
  };

  private constructor(registry: ServiceRegistry) {
    this.id = "agent-communication-service";
    this.type = ServiceAgentType.AGENT_COMMUNICATION;
    this.status = "inactive";
    this.lastHeartbeat = new Date();
    this.metrics = {
      requestsHandled: 0,
      successRate: 0,
      averageResponseTime: 0,
      messageQueueSize: 0,
      averageQueueWaitTime: 0
    };

    this.events = new EventEmitter();
    this.registry = registry;
    this.messageQueue = new Map();
    this.processingTasks = new Map();

    this.initializeEventHandlers();
  }

  public static getInstance(registry: ServiceRegistry): AgentCommunicationService {
    if (!AgentCommunicationService.instance) {
      AgentCommunicationService.instance = new AgentCommunicationService(registry);
    }
    return AgentCommunicationService.instance;
  }

  public async start(): Promise<void> {
    try {
      this.status = "active";
      this.lastHeartbeat = new Date();
      await this.processQueuedMessages();
      this.events.emit("service:started", { serviceId: this.id });
    } catch (error) {
      this.status = "error";
      this.events.emit("service:error", {
        serviceId: this.id,
        error: error instanceof Error ? error.message : "Unknown error"
      });
      throw error;
    }
  }

  private initializeEventHandlers(): void {
    this.events.on("message:queued", ({ agentId }) => {
      this.processAgentQueue(agentId);
    });

    this.events.on("agent:status", ({ agentId, status }) => {
      if (status === "active" && this.messageQueue.has(agentId)) {
        this.processAgentQueue(agentId);
      }
    });
  }

  public async sendMessage(request: AgentPromptRequest): Promise<AgentPromptResponse> {
    const startTime = Date.now();
    try {
      this.lastHeartbeat = new Date();
      this.metrics.requestsHandled++;

      const targetAgent = await this.registry.getAgent(request.targetAgentId);
      if (!targetAgent) {
        throw new Error(`Target agent ${request.targetAgentId} not found`);
      }

      if (targetAgent.status !== "active") {
        this.queueMessage(request);
        return {
          success: false,
          error: "Target agent is not active. Message queued.",
          metadata: {
            processingTime: Date.now() - startTime,
            optimizationAttempts: 0,
            qualityScore: 0
          }
        };
      }

      const response = await this.processMessage(request);
      const processingTime = Date.now() - startTime;
      this.updateMetrics(response, processingTime);

      return {
        ...response,
        metadata: {
          ...response.metadata,
          processingTime
        }
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      return {
        success: false,
        error: errorMessage,
        metadata: {
          processingTime: Date.now() - startTime,
          optimizationAttempts: 0,
          qualityScore: 0
        }
      };
    }
  }

  private queueMessage(request: AgentPromptRequest): void {
    const queue = this.messageQueue.get(request.targetAgentId) || [];
    queue.push(request);
    this.messageQueue.set(request.targetAgentId, queue);
    this.metrics.messageQueueSize = Array.from(this.messageQueue.values()).reduce(
      (total, queue) => total + queue.length,
      0
    );
    this.events.emit("message:queued", { agentId: request.targetAgentId });
  }

  private async processMessage(request: AgentPromptRequest): Promise<AgentPromptResponse> {
    const targetAgent = await this.registry.getAgent(request.targetAgentId);
    if (!targetAgent) {
      throw new Error(`Target agent ${request.targetAgentId} not found`);
    }

    // Implement actual message processing logic here
    // This is a placeholder implementation
    return {
      success: true,
      result: `Processed message from ${request.sourceAgentId} to ${request.targetAgentId}`,
      metadata: {
        processingTime: 0,
        optimizationAttempts: 1,
        qualityScore: 0.8
      }
    };
  }

  private async processQueuedMessages(): Promise<void> {
    for (const [agentId, queue] of this.messageQueue.entries()) {
      if (queue.length > 0) {
        this.processAgentQueue(agentId);
      }
    }
  }

  private async processAgentQueue(agentId: string): Promise<void> {
    if (this.processingTasks.has(agentId)) {
      return;
    }

    const processTask = async () => {
      const queue = this.messageQueue.get(agentId) || [];
      const agent = await this.registry.getAgent(agentId);

      if (!agent || agent.status !== "active") {
        return;
      }

      while (queue.length > 0) {
        const request = queue.shift();
        if (request) {
          await this.processMessage(request);
        }
      }

      this.messageQueue.set(agentId, queue);
      this.metrics.messageQueueSize = Array.from(this.messageQueue.values()).reduce(
        (total, queue) => total + queue.length,
        0
      );
      this.processingTasks.delete(agentId);
    };

    const task = processTask();
    this.processingTasks.set(agentId, task);
    await task;
  }

  private updateMetrics(response: AgentPromptResponse, processingTime: number): void {
    const totalRequests = this.metrics.requestsHandled;
    const successfulRequests = this.metrics.successRate * totalRequests + (response.success ? 1 : 0);

    this.metrics.successRate = successfulRequests / totalRequests;
    this.metrics.averageResponseTime =
      (this.metrics.averageResponseTime * (totalRequests - 1) + processingTime) / totalRequests;

    if (this.metrics.messageQueueSize > 0) {
      this.metrics.averageQueueWaitTime =
        (this.metrics.averageQueueWaitTime * (totalRequests - 1) + processingTime) / totalRequests;
    }
  }
}
