import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function LoginForm() {
  const isLoading = useSignal(false);
  const error = useSignal("");
  const needsVerification = useSignal(false);

  async function handleSubmit(e: Event) {
    if (!IS_BROWSER) return;
    
    e.preventDefault();
    isLoading.value = true;
    error.value = "";

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email");
    const password = formData.get("password");

    console.log("Submitting login form...");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "same-origin",
        redirect: "follow",
      });

      console.log("Login response:", {
        status: response.status,
        statusText: response.statusText,
        redirected: response.redirected,
        url: response.url,
        type: response.type,
      });

      // Check for redirection
      if (response.redirected) {
        console.log("Following redirect to:", response.url);
        window.location.href = response.url;
        return;
      }

      // Only try to parse JSON if we didn't get a redirect
      let data;
      try {
        data = await response.json();
        console.log("Response data:", data);
      } catch (err) {
        console.error("Failed to parse response as JSON:", err);
        error.value = "Invalid server response";
        return;
      }

      // Check for HTTP errors
      if (!response.ok) {
        console.error("HTTP error:", response.status, data);
        error.value = data.message || `HTTP error: ${response.status}`;
        return;
      }

      // Check for application-level success
      if (!data.success) {
        console.error("Login failed:", data);
        if (data.message?.toLowerCase().includes("email not confirmed")) {
          needsVerification.value = true;
        } else {
          error.value = data.message || "Invalid email or password";
        }
        return;
      }

      // Success! Redirect to dashboard
      console.log("Login successful, redirecting to dashboard");
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Login error:", err);
      error.value = "An error occurred. Please try again.";
    } finally {
      isLoading.value = false;
    }
  }

  if (needsVerification.value) {
    return (
      <div class="text-center p-6 bg-info/10 rounded-lg">
        <h3 class="text-xl font-semibold text-info mb-2">Email Verification Required</h3>
        <p class="text-base-content/80 mb-4">
          Please check your email to verify your account before logging in.
        </p>
        <button
          onClick={() => needsVerification.value = false}
          class="btn btn-info"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form class="space-y-6" onSubmit={handleSubmit}>
            {error.value && (
              <div class="bg-red-50 border-l-4 border-red-400 p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm text-red-700">{error.value}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" class="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div class="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" class="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div class="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  class="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading.value}
                class={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                  isLoading.value ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading.value ? "Signing in..." : "Sign in"}
              </button>
            </div>
          </form>

          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300" />
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            <div class="mt-6 grid grid-cols-3 gap-3">
              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with Google</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"/>
                </svg>
              </button>

              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'github' })}
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with GitHub</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0C7.021 0,2.543 6.477,2.543 12s4.478 10,10.002 10c8.396 0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>

              <button
                onClick={() => supabase.auth.signInWithOAuth({ provider: 'azure' })}
                class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                <span class="sr-only">Sign in with Microsoft</span>
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 23 23">
                  <path d="M0 0h11v11H0z"/>
                  <path d="M12 0h11v11H12z"/>
                  <path d="M0 12h11v11H0z"/>
                  <path d="M12 12h11v11H12z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
