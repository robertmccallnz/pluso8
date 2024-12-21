import { Handlers, PageProps } from "$fresh/server.ts";
import { pageSEOConfig } from "../core/seo/config.ts";
import SEO from "../components/SEO.tsx";

interface DashboardData {
  error?: string;
}

export const handler: Handlers<DashboardData> = {
  async GET(_req, ctx) {
    return ctx.render({});
  },
};

export default function Dashboard({ data }: PageProps<DashboardData>) {
  let userData = null;
  let isLoading = true;
  let error = "";

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/dashboard', {
        credentials: 'include'
      });

      const data = await response.json();
      console.log('Dashboard data:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load dashboard');
      }

      userData = data.user;
      isLoading = false;
    } catch (err) {
      console.error('Dashboard error:', err);
      error = err.message;
      isLoading = false;
    }
  };

  fetchUserData();

  if (isLoading) {
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div class="min-h-screen flex items-center justify-center">
        <div class="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...pageSEOConfig.dashboard} />
      <div class="min-h-screen bg-base-100">
        <nav class="navbar bg-base-200 shadow-lg">
          <div class="flex-1">
            <a href="/" class="btn btn-ghost normal-case text-xl">Pluso</a>
          </div>
          <div class="flex-none">
            <div class="dropdown dropdown-end">
              <label tabIndex={0} class="btn btn-ghost btn-circle avatar">
                <div class="w-10 rounded-full">
                  <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData?.email || '')}`} alt="avatar" />
                </div>
              </label>
              <ul tabIndex={0} class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li>
                  <a href="/profile">Profile</a>
                </li>
                <li>
                  <a href="/settings">Settings</a>
                </li>
                <li>
                  <a href="/api/auth/logout">Logout</a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <main class="container mx-auto px-4 py-8">
          <div class="grid gap-6">
            <div class="card bg-base-200 shadow-xl">
              <div class="card-body">
                <h2 class="card-title">Welcome back, {userData?.email}!</h2>
                <p>This is your dashboard. Start building something amazing.</p>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="card bg-primary text-primary-content">
                <div class="card-body">
                  <h3 class="card-title">Projects</h3>
                  <p class="text-3xl font-bold">0</p>
                </div>
              </div>

              <div class="card bg-secondary text-secondary-content">
                <div class="card-body">
                  <h3 class="card-title">Tasks</h3>
                  <p class="text-3xl font-bold">0</p>
                </div>
              </div>

              <div class="card bg-accent text-accent-content">
                <div class="card-body">
                  <h3 class="card-title">Messages</h3>
                  <p class="text-3xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
