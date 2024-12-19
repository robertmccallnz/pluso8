import { signal } from "@preact/signals";
import { AgentMetrics, MetricData, SystemMetrics } from "./types.ts";

// Basic metrics interface for dashboard
export interface DashboardMetrics {
  activeAgents: number;
  totalConversations: number;
  avgResponseTime: string;
  userSatisfaction: number;
}

// Shared metrics state
export const metricsState = {
  activeAgents: signal(0),
  totalConversations: signal(0),
  avgResponseTime: signal("0s"),
  userSatisfaction: signal(0),
  lastUpdate: signal<Date | null>(null),
  systemMetrics: signal<SystemMetrics | null>(null),
  agentMetrics: signal<AgentMetrics[]>([]),
};

export async function getInitialMetrics(): Promise<DashboardMetrics> {
  try {
    // In a real application, this would fetch from your backend
    // For now, we'll return mock data
    const mockMetrics: DashboardMetrics = {
      activeAgents: 12,
      totalConversations: 1543,
      avgResponseTime: "1.2s",
      userSatisfaction: 98,
    };

    // Update shared state
    metricsState.activeAgents.value = mockMetrics.activeAgents;
    metricsState.totalConversations.value = mockMetrics.totalConversations;
    metricsState.avgResponseTime.value = mockMetrics.avgResponseTime;
    metricsState.userSatisfaction.value = mockMetrics.userSatisfaction;
    metricsState.lastUpdate.value = new Date();

    return mockMetrics;
  } catch (error) {
    console.error("Failed to fetch metrics:", error);
    return {
      activeAgents: 0,
      totalConversations: 0,
      avgResponseTime: "0s",
      userSatisfaction: 0,
    };
  }
}

export async function updateMetrics(): Promise<void> {
  try {
    const metrics = await getInitialMetrics();
    metricsState.activeAgents.value = metrics.activeAgents;
    metricsState.totalConversations.value = metrics.totalConversations;
    metricsState.avgResponseTime.value = metrics.avgResponseTime;
    metricsState.userSatisfaction.value = metrics.userSatisfaction;
    metricsState.lastUpdate.value = new Date();
  } catch (error) {
    console.error("Failed to update metrics:", error);
  }
}

// Update metrics every 30 seconds if in browser
if (typeof window !== "undefined") {
  setInterval(updateMetrics, 30000);
}

// Helper function to format response time
export function formatResponseTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(1)}s`;
}

// Helper function to calculate success rate
export function calculateSuccessRate(
  successful: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((successful / total) * 100);
}

// Helper function to aggregate metrics
export function aggregateMetrics(
  metrics: MetricData[],
  period: "hour" | "day" | "week" = "hour"
): MetricData {
  if (!metrics.length) {
    return {
      current: 0,
      min: 0,
      max: 0,
      avg: 0,
      history: [],
      timestamp: Date.now(),
    };
  }

  const now = Date.now();
  const periodInMs = {
    hour: 60 * 60 * 1000,
    day: 24 * 60 * 60 * 1000,
    week: 7 * 24 * 60 * 60 * 1000,
  }[period];

  const relevantMetrics = metrics.filter(
    (m) => now - m.timestamp <= periodInMs
  );

  if (!relevantMetrics.length) {
    return {
      current: metrics[metrics.length - 1].current,
      min: 0,
      max: 0,
      avg: 0,
      history: [],
      timestamp: now,
    };
  }

  return {
    current: relevantMetrics[relevantMetrics.length - 1].current,
    min: Math.min(...relevantMetrics.map((m) => m.current)),
    max: Math.max(...relevantMetrics.map((m) => m.current)),
    avg:
      relevantMetrics.reduce((sum, m) => sum + m.current, 0) /
      relevantMetrics.length,
    history: relevantMetrics.map((m) => m.current),
    timestamp: now,
  };
}
