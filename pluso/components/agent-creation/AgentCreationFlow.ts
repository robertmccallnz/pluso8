export type AgentCapability = 
  | 'chat'
  | 'image'
  | 'rag'
  | 'content'
  | 'code'
  | 'analysis'
  | 'workflow';

export interface AgentUseCase {
  id: string;
  name: string;
  description: string;
  capabilities: AgentCapability[];
  suggestedModels: string[];
  templates: string[];
  evaluationCriteria: string[];
}

export interface ModelConfig {
  id: string;
  name: string;
  provider: string;
  capabilities: AgentCapability[];
  contextWindow: number;
  maxTokens: number;
  costPer1kTokens: number;
  strengths: string[];
  limitations: string[];
}

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  useCase: string;
  systemPrompt: string;
  userPromptTemplate: string;
  outputFormat?: string;
  requiredContext: string[];
  suggestedParameters: Record<string, {
    type: string;
    description: string;
    default?: any;
  }>;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  description: string;
  metrics: Array<{
    name: string;
    weight: number;
    scoreRange: [number, number];
    rubric: Record<number, string>;
  }>;
  automatedTests?: Array<{
    name: string;
    testCases: Array<{
      input: string;
      expectedOutput: string;
      tolerance?: number;
    }>;
  }>;
}

export interface AgentConfig {
  id: string;
  name: string;
  description: string;
  useCase: AgentUseCase;
  model: ModelConfig;
  template: AgentTemplate;
  parameters: Record<string, any>;
  evaluationCriteria: EvaluationCriteria[];
  deploymentConfig: {
    endpoint: string;
    scalingRules: {
      minInstances: number;
      maxInstances: number;
      targetLatency: number;
    };
    caching: {
      enabled: boolean;
      ttl: number;
    };
    monitoring: {
      metrics: string[];
      alerts: Array<{
        metric: string;
        threshold: number;
        condition: 'above' | 'below';
      }>;
    };
  };
}

export const DEFAULT_USE_CASES: Record<string, AgentUseCase> = {
  chat: {
    id: 'chat',
    name: 'Conversational AI',
    description: 'Create interactive chat agents for customer service, support, or general conversation',
    capabilities: ['chat'],
    suggestedModels: ['gpt-4', 'claude-2', 'palm-2'],
    templates: ['customer-service', 'technical-support', 'sales-assistant'],
    evaluationCriteria: ['response-quality', 'conversation-flow', 'task-completion']
  },
  rag: {
    id: 'rag',
    name: 'Retrieval Augmented Generation',
    description: 'Build agents that can access and reason over large knowledge bases',
    capabilities: ['rag', 'chat'],
    suggestedModels: ['gpt-4', 'claude-2'],
    templates: ['knowledge-base', 'document-qa', 'research-assistant'],
    evaluationCriteria: ['accuracy', 'relevance', 'citation-quality']
  },
  content: {
    id: 'content',
    name: 'Content Generation',
    description: 'Create agents for generating marketing, technical, or creative content',
    capabilities: ['content'],
    suggestedModels: ['gpt-4', 'claude-2', 'palm-2'],
    templates: ['blog-writer', 'social-media', 'technical-writer'],
    evaluationCriteria: ['creativity', 'grammar', 'tone-consistency']
  },
  image: {
    id: 'image',
    name: 'Image Generation & Analysis',
    description: 'Create agents that can generate, edit, or analyze images',
    capabilities: ['image'],
    suggestedModels: ['dall-e-3', 'stable-diffusion-xl', 'midjourney'],
    templates: ['image-generator', 'image-editor', 'image-analyzer'],
    evaluationCriteria: ['image-quality', 'prompt-adherence', 'artistic-merit']
  },
  code: {
    id: 'code',
    name: 'Code Generation & Analysis',
    description: 'Build agents for code generation, review, and optimization',
    capabilities: ['code'],
    suggestedModels: ['gpt-4', 'claude-2', 'codellama'],
    templates: ['code-generator', 'code-reviewer', 'code-optimizer'],
    evaluationCriteria: ['code-quality', 'performance', 'security']
  },
  analysis: {
    id: 'analysis',
    name: 'Data Analysis & Insights',
    description: 'Create agents for analyzing data and generating insights',
    capabilities: ['analysis'],
    suggestedModels: ['gpt-4', 'claude-2'],
    templates: ['data-analyzer', 'insight-generator', 'report-writer'],
    evaluationCriteria: ['accuracy', 'insight-quality', 'visualization']
  },
  workflow: {
    id: 'workflow',
    name: 'Workflow Automation',
    description: 'Build agents that can orchestrate and automate complex workflows',
    capabilities: ['workflow'],
    suggestedModels: ['gpt-4', 'claude-2'],
    templates: ['workflow-designer', 'task-coordinator', 'process-optimizer'],
    evaluationCriteria: ['efficiency', 'reliability', 'integration']
  }
};
