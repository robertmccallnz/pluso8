import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: Event) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message || "Something went wrong");
        return;
      }

      // Show success message and instructions
      setSuccess(true);
      form.reset();
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div class="text-center p-6 bg-success/10 rounded-lg">
        <h3 class="text-xl font-semibold text-success mb-2">Account Created Successfully!</h3>
        <p class="text-base-content/80 mb-4">
          Please check your email to verify your account. Once verified, you can log in.
        </p>
        <a
          href="/login"
          class="btn btn-primary"
        >
          Go to Login
        </a>
      </div>
    );
  }

  return (
    <form class="space-y-6" onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name" class="block text-sm font-medium text-base-content">
          Full name
        </label>
        <div class="mt-1">
          <input
            id="name"
            name="name"
            type="text"
            required
            class="input input-bordered w-full bg-base-200/50 focus:bg-base-100"
            placeholder="John Doe"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" class="block text-sm font-medium text-base-content">
          Email address
        </label>
        <div class="mt-1">
          <input
            id="email"
            name="email"
            type="email"
            required
            class="input input-bordered w-full bg-base-200/50 focus:bg-base-100"
            placeholder="john@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" class="block text-sm font-medium text-base-content">
          Password
        </label>
        <div class="mt-1">
          <input
            id="password"
            name="password"
            type="password"
            required
            class="input input-bordered w-full bg-base-200/50 focus:bg-base-100"
            placeholder="••••••••"
          />
        </div>
      </div>

      {error && (
        <div class="text-error text-sm mt-2">
          {error}
        </div>
      )}

      <button
        type="submit"
        class="btn btn-primary w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <span class="loading loading-spinner"></span>
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
