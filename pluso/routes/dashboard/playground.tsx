import { useSignal } from "@preact/signals";
import { Handlers, PageProps } from "$fresh/server.ts";
import { State } from "../../utils/auth.ts";
import DashboardLayout from "./_layout.tsx";

interface PlaygroundData {
  models: Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export const handler: Handlers<PlaygroundData, State> = {
  async GET(_req, ctx) {
    return ctx.render({
      models: [
        {
          id: "gpt-4",
          name: "GPT-4",
          description: "Most capable model, best at creative and analytical tasks",
        },
        {
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo",
          description: "Fast and efficient for most tasks",
        },
        {
          id: "claude-2",
          name: "Claude 2",
          description: "Advanced model with strong reasoning capabilities",
        },
      ],
    });
  },
};

export default function PlaygroundPage({ data }: PageProps<PlaygroundData>) {
  const selectedModel = useSignal(data.models[0].id);
  const prompt = useSignal("");
  const response = useSignal("");
  const isLoading = useSignal(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!prompt.value.trim() || isLoading.value) return;

    isLoading.value = true;
    try {
      // TODO: Implement API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      response.value = "This is a sample response. In production, this would be replaced with actual API response.";
    } catch (error) {
      console.error("Error:", error);
    } finally {
      isLoading.value = false;
    }
  };

  return (
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold">AI Playground</h1>
        <div class="flex items-center space-x-4">
          <label class="block text-sm font-medium text-gray-700">Model</label>
          <select
            value={selectedModel.value}
            onChange={(e) => selectedModel.value = e.currentTarget.value}
            class="block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary rounded-md"
          >
            {data.models.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-6">
        {/* Input Panel */}
        <div class="space-y-4">
          <div class="bg-white rounded-lg shadow">
            <div class="p-4">
              <textarea
                value={prompt.value}
                onChange={(e) => prompt.value = e.currentTarget.value}
                placeholder="Enter your prompt here..."
                class="w-full h-[calc(100vh-20rem)] p-4 border-gray-300 rounded-md focus:ring-primary focus:border-primary resize-none"
              />
            </div>
            <div class="border-t p-4 flex justify-between items-center">
              <div class="text-sm text-gray-500">
                {prompt.value.length} characters
              </div>
              <button
                onClick={handleSubmit}
                disabled={isLoading.value || !prompt.value.trim()}
                class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading.value ? (
                  <>
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Output Panel */}
        <div class="bg-white rounded-lg shadow">
          <div class="p-4 h-[calc(100vh-16rem)] overflow-auto">
            {response.value ? (
              <div class="prose max-w-none">
                {response.value}
              </div>
            ) : (
              <div class="h-full flex items-center justify-center text-gray-500">
                Response will appear here
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

PlaygroundPage.layout = DashboardLayout;

export const config = {
  title: "Playground",
};
