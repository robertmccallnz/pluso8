import { ServiceAgent, ServiceAgentType } from "../types.ts";

export enum BusinessDomain {
  SALES = "sales",
  MARKETING = "marketing",
  CUSTOMER_SERVICE = "customer_service",
  OPERATIONS = "operations",
  FINANCE = "finance",
  HR = "hr",
}

export enum AgentCapability {
  EMAIL = "email",
  CALENDAR = "calendar",
  CRM = "crm",
  NOTIFICATION = "notification",
  ANALYTICS = "analytics",
  AUTOMATION = "automation",
  INTEGRATION = "integration",
  LEARNING = "learning",
}

export interface AgentEvolutionMetrics {
  useFrequency: number;
  successRate: number;
  responseTime: number;
  userSatisfaction: number;
  complexityScore: number;
  adaptabilityScore: number;
}

export interface AgentBlueprint {
  name: string;
  type: ServiceAgentType;
  domain: BusinessDomain;
  capabilities: AgentCapability[];
  triggers: TriggerDefinition[];
  dependencies: ServiceAgentType[];
  learningObjectives: string[];
}

export interface TriggerDefinition {
  event: string;
  source: string;
  conditions: string[];
  actions: string[];
  priority: number;
  domain: BusinessDomain;
}

export interface AgentLearningData {
  successfulPatterns: Map<string, number>;
  failurePatterns: Map<string, number>;
  userFeedback: FeedbackEntry[];
  adaptations: AdaptationRecord[];
}

export interface FeedbackEntry {
  timestamp: Date;
  context: string;
  rating: number;
  comments: string;
}

export interface AdaptationRecord {
  timestamp: Date;
  trigger: string;
  change: string;
  outcome: string;
  successMetric: number;
}

export interface AgentFactory {
  createAgent(blueprint: AgentBlueprint): Promise<ServiceAgent>;
  evolveAgent(agent: ServiceAgent, metrics: AgentEvolutionMetrics): Promise<ServiceAgent>;
  mergeAgents(agents: ServiceAgent[]): Promise<ServiceAgent>;
}

export interface EcosystemManager {
  monitorHealth(): Promise<void>;
  optimizeResources(): Promise<void>;
  evolveEcosystem(): Promise<void>;
  handleEmergingNeeds(): Promise<void>;
}
