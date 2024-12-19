import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import { signal } from "@preact/signals";
import MetricsPage from "../../../islands/MetricsPage.tsx";
import { MetricsSummary } from "../../../core/types/index.ts";
import SEO from "../../../components/SEO.tsx";

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

const fetchMetrics = async () => {
  try {
    const response = await fetch("/api/metrics");
    const data = await response.json();
    metricsSignal.value = {
      ...metricsSignal.value,
      data,
      loading: false,
    };
  } catch (error) {
    metricsSignal.value = {
      ...metricsSignal.value,
      error: "Failed to load metrics",
      loading: false,
    };
  }
};

fetchMetrics();

export default function Metrics({ data }: PageProps<MetricsPageData>) {
  return (
    <>
      <SEO 
        title="Metrics | Pluso - AI Agent Platform"
        description="View detailed metrics and performance data for your AI agents"
      />
      <div class="container mx-auto px-4 py-8">
        <MetricsPage>
          {metricsSignal.value.loading ? (
            <div>Loading metrics...</div>
          ) : metricsSignal.value.error ? (
            <div>Error: {metricsSignal.value.error}</div>
          ) : (
            <div>
              {/* Render metrics data */}
              {metricsSignal.value.data.map((metric) => (
                <div key={metric.id}>
                  <h3>{metric.name}</h3>
                  <p>{metric.value}</p>
                </div>
              ))}
            </div>
          )}
        </MetricsPage>
      </div>
    </>
  );
}
