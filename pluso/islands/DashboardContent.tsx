import { DashboardData } from "../types/dashboard.ts";
import DashboardTabs from "./DashboardTabs.tsx";

interface DashboardContentProps {
  data: DashboardData;
  initialTab?: string;
}

export default function DashboardContent({ data, initialTab }: DashboardContentProps) {
  return (
    <DashboardTabs data={data} initialTab={initialTab} />
  );
}
