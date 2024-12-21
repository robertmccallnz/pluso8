import { Agent } from "../types/agent.ts";

export enum ServiceAgentType {
  META_PROMPT = "meta_prompt",
  AGENT_COMMUNICATION = "agent_communication",
  SCRAPER = "scraper",
  AUTONOMOUS = "autonomous",
  ENHANCEMENT_MANAGER = "enhancement_manager",
  MODEL_SEARCH = "model_search",
}

export type ServiceAgentStatus = "active" | "inactive" | "error" | "terminated";

export interface ServiceAgent extends Agent {
  id: string;
  type: ServiceAgentType;
  status: ServiceAgentStatus;
  lastHeartbeat: Date;
  metrics: {
    [key: string]: number;
    requestsHandled: number;
    successRate: number;
    averageResponseTime: number;
  };
  start?: () => Promise<void>;
  metaPromptingService?: MetaPromptingService;
}

export interface ServiceRegistry {
  initialize(): Promise<void>;
  registerAgent(agent: ServiceAgent): Promise<void>;
  deregisterAgent(agentId: string): Promise<void>;
  getAgent(type: ServiceAgentType): Promise<ServiceAgent | null>;
  updateStatus(agentId: string, status: ServiceAgentStatus): Promise<void>;
}

export interface AgentPromptRequest {
  sourceAgentId: string;
  targetAgentId: string;
  task: string;
  metadata: {
    timestamp: Date;
    priority: "high" | "medium" | "low";
    domain?: string;
  };
}

export interface AgentPromptResponse {
  success: boolean;
  result?: string;
  error?: string;
  metadata: {
    processingTime: number;
    optimizationAttempts: number;
    qualityScore: number;
  };
}

export interface MetaPromptRequest {
  type: "generate" | "optimize" | "evaluate";
  input: {
    task: string;
    context?: string;
    examples?: Array<{
      input: Record<string, any>;
      output: string;
    }>;
    constraints?: string[];
    targetModel?: string;
    strategy?: string;
  };
}

export interface MetaPromptResponse {
  success: boolean;
  prompt?: string;
  evaluation?: {
    score: number;
    feedback: string;
    suggestions: string[];
  };
  error?: string;
  metadata: {
    processingTime: number;
    strategy: string;
    optimizationAttempts: number;
  };
  timestamp: Date;
}

export interface BrowserFingerprint {
  userAgent: string;
  platform: string;
  vendor: string;
}

export interface MetaPromptingService {
  // Add properties and methods for MetaPromptingService as needed
}
