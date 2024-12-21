import { IS_BROWSER } from "$fresh/runtime.ts";
import { signal } from "@preact/signals";

const loadingSignal = signal({
  isLoading: true,
  progress: 0,
  message: "Loading...",
});

export default function LoadingStateIsland() {
  if (!IS_BROWSER) {
    return <div>Loading...</div>;
  }

  return (
    <div class="flex items-center justify-center min-h-screen bg-gray-100">
      <div class="bg-white p-8 rounded-lg shadow-lg w-96">
        <div class="text-center">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <h2 class="text-xl font-semibold mb-2">
            {loadingSignal.value.message}
          </h2>
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div
              class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${loadingSignal.value.progress}%` }}
            ></div>
          </div>
          <p class="text-gray-600 mt-2">
            {loadingSignal.value.progress}% Complete
          </p>
        </div>
      </div>
    </div>
  );
}
