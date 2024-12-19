import { Handlers, PageProps } from "$fresh/server.ts";
import AgentDetailsIsland from "../../../islands/dashboard/AgentDetails.tsx";
import { DashboardData } from "../../../types/dashboard.ts";
import SEO from "../../../components/SEO.tsx";
import { pageSEOConfig } from "../../../core/seo/config.ts";

interface PageData {
  agentId: string;
  dashboardData: DashboardData;
}

export const handler: Handlers<PageData> = {
  async GET(_req, ctx) {
    const agentId = ctx.params.id;
    
    // TODO: Fetch actual agent data from your backend
    const dashboardData: DashboardData = {
      agent: {
        id: agentId,
        config: {}, // Fetch actual config
        status: "online",
        lastDeployed: new Date().toISOString(),
      },
      versions: [],
      metrics: {
        requestCount: 0,
        averageResponseTime: 0,
        errorRate: 0,
        lastUsed: new Date().toISOString(),
        tokenUsage: {
          prompt: 0,
          completion: 0,
          total: 0,
          cost: 0,
        },
        dailyStats: [],
      },
      collaborators: [],
      tests: [],
      webhooks: [],
      rateLimits: {
        requests: {
          perSecond: 10,
          perMinute: 100,
          perHour: 1000,
          perDay: 10000,
        },
        tokens: {
          perDay: 100000,
          perMonth: 3000000,
        },
        cost: {
          perDay: 10,
          perMonth: 300,
        },
      },
      optimization: {
        caching: {
          enabled: true,
          ttl: 3600,
          maxSize: 1000,
        },
        batching: {
          enabled: true,
          maxSize: 10,
          maxWait: 100,
        },
        compression: true,
        priorityQueue: {
          enabled: true,
          levels: 3,
        },
      },
      evaluations: [],
    };

    return ctx.render({ agentId, dashboardData });
  },
};

export default function AgentDetailsPage({ data }: PageProps<PageData>) {
  return (
    <>
      <SEO 
        title="Agent Details | Pluso - AI Agent Platform"
        description="View and manage your AI agent details"
        path={`/dashboard/agent/${data.agentId}`}
      />
      <div class="container mx-auto px-4 py-8">
        <AgentDetailsIsland agentId={data.agentId} dashboardData={data.dashboardData} />
      </div>
    </>
  );
}
