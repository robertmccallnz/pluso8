import { useSignal } from "@preact/signals";
import { DashboardData } from "../../types/dashboard.ts";
import MetricsPanel from "./MetricsPanel.tsx";
import ApiKeyManager from "../../components/dashboard/ApiKeyManager.tsx";
import { Chart } from "../../utils/chart.ts";
import { useEffect, useRef } from "preact/hooks";

interface AgentDetailsProps {
  agentId: string;
  dashboardData: DashboardData;
}

export default function AgentDetailsIsland({ agentId, dashboardData }: AgentDetailsProps) {
  const activeTab = useSignal("overview");
  const usageChartRef = useRef<HTMLCanvasElement>(null);
  const costChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (usageChartRef.current && costChartRef.current) {
      const usageCtx = usageChartRef.current.getContext("2d");
      const costCtx = costChartRef.current.getContext("2d");

      if (usageCtx && costCtx) {
        // Usage Chart
        new Chart(usageCtx, {
          type: "line",
          data: {
            labels: dashboardData.metrics.dailyStats.map(stat => stat.date),
            datasets: [{
              label: "Token Usage",
              data: dashboardData.metrics.dailyStats.map(stat => stat.tokenUsage),
              borderColor: "#0088FE",
              tension: 0.1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });

        // Cost Chart
        new Chart(costCtx, {
          type: "line",
          data: {
            labels: dashboardData.metrics.dailyStats.map(stat => stat.date),
            datasets: [{
              label: "Daily Cost",
              data: dashboardData.metrics.dailyStats.map(stat => stat.cost),
              borderColor: "#00C49F",
              tension: 0.1,
            }],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }
    }
  }, [dashboardData]);

  return (
    <div class="space-y-6">
      {/* Header */}
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold">Agent Details</h1>
        <div class="flex items-center space-x-2">
          <span class={`px-2 py-1 rounded ${
            dashboardData.agent.status === "online" ? "bg-green-100 text-green-800" :
            dashboardData.agent.status === "offline" ? "bg-gray-100 text-gray-800" :
            "bg-red-100 text-red-800"
          }`}>
            {dashboardData.agent.status}
          </span>
          <button class="btn-primary">Deploy</button>
          <button class="btn-secondary">Settings</button>
        </div>
      </div>

      {/* Navigation */}
      <div class="border-b border-gray-200">
        <nav class="flex space-x-8">
          {["overview", "analytics", "api-keys", "tests", "versions", "collaborators", "webhooks", "settings"].map((tab) => (
            <button
              key={tab}
              onClick={() => activeTab.value = tab}
              class={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab.value === tab
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div class="space-y-6">
        {activeTab.value === "overview" && (
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MetricsPanel title="Performance" metrics={[
              { label: "Request Count", value: dashboardData.metrics.requestCount },
              { label: "Avg Response Time", value: `${dashboardData.metrics.averageResponseTime}ms` },
              { label: "Error Rate", value: `${dashboardData.metrics.errorRate}%` },
              { label: "Last Used", value: new Date(dashboardData.metrics.lastUsed).toLocaleString() },
            ]} />
            
            <MetricsPanel title="Token Usage" metrics={[
              { label: "Prompt Tokens", value: dashboardData.metrics.tokenUsage.prompt },
              { label: "Completion Tokens", value: dashboardData.metrics.tokenUsage.completion },
              { label: "Total Tokens", value: dashboardData.metrics.tokenUsage.total },
              { label: "Total Cost", value: `$${dashboardData.metrics.tokenUsage.cost.toFixed(2)}` },
            ]} />

            <div class="col-span-2">
              <h3 class="text-lg font-medium mb-4">Usage Over Time</h3>
              <div class="h-64">
                <canvas ref={usageChartRef}></canvas>
              </div>
            </div>

            <div class="col-span-2">
              <h3 class="text-lg font-medium mb-4">Cost Over Time</h3>
              <div class="h-64">
                <canvas ref={costChartRef}></canvas>
              </div>
            </div>
          </div>
        )}

        {activeTab.value === "analytics" && (
          <div class="space-y-6">
            <h3 class="text-lg font-medium">Detailed Analytics</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              {dashboardData.metrics.dailyStats.map((stat) => (
                <div key={stat.date} class="bg-white p-4 rounded-lg shadow">
                  <div class="text-sm text-gray-500">{new Date(stat.date).toLocaleDateString()}</div>
                  <div class="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <div class="text-sm font-medium text-gray-500">Requests</div>
                      <div class="mt-1 text-lg font-semibold">{stat.requests}</div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-500">Errors</div>
                      <div class="mt-1 text-lg font-semibold">{stat.errors}</div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-500">Tokens</div>
                      <div class="mt-1 text-lg font-semibold">{stat.tokenUsage}</div>
                    </div>
                    <div>
                      <div class="text-sm font-medium text-gray-500">Cost</div>
                      <div class="mt-1 text-lg font-semibold">${stat.cost.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab.value === "api-keys" && (
          <ApiKeyManager
            apiKeys={dashboardData.apiKeys}
            onCreateKey={async (keyData) => {
              try {
                const response = await fetch(`/api/agents/${agentId}/api-keys`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(keyData),
                });
                
                if (!response.ok) {
                  throw new Error("Failed to create API key");
                }

                // Refresh the page to show the new key
                window.location.reload();
              } catch (error) {
                console.error("Error creating API key:", error);
                alert("Failed to create API key. Please try again.");
              }
            }}
            onRevokeKey={async (keyId) => {
              if (!confirm("Are you sure you want to revoke this API key? This action cannot be undone.")) {
                return;
              }

              try {
                const response = await fetch(`/api/agents/${agentId}/api-keys/${keyId}/revoke`, {
                  method: "POST",
                });
                
                if (!response.ok) {
                  throw new Error("Failed to revoke API key");
                }

                // Refresh the page to show the updated key status
                window.location.reload();
              } catch (error) {
                console.error("Error revoking API key:", error);
                alert("Failed to revoke API key. Please try again.");
              }
            }}
          />
        )}

        {/* Add other tab contents here */}
      </div>
    </div>
  );
}
