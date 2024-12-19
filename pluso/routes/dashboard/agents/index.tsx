import { PageProps } from "$fresh/server.ts";
import MaiaWidget from "../../../islands/agents/maia/MaiaWidget.tsx";
import JeffWidget from "../../../islands/agents/jeff/JeffWidget.tsx";
import PetuniaWidget from "../../../islands/agents/petunia/PetuniaWidget.tsx";

export default function AgentsPage(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">AI Agents</h1>
          <p class="mt-2 text-gray-600">
            Chat with our specialized AI agents
          </p>
        </div>
        
        <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Maia Card */}
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Maia</h2>
              <p class="text-gray-600 mb-4">
                Your AI companion focused on emotional intelligence and personal growth.
              </p>
              <MaiaWidget />
            </div>
          </div>

          {/* Jeff Card */}
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Jeff</h2>
              <p class="text-gray-600 mb-4">
                Your efficient personal assistant for task management and productivity.
              </p>
              <JeffWidget />
            </div>
          </div>

          {/* Petunia Card */}
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="p-6">
              <h2 class="text-2xl font-bold text-gray-900 mb-4">Petunia</h2>
              <p class="text-gray-600 mb-4">
                Expert gardening assistant with deep knowledge of plants and cultivation.
              </p>
              <PetuniaWidget />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
