import { AgentConfig } from "../../islands/AgentCreation/types.ts";

export const TEST_AGENT_DATA: Partial<AgentConfig> = {
  useCase: "customer_service",
  provider: "openai",
  model: "gpt-4",
  maxTokens: 8192,
  template: "customer_service",
  systemPrompt: "You are a helpful customer service agent...",
  name: "Test Agent",
  description: "A test agent for customer service",
  temperature: 0.7,
  evaluationCriteria: ["response_accuracy", "response_time", "context_awareness"],
  testResults: {
    messageCount: 2,
    lastTestTimestamp: Date.now(),
    passed: true
  }
};

export const STEP_VALIDATION = {
  useCaseStep: (data: Partial<AgentConfig>) => !!data.useCase,
  
  modelStep: (data: Partial<AgentConfig>) => 
    !!data.model && !!data.provider,
  
  templateStep: (data: Partial<AgentConfig>) => 
    !!data.template,
  
  configStep: (data: Partial<AgentConfig>) => 
    !!data.name && 
    data.name.length >= 3 && 
    !!data.description && 
    data.description.length >= 10 &&
    !!data.systemPrompt,
  
  evaluationStep: (data: Partial<AgentConfig>) => 
    data.evaluationCriteria?.includes("response_accuracy") &&
    data.evaluationCriteria?.includes("response_time"),
  
  testStep: (data: Partial<AgentConfig>) => 
    data.testResults?.passed || true,
  
  deployStep: (data: Partial<AgentConfig>) => true
};
