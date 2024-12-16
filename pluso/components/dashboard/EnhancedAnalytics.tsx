import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";
import { TemplateManager, type TemplateAnalytics } from "./IndustryTemplates";

interface AnalyticsTimeframe {
  label: string;
  days: number;
}

interface UsageTrend {
  date: string;
  uses: number;
  tokens: number;
  cost: number;
}

interface EnhancedAnalyticsProps {
  templateId: string;
}

export function EnhancedAnalytics({ templateId }: EnhancedAnalyticsProps): JSX.Element {
  const [analytics, setAnalytics] = useState<TemplateAnalytics | undefined>();
  const [timeframe, setTimeframe] = useState<AnalyticsTimeframe>({ label: "Last 7 Days", days: 7 });
  const [usageTrends, setUsageTrends] = useState<UsageTrend[]>([]);

  const templateManager = TemplateManager.getInstance();

  const timeframes: AnalyticsTimeframe[] = [
    { label: "Last 7 Days", days: 7 },
    { label: "Last 30 Days", days: 30 },
    { label: "Last 90 Days", days: 90 },
  ];

  useEffect(() => {
    loadAnalytics();
  }, [templateId, timeframe]);

  const loadAnalytics = () => {
    const analytics = templateManager.getTemplateAnalytics(templateId);
    setAnalytics(analytics);
    if (analytics) {
      generateUsageTrends(analytics);
    }
  };

  const generateUsageTrends = (analytics: TemplateAnalytics) => {
    const trends: UsageTrend[] = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - timeframe.days);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      trends.push({
        date: d.toISOString().split("T")[0],
        uses: Math.floor(Math.random() * 10), // Replace with actual data
        tokens: Math.floor(Math.random() * 1000), // Replace with actual data
        cost: Math.random() * 0.1, // Replace with actual data
      });
    }

    setUsageTrends(trends);
  };

  const renderChart = (data: UsageTrend[]) => {
    const maxUses = Math.max(...data.map(d => d.uses));
    const height = 200;
    const width = "100%";

    return (
      <svg
        viewBox={`0 0 ${data.length * 50} ${height}`}
        style={{ width, height }}
        class="mt-4"
      >
        {data.map((point, i) => (
          <g key={point.date} transform={`translate(${i * 50}, 0)`}>
            <rect
              x="10"
              y={height - (point.uses / maxUses) * height}
              width="30"
              height={(point.uses / maxUses) * height}
              class="fill-blue-500"
            />
            <text
              x="25"
              y={height - 10}
              class="text-xs text-gray-500"
              text-anchor="middle"
              transform="rotate(-45 25 180)"
            >
              {point.date}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  const calculateTrends = () => {
    if (!usageTrends.length) return null;

    const current = usageTrends.slice(-7);
    const previous = usageTrends.slice(-14, -7);

    const currentUses = current.reduce((sum, d) => sum + d.uses, 0);
    const previousUses = previous.reduce((sum, d) => sum + d.uses, 0);
    const usageChange = ((currentUses - previousUses) / previousUses) * 100;

    const currentCost = current.reduce((sum, d) => sum + d.cost, 0);
    const previousCost = previous.reduce((sum, d) => sum + d.cost, 0);
    const costChange = ((currentCost - previousCost) / previousCost) * 100;

    return { usageChange, costChange };
  };

  const trends = calculateTrends();

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-medium">Enhanced Analytics</h3>
        <select
          value={timeframe.days}
          onChange={(e) =>
            setTimeframe(
              timeframes.find(
                (t) => t.days === parseInt((e.target as HTMLSelectElement).value)
              ) || timeframes[0]
            )
          }
          class="px-3 py-2 border rounded-md"
        >
          {timeframes.map((t) => (
            <option key={t.days} value={t.days}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {analytics && (
        <div class="space-y-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Usage Trend</div>
              <div class="text-2xl font-semibold">
                {trends?.usageChange.toFixed(1)}%
                <span
                  class={`text-sm ml-2 ${
                    trends?.usageChange >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {trends?.usageChange >= 0 ? "↑" : "↓"}
                </span>
              </div>
              <div class="text-xs text-gray-500">vs previous period</div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Cost Trend</div>
              <div class="text-2xl font-semibold">
                {trends?.costChange.toFixed(1)}%
                <span
                  class={`text-sm ml-2 ${
                    trends?.costChange >= 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {trends?.costChange >= 0 ? "↑" : "↓"}
                </span>
              </div>
              <div class="text-xs text-gray-500">vs previous period</div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow-sm">
              <div class="text-sm text-gray-600">Success Rate</div>
              <div class="text-2xl font-semibold">
                {(analytics.successRate * 100).toFixed(1)}%
              </div>
              <div class="text-xs text-gray-500">overall</div>
            </div>
          </div>

          <div class="bg-white p-4 rounded-lg shadow-sm">
            <h4 class="text-sm font-medium text-gray-700 mb-4">Usage Over Time</h4>
            {renderChart(usageTrends)}
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white p-4 rounded-lg shadow-sm">
              <h4 class="text-sm font-medium text-gray-700 mb-4">
                Variable Usage Heat Map
              </h4>
              <div class="space-y-2">
                {Object.entries(analytics.popularVariables)
                  .sort(([, a], [, b]) => b - a)
                  .map(([variable, count]) => {
                    const intensity = Math.min(
                      (count / Math.max(...Object.values(analytics.popularVariables))) * 100,
                      100
                    );
                    return (
                      <div
                        key={variable}
                        class="flex items-center space-x-2"
                      >
                        <div
                          class="h-4 bg-blue-100"
                          style={{
                            width: `${intensity}%`,
                            backgroundColor: `rgba(59, 130, 246, ${
                              intensity / 100
                            })`,
                          }}
                        />
                        <span class="text-sm text-gray-600">{variable}</span>
                        <span class="text-sm text-gray-500">{count}</span>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div class="bg-white p-4 rounded-lg shadow-sm">
              <h4 class="text-sm font-medium text-gray-700 mb-4">
                Industry Distribution
              </h4>
              <div class="space-y-2">
                {Object.entries(analytics.industryUsage)
                  .sort(([, a], [, b]) => b - a)
                  .map(([industry, count]) => {
                    const percentage =
                      (count /
                        Object.values(analytics.industryUsage).reduce(
                          (a, b) => a + b,
                          0
                        )) *
                      100;
                    return (
                      <div key={industry} class="space-y-1">
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600">{industry}</span>
                          <span class="text-gray-500">{percentage.toFixed(1)}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                          <div
                            class="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
