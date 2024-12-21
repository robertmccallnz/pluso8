import { PageProps } from "$fresh/server.ts";
import SEO from '../../components/SEO.tsx';

export default function CreateAgentPage(_props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <SEO
        title="Create Agent - Pluso"
        description="Create a new AI agent with custom capabilities"
      />
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Create AI Agent</h1>
          <p class="mt-2 text-gray-600">
            Create your own AI agent with custom capabilities
          </p>
        </div>
        <div data-fresh-island>
          {/* AgentCreationWizard will be rendered here by Fresh */}
        </div>
      </div>
    </div>
  );
}
