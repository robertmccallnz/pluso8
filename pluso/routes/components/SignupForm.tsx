import { JSX } from "preact";
import { signal } from "@preact/signals";

export interface SignupFormProps {
  onSubmit?: (data: { email: string; password: string; name: string }) => void;
}

const formStateSignal = signal({
  email: "",
  password: "",
  confirmPassword: "",
  loading: false,
  error: null,
});

export default function SignupForm({ onSubmit }: SignupFormProps) {
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    formStateSignal.value = { ...formStateSignal.value, loading: true, error: null };

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formStateSignal.value.email,
          password: formStateSignal.value.password,
        }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      // Redirect to dashboard on success
      window.location.href = "/dashboard";
    } catch (error) {
      formStateSignal.value = {
        ...formStateSignal.value,
        error: "Failed to create account",
        loading: false,
      };
    }
  };

  return (
    <form
      class="space-y-6 max-w-sm mx-auto p-6 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      {formStateSignal.value.error && (
        <div class="text-red-500">{formStateSignal.value.error}</div>
      )}
      <div>
        <label
          htmlFor="name"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Full Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          value={formStateSignal.value.name}
          onInput={(e) =>
            (formStateSignal.value = {
              ...formStateSignal.value,
              name: (e.target as HTMLInputElement).value,
            })
          }
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="John Doe"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          value={formStateSignal.value.email}
          onInput={(e) =>
            (formStateSignal.value = {
              ...formStateSignal.value,
              email: (e.target as HTMLInputElement).value,
            })
          }
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label
          htmlFor="password"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          value={formStateSignal.value.password}
          onInput={(e) =>
            (formStateSignal.value = {
              ...formStateSignal.value,
              password: (e.target as HTMLInputElement).value,
            })
          }
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          minLength={8}
          placeholder="••••••••"
        />
      </div>

      <div>
        <label
          htmlFor="confirmPassword"
          class="block text-sm font-medium text-gray-700 mb-1"
        >
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          required
          value={formStateSignal.value.confirmPassword}
          onInput={(e) =>
            (formStateSignal.value = {
              ...formStateSignal.value,
              confirmPassword: (e.target as HTMLInputElement).value,
            })
          }
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          minLength={8}
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={formStateSignal.value.loading}
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
      >
        {formStateSignal.value.loading ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
