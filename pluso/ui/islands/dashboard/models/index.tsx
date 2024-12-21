import { Handlers, PageProps } from "$fresh/server.ts";
import { h } from "preact";
import ModelsPage from "../../../islands/ModelsPage.tsx";
import { Model, ModelType, ModelProvider } from "../../../lib/constants/models.ts";

interface ModelsPageData {
  models: Model[];
  providers: ModelProvider[];
  types: ModelType[];
  error?: string;
}

export const handler: Handlers<ModelsPageData> = {
  async GET(_req, ctx) {
    try {
      const apiUrl = `${new URL(_req.url).origin}/api/models`;
      console.log("[Page Debug] Fetching from:", apiUrl);

      const response = await fetch(apiUrl, {
        headers: { 
          "Accept": "application/json",
          "Cache-Control": "no-cache"
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log("[Page Debug] API Response:", data);

      if (!data.models || !Array.isArray(data.models)) {
        throw new Error("Invalid response format: models array missing");
      }

      const { models, providers, types } = data;
      console.log("[Page Debug] Extracted data:", { 
        modelCount: models.length,
        providerCount: providers?.length,
        typeCount: types?.length
      });

      return ctx.render({ models, providers, types });
    } catch (error) {
      console.error('[Page Error] Error fetching models:', error);
      return ctx.render({ 
        models: [], 
        providers: [], 
        types: [],
        error: error instanceof Error ? error.message : 'An unknown error occurred'
      });
    }
  }
};

export default function ModelsPageRoute({ data }: PageProps<ModelsPageData>) {
  const { error, models, providers, types } = data;

  if (error) {
    return (
      <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="bg-red-50 p-4 rounded-md">
            <h3 class="text-sm font-medium text-red-800">Error Loading Models</h3>
            <div class="mt-2 text-sm text-red-700">
              <p>{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!models || models.length === 0) {
    return (
      <div class="min-h-screen bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="bg-yellow-50 p-4 rounded-md">
            <h3 class="text-sm font-medium text-yellow-800">No Models Available</h3>
            <div class="mt-2 text-sm text-yellow-700">
              <p>No models are currently available. Please try again later.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="py-8">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ModelsPage
            models={models}
            providers={providers}
            types={types}
          />
        </div>
      </div>
    </div>
  );
}
