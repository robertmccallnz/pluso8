import { useCallback, useEffect, useState } from "preact/hooks";
import { fetchWithCache } from "../utils/fetch-utils.ts";

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

interface AnalyticsResponse {
  analytics: AnalyticsData;
  layout: DashboardLayout;
}

export function useAnalytics(refreshInterval = 5000) {
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await fetchWithCache("/api/analytics");
      setData(response);
      setError(null);
    } catch (err) {
      setError(err as Error);
      console.error("Error fetching analytics:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();

    // Only set up polling if refreshInterval is greater than 0
    if (refreshInterval > 0) {
      const intervalId = setInterval(fetchAnalytics, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchAnalytics, refreshInterval]);

  return { data, error, loading, refetch: fetchAnalytics };
}
