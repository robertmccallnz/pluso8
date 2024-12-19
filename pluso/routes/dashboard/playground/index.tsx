import { PageProps } from "$fresh/server.ts";
import PlaygroundIsland from "../../../islands/dashboard/Playground.tsx";
import { DashboardData } from "../../../types/dashboard.ts";

export default function Playground(_props: PageProps<DashboardData>) {
  return (
    <div class="min-h-screen bg-gray-50">
      <PlaygroundIsland />
    </div>
  );
}
