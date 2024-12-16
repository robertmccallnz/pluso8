import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import NavBar from "../../islands/NavBar.tsx";
import CreateAgentFormIsland from "../../islands/CreateAgentFormIsland.tsx";

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  industry: string;
  systemPrompt: string;
  evaluationCriteria: {
    id: string;
    name: string;
    description: string;
    type: string;
  }[];
}

interface CreateAgentPageData {
  industries: Industry[];
  templates: Template[];
}

export const handler: Handlers<CreateAgentPageData> = {
  async GET(_req, ctx) {
    try {
      // Load industries and templates from static directory
      const industriesData = await Deno.readTextFile(
        new URL("../../static/data/industries.json", import.meta.url)
      );
      const templatesData = await Deno.readTextFile(
        new URL("../../static/data/templates.json", import.meta.url)
      );

      const industries = JSON.parse(industriesData).industries;
      const templates = JSON.parse(templatesData).templates;

      return ctx.render({ industries, templates });
    } catch (error) {
      console.error("Error loading data:", error);
      return ctx.render({ industries: [], templates: [] });
    }
  },
};

export default function CreateAgent({ data }: PageProps<CreateAgentPageData>) {
  return (
    <>
      <Head>
        <title>Create New Agent - Pluso</title>
      </Head>
      <div class="min-h-screen bg-gray-50">
        <NavBar />
        <main class="container mx-auto px-4 py-8 mt-20">
          <div class="max-w-4xl mx-auto">
            <div class="bg-white rounded-lg shadow-sm p-6">
              <h1 class="text-3xl font-bold text-gray-900 mb-2">
                Create New Agent
              </h1>
              <p class="text-gray-600 mb-6">
                Configure your AI agent by selecting an industry and template
              </p>
              <CreateAgentFormIsland
                industries={data.industries}
                templates={data.templates}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
