import { assertEquals, assertExists } from "$std/assert/mod.ts";
import { AgentAnalyticsService, agentAnalytics } from "../core/services/agent-analytics.ts";
import { AgentPerformanceMetrics } from "../core/ai/agent-network.ts";

Deno.test({
  name: "AgentAnalytics - Basic Analytics Flow",
  async fn() {
    // Test metrics for a high-performing agent
    const testMetrics: AgentPerformanceMetrics = {
      responseTime: 300, // 300ms - very fast
      successRate: 0.98,
      userSatisfaction: 0.95,
      contextRelevance: 0.97,
      memoryUsage: 40
    };

    const stats = await agentAnalytics.analyzeAgent(
      "test-agent-1",
      "Test Jeff",
      "jeff",
      testMetrics
    );

    assertExists(stats);
    assertEquals(stats.agentId, "test-agent-1");
    assertEquals(stats.name, "Test Jeff");
    assertEquals(stats.type, "jeff");
    
    // Performance score should be high for good metrics
    assertEquals(stats.performanceScore > 0.8, true);
  }
});

Deno.test({
  name: "AgentAnalytics - Performance Comparison",
  async fn() {
    // Test metrics for agents with different performance levels
    const highPerformanceMetrics: AgentPerformanceMetrics = {
      responseTime: 200,
      successRate: 0.99,
      userSatisfaction: 0.98,
      contextRelevance: 0.99,
      memoryUsage: 30
    };

    const lowPerformanceMetrics: AgentPerformanceMetrics = {
      responseTime: 2000,
      successRate: 0.6,
      userSatisfaction: 0.5,
      contextRelevance: 0.7,
      memoryUsage: 90
    };

    const highPerfStats = await agentAnalytics.analyzeAgent(
      "high-perf-agent",
      "High Perf Maia",
      "maia",
      highPerformanceMetrics
    );

    const lowPerfStats = await agentAnalytics.analyzeAgent(
      "low-perf-agent",
      "Low Perf Petunia",
      "petunia",
      lowPerformanceMetrics
    );

    // High performance agent should have better score
    assertEquals(highPerfStats.performanceScore > lowPerfStats.performanceScore, true);
  }
});

Deno.test({
  name: "AgentAnalytics - Historical Data Retrieval",
  async fn() {
    const testMetrics: AgentPerformanceMetrics = {
      responseTime: 500,
      successRate: 0.9,
      userSatisfaction: 0.85,
      contextRelevance: 0.9,
      memoryUsage: 60
    };

    // Create some test data
    await agentAnalytics.analyzeAgent(
      "history-test-agent",
      "History Test Agent",
      "jeff",
      testMetrics
    );

    // Retrieve historical data
    const history = await agentAnalytics.getAgentStats("history-test-agent");
    
    assertExists(history);
    assertEquals(history.length > 0, true);
    assertEquals(history[0].agentId, "history-test-agent");
  }
});
