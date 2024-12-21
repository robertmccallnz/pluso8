export interface Agent {
  id: string;
  type: string;
  status: "active" | "inactive" | "error";
}

export interface ServiceAgent extends Agent {
  // Service-specific methods and properties
  initialize?(): Promise<void>;
  start?(): Promise<void>;
  stop?(): Promise<void>;
  getStatus?(): Promise<Record<string, unknown>>;
}

export interface TaskAgent extends Agent {
  // Task-specific methods and properties
  execute(task: any): Promise<any>;
  cancel(): Promise<void>;
  getProgress(): Promise<number>;
}

export interface MonitorAgent extends Agent {
  // Monitoring-specific methods and properties
  startMonitoring(): Promise<void>;
  stopMonitoring(): Promise<void>;
  getMetrics(): Promise<Record<string, number>>;
}

export interface AgentConfig {
  id?: string;
  type: string;
  settings: Record<string, unknown>;
  capabilities?: string[];
  dependencies?: string[];
}

export interface AgentState {
  status: "active" | "inactive" | "error";
  lastActive: Date;
  metrics: Record<string, number>;
  errors?: string[];
}

export interface AgentEvent {
  type: string;
  agent: string;
  data: unknown;
  timestamp: Date;
}
