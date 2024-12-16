// Mock metrics provider for development
import { AgentMetrics } from "./types.ts";

export function generateMockMetrics(agentId: string): AgentMetrics {
  return {
    id: agentId,
    name: agentId,
    metrics: {
      conversations: {
        total: Math.floor(Math.random() * 1000),
        active: Math.floor(Math.random() * 10),
        completed: Math.floor(Math.random() * 900),
        avgDuration: Math.floor(Math.random() * 300000), // 0-5 minutes in ms
        responseTime: {
          avg: Math.floor(Math.random() * 2000), // 0-2s in ms
          min: 100,
          max: 5000,
        },
      },
      performance: {
        memoryUsage: Math.floor(Math.random() * 1024 * 1024 * 100), // 0-100MB
        cpuUsage: Math.random() * 100,
        latency: Math.floor(Math.random() * 1000),
        errorRate: Math.random() * 0.1,
        successRate: 0.9 + (Math.random() * 0.1), // 90-100%
      },
      knowledge: {
        totalTokens: Math.floor(Math.random() * 1000000),
        uniqueTopics: Math.floor(Math.random() * 100),
        contextSize: Math.floor(Math.random() * 1024 * 100),
        embeddingCount: Math.floor(Math.random() * 1000),
      },
      interaction: {
        userSatisfaction: 0.8 + (Math.random() * 0.2), // 80-100%
        clarificationRequests: Math.floor(Math.random() * 100),
        accuracyScore: 0.85 + (Math.random() * 0.15), // 85-100%
        engagementLevel: 0.7 + (Math.random() * 0.3), // 70-100%
      },
      timestamps: {
        created: Date.now() - 86400000, // 24 hours ago
        lastActive: Date.now() - Math.floor(Math.random() * 3600000), // 0-1 hour ago
        lastError: Date.now() - Math.floor(Math.random() * 86400000), // 0-24 hours ago
      },
    }
  };
}
