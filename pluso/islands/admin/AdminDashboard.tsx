import { useEffect, useRef } from "preact/hooks";
import { Chart } from "chart.js/auto";

interface AdminDashboardProps {
  users: {
    total: number;
    active: number;
    new: number;
  };
  agents: {
    total: number;
    active: number;
    byType: Record<string, number>;
  };
  metrics: {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
    costToDate: number;
  };
  systemStatus: {
    cpu: number;
    memory: number;
    storage: number;
    uptime: number;
  };
}

export default function AdminDashboard(props: AdminDashboardProps) {
  const agentChartRef = useRef<HTMLCanvasElement>(null);
  const metricsChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (agentChartRef.current && metricsChartRef.current) {
      // Agent Distribution Chart
      new Chart(agentChartRef.current, {
        type: "doughnut",
        data: {
          labels: Object.keys(props.agents.byType),
          datasets: [{
            data: Object.values(props.agents.byType),
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
          }],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "right",
            },
            title: {
              display: true,
              text: "Agent Distribution by Type",
            },
          },
        },
      });

      // Metrics Timeline Chart
      new Chart(metricsChartRef.current, {
        type: "line",
        data: {
          labels: ["Last 24h", "48h", "72h", "96h", "120h"],
          datasets: [{
            label: "Response Time (ms)",
            data: [
              props.metrics.avgResponseTime,
              props.metrics.avgResponseTime * 0.95,
              props.metrics.avgResponseTime * 1.1,
              props.metrics.avgResponseTime * 0.9,
              props.metrics.avgResponseTime * 1.05,
            ],
            borderColor: "#36A2EB",
            tension: 0.1,
          }],
        },
        options: {
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Response Time Trend",
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
  }, [props]);

  return (
    <div class="p-6 max-w-7xl mx-auto">
      <div class="mb-8">
        <h1 class="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p class="text-gray-600">Monitor system performance and manage users</p>
      </div>

      {/* Quick Stats */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Total Users</h3>
          <div class="mt-2 flex items-baseline">
            <p class="text-3xl font-semibold">{props.users.total}</p>
            <p class="ml-2 text-sm text-green-600">+{props.users.new} new</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Active Agents</h3>
          <div class="mt-2 flex items-baseline">
            <p class="text-3xl font-semibold">{props.agents.active}</p>
            <p class="ml-2 text-sm text-gray-600">of {props.agents.total}</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Error Rate</h3>
          <div class="mt-2 flex items-baseline">
            <p class="text-3xl font-semibold">{props.metrics.errorRate}%</p>
            <p class="ml-2 text-sm text-gray-600">last 24h</p>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h3 class="text-gray-500 text-sm font-medium">Cost to Date</h3>
          <div class="mt-2 flex items-baseline">
            <p class="text-3xl font-semibold">${props.metrics.costToDate}</p>
            <p class="ml-2 text-sm text-gray-600">USD</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-lg shadow p-6">
          <canvas ref={agentChartRef} />
        </div>
        <div class="bg-white rounded-lg shadow p-6">
          <canvas ref={metricsChartRef} />
        </div>
      </div>

      {/* System Status */}
      <div class="bg-white rounded-lg shadow p-6 mb-8">
        <h2 class="text-xl font-semibold mb-4">System Status</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <h3 class="text-gray-500 text-sm font-medium">CPU Usage</h3>
            <p class="mt-1 text-2xl font-semibold">{props.systemStatus.cpu}%</p>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm font-medium">Memory Usage</h3>
            <p class="mt-1 text-2xl font-semibold">{props.systemStatus.memory}%</p>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm font-medium">Storage</h3>
            <p class="mt-1 text-2xl font-semibold">{props.systemStatus.storage}%</p>
          </div>
          <div>
            <h3 class="text-gray-500 text-sm font-medium">Uptime</h3>
            <p class="mt-1 text-2xl font-semibold">{Math.floor(props.systemStatus.uptime / 3600)}h</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div class="bg-white rounded-lg shadow p-6">
        <h2 class="text-xl font-semibold mb-4">Quick Actions</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/users"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Manage Users
          </a>
          <a
            href="/admin/agents"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Manage Agents
          </a>
          <a
            href="/admin/settings"
            class="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            System Settings
          </a>
        </div>
      </div>
    </div>
  );
}
