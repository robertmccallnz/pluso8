import { Handlers, PageProps } from "$fresh/server.ts";
import CreateAgent from "../../islands/dashboard/CreateAgent.tsx";
import { listIndustries } from "../../core/services/industry.ts";
import { listTemplates } from "../../core/services/template.ts";
import SEO from '../../components/SEO.tsx';
import type { Industry } from "../../core/services/industry.ts";
import type { Template } from "../../core/services/template.ts";

interface CreatePageData {
  industries: Industry[];
  templates: Template[];
  error?: string;
}

export const handler: Handlers<CreatePageData> = {
  async GET(_req, ctx) {
    try {
      const [industries, templates] = await Promise.all([
        listIndustries(),
        listTemplates(),
      ]);

      if (!industries?.length || !templates?.length) {
        console.error("No industries or templates found:", { industries, templates });
        throw new Error("Failed to load required data");
      }

      return ctx.render({ industries, templates });
    } catch (error) {
      console.error("Error loading create page data:", error);
      return ctx.render({ 
        industries: [], 
        templates: [], 
        error: error instanceof Error ? error.message : "Failed to load data" 
      });
    }
  },
};

export default function CreateAgentPage({ data }: PageProps<CreatePageData>) {
  return (
    <>
      <SEO
        title="Create Agent - Pluso"
        description="Create a new AI agent for your business"
      />
      <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div class="mb-8">
            <h1 class="text-3xl font-bold text-gray-900">Create New Agent</h1>
            <p class="mt-2 text-sm text-gray-500">
              Configure your AI agent by following these steps
            </p>
          </div>
          
          <CreateAgent
            industries={data.industries}
            templates={data.templates}
          />
        </div>
      </div>
    </>
  );
}
