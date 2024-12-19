import { Handlers, PageProps } from "$fresh/server.ts";
import DeployAgent from "../../../../islands/DeployAgent.tsx";
import { AgentConfig } from "../../../../agents/types/agent.ts";
import { REGISTERED_AGENTS } from "../../../../agents/core/registry.ts";
import SEO from "../../../../components/SEO.tsx";

interface DeploymentData {
  agentId: string;
  config: AgentConfig;
  deploymentStatus?: {
    status: "pending" | "in_progress" | "completed" | "failed";
    message?: string;
    error?: string;
  };
}

export const handler: Handlers<DeploymentData> = {
  async GET(req, ctx) {
    const agentId = ctx.params.agentId;
    
    try {
      // Check if agent exists in registry
      const agent = REGISTERED_AGENTS[agentId];
      if (!agent) {
        return new Response("Agent not found", { status: 404 });
      }

      // Convert registry agent to config format
      const config: AgentConfig = {
        name: agent.name,
        description: agent.description,
        industry: agent.industry,
        type: agent.type,
        version: agent.version,
        systemPrompt: agent.systemPrompt,
        capabilities: agent.capabilities,
        metadata: agent.metadata,
        // Add any additional config fields needed for deployment
        models: {
          primary: "gpt-4",
          fallback: "gpt-3.5-turbo",
        },
        endpoints: {
          ws: `/api/agents/${agentId}/ws`,
          api: `/api/agents/${agentId}`,
        },
      };

      return ctx.render({
        agentId,
        config,
      });
    } catch (error) {
      console.error(`Error preparing deployment for agent ${agentId}:`, error);
      return new Response("Failed to prepare deployment", { 
        status: 500,
        statusText: error.message 
      });
    }
  },
};

export default function DeployPage({ data }: PageProps<DeploymentData>) {
  const { agentId, config, deploymentStatus } = data;

  return (
    <>
      <SEO 
        title="Deploy Agent | Pluso - AI Agent Platform"
        description="Deploy and configure your AI agent"
        path={`/dashboard/agents/deploy/${agentId}`}
      />
      <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto py-8 px-4">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="mb-6">
              <h1 class="text-2xl font-bold text-gray-900">Deploy {config.name}</h1>
              <p class="mt-2 text-gray-600">
                Industry: {config.industry} | Type: {config.type} | Version: {config.version}
              </p>
            </div>
            <DeployAgent
              agentId={agentId}
              config={config}
              initialStatus={deploymentStatus}
            />
          </div>
        </div>
      </div>
    </>
  );
}
