import { IS_BROWSER } from "$fresh/runtime.ts";
import { DashboardData } from "../../types/dashboard.ts";
import { LineChart } from "./components/charts/LineChart.tsx";
import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface MetricsDashboardProps {
  data: DashboardData;
}

export default function AgentMetricsDashboard({ data }: MetricsDashboardProps) {
  const selectedMetricType = useSignal<string>("latency");
  const isLoading = useSignal<boolean>(false);
  const error = useSignal<string | null>(null);

  if (!IS_BROWSER) {
    return null;
  }

  if (!data) {
    error.value = "No dashboard data available";
    return (
      <div class="text-center py-12">
        <div class="text-red-600">{error.value}</div>
      </div>
    );
  }

  if (!data.agent) {
    return (
      <div class="text-center py-12">
        <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 class="mt-2 text-sm font-medium text-gray-900">No Agent Selected</h3>
        <p class="mt-1 text-sm text-gray-500">
          Select an agent to view its metrics
        </p>
      </div>
    );
  }

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Agent Metrics</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Request Count */}
          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Total Requests</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {data.metrics?.requestCount.toLocaleString() || "0"}
            </dd>
          </div>

          {/* Average Response Time */}
          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Avg Response Time</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {data.metrics?.averageResponseTime ? `${data.metrics.averageResponseTime}ms` : "N/A"}
            </dd>
          </div>

          {/* Error Rate */}
          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Error Rate</dt>
            <dd class="mt-1 text-3xl font-semibold text-gray-900">
              {data.metrics?.errorRate ? `${data.metrics.errorRate}%` : "0%"}
            </dd>
          </div>
        </div>
      </div>

      {/* Token Usage */}
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Token Usage</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Prompt Tokens</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">
              {data.metrics?.tokenUsage?.prompt.toLocaleString() || "0"}
            </dd>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Completion Tokens</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">
              {data.metrics?.tokenUsage?.completion.toLocaleString() || "0"}
            </dd>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Total Tokens</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">
              {data.metrics?.tokenUsage?.total.toLocaleString() || "0"}
            </dd>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <dt class="text-sm font-medium text-gray-500">Cost</dt>
            <dd class="mt-1 text-2xl font-semibold text-gray-900">
              ${data.metrics?.tokenUsage?.cost.toFixed(2) || "0.00"}
            </dd>
          </div>
        </div>
      </div>

      {/* Daily Stats Chart */}
      {data.metrics?.dailyStats && data.metrics.dailyStats.length > 0 && (
        <div class="bg-white shadow rounded-lg p-6">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Daily Statistics</h2>
          <div class="h-64">
            <LineChart
              data={data.metrics.dailyStats}
              selectedMetric={selectedMetricType.value}
              onMetricChange={(metric) => selectedMetricType.value = metric}
            />
          </div>
        </div>
      )}

      {error.value && (
        <div class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">Error</h3>
              <div class="mt-2 text-sm text-red-700">
                <p>{error.value}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
