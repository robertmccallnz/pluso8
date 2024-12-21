export interface AgentConfig {
  id: string;
  name: string;
  description?: string;
  model: string;
  useCase: string;
  template?: string;
  systemPrompt: string;
  evaluationCriteria?: string[];
  metadata?: Record<string, unknown>;
  permissions?: {
    read: boolean;
    write: boolean;
    deploy: boolean;
    manage: boolean;
  };
  status?: "draft" | "active" | "inactive" | "archived";
  version?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgentDeploymentConfig extends AgentConfig {
  deploymentId?: string;
  environment?: "development" | "staging" | "production";
  resources?: {
    memory?: string;
    cpu?: string;
    storage?: string;
  };
  scaling?: {
    minInstances?: number;
    maxInstances?: number;
    targetConcurrency?: number;
  };
}

export interface AgentResponse {
  id: string;
  content: string;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
