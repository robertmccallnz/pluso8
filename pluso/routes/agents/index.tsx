import { Handlers, PageProps } from "$fresh/server.ts";
import NavBar from "../../islands/NavBar.tsx";
import { COLORS, TYPOGRAPHY } from "../../lib/constants/styles.ts";
import { AgentStats } from "../../core/types/dashboard.ts";
import supabase from "../../core/database/supabase/client.ts";
import CreateAgentFlow from "../../islands/CreateAgentFlow.tsx";

interface Template {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: string;
}

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
}

interface AgentsPageData {
  agents: AgentStats[];
  industries: Industry[];
  templates: Template[];
}

const AGENT_TEMPLATES: Template[] = [
  {
    id: "research-assistant",
    name: "Research Assistant",
    description: "Helps researchers analyze papers, summarize findings, and generate insights",
    icon: "🔬",
    category: "Research"
  },
  {
    id: "content-creator",
    name: "Content Creator",
    description: "Assists in writing, editing, and optimizing content for various platforms",
    icon: "✍️",
    category: "Content"
  },
  {
    id: "customer-service",
    name: "Customer Service",
    description: "Handles customer inquiries and provides support 24/7",
    icon: "💬",
    category: "Support"
  },
  {
    id: "legal-assistant",
    name: "Legal Assistant",
    description: "Helps with legal research, document review, and compliance checks",
    icon: "⚖️",
    category: "Legal"
  },
  {
    id: "education-tutor",
    name: "Education Tutor",
    description: "Provides personalized learning assistance and explanations",
    icon: "📚",
    category: "Education"
  }
];

const INDUSTRIES: Industry[] = [
  {
    id: "healthcare",
    name: "Healthcare",
    description: "Medical research, patient care, and healthcare administration",
    icon: "🏥"
  },
  {
    id: "education",
    name: "Education",
    description: "Teaching, learning, and educational administration",
    icon: "🎓"
  },
  {
    id: "legal",
    name: "Legal",
    description: "Law firms, compliance, and legal research",
    icon: "⚖️"
  },
  {
    id: "technology",
    name: "Technology",
    description: "Software development, IT support, and tech consulting",
    icon: "💻"
  },
  {
    id: "retail",
    name: "Retail",
    description: "E-commerce, customer service, and retail operations",
    icon: "🛍️"
  }
];

export const handler: Handlers<AgentsPageData> = {
  async GET(_req, ctx) {
    try {
      if (!supabase) {
        console.warn('Supabase not initialized - returning empty agents list');
        return ctx.render({
          agents: [],
          industries: INDUSTRIES,
          templates: AGENT_TEMPLATES
        });
      }

      // Get agent metrics for the last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      const { data: metrics, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .gte('timestamp', twentyFourHoursAgo.getTime());

      if (error) throw error;

      // Process metrics into agent stats
      const agentMetricsMap = new Map<string, AgentStats>();
      metrics?.forEach((metric) => {
        if (!agentMetricsMap.has(metric.agent_id)) {
          agentMetricsMap.set(metric.agent_id, {
            id: metric.agent_id,
            name: metric.agent_name,
            type: metric.agent_type,
            metrics: {
              successes: 0,
              total: 0,
              responseTimes: [],
              conversations: new Set(),
              tokens: 0,
              cost: 0,
              lastActive: 0,
              primaryModelUsage: 0,
              fallbackModelUsage: 0
            }
          });
        }
        const stats = agentMetricsMap.get(metric.agent_id)!;
        stats.metrics.successes += metric.success ? 1 : 0;
        stats.metrics.total += 1;
        stats.metrics.responseTimes.push(metric.response_time);
        stats.metrics.conversations.add(metric.conversation_id);
        stats.metrics.tokens += metric.tokens;
        stats.metrics.cost += metric.cost;
        stats.metrics.lastActive = Math.max(stats.metrics.lastActive, metric.timestamp);
        if (metric.model === stats.metrics.primaryModel) {
          stats.metrics.primaryModelUsage += 1;
        } else {
          stats.metrics.fallbackModelUsage += 1;
        }
      });

      return ctx.render({
        agents: Array.from(agentMetricsMap.values()),
        industries: INDUSTRIES,
        templates: AGENT_TEMPLATES
      });
    } catch (error) {
      console.error("Error loading agents page:", error);
      return ctx.render({
        agents: [],
        industries: INDUSTRIES,
        templates: AGENT_TEMPLATES
      });
    }
  }
};

export default function AgentsPage({ data }: PageProps<AgentsPageData>) {
  return (
    <div class="min-h-screen bg-gray-50">
      <NavBar />
      <main class="pt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div class="py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              AI Agents Dashboard
            </h1>
            <p class="text-lg text-gray-600 mb-6">
              Create, manage, and evaluate your AI agents in one place.
            </p>
          </div>

          {/* Quick Actions */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Create Agent</h3>
              <p class="text-gray-600 mb-4">Build a custom AI agent for your specific needs.</p>
              <a
                href="#create-agent"
                class="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                Get Started →
              </a>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Try Models</h3>
              <p class="text-gray-600 mb-4">Test different AI models in our interactive playground.</p>
              <a
                href="/dashboard/playground"
                class="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                Open Playground →
              </a>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-lg font-semibold text-gray-900 mb-2">Explore Models</h3>
              <p class="text-gray-600 mb-4">Browse our collection of available AI models.</p>
              <a
                href="/models"
                class="inline-flex items-center text-blue-600 hover:text-blue-700"
              >
                View Models →
              </a>
            </div>
          </div>

          {/* Featured Agents */}
          <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">Featured Agents</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <a href="/petunia" class="group">
                <div class="p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200">
                  <div class="flex items-start space-x-3">
                    <span class="text-2xl">🌸</span>
                    <div>
                      <h3 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        Petunia
                      </h3>
                      <p class="text-sm text-gray-600">
                        Your ecological garden companion
                      </p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/jeff" class="group">
                <div class="p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200">
                  <div class="flex items-start space-x-3">
                    <span class="text-2xl">⚖️</span>
                    <div>
                      <h3 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        Jeff Legal
                      </h3>
                      <p class="text-sm text-gray-600">
                        NZ legal research assistant
                      </p>
                    </div>
                  </div>
                </div>
              </a>
              <a href="/maia" class="group">
                <div class="p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors duration-200">
                  <div class="flex items-start space-x-3">
                    <span class="text-2xl">✨</span>
                    <div>
                      <h3 class="font-medium text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                        Maia
                      </h3>
                      <p class="text-sm text-gray-600">
                        AI development companion
                      </p>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* Create Agent Section */}
          <div id="create-agent" class="bg-white rounded-lg shadow-sm overflow-hidden">
            <div class="border-b border-gray-200 p-6">
              <h2 class="text-xl font-semibold text-gray-900">Create Your Agent</h2>
              <p class="mt-2 text-sm text-gray-600">
                Follow these steps to create and deploy your custom AI agent. After deployment, 
                you can evaluate and fine-tune your agent in the playground.
              </p>
            </div>
            <CreateAgentFlow />
          </div>
        </div>
      </main>
    </div>
  );
}
