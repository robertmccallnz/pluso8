import { PageProps } from "$fresh/server.ts";
import CreateAgentFlow from "../../islands/CreateAgentFlow.tsx";

export default function CreateAgentPage(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div class="px-4 py-6 sm:px-0">
          <div class="bg-white rounded-lg shadow">
            <CreateAgentFlow />
          </div>
        </div>
      </div>
    </div>
  );
}
