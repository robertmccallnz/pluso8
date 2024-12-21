import { ServiceAgent, ServiceAgentType } from "../types.ts";
import { EventEmitter } from "../../../events/emitter.ts";
import { ServiceRegistry } from "../registry.ts";

export class MonitorAgent implements ServiceAgent {
  id: string;
  type: ServiceAgentType.MONITORING;
  status: "active" | "inactive" | "error";
  lastHeartbeat: Date;
  metrics: {
    requestsHandled: number;
    successRate: number;
    averageResponseTime: number;
  };

  private registry: ServiceRegistry;
  private events: EventEmitter;
  private codeChangeWatcher: Deno.FsWatcher | null = null;

  constructor() {
    this.id = crypto.randomUUID();
    this.type = ServiceAgentType.MONITORING;
    this.status = "active";
    this.lastHeartbeat = new Date();
    this.metrics = {
      requestsHandled: 0,
      successRate: 100,
      averageResponseTime: 0,
    };
    this.registry = ServiceRegistry.getInstance();
    this.events = new EventEmitter();
    this.initializeMonitoring();
  }

  private async initializeMonitoring(): Promise<void> {
    // Monitor service agents
    this.monitorServiceAgents();

    // Watch for code changes
    await this.watchCodeChanges();

    // Listen for events
    this.setupEventListeners();
  }

  private async monitorServiceAgents(): Promise<void> {
    setInterval(async () => {
      const agents = await this.registry.getAllAgents();
      for (const agent of agents) {
        if (agent.status === "error") {
          this.events.emit("agent:error", {
            agentId: agent.id,
            type: agent.type,
            lastHeartbeat: agent.lastHeartbeat,
          });
        }
      }
    }, 30000);
  }

  private async watchCodeChanges(): Promise<void> {
    try {
      this.codeChangeWatcher = Deno.watchFs("./", { recursive: true });
      for await (const event of this.codeChangeWatcher) {
        if (event.kind === "modify" && event.paths.some(p => p.endsWith(".ts") || p.endsWith(".tsx"))) {
          await this.analyzeCodeChange(event.paths);
        }
      }
    } catch (error) {
      console.error("Error setting up code change watcher:", error);
    }
  }

  private async analyzeCodeChange(paths: string[]): Promise<void> {
    for (const path of paths) {
      const content = await Deno.readTextFile(path);
      
      // Check for potential issues
      const issues = await this.checkForIssues(path, content);
      
      if (issues.length > 0) {
        this.events.emit("code:issues_detected", {
          path,
          issues,
          timestamp: new Date(),
        });
        
        // Send alerts
        await this.sendAlerts(path, issues);
      }
    }
  }

  private async checkForIssues(path: string, content: string): Promise<string[]> {
    const issues: string[] = [];

    // Check for duplicate service agent creation
    if (content.includes("new ServiceAgent") || content.includes("implements ServiceAgent")) {
      issues.push("⚠️ Creating new service agent - please use existing service agents from the registry");
    }

    // Check for direct file operations without using service agents
    if (content.includes("Deno.writeFile") || content.includes("Deno.createFile")) {
      issues.push("⚠️ Direct file operations detected - consider using FileSystem service agent");
    }

    // Check for email operations without using EmailAgent
    if (content.includes("sendEmail") || content.includes("smtp")) {
      issues.push("⚠️ Email operations detected - please use EmailAgent for all email communications");
    }

    // Check for calendar operations without using CalendarAgent
    if (content.includes("createEvent") || content.includes("schedule")) {
      issues.push("⚠️ Calendar operations detected - please use CalendarAgent for scheduling");
    }

    return issues;
  }

  private async sendAlerts(path: string, issues: string[]): Promise<void> {
    const alert = {
      title: "Code Review Alert",
      path,
      issues,
      recommendations: [
        "Review ARCHITECTURE.md for existing service agents",
        "Use ServiceRegistry to access existing agents",
        "Create new triggers instead of new agents",
      ],
      timestamp: new Date(),
    };

    // Send to monitoring dashboard
    this.events.emit("alert:code_review", alert);

    // Log to monitoring system
    console.warn("Code Review Alert:", alert);
  }

  private setupEventListeners(): void {
    // Listen for agent registration
    this.events.on("agent:registered", ({ agent }) => {
      console.log(`New agent registered: ${agent.type}`);
    });

    // Listen for agent errors
    this.events.on("agent:error", ({ agentId, type }) => {
      console.error(`Agent error detected: ${type} (${agentId})`);
    });

    // Listen for code issues
    this.events.on("code:issues_detected", ({ path, issues }) => {
      console.warn(`Code issues detected in ${path}:`, issues);
    });
  }

  async cleanup(): Promise<void> {
    if (this.codeChangeWatcher) {
      try {
        this.codeChangeWatcher.close();
      } catch (error) {
        console.error("Error closing code change watcher:", error);
      }
    }
  }
}
