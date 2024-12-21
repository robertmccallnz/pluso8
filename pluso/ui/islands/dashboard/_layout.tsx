import { PageProps } from "$fresh/server.ts";
import { DashboardData } from "../../types/dashboard.ts";

interface DashboardProps extends PageProps {
  data: DashboardData;
}

export default function DashboardLayout({ Component, url, data }: DashboardProps) {
  return (
    <div class="flex h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside class="w-64 flex-shrink-0 bg-white border-r border-gray-200">
        <div id="side-bar" data-fresh-island="SideBar" data-props={JSON.stringify({ currentPath: url.pathname })} class="h-full" />
      </aside>

      {/* Main Content Area */}
      <main class="flex-1 overflow-auto">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Component />
        </div>
      </main>
    </div>
  );
}

export const config = {
  title: "Dashboard",
};
