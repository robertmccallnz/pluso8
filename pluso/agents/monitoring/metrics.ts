import { AgentIndustry, AgentType } from "../core/registry.ts";

interface TimeSeriesPoint {
  timestamp: number;
  value: number;
}

interface AgentMetrics {
  id: string;
  name: string;
  industry: AgentIndustry;
  type: AgentType;
  timeSeries: {
    latency: TimeSeriesPoint[];
    memoryUsage: TimeSeriesPoint[];
    requestCount: TimeSeriesPoint[];
    errorRate: TimeSeriesPoint[];
    tokenUsage: TimeSeriesPoint[];
  };
  current: {
    latency: number;
    memoryUsage: number;
    requestCount: number;
    errorCount: number;
    successRate: number;
    activeConnections: number;
    avgResponseTime: number;
    tokenUsage: number;
  };
  events: Array<{
    timestamp: number;
    name: string;
    data?: Record<string, unknown>;
  }>;
}

export class RouteMetrics {
  private metrics: AgentMetrics;
  private readonly maxDataPoints = 100; // Keep last 100 points for time series

  constructor(id: string, name: string, industry: AgentIndustry, type: AgentType) {
    this.metrics = {
      id,
      name,
      industry,
      type,
      timeSeries: {
        latency: [],
        memoryUsage: [],
        requestCount: [],
        errorRate: [],
        tokenUsage: [],
      },
      current: {
        latency: 0,
        memoryUsage: 0,
        requestCount: 0,
        errorCount: 0,
        successRate: 100,
        activeConnections: 0,
        avgResponseTime: 0,
        tokenUsage: 0,
      },
      events: [],
    };
  }

  private addTimeSeriesPoint(
    series: TimeSeriesPoint[],
    value: number,
    timestamp = Date.now()
  ) {
    series.push({ timestamp, value });
    if (series.length > this.maxDataPoints) {
      series.shift();
    }
  }

  recordLatency(latencyMs: number) {
    this.metrics.current.latency = latencyMs;
    this.addTimeSeriesPoint(this.metrics.timeSeries.latency, latencyMs);
  }

  recordMemoryUsage(memoryBytes: number) {
    this.metrics.current.memoryUsage = memoryBytes;
    this.addTimeSeriesPoint(this.metrics.timeSeries.memoryUsage, memoryBytes);
  }

  recordRequest() {
    this.metrics.current.requestCount++;
    this.addTimeSeriesPoint(
      this.metrics.timeSeries.requestCount,
      this.metrics.current.requestCount
    );
  }

  recordError() {
    this.metrics.current.errorCount++;
    const errorRate = (this.metrics.current.errorCount / this.metrics.current.requestCount) * 100;
    this.metrics.current.successRate = 100 - errorRate;
    this.addTimeSeriesPoint(this.metrics.timeSeries.errorRate, errorRate);
  }

  recordTokenUsage(tokens: number) {
    this.metrics.current.tokenUsage += tokens;
    this.addTimeSeriesPoint(
      this.metrics.timeSeries.tokenUsage,
      this.metrics.current.tokenUsage
    );
  }

  updateActiveConnections(delta: number) {
    this.metrics.current.activeConnections += delta;
  }

  recordResponseTime(timeMs: number) {
    const currentTotal = this.metrics.current.avgResponseTime * (this.metrics.current.requestCount - 1);
    this.metrics.current.avgResponseTime = (currentTotal + timeMs) / this.metrics.current.requestCount;
  }

  recordEvent(name: string, data?: Record<string, unknown>) {
    this.metrics.events.push({
      timestamp: Date.now(),
      name,
      data,
    });
  }

  getMetrics(): AgentMetrics {
    return { ...this.metrics };
  }
}

export class MetricsCollector {
  private static instance: MetricsCollector;
  private routeMetrics: Map<string, RouteMetrics> = new Map();

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  createRouteMetrics(
    agentId: string,
    name: string,
    industry: AgentIndustry,
    type: AgentType
  ): RouteMetrics {
    const metrics = new RouteMetrics(agentId, name, industry, type);
    this.routeMetrics.set(agentId, metrics);
    return metrics;
  }

  getRouteMetrics(agentId: string): RouteMetrics | undefined {
    return this.routeMetrics.get(agentId);
  }

  getAllMetrics(): Record<string, AgentMetrics> {
    const allMetrics: Record<string, AgentMetrics> = {};
    for (const [id, metrics] of this.routeMetrics.entries()) {
      allMetrics[id] = metrics.getMetrics();
    }
    return allMetrics;
  }

  getMetricsByIndustry(industry: AgentIndustry): AgentMetrics[] {
    return Array.from(this.routeMetrics.values())
      .filter(metrics => metrics.getMetrics().industry === industry)
      .map(metrics => metrics.getMetrics());
  }

  getMetricsByType(type: AgentType): AgentMetrics[] {
    return Array.from(this.routeMetrics.values())
      .filter(metrics => metrics.getMetrics().type === type)
      .map(metrics => metrics.getMetrics());
  }
}
