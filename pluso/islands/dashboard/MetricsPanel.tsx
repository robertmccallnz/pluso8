import { useEffect, useRef } from "preact/hooks";
import { MetricVisualization } from "../../core/types/metrics.ts";
import { COLORS } from "../../lib/constants/styles.ts";

interface Props {
  panel: {
    id: string;
    type: 'metric' | 'chart' | 'table' | 'alert';
    visualization: MetricVisualization;
  };
  realTimeData: number[];
}

export default function MetricsPanel({ panel, realTimeData }: Props) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<any>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Initialize chart based on visualization type
    switch (panel.visualization.type) {
      case 'line':
        initLineChart(ctx);
        break;
      case 'gauge':
        initGaugeChart(ctx);
        break;
      case 'bar':
        initBarChart(ctx);
        break;
      // Add other chart types as needed
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [panel.visualization.type]);

  useEffect(() => {
    if (chartInstance.current) {
      updateChartData(realTimeData);
    }
  }, [realTimeData]);

  const initLineChart = (ctx: CanvasRenderingContext2D) => {
    const { data, options } = panel.visualization;
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: generateTimeLabels(realTimeData.length),
        datasets: [{
          ...data.datasets[0],
          data: realTimeData,
          borderColor: COLORS.brand.blue,
          tension: 0.4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          }
        },
        scales: {
          x: {
            type: 'time',
            time: {
              unit: 'minute'
            }
          },
          y: {
            beginAtZero: true
          }
        },
        animation: {
          duration: 0
        }
      }
    });
  };

  const initGaugeChart = (ctx: CanvasRenderingContext2D) => {
    const { data, options } = panel.visualization;
    chartInstance.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Value'],
        datasets: [{
          data: [data.datasets[0].data[0], 100 - data.datasets[0].data[0]],
          backgroundColor: [COLORS.brand.blue, '#e5e7eb'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        circumference: 180,
        rotation: -90,
        plugins: {
          legend: {
            display: false
          }
        },
        animation: {
          duration: 1000
        }
      }
    });
  };

  const initBarChart = (ctx: CanvasRenderingContext2D) => {
    const { data, options } = panel.visualization;
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.labels,
        datasets: data.datasets.map(dataset => ({
          ...dataset,
          backgroundColor: COLORS.brand.blue
        }))
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top'
          }
        },
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  };

  const updateChartData = (newData: number[]) => {
    if (!chartInstance.current) return;

    const chart = chartInstance.current;
    const labels = generateTimeLabels(newData.length);

    chart.data.labels = labels;
    chart.data.datasets[0].data = newData;
    chart.update('none');
  };

  const generateTimeLabels = (count: number) => {
    const now = new Date();
    return Array.from({ length: count }, (_, i) => {
      const time = new Date(now.getTime() - (count - i - 1) * 1000);
      return time.toISOString();
    });
  };

  return (
    <div class="bg-white rounded-lg shadow p-4">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-medium text-gray-900">{panel.visualization.data.datasets[0].label}</h3>
        {panel.visualization.options.refreshRate && (
          <span class="text-sm text-gray-500">
            Updates every {panel.visualization.options.refreshRate}s
          </span>
        )}
      </div>
      <div class="h-64">
        <canvas ref={chartRef} />
      </div>
    </div>
  );
}
