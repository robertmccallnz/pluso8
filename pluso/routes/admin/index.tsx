import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import AdminDashboard from "../../islands/admin/AdminDashboard.tsx";
import { supabaseAdmin } from "../../core/database/supabase/client.ts";

interface AdminData {
  users: {
    total: number;
    active: number;
    new: number;
  };
  agents: {
    total: number;
    active: number;
    byType: Record<string, number>;
  };
  metrics: {
    totalRequests: number;
    avgResponseTime: number;
    errorRate: number;
    costToDate: number;
  };
  systemStatus: {
    cpu: number;
    memory: number;
    storage: number;
    uptime: number;
  };
}

export const handler: Handlers<AdminData> = {
  async GET(req, ctx) {
    // Check if user is admin
    const cookies = req.headers.get('cookie');
    const sessionToken = cookies?.match(/session=([^;]+)/)?.[1];
    if (!sessionToken) {
      return new Response('Unauthorized', { status: 401 });
    }

    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(sessionToken);
    if (userError || !user?.user_metadata?.isAdmin) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Fetch all admin data
    const [usersRes, agentsRes, metricsRes, systemRes] = await Promise.all([
      fetch(`${req.url}/api/admin/users`),
      fetch(`${req.url}/api/admin/agents`),
      fetch(`${req.url}/api/admin/metrics`),
      fetch(`${req.url}/api/admin/system`),
    ]);

    const [users, agents, metrics, systemStatus] = await Promise.all([
      usersRes.json(),
      agentsRes.json(),
      metricsRes.json(),
      systemRes.json(),
    ]);

    return ctx.render({ users, agents, metrics, systemStatus });
  },
};

export default function AdminPage({ data }: PageProps<AdminData>) {
  return (
    <>
      <Head>
        <title>PluSO Admin Dashboard</title>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" />
      </Head>
      <AdminDashboard {...data} />
    </>
  );
}
