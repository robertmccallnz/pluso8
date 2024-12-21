import { PageProps } from "$fresh/server.ts";
import AgentMetricsDashboard from "../../../islands/dashboard/AgentMetricsDashboard.tsx";
import { AgentIndustry, AgentType } from "../../../agents/core/registry.ts";
import DashboardLayout from "../_layout.tsx";

export default function MonitoringPage(props: PageProps) {
  const searchParams = new URL(props.url).searchParams;
  const view = searchParams.get("view") || "all";
  const industry = searchParams.get("industry") as AgentIndustry;
  const type = searchParams.get("type") as AgentType;
  const agentId = searchParams.get("agent");

  return (
    <div class="p-4 mx-auto max-w-screen-xl">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">Agent Monitoring Dashboard</h1>
        
        <div class="flex space-x-4">
          <select
            class="border rounded p-2"
            value={view}
            onChange={(e) => {
              const target = e.target as HTMLSelectElement;
              const newUrl = new URL(window.location.href);
              newUrl.searchParams.set("view", target.value);
              window.history.pushState({}, "", newUrl.toString());
            }}
          >
            <option value="all">All Metrics</option>
            <option value="performance">Performance</option>
            <option value="errors">Errors</option>
            <option value="usage">Usage</option>
          </select>

          <select
            class="border rounded p-2"
            value={industry || ""}
            onChange={(e) => {
              const target = e.target as HTMLSelectElement;
              const newUrl = new URL(window.location.href);
              if (target.value) {
                newUrl.searchParams.set("industry", target.value);
              } else {
                newUrl.searchParams.delete("industry");
              }
              window.history.pushState({}, "", newUrl.toString());
            }}
          >
            <option value="">All Industries</option>
            <option value="tech">Technology</option>
            <option value="finance">Finance</option>
            <option value="healthcare">Healthcare</option>
          </select>

          <select
            class="border rounded p-2"
            value={type || ""}
            onChange={(e) => {
              const target = e.target as HTMLSelectElement;
              const newUrl = new URL(window.location.href);
              if (target.value) {
                newUrl.searchParams.set("type", target.value);
              } else {
                newUrl.searchParams.delete("type");
              }
              window.history.pushState({}, "", newUrl.toString());
            }}
          >
            <option value="">All Types</option>
            <option value="assistant">Assistant</option>
            <option value="classifier">Classifier</option>
            <option value="generator">Generator</option>
          </select>
        </div>
      </div>

      <AgentMetricsDashboard
        view={view}
        industry={industry}
        type={type}
        agentId={agentId}
      />
    </div>
  );
}

MonitoringPage.layout = DashboardLayout;
