import { useEffect, useRef } from "preact/hooks";
import { Chart } from "npm:chart.js@4.4.1/auto";

interface AdminDashboardProps {
  users: {
    total: number;
    active: number;
    new: number;
  };
  agents: {
    total: number;
    active: number;
    new: number;
  };
  metrics: {
    total: number;
    thisWeek: number;
    lastWeek: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
}

export default function AdminDashboard(props: AdminDashboardProps) {
  const metricsChartRef = useRef<HTMLCanvasElement>(null);
  const revenueChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (metricsChartRef.current && revenueChartRef.current) {
      // Metrics Chart
      new Chart(metricsChartRef.current, {
        type: "line",
        data: {
          labels: ["Last Week", "This Week"],
          datasets: [{
            label: "Metrics",
            data: [props.metrics.lastWeek, props.metrics.thisWeek],
            borderColor: "rgb(75, 192, 192)",
            tension: 0.1
          }]
        }
      });

      // Revenue Chart
      new Chart(revenueChartRef.current, {
        type: "bar",
        data: {
          labels: ["Last Month", "This Month"],
          datasets: [{
            label: "Revenue",
            data: [props.revenue.lastMonth, props.revenue.thisMonth],
            backgroundColor: "rgb(54, 162, 235)"
          }]
        }
      });
    }
  }, [props]);

  return (
    <div class="p-6">
      <h1 class="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Users Card */}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Users</h3>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <p class="text-sm text-gray-600">Total</p>
              <p class="text-xl font-bold">{props.users.total}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Active</p>
              <p class="text-xl font-bold">{props.users.active}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">New</p>
              <p class="text-xl font-bold">{props.users.new}</p>
            </div>
          </div>
        </div>

        {/* Agents Card */}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Agents</h3>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <p class="text-sm text-gray-600">Total</p>
              <p class="text-xl font-bold">{props.agents.total}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Active</p>
              <p class="text-xl font-bold">{props.agents.active}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">New</p>
              <p class="text-xl font-bold">{props.agents.new}</p>
            </div>
          </div>
        </div>

        {/* Metrics Card */}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Metrics</h3>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <p class="text-sm text-gray-600">Total</p>
              <p class="text-xl font-bold">{props.metrics.total}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">This Week</p>
              <p class="text-xl font-bold">{props.metrics.thisWeek}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Last Week</p>
              <p class="text-xl font-bold">{props.metrics.lastWeek}</p>
            </div>
          </div>
        </div>

        {/* Revenue Card */}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-2">Revenue</h3>
          <div class="grid grid-cols-3 gap-2">
            <div>
              <p class="text-sm text-gray-600">Total</p>
              <p class="text-xl font-bold">${props.revenue.total}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">This Month</p>
              <p class="text-xl font-bold">${props.revenue.thisMonth}</p>
            </div>
            <div>
              <p class="text-sm text-gray-600">Last Month</p>
              <p class="text-xl font-bold">${props.revenue.lastMonth}</p>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Metrics Chart */}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Metrics Trend</h3>
          <canvas ref={metricsChartRef}></canvas>
        </div>

        {/* Revenue Chart */}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4">Revenue Trend</h3>
          <canvas ref={revenueChartRef}></canvas>
        </div>
      </div>
    </div>
  );
}
