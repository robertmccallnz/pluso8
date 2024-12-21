import { PageProps } from "$fresh/server.ts";
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO {...pageSEOConfig.dashboard} />
      <div className="min-h-screen bg-base-100">
        <main className="container mx-auto px-4 py-8">
          <div className="grid gap-6">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Welcome back, {userData?.email}!</h2>
                <p>This is your dashboard. Start building something amazing.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card bg-primary text-primary-content">
                <div className="card-body">
                  <h3 className="card-title">Projects</h3>
                  <p className="text-3xl font-bold">0</p>
                </div>
              </div>

              <div className="card bg-secondary text-secondary-content">
                <div className="card-body">
                  <h3 className="card-title">Tasks</h3>
                  <p className="text-3xl font-bold">0</p>
                </div>
              </div>

              <div className="card bg-accent text-accent-content">
                <div className="card-body">
                  <h3 className="card-title">Messages</h3>
                  <p className="text-3xl font-bold">0</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}