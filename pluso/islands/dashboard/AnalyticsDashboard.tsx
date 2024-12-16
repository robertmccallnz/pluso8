import { useSignal, useComputed } from "@preact/signals";
import { useEffect } from "preact/hooks";
import { AgentAnalytics, DashboardLayout, MetricVisualization } from "../../core/metrics/types.ts";
import MetricsPanel from "./MetricsPanel.tsx";
import { COLORS } from "../../lib/constants/styles.ts";

interface Props {
  analytics: AgentAnalytics;
  layout: DashboardLayout;
}

export default function AnalyticsDashboard({ analytics, layout }: Props) {
  const ws = useSignal<WebSocket | null>(null);
  const realTimeData = useSignal<Record<string, number[]>>({});
  
  // Initialize WebSocket connection
  useEffect(() => {
    const socket = new WebSocket(`ws://${window.location.host}/api/metrics/ws`);
    
    socket.onopen = () => {
      console.log("Connected to metrics WebSocket");
      ws.value = socket;
    };
    
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      updateMetrics(data);
    };
    
    socket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
    
    return () => {
      socket.close();
    };
  }, []);
  
  const updateMetrics = (data: Record<string, number>) => {
    for (const [key, value] of Object.entries(data)) {
      const history = realTimeData.value[key] || [];
      realTimeData.value = {
        ...realTimeData.value,
        [key]: [...history.slice(-60), value] // Keep last 60 data points
      };
    }
  };
  
  const exportData = async () => {
    try {
      const response = await fetch("/api/metrics/export");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pluso-metrics-${new Date().toISOString()}.json`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export metrics:", error);
    }
  };
  
  const importData = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("metrics", file);
      await fetch("/api/metrics/import", {
        method: "POST",
        body: formData
      });
    } catch (error) {
      console.error("Failed to import metrics:", error);
    }
  };

  return (
    <div class="space-y-6">
      {/* Summary Cards */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          title="Total Conversations"
          value={analytics.metrics.usage.totalRequests}
          trend={analytics.trends.find(t => t.metric === "totalRequests")}
        />
        <SummaryCard
          title="Active Users"
          value={analytics.metrics.usage.uniqueUsers}
          trend={analytics.trends.find(t => t.metric === "uniqueUsers")}
        />
        <SummaryCard
          title="Satisfaction Score"
          value={analytics.metrics.quality.satisfactionScore * 100}
          suffix="%"
          trend={analytics.trends.find(t => t.metric === "satisfactionScore")}
        />
        <SummaryCard
          title="Response Time"
          value={analytics.metrics.performance.p95ResponseTime}
          suffix="ms"
          trend={analytics.trends.find(t => t.metric === "responseTime")}
        />
      </div>
      
      {/* Metrics Grid */}
      <div class="grid gap-4" style={{ 
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gridAutoRows: "minmax(250px, auto)"
      }}>
        {layout.panels.map(panel => (
          <MetricsPanel
            key={panel.id}
            panel={panel}
            realTimeData={realTimeData.value[panel.id] || []}
          />
        ))}
      </div>
      
      {/* Export/Import Controls */}
      <div class="flex justify-end space-x-4 mt-8">
        <input
          type="file"
          accept=".json"
          class="hidden"
          id="import-metrics"
          onChange={(e) => {
            const file = e.currentTarget.files?.[0];
            if (file) importData(file);
          }}
        />
        <button
          onClick={() => document.getElementById("import-metrics")?.click()}
          class="px-4 py-2 bg-white text-gray-700 border rounded-md hover:bg-gray-50"
        >
          Import Metrics
        </button>
        <button
          onClick={exportData}
          class="px-4 py-2 bg-white text-gray-700 border rounded-md hover:bg-gray-50"
        >
          Export Metrics
        </button>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, suffix = "", trend }) {
  const trendColor = trend?.direction === "up" ? "text-green-500" : "text-red-500";
  const trendIcon = trend?.direction === "up" ? "↑" : "↓";
  
  return (
    <div class="bg-white p-6 rounded-lg shadow">
      <h3 class="text-sm font-medium text-gray-500">{title}</h3>
      <div class="mt-2 flex items-baseline">
        <p class="text-2xl font-semibold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
          {suffix}
        </p>
        {trend && (
          <span class={`ml-2 text-sm ${trendColor}`}>
            {trendIcon} {Math.abs(trend.change)}%
          </span>
        )}
      </div>
    </div>
  );
}
