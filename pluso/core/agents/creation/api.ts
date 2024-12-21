import { AgentConfig, StepData, AgentCreationResponse } from "./types.ts";

export async function initializeAgent(userId: string): Promise<AgentCreationResponse> {
  const response = await fetch('/api/agents/initialize', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to initialize agent');
  }
  
  return response.json();
}

export async function saveStepData(stepData: StepData): Promise<void> {
  const response = await fetch('/api/agents/steps/save', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(stepData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to save step data');
  }
}

export async function updateAgentConfig(config: Partial<AgentConfig>): Promise<void> {
  const response = await fetch(`/api/agents/${config.id}/update`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(config),
  });
  
  if (!response.ok) {
    throw new Error('Failed to update agent configuration');
  }
}

export async function getAgentConfig(agentId: string): Promise<AgentConfig> {
  const response = await fetch(`/api/agents/${agentId}`);
  
  if (!response.ok) {
    throw new Error('Failed to fetch agent configuration');
  }
  
  return response.json();
}

export async function completeStep(agentId: string, stepId: string): Promise<void> {
  const response = await fetch(`/api/agents/${agentId}/steps/${stepId}/complete`, {
    method: 'POST',
  });
  
  if (!response.ok) {
    throw new Error('Failed to complete step');
  }
}
