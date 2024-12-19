import { ErrorPageProps } from "$fresh/server.ts";

export default function Error500Page({ error }: ErrorPageProps) {
  // Log the error to help with debugging
  console.error("Server Error:", error);

  return (
    <div class="p-4">
      <h1 class="text-2xl font-bold">Server Error</h1>
      <p class="mt-4 text-gray-600">An error occurred while processing your request.</p>
      {error && (
        <pre class="mt-4 p-4 bg-gray-100 rounded overflow-auto">
          {error.stack || error.message || String(error)}
        </pre>
      )}
    </div>
  );
}
