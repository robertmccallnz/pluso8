import { BusinessDomain } from "../ecosystem/types.ts";

export enum BusinessDomain {
  ALL = "all",
  FINANCE = "finance",
  HEALTHCARE = "healthcare",
  EDUCATION = "education",
  ECOMMERCE = "ecommerce",
  SOCIAL = "social"
}

export interface WireframeQuestion {
  id: string;
  sessionId: string;
  question: string;
  domain: BusinessDomain;
  status: "pending" | "processing" | "completed" | "error";
  answer?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WireframeResponse {
  questionId: string;
  value: string | number | boolean;
  timestamp: Date;
}

export interface WireframeSession {
  id: string;
  userId: string;
  responses: WireframeResponse[];
  status: "in_progress" | "completed" | "abandoned";
  startedAt: Date;
  completedAt?: Date;
  domain: BusinessDomain;
  status: "active" | "completed" | "error";
  createdAt: Date;
  updatedAt: Date;
}

export interface AgentWireframe {
  id: string;
  name: string;
  description: string;
  domain: BusinessDomain;
  capabilities: string[];
  integrations: string[];
  mlCapabilities: MLCapability[];
  securityLevel: "basic" | "enhanced" | "enterprise";
  uiComponents: UIComponent[];
  routes: RouteDefinition[];
  dataModel: DataModelDefinition;
  mlModels: MLModelConfig[];
}

export interface MLCapability {
  type: MLModelType;
  purpose: string;
  requiredData: string[];
  expectedOutcome: string;
  metrics: string[];
}

export enum MLModelType {
  CLASSIFICATION = "classification",
  REGRESSION = "regression",
  CLUSTERING = "clustering",
  NLP = "nlp",
  COMPUTER_VISION = "computer_vision",
  RECOMMENDATION = "recommendation",
  ANOMALY_DETECTION = "anomaly_detection",
  REINFORCEMENT_LEARNING = "reinforcement_learning"
}

export interface MLModelConfig {
  type: MLModelType;
  framework: "tensorflow" | "pytorch" | "scikit-learn" | "huggingface";
  modelName: string;
  parameters: Record<string, unknown>;
  trainingConfig: {
    epochs: number;
    batchSize: number;
    optimizer: string;
    learningRate: number;
  };
}

export interface MLModel {
  id: string;
  type: MLModelType;
  name: string;
  version: string;
  accuracy: number;
  latency: number;
  memoryUsage: number;
}

export interface UIComponent {
  type: string;
  name: string;
  props: Record<string, unknown>;
  children?: UIComponent[];
  layout: {
    grid: string;
    responsive: boolean;
  };
}

export interface WireframeComponent {
  id: string;
  type: string;
  name: string;
  properties: Record<string, unknown>;
  children?: WireframeComponent[];
}

export interface RouteDefinition {
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  handler: string;
  middleware: string[];
  authentication: boolean;
  rateLimit?: {
    requests: number;
    period: string;
  };
}

export interface WireframeRoute {
  id: string;
  path: string;
  method: string;
  handler: string;
  middleware: string[];
}

export interface DataModelDefinition {
  entities: {
    name: string;
    fields: {
      name: string;
      type: string;
      required: boolean;
      validation?: string;
    }[];
    relationships: {
      type: "one_to_one" | "one_to_many" | "many_to_many";
      with: string;
      through?: string;
    }[];
  }[];
}

export interface Wireframe {
  id: string;
  domain: BusinessDomain;
  mlModels: MLModel[];
  dataSources: string[];
  components: WireframeComponent[];
  routes: WireframeRoute[];
  createdAt: Date;
  updatedAt: Date;
}
