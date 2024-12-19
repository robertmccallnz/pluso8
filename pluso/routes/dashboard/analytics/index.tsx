import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import AnalyticsDashboard from "../../../islands/dashboard/AnalyticsDashboard.tsx";
import Layout from "../../../routes/_layout.tsx";
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

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    try {
      const url = new URL(req.url);
      const apiUrl = new URL("/api/analytics", url.origin);
      const response = await fetch(apiUrl.toString());
      
      if (!response.ok) {
        throw new Error(`Failed to fetch analytics: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      const { analytics, layout } = data;

      if (!analytics || !layout) {
        throw new Error('Missing required data in response');
      }

      return ctx.render({ analytics, layout });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      return ctx.render({ 
        analytics: {
          totalRequests: 0,
          avgLatency: 0,
          successRate: 0,
          errorRate: 0,
          topAgents: [],
          requestsOverTime: [],
        },
        layout: {
          id: "error",
          name: "Error",
          panels: [],
        },
        error: error instanceof Error ? error.message : "An unknown error occurred"
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

Analytics.layout = Layout;
