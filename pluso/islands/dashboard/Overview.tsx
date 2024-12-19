import { DashboardData } from "../../types/dashboard.ts";
import { selectedAgent } from "../../core/state/index.ts";

interface OverviewProps {
  data: DashboardData;
}

export default function Overview({ data }: OverviewProps) {
  const agent = data.agent;
  if (!agent) {
    return (
      <div class="text-center py-12">
        <div class="rounded-md bg-yellow-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
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
                    onClick={() => selectedAgent.value = null}
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
    );
  }

  return (
    <div class="space-y-6">
      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Agent Overview
          </h3>
          <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Status
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {agent.status}
                </dd>
              </div>
            </div>
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Last Deployed
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {new Date(agent.lastDeployed).toLocaleDateString()}
                </dd>
              </div>
            </div>
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <dt class="text-sm font-medium text-gray-500 truncate">
                  Model
                </dt>
                <dd class="mt-1 text-3xl font-semibold text-gray-900">
                  {agent.config.model.model}
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Configuration
          </h3>
          <div class="mt-5 border-t border-gray-200">
            <dl class="divide-y divide-gray-200">
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Name</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {agent.config.name}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Description</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {agent.config.description}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">System Prompt</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {agent.config.systemPrompt}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Temperature</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {agent.config.model.temperature}
                </dd>
              </div>
              <div class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt class="text-sm font-medium text-gray-500">Max Tokens</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  {agent.config.model.maxTokens}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {data.metrics && (
        <div class="bg-white shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">
              Usage Statistics
            </h3>
            <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Requests
                  </dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">
                    {data.metrics.requestCount}
                  </dd>
                </div>
              </div>
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Average Response Time
                  </dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">
                    {data.metrics.averageResponseTime.toFixed(2)}ms
                  </dd>
                </div>
              </div>
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Error Rate
                  </dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">
                    {(data.metrics.errorRate * 100).toFixed(1)}%
                  </dd>
                </div>
              </div>
              <div class="bg-white overflow-hidden shadow rounded-lg">
                <div class="px-4 py-5 sm:p-6">
                  <dt class="text-sm font-medium text-gray-500 truncate">
                    Total Cost
                  </dt>
                  <dd class="mt-1 text-3xl font-semibold text-gray-900">
                    ${data.metrics.tokenUsage.cost.toFixed(2)}
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
