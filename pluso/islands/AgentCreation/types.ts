export interface AgentConfig {
  id?: string;
  userId: string;
  mode?: "assistant" | "agent";
  industry?: string;
  type?: string;
  yaml?: string;
  model?: string;
  status: "draft" | "configuring" | "complete";
  createdAt: string;
  updatedAt: string;
  currentStep: number;
}

export interface StepData {
  stepId: string;
  agentId: string;
  userId: string;
  data: Record<string, any>;
  completedAt?: string;
}

export interface AgentCreationResponse {
  agentId: string;
  status: string;
  step: number;
}
