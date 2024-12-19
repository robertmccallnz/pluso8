import { Handlers, PageProps } from "$fresh/server.ts";
import { pageSEOConfig } from "../core/seo/config.ts";
import SEO from "../components/SEO.tsx";
import SignupForm from "../islands/auth/SignupForm.tsx";

interface SignupData {
  error?: string;
}

export const handler: Handlers<SignupData> = {
  async GET(_req, ctx) {
    return ctx.render({});
  },
};

export default function Signup({ data }: PageProps<SignupData>) {
  return (
    <>
      <SEO {...pageSEOConfig.signup} />
      <div class="min-h-screen flex flex-col justify-center bg-gradient-to-br from-base-200 via-base-100 to-base-300">
        <div class="sm:mx-auto sm:w-full sm:max-w-md">
          <div class="text-center">
            <h2 class="text-3xl font-extrabold text-base-content">
              Create your account
            </h2>
            <p class="mt-2 text-sm text-base-content/70">
              Already have an account?{" "}
              <a href="/login" class="font-medium text-primary hover:text-primary-focus transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>

        <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div class="bg-base-100 py-8 px-4 shadow-xl ring-1 ring-base-content/5 sm:rounded-lg sm:px-10">
            <SignupForm />
          </div>
        </div>
      </div>
    </>
  );
}
