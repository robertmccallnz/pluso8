import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";
import { COLORS, TYPOGRAPHY, COMPONENTS } from "../lib/constants/styles.ts";
import { Chart } from "../utils/chart.ts";
import { AgentMetrics } from "../core/metrics/types.ts";
import { metricsState, updateMetrics } from "../core/metrics/metrics.ts";

interface MetricsPageIslandProps {
  initialMetrics: AgentMetrics[];
}

// Global signals for metrics state
export const chartInstance = signal<Chart | null>(null);
export const metricsError = signal<string | null>(null);

export default function MetricsPageIsland({ initialMetrics }: MetricsPageIslandProps) {
  if (!IS_BROWSER) {
    return null;
  }

  // Initialize metrics if needed
  if (metricsState.agentMetrics.value.length === 0 && initialMetrics.length > 0) {
    metricsState.agentMetrics.value = initialMetrics;
  }

  // Initialize chart
  const initializeChart = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        labels: metricsState.agentMetrics.value.map(m => new Date(m.timestamp).toLocaleTimeString()),
        datasets: [{
          label: 'Active Agents',
          data: [metricsState.activeAgents.value],
          borderColor: COLORS.primary,
          tension: 0.4,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: COLORS.gray[200],
            }
          },
          x: {
            grid: {
              display: false,
            }
          }
        }
      }
    });
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Metrics Overview</h2>
        <div class="flex gap-4">
          <button
            onClick={() => updateMetrics()}
            class={COMPONENTS.button.secondary}
          >
            Refresh
          </button>
        </div>
      </div>

      {metricsError.value && (
        <div class="p-4 bg-red-100 text-red-700 rounded-md">
          {metricsError.value}
        </div>
      )}

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="Active Agents"
          value={metricsState.activeAgents.value}
          icon="🤖"
        />
        <MetricCard
          title="Total Requests"
          value={metricsState.totalRequests.value}
          icon="📊"
        />
        <MetricCard
          title="Average Latency"
          value={`${metricsState.avgLatency.value.toFixed(2)}ms`}
          icon="⚡"
        />
      </div>

      <div class="bg-white p-6 rounded-lg shadow">
        <h3 class="text-lg font-semibold mb-4">Performance Trends</h3>
        <div class="h-80">
          <canvas ref={initializeChart}></canvas>
        </div>
      </div>
    </div>
  );
}

function MetricCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div class="bg-white p-6 rounded-lg shadow">
      <div class="flex items-center justify-between">
        <span class="text-2xl">{icon}</span>
      </div>
      <h3 class="text-lg font-medium text-gray-900 mt-4">{title}</h3>
      <p class="text-3xl font-semibold text-gray-700 mt-2">{value}</p>
    </div>
  );
}
