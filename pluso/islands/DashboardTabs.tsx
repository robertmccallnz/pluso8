import { h } from "preact";
import { useEffect } from "preact/hooks";
import { DashboardData } from "../types/dashboard.ts";
import { 
  activeTab,
  resetAllState
} from "../core/state/index.ts";
import AgentMetricsDashboard from "./dashboard/AgentMetricsDashboard.tsx";
import AnalyticsDashboard from "./dashboard/AnalyticsDashboard.tsx";
import PlaygroundIsland from "./dashboard/Playground.tsx";
import AgentWizard from "./AgentCreation/AgentWizard.tsx";
import Overview from "./dashboard/Overview.tsx";

interface DashboardTabsProps {
  data: DashboardData;
}

export default function DashboardTabs({ data }: DashboardTabsProps) {
  useEffect(() => {
    if (!activeTab.value) {
      activeTab.value = "overview";
    }
  }, []);

  const renderContent = () => {
    console.log("Current active tab:", activeTab.value);
    console.log("Dashboard data:", data);

    switch (activeTab.value) {
      case "overview":
        return <Overview data={data} />;
      case "playground":
        return <PlaygroundIsland data={data} />;
      case "metrics":
        return <AgentMetricsDashboard data={data} />;
      case "analytics":
        return <AnalyticsDashboard data={data} />;
      case "create":
        return <AgentWizard />;
      default:
        console.log("Rendering default overview");
        return <Overview data={data} />;
    }
  };

  return (
    <div class="space-y-6">
      {renderContent()}
    </div>
  );
}
