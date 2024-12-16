import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface MetricsSummary {
  avgResponseTime: number;
  totalTokens: number;
  totalCost: number;
  avgScore: number;
  lastActive: string;
}

export default function AgentMetricsCard() {
  const metrics = useSignal<MetricsSummary | null>(null);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const response = await fetch('/api/metrics/agent/82cbb039-8f91-413a-a9eb-82351c691000');
        const data = await response.json();
        metrics.value = data.summary;
      } catch (err) {
        error.value = 'Failed to fetch metrics';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    fetchMetrics();
  }, []);

  if (loading.value) return <div>Loading metrics...</div>;
  if (error.value) return <div>Error: {error.value}</div>;
  if (!metrics.value) return <div>No metrics available</div>;

  const cards = [
    {
      title: "Avg Response Time",
      value: `${metrics.value.avgResponseTime}ms`,
      color: "bg-blue-100"
    },
    {
      title: "Total Tokens",
      value: metrics.value.totalTokens.toLocaleString(),
      color: "bg-green-100"
    },
    {
      title: "Total Cost",
      value: `$${metrics.value.totalCost.toFixed(2)}`,
      color: "bg-yellow-100"
    },
    {
      title: "Avg Score",
      value: `${metrics.value.avgScore}%`,
      color: "bg-purple-100"
    }
  ];

  return (
    <>
      {cards.map((card) => (
        <div class={`${card.color} p-4 rounded-lg shadow`} key={card.title}>
          <h3 class="text-sm font-medium text-gray-500">{card.title}</h3>
          <p class="mt-2 text-2xl font-semibold text-gray-900">{card.value}</p>
        </div>
      ))}
    </>
  );
}
