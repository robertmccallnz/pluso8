
import { useEffect, useState } from "https://esm.sh/preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { fetchWithCache } from "../../utils/fetch-utils.ts";

interface SummaryCardProps {
  title: string;
  value: number;
  suffix?: string;
  trend?: {
    change: number;
    direction: "up" | "down" | "stable";
    significance: number;
  } | null;
}

function SummaryCard({ title, value, suffix = "", trend }: SummaryCardProps) {
  const displayValue = value !== null && value !== undefined 
    ? value.toLocaleString(undefined, { maximumFractionDigits: 2 })
    : 'N/A';

  return (
    <div class="bg-white overflow-hidden shadow rounded-lg">
      <div class="p-5">
        <div class="flex items-center">
          <div class="flex-1">
            <p class="text-sm font-medium text-gray-500 truncate">{title}</p>
            <p class="mt-1 text-3xl font-semibold text-gray-900">
              {displayValue}{suffix}
            </p>
          </div>
        </div>
        {trend && (
          <div class="mt-4">
            <div class={`flex items-center text-sm ${
              trend.direction === 'up' ? 'text-green-600' : 
              trend.direction === 'down' ? 'text-red-600' : 
              'text-gray-600'
            }`}>
              {trend.direction === 'up' ? '↑' : 
               trend.direction === 'down' ? '↓' : 
               '→'} {trend.change}%
              <span class="ml-2 text-gray-500">vs last period</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AnalyticsData {
  totalRequests: number;
  avgLatency: number;
  successRate: number;
  errorRate: number;
  topAgents: Array<{
    id: string;
    name: string;
    requests: number;
    successRate: number;
  }>;
  requestsOverTime: Array<{
    timestamp: string;
    count: number;
  }>;
}

interface DashboardLayout {
  id: string;
  name: string;
  panels: Array<{
    id: string;
    type: "chart" | "metric" | "table";
    title: string;
    data: unknown;
  }>;
}

interface AnalyticsProps {
  analytics: AnalyticsData;
  layout: DashboardLayout;
  connectionStatus: {
    isConnected: boolean;
    lastUpdate: string | null;
  };
}

interface AnalyticsResponse {
  analytics: AnalyticsData;
  layout: DashboardLayout;
}

function AgentTable({ agents }: { agents: AnalyticsData['topAgents'] }) {
  if (!agents || agents.length === 0) {
    return (
      <div class="bg-white shadow overflow-hidden sm:rounded-lg p-4 text-center text-gray-500">
        No agent data available
      </div>
    );
  }

  return (
    <div class="bg-white shadow overflow-hidden sm:rounded-lg">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Agent
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requests
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Success Rate
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {agents.map((agent) => (
              <tr key={agent.id}>
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {agent.name}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {agent.requests.toLocaleString()}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {typeof agent.successRate === 'number' 
                    ? `${agent.successRate.toFixed(1)}%`
                    : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TimeSeriesChart({ data }: { data: AnalyticsData['requestsOverTime'] }) {
  const maxCount = Math.max(...data.map(d => d.count));
  const height = 200;
  const width = 800;
  const padding = 40;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - (d.count / maxCount) * (height - 2 * padding) - padding;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div class="bg-white p-4 rounded-lg shadow">
      <h3 class="text-lg font-medium text-gray-900 mb-4">Requests Over Time</h3>
      <svg width={width} height={height} class="overflow-visible">
        {/* Y-axis */}
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#E5E7EB"
          stroke-width="1"
        />
        {/* X-axis */}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#E5E7EB"
          stroke-width="1"
        />
        {/* Data line */}
        <polyline
          points={points}
          fill="none"
          stroke="#3B82F6"
          stroke-width="2"
        />
        {/* Data points */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
          const y = height - (d.count / maxCount) * (height - 2 * padding) - padding;
          return (
            <circle
              cx={x}
              cy={y}
              r="4"
              fill="#3B82F6"
            />
          );
        })}
        {/* Y-axis labels */}
        <text x={padding - 10} y={padding} text-anchor="end" class="text-xs">
          {maxCount}
        </text>
        <text x={padding - 10} y={height - padding} text-anchor="end" class="text-xs">
          0
        </text>
        {/* X-axis labels */}
        {data.map((d, i) => {
          if (i % Math.ceil(data.length / 5) === 0) {
            const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
            const time = new Date(d.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <text
                x={x}
                y={height - padding + 20}
                text-anchor="middle"
                class="text-xs"
              >
                {time}
              </text>
            );
          }
        })}
      </svg>
    </div>
  );
}

function AnalyticsDashboardContent({ analytics, error }: { 
  analytics: AnalyticsData;
  error: string | null;
}) {
  return (
    <div class="p-6 space-y-6">
      {/* Error message */}
      {error && (
        <div class="p-4">
          <div class="bg-red-50 border border-red-200 rounded-md p-4">
            <p class="text-red-700">Error loading analytics: {error}</p>
          </div>
        </div>
      )}

      {/* Summary metrics */}
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Requests"
          value={analytics.totalRequests}
        />
        <SummaryCard
          title="Average Latency"
          value={analytics.avgLatency}
          suffix="ms"
        />
        <SummaryCard
          title="Success Rate"
          value={analytics.successRate}
          suffix="%"
        />
        <SummaryCard
          title="Error Rate"
          value={analytics.errorRate}
          suffix="%"
        />
      </div>

      {/* Time series chart */}
      <div class="mt-8">
        <TimeSeriesChart data={analytics.requestsOverTime} />
      </div>

      {/* Top agents table */}
      <div class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Top Performing Agents</h3>
        <AgentTable agents={analytics.topAgents} />
      </div>
    </div>
  );
}

export default function AnalyticsDashboard({ 
  analytics: initialAnalytics, 
  layout: initialLayout,
  connectionStatus 
}: AnalyticsProps) {
  // Return early if not in browser
  if (!IS_BROWSER) {
    return <AnalyticsDashboardContent analytics={initialAnalytics} error={null} />;
  }

  const [analytics, setAnalytics] = useState<AnalyticsData>(initialAnalytics);
  const [layout, setLayout] = useState<DashboardLayout>(initialLayout);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetchWithCache<AnalyticsResponse>("/api/analytics");
        if (response.analytics) {
          setAnalytics(response.analytics);
        }
        if (response.layout) {
          setLayout(response.layout);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to fetch analytics data");
      }
    };

    // Initial fetch
    fetchAnalytics();

    // Set up polling
    const intervalId = setInterval(fetchAnalytics, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return <AnalyticsDashboardContent analytics={analytics} error={error} />;
}
