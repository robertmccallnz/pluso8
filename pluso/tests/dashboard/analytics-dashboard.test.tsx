import { h } from "preact";
import { assertEquals } from "$std/assert/mod.ts";
import { renderToString } from "preact-render-to-string";
import AnalyticsDashboard from "../../islands/dashboard/AnalyticsDashboard.tsx";

const mockAnalytics = {
  totalRequests: 15234,
  avgLatency: 245,
  successRate: 98.5,
  errorRate: 1.5,
  topAgents: [
    {
      id: "agent-1",
      name: "Agent One",
      requests: 5000,
      successRate: 99.1
    },
    {
      id: "agent-2",
      name: "Agent Two",
      requests: 4500,
      successRate: 98.5
    }
  ],
  requestsOverTime: [
    {
      timestamp: "2024-12-19T00:00:00Z",
      count: 100
    },
    {
      timestamp: "2024-12-19T01:00:00Z",
      count: 150
    }
  ]
};

const mockLayout = {
  id: "default",
  name: "Default Layout",
  panels: [
    {
      id: "panel-1",
      type: "metric" as const,
      title: "Total Requests",
      data: null
    }
  ]
} as const;

Deno.test({
  name: "AnalyticsDashboard - Server Side Rendering",
  fn() {
    const html = renderToString(
      <AnalyticsDashboard analytics={mockAnalytics} layout={mockLayout} />
    );

    // Check if metrics are displayed correctly
    assertEquals(html.includes("15,234"), true, "Should display total requests");
    assertEquals(html.includes("245ms"), true, "Should display average latency");
    assertEquals(html.includes("98.5%"), true, "Should display success rate");
    assertEquals(html.includes("1.5%"), true, "Should display error rate");

    // Check if agent names are displayed
    assertEquals(html.includes("Agent One"), true, "Should display first agent");
    assertEquals(html.includes("Agent Two"), true, "Should display second agent");

    // Check for key UI elements
    assertEquals(html.includes("Top Performing Agents"), true, "Should display agents table title");
    assertEquals(html.includes("bg-white overflow-hidden shadow rounded-lg"), true, "Should include summary cards");
  }
});
