import { AgentConfig, AgentType, AgentIndustry } from "../../types/agent.ts";
import { ModelProvider } from "../../types/models.ts";
import { WEB_TOOLS } from "../../config/tools.ts";

export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  type: AgentType;
  industry: AgentIndustry;
  defaultConfig: Partial<AgentConfig>;
  systemPromptTemplate: string;
  features: string[];
  requiredTools: string[];
  suggestedModels: Array<{
    provider: ModelProvider;
    modelId: string;
    description: string;
    recommended: boolean;
  }>;
  evaluationCriteria: Array<{
    name: string;
    description: string;
    weight: number;
  }>;
  sampleTestCases: Array<{
    input: string;
    expectedOutput: string;
    description: string;
  }>;
}

export const AGENT_TEMPLATES: Record<string, AgentTemplate> = {
  "CUSTOMER_SERVICE": {
    id: "CUSTOMER_SERVICE",
    name: "Customer Service Agent",
    description: "A helpful agent designed to handle customer inquiries and support requests",
    type: "support",
    industry: "general",
    defaultConfig: {
      temperature: 0.7,
      maxTokens: 2000,
      contextWindow: 4000,
      responseFormat: "markdown",
    },
    systemPromptTemplate: `You are a helpful customer service agent for {company_name}.
Your main responsibilities:
- Answer customer questions about {product_line}
- Handle support requests professionally
- Maintain a friendly and helpful tone
- Escalate complex issues when necessary

Company Values:
{company_values}

Guidelines:
- Always be polite and professional
- Use clear and simple language
- Show empathy towards customer concerns
- Follow up to ensure customer satisfaction`,
    features: [
      "ticket_management",
      "knowledge_base_integration",
      "sentiment_analysis",
      "multilingual_support"
    ],
    requiredTools: [
      "ticket_system",
      "knowledge_base",
      "translation"
    ],
    suggestedModels: [
      {
        provider: "anthropic",
        modelId: "claude-2.1",
        description: "Best for complex support scenarios",
        recommended: true
      },
      {
        provider: "openai",
        modelId: "gpt-4",
        description: "Good balance of performance and cost",
        recommended: false
      }
    ],
    evaluationCriteria: [
      {
        name: "response_accuracy",
        description: "Accuracy of information provided",
        weight: 0.3
      },
      {
        name: "tone_appropriateness",
        description: "Professional and empathetic tone",
        weight: 0.2
      },
      {
        name: "problem_resolution",
        description: "Effectiveness in resolving issues",
        weight: 0.3
      },
      {
        name: "response_time",
        description: "Speed of response",
        weight: 0.2
      }
    ],
    sampleTestCases: [
      {
        input: "I haven't received my order yet. Order #12345",
        expectedOutput: "I apologize for the delay with your order #12345. Let me check the status for you right away...",
        description: "Order status inquiry"
      },
      {
        input: "Your product is defective and I want a refund!",
        expectedOutput: "I'm very sorry to hear about the issues with your product. I understand your frustration...",
        description: "Angry customer handling"
      }
    ]
  },
  "TECHNICAL_ASSISTANT": {
    id: "TECHNICAL_ASSISTANT",
    name: "Technical Assistant",
    description: "An expert agent for technical support and programming assistance",
    type: "technical",
    industry: "technology",
    defaultConfig: {
      temperature: 0.3,
      maxTokens: 4000,
      contextWindow: 8000,
      responseFormat: "markdown",
    },
    systemPromptTemplate: `You are a technical assistant specializing in {technology_stack}.
Your expertise includes:
{expertise_areas}

Your responsibilities:
- Provide accurate technical guidance
- Debug code issues
- Explain complex concepts clearly
- Suggest best practices and optimizations

Guidelines:
- Use precise technical terminology
- Include code examples when relevant
- Reference documentation when appropriate
- Consider performance implications`,
    features: [
      "code_analysis",
      "debugging",
      "documentation_search",
      "performance_optimization"
    ],
    requiredTools: [
      "code_parser",
      "linter",
      "documentation_search",
      "git_integration"
    ],
    suggestedModels: [
      {
        provider: "anthropic",
        modelId: "claude-2.1",
        description: "Excellent for technical tasks and code understanding",
        recommended: true
      },
      {
        provider: "openai",
        modelId: "gpt-4",
        description: "Strong technical capabilities",
        recommended: true
      }
    ],
    evaluationCriteria: [
      {
        name: "technical_accuracy",
        description: "Accuracy of technical information",
        weight: 0.4
      },
      {
        name: "code_quality",
        description: "Quality of code suggestions",
        weight: 0.3
      },
      {
        name: "explanation_clarity",
        description: "Clarity of technical explanations",
        weight: 0.2
      },
      {
        name: "best_practices",
        description: "Adherence to best practices",
        weight: 0.1
      }
    ],
    sampleTestCases: [
      {
        input: "How do I implement error handling in async/await functions?",
        expectedOutput: "Here's how to implement proper error handling in async/await functions...",
        description: "Technical concept explanation"
      },
      {
        input: "Debug this code: [code snippet with error]",
        expectedOutput: "I've identified the issue in your code...",
        description: "Code debugging"
      }
    ]
  },
  "TECH_ASSISTANT": {
    id: "TECH_ASSISTANT",
    name: "Technical Assistant",
    description: "A technical assistant with web automation capabilities",
    type: "assistant",
    industry: "technology",
    defaultConfig: {
      temperature: 0.7,
      maxTokens: 2000,
      contextWindow: 4000,
      responseFormat: "markdown",
    },
    systemPromptTemplate: `You are a technical assistant with powerful web automation capabilities.
Your main responsibilities:
- Help users with technical tasks
- Automate web-based workflows
- Analyze websites and web applications
- Generate reports and documentation

Guidelines:
1. Always confirm understanding before executing tasks
2. Provide clear explanations of your actions
3. Handle errors gracefully
4. Suggest improvements when possible`,
    features: [
      "web_automation",
      "code_analysis",
      "documentation",
      "performance_monitoring"
    ],
    requiredTools: [
      WEB_TOOLS.SCREENSHOT.id,
      WEB_TOOLS.PDF_GENERATOR.id,
      WEB_TOOLS.CONTENT_SCRAPER.id,
      WEB_TOOLS.SEO_ANALYZER.id,
      WEB_TOOLS.FORM_FILLER.id,
      WEB_TOOLS.SITE_MONITOR.id
    ],
    suggestedModels: [
      {
        provider: "anthropic",
        modelId: "claude-2.1",
        description: "Best for complex technical tasks and web automation",
        recommended: true
      }
    ],
    evaluationCriteria: [
      {
        name: "Technical Accuracy",
        description: "Accuracy of technical information and automation tasks",
        weight: 0.4
      },
      {
        name: "Task Completion",
        description: "Successfully completing requested automation tasks",
        weight: 0.3
      },
      {
        name: "Error Handling",
        description: "Gracefully handling errors and edge cases",
        weight: 0.3
      }
    ],
    sampleTestCases: [
      {
        input: "Take a screenshot of example.com",
        expectedOutput: "Successfully captured and saved screenshot",
        description: "Basic web automation task"
      },
      {
        input: "Analyze the SEO of my website",
        expectedOutput: "Detailed SEO analysis report",
        description: "Website analysis task"
      }
    ]
  }
};
