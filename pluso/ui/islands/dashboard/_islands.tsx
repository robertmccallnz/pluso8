import { Island } from "$fresh/runtime.ts";
import SideBar from "../../islands/SideBar.tsx";
import DashboardTabs from "../../islands/DashboardTabs.tsx";
import { DashboardData } from "../../types/dashboard.ts";

interface IslandsProps {
  url: URL;
  data: DashboardData;
}

export default function Islands({ url, data }: IslandsProps) {
  return (
    <>
      <Island name="SideBar">
        <SideBar currentPath={url.pathname} />
      </Island>
      <Island name="DashboardTabs">
        <DashboardTabs data={data} />
      </Island>
    </>
  );
}
