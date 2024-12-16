import { useEffect, useRef } from "preact/hooks";
import { useSignal } from "@preact/signals";
import { Chart } from "../utils/chart-config.ts";

interface MetricData {
  created_at: string;
  response_time?: number;
  tokens?: number;
}

interface Props {
  type: "response_time" | "tokens";
}

export default function AgentPerformanceChart({ type }: Props) {
  const data = useSignal<MetricData[]>([]);
  const loading = useSignal(true);
  const error = useSignal<string | null>(null);
  const chartRef = useSignal<HTMLCanvasElement | null>(null);
  const chartInstance = useSignal<Chart | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/metrics/agent/82cbb039-8f91-413a-a9eb-82351c691000');
        const result = await response.json();
        data.value = result.metrics;
      } catch (err) {
        error.value = 'Failed to fetch performance data';
        console.error(err);
      } finally {
        loading.value = false;
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!chartRef.value || !data.value.length) return;

    // Destroy existing chart if it exists
    if (chartInstance.value) {
      chartInstance.value.destroy();
    }

    const ctx = chartRef.value.getContext('2d');
    if (!ctx) return;

    const chartData = data.value.map(item => ({
      x: new Date(item.created_at),
      y: type === 'response_time' ? item.response_time : item.tokens
    }));

    chartInstance.value = new Chart(ctx, {
      type: 'line',
      data: {
        datasets: [{
          label: type === 'response_time' ? 'Response Time (ms)' : 'Tokens',
          data: chartData,
          borderColor: '#8884d8',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute'
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            title: {
              display: true,
              text: type === 'response_time' ? 'Response Time (ms)' : 'Tokens'
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.value) {
        chartInstance.value.destroy();
      }
    };
  }, [data.value, type]);

  if (loading.value) return <div>Loading chart...</div>;
  if (error.value) return <div>Error: {error.value}</div>;
  if (!data.value.length) return <div>No data available</div>;

  return (
    <div style={{ width: '100%', height: '300px', position: 'relative' }}>
      <canvas
        ref={(el) => chartRef.value = el}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
