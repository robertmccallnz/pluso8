import { PageProps } from "$fresh/server.ts";
import Examples from "../../../islands/Examples.tsx";

export default function ExamplesPage(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-50 py-8">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">Example Agents</h1>
          <p class="mt-2 text-gray-600">
            Try out our example agents and see what they can do
          </p>
        </div>
        <Examples />
      </div>
    </div>
  );
}
