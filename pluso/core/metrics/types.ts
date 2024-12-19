// core/metrics/types.ts

// Base Metric Types
export interface MetricData {
  current: number;
  min: number;
  max: number;
  avg: number;
  history: number[];
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export interface StageMetrics {
  count: number;
  totalTime: number;
  avgTime: number;
  memoryUsage: {
    start: number;
    peak: number;
    end: number;
  };
  timestamps: {
    start: number;
    end: number;
  };
}

export interface SystemMetrics {
  cpu: {
    usage: number;
    loadAverage: number[];
    cores: number;
  };
  memory: {
    heapUsed: number;
    heapTotal: number;
    external: number;
    rss: number;
    usagePercentage: number;
  };
  latency: {
    current: number;
    avg: number;
    peak: number;
  };
  network?: {
    bytesReceived: number;
    bytesSent: number;
    activeConnections: number;
  };
  process: {
    uptime: number;
    pid: number;
  };
  timestamp: number;
}

// Threshold and Alert Types
export interface MetricThreshold {
  value: number;
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  duration?: number;
  severity: 'info' | 'warning' | 'critical';
}

export interface MetricAlert {
  id: string;
  metricName: string;
  threshold: MetricThreshold;
  value: number;
  timestamp: number;
  resolved?: boolean;
  resolvedAt?: number;
}

// History and Aggregation Types
export interface MetricHistoryOptions {
  startTime?: number;
  endTime?: number;
  limit?: number;
  aggregation?: 'raw' | 'hourly' | 'daily';
}

export type MetricValue = number | string | boolean | object;

export interface MetricBatch {
  metrics: Record<string, MetricValue>;
  timestamp: number;
  tags?: Record<string, string>;
}

export interface AggregatedMetrics {
  period: 'hourly' | 'daily' | 'weekly';
  startTime: number;
  endTime: number;
  metrics: Record<string, {
    min: number;
    max: number;
    avg: number;
    count: number;
    sum: number;
  }>;
}

// Registry Types
export interface MetricDefinition {
  name: string;
  type: 'gauge' | 'counter' | 'histogram';
  description: string;
  unit?: string;
  thresholds?: MetricThreshold[];
  tags?: string[];
}

export interface MetricsRegistry {
  definitions: Record<string, MetricDefinition>;
  lastUpdated: number;
}

// Agent Specific Metrics
export interface AgentMetrics {
  id: string;
  name: string;
  recorded_at: string;
  metrics: {
    conversations: {
      total: number;
      active: number;
      completed: number;
      avgDuration: number;
      responseTime: {
        avg: number;
        min: number;
        max: number;
      };
    };
    performance: {
      memoryUsage: number;
      cpuUsage: number;
      latency: number;
      errorRate: number;
      successRate: number;
    };
    knowledge: {
      totalTokens: number;
      uniqueTopics: number;
      contextSize: number;
      embeddingCount: number;
    };
    interaction: {
      userSatisfaction: number;
      clarificationRequests: number;
      accuracyScore: number;
      engagementLevel: number;
    };
    timestamps: {
      created: number;
      lastActive: number;
      lastError: number;
    };
  };
}

// Visualization Types
export interface MetricVisualization {
  type: 'line' | 'bar' | 'gauge' | 'area' | 'scatter' | 'heatmap';
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      color?: string;
      borderColor?: string;
      backgroundColor?: string;
    }>;
  };
  options: {
    timeRange?: 'hour' | 'day' | 'week' | 'month';
    aggregation?: 'sum' | 'avg' | 'min' | 'max';
    refreshRate?: number;
    annotations?: Array<{
      type: 'line' | 'point' | 'box';
      value: number;
      label: string;
    }>;
    thresholds?: Array<{
      value: number;
      color: string;
      label: string;
    }>;
  };
}

export interface DashboardLayout {
  id: string;
  name: string;
  panels: Array<{
    id: string;
    type: 'metric' | 'chart' | 'table' | 'alert';
    position: {
      x: number;
      y: number;
      width: number;
      height: number;
    };
    visualization: MetricVisualization;
    refreshInterval?: number;
  }>;
}

// Export/Import Types
export interface MetricExport {
  version: string;
  timestamp: number;
  metadata: {
    environment: string;
    source: string;
    tags: Record<string, string>;
  };
  metrics: {
    agents: Record<string, AgentMetrics>;
    system: SystemMetrics;
    custom?: Record<string, MetricValue>;
  };
  aggregations?: Record<string, AggregatedMetrics>;
}

export interface MetricImportOptions {
  overwrite: boolean;
  validate: boolean;
  aggregateWithExisting: boolean;
  tags?: Record<string, string>;
}

export interface MetricValidation {
  isValid: boolean;
  errors: Array<{
    path: string;
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: string[];
}

// Real-time Monitoring Types
export interface AgentHealthCheck {
  id: string;
  timestamp: number;
  status: 'healthy' | 'degraded' | 'error';
  metrics: {
    responseTime: number;
    errorCount: number;
    memoryUsage: number;
    activeConnections: number;
  };
  lastError?: {
    message: string;
    code: string;
    timestamp: number;
  };
}

export interface MetricStream {
  id: string;
  type: 'agent' | 'system' | 'custom';
  interval: number;
  metrics: string[];
  filters?: Record<string, unknown>;
  transformations?: Array<{
    type: 'aggregate' | 'filter' | 'transform';
    config: Record<string, unknown>;
  }>;
}

// Analytics Types
export interface AgentAnalytics {
  timeRange: {
    start: number;
    end: number;
  };
  metrics: {
    usage: {
      totalRequests: number;
      uniqueUsers: number;
      peakConcurrent: number;
      avgSessionDuration: number;
    };
    performance: {
      p50ResponseTime: number;
      p95ResponseTime: number;
      p99ResponseTime: number;
      errorDistribution: Record<string, number>;
    };
    quality: {
      satisfactionScore: number;
      accuracyScore: number;
      clarityScore: number;
      helpfulnessScore: number;
    };
    resources: {
      tokenUsage: number;
      computeCost: number;
      storageUsed: number;
      bandwidthUsed: number;
    };
  };
  trends: Array<{
    metric: string;
    change: number;
    direction: 'up' | 'down' | 'stable';
    significance: number;
  }>;
}

// KV Storage Key Types
export type MetricKey = [
  'metrics',
  string, // metric name
  string, // timestamp
  ...string[] // additional identifiers
];

export type AlertKey = [
  'alerts',
  string, // metric name
  string, // severity
  string, // timestamp
];

export type AgentMetricKey = [
  'agent_metrics',
  string, // agent id
  string, // metric type
  string, // timestamp
];

export type VisualizationKey = [
  'visualizations',
  string, // dashboard id
  string, // panel id
];

export type MetricExportKey = [
  'metric_exports',
  string, // export id
  string, // timestamp
];