interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  agents: {
    role: string;
    name: string;
    description: string;
    capabilities: string[];
    systemPrompt: string;
    parameters: Record<string, any>;
  }[];
  workflow: {
    type: string;
    steps: {
      id: string;
      type: string;
      config: any;
    }[];
  };
  evaluationCriteria: {
    metric: string;
    threshold: number;
    weight: number;
  }[];
}

export const AGENT_TEMPLATES: Record<string, AgentTemplate> = {
  customerService: {
    id: 'customer_service',
    name: 'Customer Service Assistant',
    description: 'Handle customer inquiries and support tickets',
    category: 'Support',
    difficulty: 'beginner',
    agents: [
      {
        role: 'primary',
        name: 'Support Agent',
        description: 'Handles initial customer contact',
        capabilities: ['conversation', 'sentiment_analysis', 'ticket_management'],
        systemPrompt: 'You are a helpful customer service agent...',
        parameters: {
          temperature: 0.7,
          maxTokens: 150
        }
      },
      {
        role: 'specialist',
        name: 'Technical Specialist',
        description: 'Handles technical issues',
        capabilities: ['technical_support', 'troubleshooting'],
        systemPrompt: 'You are a technical specialist...',
        parameters: {
          temperature: 0.4,
          maxTokens: 200
        }
      }
    ],
    workflow: {
      type: 'sequential',
      steps: [
        {
          id: 'initial_contact',
          type: 'conversation',
          config: { maxTurns: 3 }
        },
        {
          id: 'issue_classification',
          type: 'analysis',
          config: { categories: ['technical', 'billing', 'general'] }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'response_time', threshold: 30, weight: 0.3 },
      { metric: 'customer_satisfaction', threshold: 0.8, weight: 0.4 },
      { metric: 'resolution_rate', threshold: 0.9, weight: 0.3 }
    ]
  },

  contentCreation: {
    id: 'content_creation',
    name: 'Content Creation Suite',
    description: 'Generate and optimize content for various platforms',
    category: 'Marketing',
    difficulty: 'intermediate',
    agents: [
      {
        role: 'writer',
        name: 'Content Writer',
        description: 'Generates initial content',
        capabilities: ['content_generation', 'research'],
        systemPrompt: 'You are a creative content writer...',
        parameters: {
          temperature: 0.8,
          maxTokens: 500
        }
      },
      {
        role: 'editor',
        name: 'Content Editor',
        description: 'Reviews and optimizes content',
        capabilities: ['editing', 'seo_optimization'],
        systemPrompt: 'You are a detail-oriented editor...',
        parameters: {
          temperature: 0.3,
          maxTokens: 200
        }
      }
    ],
    workflow: {
      type: 'pipeline',
      steps: [
        {
          id: 'research',
          type: 'research',
          config: { sources: ['web', 'academic', 'news'] }
        },
        {
          id: 'writing',
          type: 'generation',
          config: { formats: ['blog', 'social', 'email'] }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'originality', threshold: 0.8, weight: 0.4 },
      { metric: 'engagement_potential', threshold: 0.7, weight: 0.3 },
      { metric: 'seo_score', threshold: 0.8, weight: 0.3 }
    ]
  },

  dataAnalysis: {
    id: 'data_analysis',
    name: 'Data Analysis Pipeline',
    description: 'Analyze data and generate insights',
    category: 'Analytics',
    difficulty: 'advanced',
    agents: [
      {
        role: 'analyst',
        name: 'Data Analyst',
        description: 'Processes and analyzes data',
        capabilities: ['data_analysis', 'statistics', 'visualization'],
        systemPrompt: 'You are a data analyst...',
        parameters: {
          temperature: 0.2,
          maxTokens: 300
        }
      },
      {
        role: 'reporter',
        name: 'Insights Reporter',
        description: 'Generates reports and recommendations',
        capabilities: ['report_generation', 'visualization'],
        systemPrompt: 'You are an insights reporter...',
        parameters: {
          temperature: 0.6,
          maxTokens: 400
        }
      }
    ],
    workflow: {
      type: 'parallel',
      steps: [
        {
          id: 'data_processing',
          type: 'analysis',
          config: { methods: ['statistical', 'ml'] }
        },
        {
          id: 'visualization',
          type: 'visualization',
          config: { types: ['charts', 'graphs', 'tables'] }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'accuracy', threshold: 0.95, weight: 0.4 },
      { metric: 'insight_quality', threshold: 0.8, weight: 0.3 },
      { metric: 'report_clarity', threshold: 0.9, weight: 0.3 }
    ]
  },

  researchAssistant: {
    id: 'research_assistant',
    name: 'Research Assistant Team',
    description: 'Conduct research and synthesize findings',
    category: 'Research',
    difficulty: 'advanced',
    agents: [
      {
        role: 'researcher',
        name: 'Research Agent',
        description: 'Conducts primary research',
        capabilities: ['research', 'data_collection', 'analysis'],
        systemPrompt: 'You are a thorough researcher...',
        parameters: {
          temperature: 0.4,
          maxTokens: 500
        }
      },
      {
        role: 'synthesizer',
        name: 'Research Synthesizer',
        description: 'Synthesizes research findings',
        capabilities: ['summarization', 'insight_generation'],
        systemPrompt: 'You are a research synthesizer...',
        parameters: {
          temperature: 0.6,
          maxTokens: 400
        }
      }
    ],
    workflow: {
      type: 'iterative',
      steps: [
        {
          id: 'research',
          type: 'research',
          config: { depth: 'comprehensive' }
        },
        {
          id: 'synthesis',
          type: 'synthesis',
          config: { format: 'academic' }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'research_depth', threshold: 0.9, weight: 0.4 },
      { metric: 'synthesis_quality', threshold: 0.85, weight: 0.3 },
      { metric: 'citation_accuracy', threshold: 0.95, weight: 0.3 }
    ]
  },

  codeAssistant: {
    id: 'code_assistant',
    name: 'Code Development Team',
    description: 'Assist with code development and review',
    category: 'Development',
    difficulty: 'advanced',
    agents: [
      {
        role: 'developer',
        name: 'Code Generator',
        description: 'Generates and modifies code',
        capabilities: ['code_generation', 'debugging'],
        systemPrompt: 'You are a skilled programmer...',
        parameters: {
          temperature: 0.3,
          maxTokens: 500
        }
      },
      {
        role: 'reviewer',
        name: 'Code Reviewer',
        description: 'Reviews and optimizes code',
        capabilities: ['code_review', 'optimization'],
        systemPrompt: 'You are a thorough code reviewer...',
        parameters: {
          temperature: 0.2,
          maxTokens: 300
        }
      }
    ],
    workflow: {
      type: 'iterative',
      steps: [
        {
          id: 'development',
          type: 'coding',
          config: { style: 'clean', documentation: true }
        },
        {
          id: 'review',
          type: 'review',
          config: { checks: ['style', 'security', 'performance'] }
        }
      ]
    },
    evaluationCriteria: [
      { metric: 'code_quality', threshold: 0.9, weight: 0.4 },
      { metric: 'test_coverage', threshold: 0.8, weight: 0.3 },
      { metric: 'performance_score', threshold: 0.85, weight: 0.3 }
    ]
  }
};
