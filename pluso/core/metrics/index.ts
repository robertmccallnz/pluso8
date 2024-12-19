import { signal } from "@preact/signals";

export interface Metrics {
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
};

export async function getInitialMetrics(): Promise<Metrics> {
  try {
    // In a real application, this would fetch from your backend
    // For now, we'll return mock data
    const mockMetrics: Metrics = {
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

// Update metrics every 30 seconds
if (typeof window !== "undefined") {
  setInterval(updateMetrics, 30000);
}
