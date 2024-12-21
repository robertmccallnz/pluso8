import { useEffect, useState } from "preact/hooks";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "https://esm.sh/chart.js@4.4.1";
import RTCMetricsConnection from "./RTCMetricsConnection.tsx";

// Register all Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface MetricsGraphProps {
  initialData: {
    timestamps: string[];
    petunia: number[];
    maia: number[];
    jeff: number[];
  };
}

export default function MetricsGraph({ initialData }: MetricsGraphProps) {
  const [chart, setChart] = useState<ChartJS | null>(null);

  const handleMetricsUpdate = (newData: any) => {
    if (!chart) return;

    chart.data.labels = newData.timestamps;
    chart.data.datasets[0].data = newData.petunia;
    chart.data.datasets[1].data = newData.maia;
    chart.data.datasets[2].data = newData.jeff;
    chart.update('none'); // Use 'none' mode for smoother updates
  };

  useEffect(() => {
    const ctx = document.getElementById("metricsChart") as HTMLCanvasElement;
    if (!ctx) return;

    const newChart = new ChartJS(ctx, {
      type: "line",
      data: {
        labels: initialData.timestamps,
        datasets: [
          {
            label: "Petunia",
            data: initialData.petunia,
            borderColor: "#4F46E5",
            backgroundColor: "#4F46E520",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Maia",
            data: initialData.maia,
            borderColor: "#10B981",
            backgroundColor: "#10B98120",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Jeff",
            data: initialData.jeff,
            borderColor: "#F59E0B",
            backgroundColor: "#F59E0B20",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        interaction: {
          intersect: false,
          mode: "index",
        },
        plugins: {
          title: {
            display: true,
            text: "Agent Performance Metrics",
            font: {
              size: 16,
              weight: "bold",
            },
          },
          legend: {
            position: "top",
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Response Time (ms)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Time",
            },
          },
        },
        animation: {
          duration: 0, // Disable animations for smoother updates
        },
      },
    });

    setChart(newChart);

    return () => {
      newChart.destroy();
    };
  }, [initialData]);

  return (
    <div class="w-full h-[400px] bg-white rounded-lg shadow-sm p-4">
      <canvas id="metricsChart"></canvas>
      <RTCMetricsConnection onMetricsUpdate={handleMetricsUpdate} />
    </div>
  );
}
