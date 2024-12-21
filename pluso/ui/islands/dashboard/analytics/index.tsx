import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import AnalyticsDashboard from "../../../islands/dashboard/AnalyticsDashboard.tsx";
import DashboardLayout from "../_layout.tsx";
import SEO from "../../../components/SEO.tsx";

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

interface Data {
  analytics: AnalyticsData;
  layout: DashboardLayout;
  error?: string;
}

// Mock data for development
const mockAnalytics: AnalyticsData = {
  totalRequests: 1000,
  avgLatency: 250,
  successRate: 98.5,
  errorRate: 1.5,
  topAgents: [
    { id: "1", name: "Customer Service Bot", requests: 500, successRate: 99.0 },
    { id: "2", name: "Sales Assistant", requests: 300, successRate: 98.0 },
    { id: "3", name: "Support Agent", requests: 200, successRate: 97.5 }
  ],
  requestsOverTime: Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 3600000).toISOString(),
    count: Math.floor(Math.random() * 50) + 20
  })).reverse()
};

const mockLayout: DashboardLayout = {
  id: "default",
  name: "Default Layout",
  panels: [
    { id: "requests", type: "metric", title: "Total Requests", data: null },
    { id: "latency", type: "metric", title: "Average Latency", data: null },
    { id: "success", type: "metric", title: "Success Rate", data: null },
    { id: "chart", type: "chart", title: "Requests Over Time", data: null },
    { id: "agents", type: "table", title: "Top Performing Agents", data: null }
  ]
};

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    try {
      // For development, return mock data
      return ctx.render({
        analytics: mockAnalytics,
        layout: mockLayout
      });
      
      // TODO: Implement real API call when backend is ready
      /*
      const url = new URL(req.url);
      const apiUrl = new URL("/api/analytics", url.origin);
      const response = await fetch(apiUrl.toString());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const data = await response.json();
      return ctx.render(data);
      */
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return ctx.render({ 
        analytics: mockAnalytics,
        layout: mockLayout,
        error: error.message 
      });
    }
  }
};

export default function Analytics({ data }: PageProps<Data>) {
  if (data.error) {
    return (
      <div class="min-h-screen bg-gray-50">
        <div class="py-8">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="mb-8">
              <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
              <p class="mt-2 text-gray-600">
                View your AI agents' performance metrics and insights
              </p>
            </div>
            <div class="bg-red-50 border-l-4 border-red-400 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-700">{data.error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p class="mt-2 text-gray-600">
              View your AI agents' performance metrics and insights
            </p>
          </div>
          <AnalyticsDashboard
            analytics={data.analytics}
            layout={data.layout}
          />
        </div>
      </div>
    </div>
  );
}

Analytics.layout = DashboardLayout;
