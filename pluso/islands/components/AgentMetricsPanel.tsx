import { useState, useEffect } from "preact/hooks";
import { AgentMetrics } from "../../core/types/metrics.ts";
import { COLORS } from "../../lib/constants/styles.ts";

interface Props {
  agentId: string;
  showDetails?: boolean;
}

// Check if we're in the browser
const IS_BROWSER = typeof window !== "undefined";

export default function AgentMetricsPanel({ agentId, showDetails = false }: Props) {
  const [metrics, setMetrics] = useState<AgentMetrics | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!IS_BROWSER) return;

    // Connect to WebSocket for real-time updates
    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${wsProtocol}//${window.location.host}/api/metrics/ws?agentId=${agentId}`;
    
    console.log('Attempting WebSocket connection to:', wsUrl);

    const socket = new WebSocket(wsUrl);
    setWs(socket);

    socket.onopen = () => {
      console.log('WebSocket connection established');
      setError(null);
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setMetrics(data);
      } catch (err) {
        console.error('Error parsing WebSocket message:', err);
        setError('Failed to parse metrics data');
      }
    };

    socket.onerror = (event) => {
      console.error('WebSocket error:', event);
      setError('Failed to connect to metrics service');
    };

    socket.onclose = () => {
      console.log('WebSocket connection closed');
    };

    // Cleanup on unmount
    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.close();
      }
    };
  }, [agentId]);

  if (error) {
    return (
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-red-600">{error}</p>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div class="bg-white border border-gray-200 rounded-lg p-4">
        <p class="text-gray-500">Loading metrics...</p>
      </div>
    );
  }

  const successRate = metrics.total > 0 
    ? ((metrics.successes / metrics.total) * 100).toFixed(1)
    : '0.0';

  const avgResponseTime = metrics.responseTimes.length > 0
    ? (metrics.responseTimes.reduce((a, b) => a + b, 0) / metrics.responseTimes.length).toFixed(2)
    : '0.00';

  const formattedCost = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 4
  }).format(metrics.cost);

  const lastActiveTime = metrics.lastActive
    ? new Date(metrics.lastActive).toLocaleString()
    : 'Never';

  return (
    <div class="bg-white border border-gray-200 rounded-lg p-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <QuickStat
          label="Success Rate"
          value={`${successRate}%`}
          trend={parseFloat(successRate) >= 90 ? 'positive' : parseFloat(successRate) >= 75 ? undefined : 'negative'}
        />
        <QuickStat
          label="Total Requests"
          value={metrics.total.toString()}
        />
        <QuickStat
          label="Avg Response Time"
          value={`${avgResponseTime}s`}
          trend={parseFloat(avgResponseTime) <= 2 ? 'positive' : parseFloat(avgResponseTime) <= 5 ? undefined : 'negative'}
        />
        <QuickStat
          label="Total Cost"
          value={formattedCost}
        />
      </div>

      {showDetails && (
        <div class="border-t border-gray-200 pt-4 mt-4 space-y-2">
          <DetailRow label="Unique Conversations" value={metrics.conversations.size.toString()} />
          <DetailRow label="Total Tokens" value={metrics.tokens.toString()} />
          <DetailRow label="Primary Model Usage" value={metrics.primaryModelUsage.toString()} />
          <DetailRow label="Fallback Model Usage" value={metrics.fallbackModelUsage.toString()} />
          <DetailRow label="Last Active" value={lastActiveTime} />
        </div>
      )}
    </div>
  );
}

function QuickStat({ label, value, trend }: { label: string; value: string; trend?: 'positive' | 'negative' }) {
  return (
    <div class="p-3 bg-gray-50 rounded-lg">
      <div class="text-sm text-gray-500 mb-1">{label}</div>
      <div class="flex items-center">
        <div 
          class={`text-lg font-semibold ${
            trend === 'positive' ? 'text-green-600' :
            trend === 'negative' ? 'text-red-600' :
            'text-gray-900'
          }`}
        >
          {value}
        </div>
        {trend && (
          <span class="ml-1">
            {trend === 'positive' ? '↑' : '↓'}
          </span>
        )}
      </div>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div class="flex justify-between">
      <div class="text-gray-500">{label}</div>
      <div class="font-medium text-gray-900">{value}</div>
    </div>
  );
}
