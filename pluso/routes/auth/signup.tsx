import { PageProps } from "$fresh/server.ts";
import SignupForm from "../components/SignupForm.tsx";

export default function SignupPage(props: PageProps) {
  return (
    <div class="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div class="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 class="text-center text-3xl font-extrabold text-gray-900 mb-8">
          Welcome to Pluso
        </h1>
        <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div class="mb-6 text-center">
            <p class="text-gray-600">
              Try Pluso free for 30 minutes - no signup required!
            </p>
            <p class="text-sm text-gray-500 mt-2">
              Or create an account for full access
            </p>
          </div>
          <SignupForm onSubmit={(data) => {
            // Handle signup logic here
            window.location.href = "/";
          }} />
        </div>
      </div>
    </div>
  );
}
