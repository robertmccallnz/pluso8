import { PageProps } from "$fresh/server.ts";
import MaiaWidget from "../../../islands/agents/maia/MaiaWidget.tsx";
import AgentWizard from "../../../islands/AgentCreation/AgentWizard.tsx";

export default function AgentsPage({ url }: PageProps) {
  // Get userId from URL or session (you'll need to implement proper auth)
  const userId = url.searchParams.get("userId") || "test-user";

  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Create AI Agent</h1>
          <p class="mt-2 text-gray-600">
            Create your own AI agent with custom capabilities
          </p>
        </div>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Agent Creation Wizard */}
          <div class="lg:col-span-2">
            <AgentWizard userId={userId} />
          </div>

          {/* Maia Helper */}
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Need Help?</h2>
              <p class="text-gray-600 mb-4">
                Chat with Maia, our AI assistant, to get help creating your agent.
              </p>
              <MaiaWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
