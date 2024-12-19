import { PageProps } from "$fresh/server.ts";
import AgentMetricsDashboard from "../../../islands/dashboard/AgentMetricsDashboard.tsx";
import { AgentIndustry, AgentType } from "../../../agents/core/registry.ts";

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
              const url = new URL(window.location.href);
              url.searchParams.set("view", e.target.value);
              window.location.href = url.toString();
            }}
          >
            <option value="all">All Agents</option>
            <option value="industry">By Industry</option>
            <option value="type">By Type</option>
            <option value="agent">Single Agent</option>
          </select>

          {view === "industry" && (
            <select
              class="border rounded p-2"
              value={industry || ""}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("industry", e.target.value);
                window.location.href = url.toString();
              }}
            >
              {Object.values(AgentIndustry).map((ind) => (
                <option key={ind} value={ind}>
                  {ind}
                </option>
              ))}
            </select>
          )}

          {view === "type" && (
            <select
              class="border rounded p-2"
              value={type || ""}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("type", e.target.value);
                window.location.href = url.toString();
              }}
            >
              {Object.values(AgentType).map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}

          {view === "agent" && (
            <select
              class="border rounded p-2"
              value={agentId || ""}
              onChange={(e) => {
                const url = new URL(window.location.href);
                url.searchParams.set("agent", e.target.value);
                window.location.href = url.toString();
              }}
            >
              <option value="TECH_ASST_PETUNIA_0001">Petunia</option>
              <option value="TECH_EVAL_JEFF_0001">Jeff</option>
              <option value="TECH_RSCH_MAIA_0001">Maia</option>
            </select>
          )}
        </div>
      </div>

      <AgentMetricsDashboard
        refreshInterval={5000}
        selectedAgentId={view === "agent" ? agentId || undefined : undefined}
        selectedIndustry={view === "industry" ? industry : undefined}
        selectedType={view === "type" ? type : undefined}
      />
    </div>
  );
}
