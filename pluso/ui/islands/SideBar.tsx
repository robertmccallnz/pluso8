import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { activeTab } from "../core/state/index.ts";

interface SideBarProps {
  currentPath: string;
}

export default function SideBar({ currentPath }: SideBarProps) {
  if (!IS_BROWSER) return null;

  const isActive = (tab: string) => {
    return activeTab.value === tab ? "bg-primary text-white" : "hover:bg-gray-100 text-gray-700";
  };

  const handleTabChange = (tab: string) => {
    if (!IS_BROWSER) return;
    activeTab.value = tab;
  };

  return (
    <div class="h-full bg-white border-r border-gray-200">
      <div class="flex flex-col h-full">
        {/* Navigation Links */}
        <nav class="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          <button 
            onClick={() => handleTabChange("overview")}
            class={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("overview")}`}
          >
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h8" />
            </svg>
            Overview
          </button>

          <button 
            onClick={() => handleTabChange("playground")}
            class={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("playground")}`}
          >
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Playground
          </button>

          <button 
            onClick={() => handleTabChange("metrics")}
            class={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("metrics")}`}
          >
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Metrics
          </button>

          <button 
            onClick={() => handleTabChange("analytics")}
            class={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("analytics")}`}
          >
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Analytics
          </button>

          <button 
            onClick={() => handleTabChange("create")}
            class={`flex items-center w-full px-4 py-2 text-sm font-medium rounded-lg transition-colors ${isActive("create")}`}
          >
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
            Create Agent
          </button>
        </nav>

        {/* User Section */}
        <div class="border-t border-gray-200 p-4">
          <button class="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-5 h-5 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
