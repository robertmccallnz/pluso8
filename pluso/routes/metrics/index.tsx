import { Handlers, PageProps } from "$fresh/server.ts";
import supabase from "../../core/database/supabase/client.ts";
import { verifyAgentMetrics } from "../../core/metrics/verify.ts";
import NavBar from "../../islands/NavBar.tsx";
import { COLORS, TYPOGRAPHY, COMPONENTS } from "../../lib/constants/styles.ts";

interface MetricsSummary {
  agentId: string;
  totalConversations: number;
  avgResponseTime: number;
  successRate: number;
  lastActive: string;
  errorCount: number;
  isConnected: boolean;
  metricsCount: number;
}

export const handler: Handlers<MetricsSummary[]> = {
  async GET(_req, ctx) {
    try {
      const agentIds = ["pet_UNIA", "leg_AL", "mai_A"];
      
      // Get verification status
      const verificationStatus = await verifyAgentMetrics(agentIds);

      // Get agent metrics
      const { data: metrics, error: metricsError } = await supabase
        .from('agent_metrics')
        .select('*')
        .order('created_at', { ascending: false });

      if (metricsError) throw metricsError;

      // Process metrics
      const summary: MetricsSummary[] = agentIds.map(agentId => {
        const verification = verificationStatus.find(s => s.agentId === agentId);
        const metric = metrics?.find((m: any) => m.agent_id === agentId);

        return {
          agentId,
          totalConversations: metric?.metrics.conversations?.total || 0,
          avgResponseTime: metric?.metrics.conversations?.responseTime?.avg || 0,
          successRate: metric?.metrics.performance?.successRate || 100,
          lastActive: metric ? new Date(metric.metrics.timestamps?.lastActive || metric.created_at).toLocaleString() : 'Never',
          errorCount: verification?.errorCount || 0,
          isConnected: verification?.isConnected || false,
          metricsCount: verification?.metricsCount || 0,
        };
      });

      return ctx.render(summary);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      return ctx.render([]);
    }
  },
};

export default function Metrics({ data: metrics }: PageProps<MetricsSummary[]>) {
  return (
    <div class="min-h-screen bg-gray-50">
      <NavBar />
      <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div class="flex flex-col gap-6">
          <div class={`${COMPONENTS.card.base} p-6`}>
            <h1 class={`text-${TYPOGRAPHY.fontSize["3xl"]} font-${TYPOGRAPHY.fontWeight.bold} mb-4 text-${COLORS.gray[900]}`}>
              Agent Performance Metrics
            </h1>
            <p class={`text-${TYPOGRAPHY.fontSize.lg} mb-6 text-${COLORS.gray[600]}`}>
              Monitor and analyze agent performance across various metrics
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {metrics.map((metric) => (
                <div key={metric.agentId} class={`${COMPONENTS.card.base} ${COMPONENTS.card.hover} p-6`}>
                  <h3 class={`text-${TYPOGRAPHY.fontSize.lg} font-${TYPOGRAPHY.fontWeight.semibold} mb-2 text-${COLORS.gray[900]}`}>
                    {metric.agentId}
                  </h3>
                  <div class={`text-${TYPOGRAPHY.fontSize["3xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.primary[600]}`}>
                    {metric.successRate.toFixed(1)}%
                  </div>
                  <p class={`text-${TYPOGRAPHY.fontSize.sm} mt-2 text-${COLORS.gray[500]}`}>
                    Success Rate
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Metrics Section */}
          <div class={`${COMPONENTS.card.base} p-6`}>
            <h2 class={`text-${TYPOGRAPHY.fontSize["2xl"]} font-${TYPOGRAPHY.fontWeight.bold} mb-4 text-${COLORS.gray[900]}`}>
              Detailed Metrics
            </h2>
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th class={`px-6 py-3 text-left text-${TYPOGRAPHY.fontSize.xs} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]} uppercase tracking-wider`}>
                      Agent ID
                    </th>
                    <th class={`px-6 py-3 text-left text-${TYPOGRAPHY.fontSize.xs} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]} uppercase tracking-wider`}>
                      Total Conversations
                    </th>
                    <th class={`px-6 py-3 text-left text-${TYPOGRAPHY.fontSize.xs} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]} uppercase tracking-wider`}>
                      Avg Response Time
                    </th>
                    <th class={`px-6 py-3 text-left text-${TYPOGRAPHY.fontSize.xs} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]} uppercase tracking-wider`}>
                      Success Rate
                    </th>
                    <th class={`px-6 py-3 text-left text-${TYPOGRAPHY.fontSize.xs} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]} uppercase tracking-wider`}>
                      Last Active
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  {metrics.map((metric) => (
                    <tr key={metric.agentId}>
                      <td class={`px-6 py-4 whitespace-nowrap text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[900]}`}>
                        {metric.agentId}
                      </td>
                      <td class={`px-6 py-4 whitespace-nowrap text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[500]}`}>
                        {metric.totalConversations}
                      </td>
                      <td class={`px-6 py-4 whitespace-nowrap text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[500]}`}>
                        {metric.avgResponseTime.toFixed(0)}ms
                      </td>
                      <td class={`px-6 py-4 whitespace-nowrap text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[500]}`}>
                        {metric.successRate.toFixed(1)}%
                      </td>
                      <td class={`px-6 py-4 whitespace-nowrap text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[500]}`}>
                        {metric.lastActive}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
