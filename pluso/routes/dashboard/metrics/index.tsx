import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { signal } from "@preact/signals";
import MetricsPage from "../../../islands/MetricsPage.tsx";
import { MetricsSummary } from "../../../core/types/index.ts";
import SEO from "../../../components/SEO.tsx";
import DashboardLayout from "../_layout.tsx";

interface MetricsPageData {
  initialMetrics: MetricsSummary[];
}

export const handler: Handlers<MetricsPageData> = {
  async GET(_req, ctx) {
    try {
      // Get initial metrics data from the API
      const response = await fetch(`${new URL(_req.url).origin}/api/metrics`);
      const initialMetrics = await response.json();

      return ctx.render({ initialMetrics });
    } catch (error) {
      console.error('Error fetching initial metrics:', error);
      return ctx.render({ initialMetrics: [] });
    }
  },
};

const metricsSignal = signal({
  data: [],
  loading: true,
  error: null,
});

async function fetchMetrics() {
  try {
    metricsSignal.value = {
      ...metricsSignal.value,
      loading: true,
    };

    const response = await fetch('/api/metrics');
    const data = await response.json();

    metricsSignal.value = {
      data,
      loading: false,
      error: null,
    };
  } catch (error) {
    metricsSignal.value = {
      ...metricsSignal.value,
      loading: false,
      error: error.message,
    };
  }
}

fetchMetrics();

export default function Metrics({ data }: PageProps<MetricsPageData>) {
  return (
    <>
      <SEO title="Metrics" />
      <div class="space-y-6">
        <div class="flex justify-between items-center">
          <h1 class="text-2xl font-bold">Metrics</h1>
        </div>
        <MetricsPage initialMetrics={data.initialMetrics} />
      </div>
    </>
  );
}

Metrics.layout = DashboardLayout;
