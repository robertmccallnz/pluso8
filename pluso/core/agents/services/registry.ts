import { ServiceAgent, ServiceAgentType, ServiceRegistry } from "./types.ts";
import { EventEmitter } from "../../../events/emitter.ts";
import { db } from "../../../utils/db.ts";
import { MetaPromptingService } from "./prompting/meta-prompt.ts";
import { AgentPromptingService } from "./prompting/agent-prompting.ts";
import { WebScraper } from "./scraper/web-scraper.ts";

export class ServiceAgentRegistry implements ServiceRegistry {
  private static instance: ServiceAgentRegistry;
  private agents: Map<string, ServiceAgent>;
  private events: EventEmitter;

  private constructor() {
    this.agents = new Map();
    this.events = new EventEmitter();
    this.startHeartbeatMonitoring();
  }

  public static getInstance(): ServiceAgentRegistry {
    if (!ServiceAgentRegistry.instance) {
      ServiceAgentRegistry.instance = new ServiceAgentRegistry();
    }
    return ServiceAgentRegistry.instance;
  }

  public async initialize(): Promise<void> {
    // Initialize core services
    await this.initializeCoreServices();

    // Load existing agents from database
    await this.loadAgentsFromDb();
  }

  private async initializeCoreServices(): Promise<void> {
    try {
      // Initialize and register meta-prompting service
      const metaPrompting = MetaPromptingService.getInstance();
      await this.registerAgent(metaPrompting);

      // Initialize and register agent communication service
      const agentPrompting = AgentPromptingService.getInstance();
      await this.registerAgent(agentPrompting);

      // Initialize and register web scraper service
      const webScraper = WebScraper.getInstance();
      await this.registerAgent(webScraper);

      this.events.emit("registry:core_services_initialized", {
        timestamp: new Date()
      });
    } catch (error) {
      this.events.emit("registry:initialization_error", {
        error: error.message,
        timestamp: new Date()
      });
      throw error;
    }
  }

  private async loadAgentsFromDb(): Promise<void> {
    const result = await db.query(
      "SELECT * FROM service_agents WHERE status != 'terminated'"
    );

    for (const row of result.rows) {
      const agent = await this.createAgentFromDb(row);
      if (agent) {
        this.agents.set(agent.id, agent);
      }
    }
  }

  private async createAgentFromDb(row: any): Promise<ServiceAgent | null> {
    try {
      switch (row.type) {
        case ServiceAgentType.META_PROMPT:
          return MetaPromptingService.getInstance();
        case ServiceAgentType.AGENT_COMMUNICATION:
          return AgentPromptingService.getInstance();
        case ServiceAgentType.SCRAPER:
          return WebScraper.getInstance();
        // Add other agent types as needed
        default:
          return null;
      }
    } catch (error) {
      this.events.emit("registry:agent_creation_error", {
        agentType: row.type,
        error: error.message
      });
      return null;
    }
  }

  public async registerAgent(agent: ServiceAgent): Promise<void> {
    this.agents.set(agent.id, agent);
    await db.query(
      `INSERT INTO service_agents (id, type, status, last_heartbeat) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (id) DO UPDATE 
       SET status = $3, last_heartbeat = $4`,
      [agent.id, agent.type, agent.status, new Date()]
    );
    this.events.emit("agent:registered", { agent });
  }

  public async deregisterAgent(agentId: string): Promise<void> {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = "inactive";
      await db.query(
        "UPDATE service_agents SET status = 'inactive' WHERE id = $1",
        [agentId]
      );
      this.agents.delete(agentId);
      this.events.emit("agent:deregistered", { agentId });
    }
  }

  public async getAgent(type: ServiceAgentType): Promise<ServiceAgent | null> {
    for (const agent of this.agents.values()) {
      if (agent.type === type && agent.status === "active") {
        return agent;
      }
    }
    return null;
  }

  public async updateStatus(
    agentId: string,
    status: ServiceAgent["status"]
  ): Promise<void> {
    const agent = this.agents.get(agentId);
    if (agent) {
      agent.status = status;
      agent.lastHeartbeat = new Date();
      await db.query(
        `UPDATE service_agents SET status = $1, last_heartbeat = $2 WHERE id = $3`,
        [status, agent.lastHeartbeat, agentId]
      );
      this.events.emit("agent:status_updated", { agent });
    }
  }

  private startHeartbeatMonitoring(): void {
    setInterval(() => {
      this.checkAgentHeartbeats();
    }, 30000);
  }

  private async checkAgentHeartbeats(): Promise<void> {
    const now = new Date();
    for (const agent of this.agents.values()) {
      const timeSinceLastHeartbeat = now.getTime() - agent.lastHeartbeat.getTime();
      
      if (timeSinceLastHeartbeat > 60000 && agent.status === "active") {
        // Mark agent as potentially inactive
        await this.updateStatus(agent.id, "inactive");
        
        this.events.emit("agent:heartbeat_missed", {
          agentId: agent.id,
          type: agent.type,
          lastHeartbeat: agent.lastHeartbeat
        });

        // Try to restart the agent
        await this.tryRestartAgent(agent);
      }
    }
  }

  private async tryRestartAgent(agent: ServiceAgent): Promise<void> {
    try {
      if (agent.start) {
        await agent.start();
        await this.updateStatus(agent.id, "active");
        this.events.emit("agent:restarted", {
          agentId: agent.id,
          type: agent.type
        });
      }
    } catch (error) {
      this.events.emit("agent:restart_failed", {
        agentId: agent.id,
        type: agent.type,
        error: error.message
      });
    }
  }

  public async getMetrics(): Promise<{
    totalAgents: number;
    activeAgents: number;
    serviceMetrics: Record<ServiceAgentType, any>;
  }> {
    const serviceMetrics: Record<ServiceAgentType, any> = {} as Record<
      ServiceAgentType,
      any
    >;

    for (const agent of this.agents.values()) {
      serviceMetrics[agent.type] = agent.metrics;
    }

    return {
      totalAgents: this.agents.size,
      activeAgents: Array.from(this.agents.values()).filter(
        agent => agent.status === "active"
      ).length,
      serviceMetrics
    };
  }
}
