import { AgentPromptingService } from "./core/agents/services/prompting/agent-prompting";
import { MetaPromptingService } from "./core/agents/services/prompting/meta-prompt";
import { WebScraper } from "./core/agents/services/scraper/web-scraper";
import { PuppeteerTools } from "./utils/puppeteer";
import { EventEmitter } from "./events/emitter";
import { db } from "./utils/db";

/**
 * Pluso8: Advanced AI Agent Framework
 * 
 * A powerful framework for creating, managing, and orchestrating autonomous AI agents
 * with advanced capabilities including meta-prompting, web scraping, and inter-agent
 * communication.
 */
export class Pluso8 {
  private static instance: Pluso8;
  private events: EventEmitter;
  private initialized: boolean = false;

  private constructor() {
    this.events = new EventEmitter();
  }

  public static getInstance(): Pluso8 {
    if (!Pluso8.instance) {
      Pluso8.instance = new Pluso8();
    }
    return Pluso8.instance;
  }

  /**
   * Initialize the Pluso8 framework with optional configuration
   */
  public async initialize(config?: {
    dbConfig?: any;
    enabledServices?: string[];
    logLevel?: string;
  }): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      // Initialize database connection
      await db.connect(config?.dbConfig);

      // Initialize core services
      await this.initializeCoreServices(config?.enabledServices);

      this.initialized = true;
      this.events.emit("system:initialized", { timestamp: new Date() });
    } catch (error) {
      this.events.emit("system:error", {
        context: "initialization",
        error: error.message
      });
      throw error;
    }
  }

  private async initializeCoreServices(enabledServices: string[] = ["all"]): Promise<void> {
    // Initialize services based on configuration
    const services = enabledServices.includes("all") ? [
      "meta-prompting",
      "agent-communication",
      "web-scraping"
    ] : enabledServices;

    for (const service of services) {
      await this.initializeService(service);
    }
  }

  private async initializeService(service: string): Promise<void> {
    switch (service) {
      case "meta-prompting":
        await MetaPromptingService.getInstance();
        break;
      case "agent-communication":
        await AgentPromptingService.getInstance();
        break;
      case "web-scraping":
        await WebScraper.getInstance();
        break;
    }
  }

  /**
   * Core Services
   */

  /**
   * Meta-Prompting Service
   * 
   * Advanced prompt engineering and optimization system that enables:
   * - Dynamic prompt generation and refinement
   * - Multiple prompting strategies (chain-of-thought, few-shot, etc.)
   * - Prompt evaluation and optimization
   * - Template management and customization
   */
  public getMetaPromptingService(): MetaPromptingService {
    this.ensureInitialized();
    return MetaPromptingService.getInstance();
  }

  /**
   * Agent Communication Service
   * 
   * Facilitates sophisticated inter-agent communication with:
   * - Synchronous and asynchronous messaging
   * - Prompt sharing and optimization
   * - Performance tracking and history
   * - Rate limiting and resource management
   */
  public getAgentPromptingService(): AgentPromptingService {
    this.ensureInitialized();
    return AgentPromptingService.getInstance();
  }

  /**
   * Web Scraping Service
   * 
   * Advanced web scraping capabilities including:
   * - Dynamic content handling
   * - Browser fingerprinting
   * - Proxy support
   * - Structured data extraction
   * - Rate limiting and concurrent request management
   */
  public getWebScrapingService(): WebScraper {
    this.ensureInitialized();
    return WebScraper.getInstance();
  }

  /**
   * Event System
   * 
   * Subscribe to system events for monitoring and automation
   */
  public on(event: string, handler: (data: any) => void): void {
    this.events.on(event, handler);
  }

  public off(event: string, handler: (data: any) => void): void {
    this.events.off(event, handler);
  }

  /**
   * System Information
   */
  public async getSystemStatus(): Promise<{
    initialized: boolean;
    services: {
      name: string;
      status: string;
      metrics: any;
    }[];
    performance: {
      memory: number;
      cpu: number;
      activeAgents: number;
    };
  }> {
    const services = [
      {
        name: "meta-prompting",
        status: "active",
        metrics: await this.getServiceMetrics("meta-prompting")
      },
      {
        name: "agent-communication",
        status: "active",
        metrics: await this.getServiceMetrics("agent-communication")
      },
      {
        name: "web-scraping",
        status: "active",
        metrics: await this.getServiceMetrics("web-scraping")
      }
    ];

    return {
      initialized: this.initialized,
      services,
      performance: await this.getSystemPerformance()
    };
  }

  private async getServiceMetrics(service: string): Promise<any> {
    switch (service) {
      case "meta-prompting":
        return MetaPromptingService.getInstance().metrics;
      case "agent-communication":
        const agentService = AgentPromptingService.getInstance();
        return {
          promptsGenerated: await this.getPromptCount(),
          optimizationRate: await this.getOptimizationRate(),
          averageResponseTime: await this.getAverageResponseTime()
        };
      case "web-scraping":
        return WebScraper.getInstance().metrics;
      default:
        return {};
    }
  }

  private async getSystemPerformance(): Promise<{
    memory: number;
    cpu: number;
    activeAgents: number;
  }> {
    // Implement system performance monitoring
    return {
      memory: process.memoryUsage().heapUsed / 1024 / 1024,
      cpu: 0, // Implement CPU usage monitoring
      activeAgents: await this.getActiveAgentCount()
    };
  }

  private async getPromptCount(): Promise<number> {
    return (await db.query("SELECT COUNT(*) FROM meta_prompt_logs")).rows[0].count;
  }

  private async getOptimizationRate(): Promise<number> {
    const result = await db.query(`
      SELECT 
        COUNT(CASE WHEN success = true THEN 1 END)::float / COUNT(*)::float as rate
      FROM meta_prompt_logs
      WHERE timestamp > NOW() - INTERVAL '24 hours'
    `);
    return result.rows[0].rate;
  }

  private async getAverageResponseTime(): Promise<number> {
    const result = await db.query(`
      SELECT AVG(response_time) as avg_time
      FROM meta_prompt_logs
      WHERE timestamp > NOW() - INTERVAL '24 hours'
    `);
    return result.rows[0].avg_time;
  }

  private async getActiveAgentCount(): Promise<number> {
    const result = await db.query(`
      SELECT COUNT(DISTINCT agent_id) as count
      FROM agent_activity_logs
      WHERE last_active > NOW() - INTERVAL '5 minutes'
    `);
    return result.rows[0].count;
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      throw new Error("Pluso8 framework not initialized. Call initialize() first.");
    }
  }
}

// Export singleton instance
export default Pluso8.getInstance();

// Export types and interfaces
export * from "./core/agents/types";
export * from "./core/agents/services/prompting/types";
export * from "./core/agents/services/scraper/types";

// Usage example:
/*
import pluso8 from "./index";

async function main() {
  // Initialize the framework
  await pluso8.initialize({
    enabledServices: ["all"],
    logLevel: "info"
  });

  // Get services
  const metaPrompting = pluso8.getMetaPromptingService();
  const agentPrompting = pluso8.getAgentPromptingService();
  const webScraper = pluso8.getWebScrapingService();

  // Monitor system events
  pluso8.on("system:error", (error) => {
    console.error("System error:", error);
  });

  // Use meta-prompting
  const promptResult = await metaPrompting.processRequest({
    type: "generate",
    input: {
      task: "Analyze market trends",
      strategy: "chain-of-thought"
    }
  });

  // Enable agent communication
  const agentResponse = await agentPrompting.requestPrompt({
    sourceAgentId: "agent-a",
    targetAgentId: "agent-b",
    task: "Process market analysis",
    context: promptResult.prompt
  });

  // Perform web scraping
  const scrapingResult = await webScraper.scrape({
    url: "https://example.com",
    options: {
      waitForDynamic: true,
      extractData: {
        title: "h1",
        prices: ".price-list"
      }
    }
  });

  // Monitor system status
  const status = await pluso8.getSystemStatus();
  console.log("System status:", status);
}

main().catch(console.error);
*/
