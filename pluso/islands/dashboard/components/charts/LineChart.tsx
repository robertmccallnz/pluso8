import { useEffect, useRef } from "preact/hooks";

interface DailyStats {
  date: string;
  requests: number;
  errors: number;
  tokenUsage: number;
  latency?: number;
}

interface LineChartProps {
  data: DailyStats[];
  metricType: "latency" | "requests" | "errors" | "tokens";
}

export function LineChart({ data, metricType }: LineChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Map data points based on metric type
    const points = data.map(d => ({
      timestamp: new Date(d.date).getTime(),
      value: metricType === "latency" ? d.latency || 0 :
             metricType === "requests" ? d.requests :
             metricType === "errors" ? d.errors :
             d.tokenUsage,
    }));

    // Calculate scales
    const padding = 40;
    const chartWidth = rect.width - 2 * padding;
    const chartHeight = rect.height - 2 * padding;

    const timestamps = points.map(d => d.timestamp);
    const values = points.map(d => d.value);
    const minX = Math.min(...timestamps);
    const maxX = Math.max(...timestamps);
    const minY = Math.min(...values);
    const maxY = Math.max(...values);
    const yRange = maxY - minY || 1; // Avoid division by zero

    // Draw axes
    ctx.beginPath();
    ctx.strokeStyle = "#e5e7eb";
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, rect.height - padding);
    ctx.lineTo(rect.width - padding, rect.height - padding);
    ctx.stroke();

    // Draw grid lines
    const gridLines = 5;
    ctx.textAlign = "right";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#6b7280";
    ctx.font = "12px system-ui";

    for (let i = 0; i <= gridLines; i++) {
      const y = padding + (i / gridLines) * chartHeight;
      const value = maxY - (i / gridLines) * yRange;
      
      ctx.beginPath();
      ctx.strokeStyle = "#f3f4f6";
      ctx.moveTo(padding, y);
      ctx.lineTo(rect.width - padding, y);
      ctx.stroke();

      ctx.fillText(value.toLocaleString(), padding - 10, y);
    }

    // Draw data points
    if (points.length > 1) {
      ctx.beginPath();
      ctx.strokeStyle = "#3b82f6";
      ctx.lineWidth = 2;

      points.forEach((point, i) => {
        const x = padding + ((point.timestamp - minX) / (maxX - minX)) * chartWidth;
        const y = rect.height - (padding + ((point.value - minY) / yRange) * chartHeight);
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.stroke();
    }

    // Draw x-axis labels
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    const dateLabels = Math.min(7, points.length);
    for (let i = 0; i < dateLabels; i++) {
      const point = points[Math.floor(i * (points.length - 1) / (dateLabels - 1))];
      const x = padding + ((point.timestamp - minX) / (maxX - minX)) * chartWidth;
      const date = new Date(point.timestamp);
      ctx.fillText(date.toLocaleDateString(), x, rect.height - padding + 10);
    }
  }, [data, metricType]);

  return (
    <canvas
      ref={canvasRef}
      class="w-full h-full"
      style={{ aspectRatio: "2/1" }}
    />
  );
}
