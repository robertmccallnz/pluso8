import { PageProps } from "$fresh/server.ts";
import Playground from "../../islands/Playground.tsx";

export default function PlaygroundPage(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50">
      <main class="pt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="py-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-4">
              Agent Playground
            </h1>
            <p class="text-lg text-gray-600 mb-6">
              Test and evaluate AI models with custom system prompts.
            </p>
          </div>
          <Playground />
        </div>
      </main>
    </div>
  );
}
