import { PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import AdminDashboard from "../../islands/admin/AdminDashboard.tsx";

interface AdminData {
  users: {
    total: number;
    active: number;
    new: number;
  };
  agents: {
    total: number;
    active: number;
    new: number;
  };
  metrics: {
    total: number;
    thisWeek: number;
    lastWeek: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    lastMonth: number;
  };
}

const mockData: AdminData = {
  users: {
    total: 1000,
    active: 750,
    new: 50,
  },
  agents: {
    total: 25,
    active: 20,
    new: 5,
  },
  metrics: {
    total: 10000,
    thisWeek: 2500,
    lastWeek: 2000,
  },
  revenue: {
    total: 50000,
    thisMonth: 15000,
    lastMonth: 12000,
  },
};

export default function AdminPage(_props: PageProps) {
  return (
    <>
      <Head>
        <title>Admin Dashboard</title>
      </Head>
      <div class="min-h-screen bg-gray-100">
        <AdminDashboard {...mockData} />
      </div>
    </>
  );
}
