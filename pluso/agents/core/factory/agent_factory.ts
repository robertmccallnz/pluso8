import { AgentConfig } from "../../types/agent.ts";
import { AGENT_TEMPLATES, AgentTemplate } from "../templates/agent_templates.ts";
import { BaseAgent } from "../base/base.ts";
import { MetricsEnabledAgent } from "../base/template_agent.ts";
import { AgentConfigValidator } from "../../utils/validator.ts";

export interface AgentCreationParams {
  templateId: string;
  name: string;
  description?: string;
  customConfig?: Partial<AgentConfig>;
  variables?: Record<string, string>;
  evaluationEnabled?: boolean;
  metricsEnabled?: boolean;
}

export class AgentFactory {
  private static instance: AgentFactory;

  private constructor() {}

  static getInstance(): AgentFactory {
    if (!this.instance) {
      this.instance = new AgentFactory();
    }
    return this.instance;
  }

  async createAgent(params: AgentCreationParams): Promise<BaseAgent> {
    // 1. Get and validate template
    const template = this.getTemplate(params.templateId);
    if (!template) {
      throw new Error(`Template ${params.templateId} not found`);
    }

    // 2. Merge configurations
    const config = this.mergeConfigurations(template, params);

    // 3. Process template variables
    config.systemPrompt = this.processTemplateVariables(
      template.systemPromptTemplate,
      params.variables || {}
    );

    // 4. Validate final configuration
    await AgentConfigValidator.validate(config);

    // 5. Create appropriate agent instance
    return this.instantiateAgent(config, params);
  }

  private getTemplate(templateId: string): AgentTemplate | undefined {
    return AGENT_TEMPLATES[templateId];
  }

  private mergeConfigurations(
    template: AgentTemplate,
    params: AgentCreationParams
  ): AgentConfig {
    return {
      id: crypto.randomUUID(),
      name: params.name,
      description: params.description || template.description,
      type: template.type,
      industry: template.industry,
      ...template.defaultConfig,
      ...params.customConfig,
      features: template.features,
      tools: template.requiredTools,
      evaluations: {
        enabled: params.evaluationEnabled ?? false,
        criteria: template.evaluationCriteria,
        testCases: template.sampleTestCases
      },
      metrics: {
        enabled: params.metricsEnabled ?? true
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }

  private processTemplateVariables(
    template: string,
    variables: Record<string, string>
  ): string {
    let processedTemplate = template;
    for (const [key, value] of Object.entries(variables)) {
      processedTemplate = processedTemplate.replace(
        new RegExp(`{${key}}`, "g"),
        value
      );
    }
    return processedTemplate;
  }

  private instantiateAgent(
    config: AgentConfig,
    params: AgentCreationParams
  ): BaseAgent {
    if (params.metricsEnabled) {
      return new MetricsEnabledAgent(config);
    }

    // Use appropriate agent implementation based on config
    switch (config.type) {
      default:
        return new BaseAgent(config.id, config);
    }
  }

  getAvailableTemplates(): Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    industry: string;
  }> {
    return Object.values(AGENT_TEMPLATES).map(template => ({
      id: template.id,
      name: template.name,
      description: template.description,
      type: template.type,
      industry: template.industry
    }));
  }

  getTemplateDetails(templateId: string): AgentTemplate | undefined {
    return this.getTemplate(templateId);
  }
}
