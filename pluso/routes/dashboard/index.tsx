import { Handlers, PageProps } from "$fresh/server.ts";
import { DashboardData } from "../../types/dashboard.ts";
import Layout from "../_layout.tsx";

export const handler: Handlers<DashboardData> = {
  async GET(_req, ctx) {
    // Mock data for initial render
    const mockData: DashboardData = {
      agent: {
        id: "test-agent",
        config: {
          id: "test-agent",
          name: "Test Agent",
          description: "A test agent",
          model: "gpt-4",
          useCase: "general",
          systemPrompt: "You are a helpful assistant",
          status: "active",
          version: "1.0.0",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        status: "online",
        lastDeployed: new Date().toISOString()
      },
      versions: [],
      metrics: {
        requestCount: 100,
        averageResponseTime: 250,
        errorRate: 0.02,
        lastUsed: new Date().toISOString(),
        tokenUsage: {
          prompt: 1000,
          completion: 2000,
          total: 3000,
          cost: 0.06
        },
        dailyStats: []
      },
      collaborators: [],
      tests: [],
      webhooks: [],
      rateLimits: {
        requests: {
          perSecond: 10,
          perMinute: 100,
          perHour: 1000,
          perDay: 10000
        },
        tokens: {
          perDay: 100000,
          perMonth: 3000000
        },
        cost: {
          perDay: 100,
          perMonth: 3000
        }
      },
      optimization: {
        caching: {
          enabled: true,
          ttl: 3600,
          maxSize: 1000
        },
        batching: {
          enabled: true,
          maxSize: 10,
          maxWait: 100
        },
        compression: true,
        priorityQueue: {
          enabled: true,
          levels: 3
        }
      },
      evaluations: [],
      apiKeys: []
    };

    return ctx.render(mockData);
  }
};

export default function Dashboard({ data, url }: PageProps<DashboardData>) {
  return (
    <Layout url={url}>
      <div id="dashboard-content" data-fresh-island="DashboardTabs" data-props={JSON.stringify({ data })} />
    </Layout>
  );
}

export const config = {
  title: "Dashboard",
};
