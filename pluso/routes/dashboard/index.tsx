import { Handlers, PageProps } from "$fresh/server.ts";
import { join } from "$std/path/mod.ts";
import NavBar from "../../islands/NavBar.tsx";
import DashboardTabsIsland from "../../islands/DashboardTabsIsland.tsx";
import { AgentMetrics, AgentStats, DashboardData } from "../../core/types/dashboard.ts";
import supabase from "../../core/database/supabase/client.ts";

export const handler: Handlers<DashboardData> = {
  async GET(_req, ctx) {
    try {
      // Load industries and templates from static directory
      const industriesData = await Deno.readTextFile(
        join(Deno.cwd(), "static", "data", "industries.json")
      );
      const templatesData = await Deno.readTextFile(
        join(Deno.cwd(), "static", "data", "templates.json")
      );

      // Get metrics for the last 24 hours
      const twentyFourHoursAgo = new Date();
      twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

      // Get agent metrics
      const { data: metrics, error } = await supabase
        .from('agent_metrics')
        .select('*')
        .gte('created_at', twentyFourHoursAgo.toISOString());

      if (error) {
        console.error("Error fetching metrics:", error);
        throw error;
      }

      // Parse JSON data
      const industries = JSON.parse(industriesData).industries;
      const templates = JSON.parse(templatesData).templates;

      // Calculate agent statistics
      const stats: AgentStats = {
        totalAgents: metrics?.length || 0,
        activeAgents: metrics?.filter(m => m.status === 'active').length || 0,
        totalRequests: metrics?.reduce((sum, m) => sum + m.requests, 0) || 0,
        averageLatency: metrics?.reduce((sum, m) => sum + m.latency, 0) / (metrics?.length || 1) || 0,
      };

      return ctx.render({
        industries,
        templates,
        metrics: metrics || [],
        stats,
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      return ctx.render({
        industries: [],
        templates: [],
        metrics: [],
        stats: {
          totalAgents: 0,
          activeAgents: 0,
          totalRequests: 0,
          averageLatency: 0,
        },
      });
    }
  },
};

export default function Dashboard({ data }: PageProps<DashboardData>) {
  const handleCreateAgent = async () => {
    const form = new FormData();
    form.set("action", "refresh");
    
    const response = await fetch("/dashboard", {
      method: "POST",
      body: form,
    });
    
    if (response.ok) {
      window.location.reload();
    }
  };

  const handleConfigureAgent = (agentId: string) => {
    window.location.href = `/agent/${agentId}/configure`;
  };

  return (
    <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <NavBar />
      <main class="container mx-auto px-4 py-8 mt-20">
        <div class="max-w-7xl mx-auto">
          <div class="mb-8">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
              Agent Dashboard
            </h1>
            <p class="text-lg text-gray-600">
              Manage your AI agents, monitor performance, and configure settings
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stats Cards */}
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Total Agents</h3>
              <p class="text-2xl font-semibold text-gray-900">{data.stats.totalAgents}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Active Agents</h3>
              <p class="text-2xl font-semibold text-gray-900">{data.stats.activeAgents}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Total Requests</h3>
              <p class="text-2xl font-semibold text-gray-900">{data.stats.totalRequests}</p>
            </div>
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h3 class="text-sm font-medium text-gray-500 mb-2">Avg. Latency</h3>
              <p class="text-2xl font-semibold text-gray-900">{data.stats.averageLatency.toFixed(2)}ms</p>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow-sm p-6">
            <DashboardTabsIsland 
              metrics={data.metrics}
              industries={data.industries}
              templates={data.templates}
              onCreateAgent={handleCreateAgent}
              onConfigureAgent={handleConfigureAgent}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
