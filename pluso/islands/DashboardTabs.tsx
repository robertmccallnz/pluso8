import { IS_BROWSER } from "$fresh/runtime.ts";
import { DashboardData } from "../types/dashboard.ts";
import { 
  activeTab,
  showCreateForm,
  selectedAgent,
  isLoading,
  metrics,
  error,
  resetAllState
} from "../core/state/index.ts";
import AgentMetricsDashboard from "./dashboard/AgentMetricsDashboard.tsx";
import AnalyticsDashboard from "./dashboard/AnalyticsDashboard.tsx";
import PlaygroundIsland from "./dashboard/Playground.tsx";
import CreateAgent from "./dashboard/CreateAgent.tsx";
import Overview from "./dashboard/Overview.tsx";
import { useEffect } from "preact/hooks";

interface DashboardTabsProps {
  data: DashboardData;
  initialTab?: string;
}

export default function DashboardTabs({ data, initialTab = "overview" }: DashboardTabsProps) {
  if (!IS_BROWSER) return null;

  useEffect(() => {
    if (!activeTab.value) {
      activeTab.value = initialTab;
    }
    if (!selectedAgent.value && data?.agent) {
      selectedAgent.value = data.agent;
    }
  }, [data]);

  const handleTabChange = (tab: string) => {
    activeTab.value = tab;
  };

  return (
    <div class="space-y-6">
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => handleTabChange("overview")}
            class={`${
              activeTab.value === "overview"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          <button
            onClick={() => handleTabChange("playground")}
            class={`${
              activeTab.value === "playground"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Playground
          </button>
          <button
            onClick={() => handleTabChange("metrics")}
            class={`${
              activeTab.value === "metrics"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Metrics
          </button>
          <button
            onClick={() => handleTabChange("analytics")}
            class={`${
              activeTab.value === "analytics"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Analytics
          </button>
          <button
            onClick={() => handleTabChange("create")}
            class={`${
              activeTab.value === "create"
                ? "border-blue-500 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm inline-flex items-center`}
          >
            <svg class="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Agent
          </button>
        </nav>
      </div>

      <div class="mt-6">
        {activeTab.value === "overview" && (
          <Overview data={data} />
        )}
        {activeTab.value === "playground" && (
          <PlaygroundIsland data={data} />
        )}
        {activeTab.value === "metrics" && (
          <AgentMetricsDashboard data={data} />
        )}
        {activeTab.value === "analytics" && (
          <AnalyticsDashboard data={data} />
        )}
        {activeTab.value === "create" && (
          <CreateAgent 
            industries={data.industries || []}
            templates={data.templates || []}
          />
        )}
      </div>
    </div>
  );
}
