import { PageProps } from "$fresh/server.ts";
import AgentMetricsCard from "../../islands/AgentMetricsCard.tsx";
import AgentPerformanceChart from "../../islands/AgentPerformanceChart.tsx";
import AgentEvaluationTable from "../../islands/AgentEvaluationTable.tsx";

export default function MetricsDashboard(_props: PageProps) {
  return (
    <div class="p-4 mx-auto max-w-screen-xl">
      <h1 class="text-3xl font-bold mb-6">Agent Metrics Dashboard</h1>
      
      {/* Agent Selection */}
      <div class="mb-6">
        <select 
          id="agentSelect" 
          class="block w-full max-w-xs px-4 py-2 border rounded-lg shadow-sm"
        >
          <option value="82cbb039-8f91-413a-a9eb-82351c691000">Test Agent</option>
        </select>
      </div>

      {/* Metrics Overview Cards */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AgentMetricsCard />
      </div>

      {/* Performance Charts */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Response Time Trend</h2>
          <AgentPerformanceChart type="response_time" />
        </div>
        <div class="bg-white p-4 rounded-lg shadow">
          <h2 class="text-xl font-semibold mb-4">Token Usage Trend</h2>
          <AgentPerformanceChart type="tokens" />
        </div>
      </div>

      {/* Evaluations Table */}
      <div class="bg-white p-4 rounded-lg shadow">
        <h2 class="text-xl font-semibold mb-4">Recent Evaluations</h2>
        <AgentEvaluationTable />
      </div>
    </div>
  );
}
