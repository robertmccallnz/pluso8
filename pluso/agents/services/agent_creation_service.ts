import { AgentFactory, AgentCreationParams } from "../core/factory/agent_factory.ts";
import { BaseAgent } from "../core/base/base.ts";
import { AgentStore } from "./agent_store.ts";
import { MetricsCollector } from "../monitoring/metrics.ts";

export class AgentCreationService {
  private factory: AgentFactory;
  private store: AgentStore;
  private metrics: MetricsCollector;

  constructor() {
    this.factory = AgentFactory.getInstance();
    this.store = new AgentStore();
    this.metrics = MetricsCollector.getInstance();
  }

  async createAgent(params: AgentCreationParams): Promise<BaseAgent> {
    const startTime = Date.now();
    
    try {
      // 1. Create agent using factory
      const agent = await this.factory.createAgent(params);
      
      // 2. Store agent configuration
      await this.store.saveAgent(agent.getConfig());
      
      // 3. Initialize agent resources
      await this.initializeAgentResources(agent);
      
      // 4. Record metrics
      this.metrics.recordEvent("agent_created", {
        templateId: params.templateId,
        agentType: agent.getConfig().type,
        creationTime: Date.now() - startTime
      });
      
      return agent;
    } catch (error) {
      this.metrics.recordEvent("agent_creation_failed", {
        templateId: params.templateId,
        error: error.message
      });
      throw error;
    }
  }

  private async initializeAgentResources(agent: BaseAgent): Promise<void> {
    const config = agent.getConfig();
    
    // Initialize required tools
    if (config.tools) {
      for (const tool of config.tools) {
        await this.initializeTool(tool, config.id);
      }
    }
    
    // Set up evaluation if enabled
    if (config.evaluations?.enabled) {
      await this.setupEvaluation(config);
    }
    
    // Configure metrics collection
    if (config.metrics?.enabled) {
      await this.setupMetrics(config);
    }
  }

  private async initializeTool(tool: string, agentId: string): Promise<void> {
    // Initialize tool-specific resources and configurations
    // This could include setting up API keys, connecting to services, etc.
    this.metrics.recordEvent("tool_initialized", {
      toolId: tool,
      agentId
    });
  }

  private async setupEvaluation(config: any): Promise<void> {
    // Set up evaluation criteria and test cases
    this.metrics.recordEvent("evaluation_setup", {
      agentId: config.id,
      criteriaCount: config.evaluations.criteria.length,
      testCaseCount: config.evaluations.testCases.length
    });
  }

  private async setupMetrics(config: any): Promise<void> {
    // Configure metrics collection for the agent
    this.metrics.createAgentMetrics(config.id, {
      type: config.type,
      industry: config.industry
    });
  }

  getAvailableTemplates() {
    return this.factory.getAvailableTemplates();
  }

  getTemplateDetails(templateId: string) {
    return this.factory.getTemplateDetails(templateId);
  }
}
