import { h } from "preact";
import { DashboardData } from "../../types/dashboard.ts";
import { selectedAgent } from "../../core/state/index.ts";

interface OverviewProps {
  data: DashboardData;
}

export default function Overview({ data }: OverviewProps) {
  const agent = data.agent;

  return (
    <div class="space-y-6">
      <header class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <button
          onClick={() => selectedAgent.value = null}
          class="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          Create New Agent
        </button>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.metrics && (
          <>
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-gray-500 text-sm font-medium">Total Requests</h3>
              <p class="mt-2 text-3xl font-semibold">{data.metrics.requestCount}</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-gray-500 text-sm font-medium">Response Time</h3>
              <p class="mt-2 text-3xl font-semibold">{data.metrics.averageResponseTime}ms</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-gray-500 text-sm font-medium">Error Rate</h3>
              <p class="mt-2 text-3xl font-semibold">{(data.metrics.errorRate * 100).toFixed(1)}%</p>
            </div>
            <div class="bg-white p-6 rounded-lg shadow">
              <h3 class="text-gray-500 text-sm font-medium">Token Usage</h3>
              <p class="mt-2 text-3xl font-semibold">${data.metrics.tokenUsage.cost.toFixed(2)}</p>
            </div>
          </>
        )}
      </div>

      {agent ? (
        <div class="bg-white rounded-lg shadow">
          <div class="px-6 py-4 border-b border-gray-200">
            <h2 class="text-lg font-medium text-gray-900">Active Agent</h2>
          </div>
          <div class="px-6 py-4">
            <div class="space-y-4">
              <div>
                <h3 class="text-sm font-medium text-gray-500">Name</h3>
                <p class="mt-1 text-sm text-gray-900">{agent.config.name}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Description</h3>
                <p class="mt-1 text-sm text-gray-900">{agent.config.description}</p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Status</h3>
                <p class="mt-1 text-sm">
                  <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    agent.status === 'online' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {agent.status}
                  </span>
                </p>
              </div>
              <div>
                <h3 class="text-sm font-medium text-gray-500">Last Deployed</h3>
                <p class="mt-1 text-sm text-gray-900">
                  {new Date(agent.lastDeployed).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div class="text-center py-12">
          <div class="rounded-md bg-yellow-50 p-4">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div class="ml-3">
                <h3 class="text-sm font-medium text-yellow-800">No Agent Found</h3>
                <div class="mt-2 text-sm text-yellow-700">
                  <p>Create your first agent to get started.</p>
                </div>
                <div class="mt-4">
                  <div class="-mx-2 -my-1.5 flex">
                    <button
                      class="bg-yellow-50 px-2 py-1.5 rounded-md text-sm font-medium text-yellow-800 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-yellow-50 focus:ring-yellow-600"
                    >
                      Create Agent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
