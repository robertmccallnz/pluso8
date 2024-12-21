import { BusinessDomain } from "../ecosystem/types.ts";

export interface ArchitectureComponent {
  id: string;
  name: string;
  type: "service" | "database" | "queue" | "cache" | "api" | "ui" | "ml";
  dependencies: string[];
  metrics: ComponentMetrics;
  status: "active" | "degraded" | "inactive";
  lastUpdated: Date;
}

export interface ComponentMetrics {
  performance: {
    latency: number;
    throughput: number;
    errorRate: number;
  };
  usage: {
    requestCount: number;
    activeUsers: number;
    resourceUtilization: number;
  };
  health: {
    uptime: number;
    lastIncident: Date | null;
    mttr: number; // Mean Time To Recovery
  };
}

export interface ArchitecturePattern {
  id: string;
  name: string;
  description: string;
  applicability: string[];
  benefits: string[];
  tradeoffs: string[];
  implementation: string;
  examples: string[];
}

export interface ArchitectureInsight {
  id: string;
  type: "performance" | "security" | "scalability" | "reliability" | "cost";
  severity: "low" | "medium" | "high" | "critical";
  description: string;
  recommendation: string;
  impact: string;
  effort: string;
  automaticResolution: boolean;
}

export interface MLArchitectureModel {
  id: string;
  name: string;
  type: MLModelType;
  purpose: string;
  framework: string;
  metrics: ModelMetrics;
  status: "training" | "deployed" | "deprecated";
}

export enum MLModelType {
  ARCHITECTURE_ANALYSIS = "architecture_analysis",
  PATTERN_RECOGNITION = "pattern_recognition",
  ANOMALY_DETECTION = "anomaly_detection",
  PERFORMANCE_PREDICTION = "performance_prediction",
  DEPENDENCY_ANALYSIS = "dependency_analysis",
  RESOURCE_OPTIMIZATION = "resource_optimization"
}

export interface ModelMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  trainingTime: number;
  lastTrainingDate: Date;
}

export interface ArchitectureEvent {
  id: string;
  timestamp: Date;
  type: "component_added" | "component_removed" | "pattern_detected" | "insight_generated" | "optimization_applied";
  details: Record<string, unknown>;
  impact: "none" | "low" | "medium" | "high";
}

export interface OptimizationPlan {
  id: string;
  targetComponent: string;
  type: "performance" | "security" | "scalability" | "reliability" | "cost";
  changes: ArchitectureChange[];
  expectedImpact: {
    metrics: string[];
    improvement: number;
  };
  risks: string[];
  rollbackPlan: string;
}

export interface ArchitectureChange {
  id: string;
  type: "add" | "remove" | "modify" | "optimize";
  component: string;
  description: string;
  implementation: string;
  validation: string[];
}

export interface ArchitectureSnapshot {
  id: string;
  timestamp: Date;
  components: ArchitectureComponent[];
  metrics: SystemMetrics;
  insights: ArchitectureInsight[];
  changes: ArchitectureChange[];
}

export interface SystemMetrics {
  overall: {
    health: number;
    performance: number;
    reliability: number;
    security: number;
    cost: number;
  };
  trends: {
    daily: MetricTrend[];
    weekly: MetricTrend[];
    monthly: MetricTrend[];
  };
}

export interface MetricTrend {
  metric: string;
  values: number[];
  timestamps: Date[];
  trend: "increasing" | "decreasing" | "stable";
}
