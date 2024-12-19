import { Handlers, PageProps } from "$fresh/server.ts";
import { pageSEOConfig } from "../../core/seo/config.ts";
import SEO from "../../components/SEO.tsx";
import DashboardTabs from "../../islands/DashboardTabs.tsx";
import { DashboardData } from "../../types/dashboard.ts";
import { State } from "../../utils/auth.ts";

interface PageData extends DashboardData {
  connectionStatus: {
    isConnected: boolean;
    lastUpdate: string | null;
  };
  industries: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    templates: string[];
  }>;
  templates: Array<{
    id: string;
    name: string;
    description: string;
    type: string;
    industry: string;
    systemPrompt: string;
    features: string[];
    requiredModels: {
      primary: string[];
      fallback: string[];
      embedding: string[];
    };
    evaluationCriteria: Array<{
      id: string;
      name: string;
      description: string;
      weight: number;
    }>;
  }>;
}

export const handler: Handlers<PageData, State> = {
  async GET(_req, ctx) {
    // Check if user is authenticated
    if (!ctx.state.user) {
      return new Response("", {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    try {
      const data: PageData = {
        agent: {
          id: "default-agent",
          config: {
            name: "Default Agent",
            description: "Default agent configuration",
            model: {
              model: "gpt-4",
              temperature: 0.7,
              maxTokens: 2000,
              topP: 1,
              frequencyPenalty: 0,
              presencePenalty: 0,
            },
            systemPrompt: "You are a helpful AI assistant.",
            features: ["chat", "analysis"],
            evaluationCriteria: [
              {
                id: "accuracy",
                name: "Accuracy",
                description: "How accurate are the responses?",
                weight: 0.4,
              },
              {
                id: "clarity",
                name: "Clarity",
                description: "How clear and understandable are the responses?",
                weight: 0.3,
              },
              {
                id: "helpfulness",
                name: "Helpfulness",
                description: "How helpful are the responses in solving the user's problem?",
                weight: 0.3,
              },
            ],
          },
          metrics: {
            totalCalls: 0,
            averageLatency: 0,
            errorRate: 0,
            lastUpdated: new Date().toISOString(),
          },
        },
        industries: [
          {
            id: "customer-service",
            name: "Customer Service",
            description: "AI agents for customer support and service",
            icon: "🎯",
            templates: ["cs-basic", "cs-advanced"],
          },
          {
            id: "sales",
            name: "Sales",
            description: "AI agents for sales and lead generation",
            icon: "💼",
            templates: ["sales-basic", "sales-advanced"],
          },
        ],
        templates: [
          {
            id: "cs-basic",
            name: "Basic Customer Service",
            description: "A basic customer service agent template",
            type: "customer-service",
            industry: "customer-service",
            systemPrompt: "You are a helpful customer service agent.",
            features: ["chat", "faqs"],
            requiredModels: {
              primary: ["gpt-4"],
              fallback: ["gpt-3.5-turbo"],
              embedding: ["text-embedding-ada-002"],
            },
            evaluationCriteria: [
              {
                id: "response-time",
                name: "Response Time",
                description: "How quickly the agent responds",
                weight: 0.3,
              },
              {
                id: "accuracy",
                name: "Accuracy",
                description: "Accuracy of information provided",
                weight: 0.4,
              },
              {
                id: "satisfaction",
                name: "Customer Satisfaction",
                description: "Overall customer satisfaction",
                weight: 0.3,
              },
            ],
          },
        ],
        connectionStatus: {
          isConnected: false,
          lastUpdate: null,
        },
      };

      return ctx.render(data);
    } catch (error) {
      console.error("Error in dashboard handler:", error);
      return ctx.render({
        agent: null,
        industries: [],
        templates: [],
        connectionStatus: {
          isConnected: false,
          lastUpdate: null,
        },
      });
    }
  },
};

export default function Dashboard({ data }: PageProps<PageData>) {
  return (
    <>
      <SEO {...pageSEOConfig.dashboard} />
      <div class="min-h-screen bg-base-100">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="space-y-6">
            <div class="flex items-center justify-between">
              <h1 class="text-2xl font-bold text-base-content">Dashboard</h1>
              <div class="flex items-center space-x-4">
                <span class={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  data.connectionStatus.isConnected ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                }`}>
                  {data.connectionStatus.isConnected ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>
            <DashboardTabs data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
