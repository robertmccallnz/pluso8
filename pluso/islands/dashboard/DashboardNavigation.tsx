import { useSignal } from "@preact/signals";
import { activeTab } from "../../core/state/index.ts";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface DashboardNavigationProps {
  currentPath: string;
}

export default function DashboardNavigation({ currentPath }: DashboardNavigationProps) {
  if (IS_BROWSER && activeTab) {
    activeTab.value = currentPath.split("/")[2] || "overview";
  }

  return (
    <aside class="w-80 bg-base-200 h-screen">
      <div class="flex flex-col h-full">
        {/* Header with brand and collapse */}
        <div class="navbar bg-base-200 border-b border-base-300 px-4">
          <div class="flex-1">
            <a href="/dashboard" class="text-xl font-bold">Pluso.</a>
          </div>
          <div class="flex-none lg:hidden">
            <label for="dashboard-drawer" class="btn btn-square btn-ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-6 h-6 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
              </svg>
            </label>
          </div>
        </div>

        {/* Navigation Links */}
        <div class="flex-1 px-4 py-6 overflow-y-auto">
          <ul class="menu menu-lg gap-2">
            <li>
              <a href="/dashboard" class={activeTab?.value === "overview" ? "active" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
                Overview
              </a>
            </li>
            <li>
              <a href="/dashboard/playground" class={activeTab?.value === "playground" ? "active" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M14.7519 11.1679L11.5547 9.03647C10.8901 8.59343 10 9.06982 10 9.86852V14.1315C10 14.9302 10.8901 15.4066 11.5547 14.9635L14.7519 12.8321C15.3457 12.4362 15.3457 11.5638 14.7519 11.1679Z" />
                  <path d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" />
                </svg>
                Playground
              </a>
            </li>
            <li>
              <a href="/dashboard/metrics" class={activeTab?.value === "metrics" ? "active" : ""}>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path d="M16 8V16M12 11V16M8 14V16M6 20H18C19.1046 20 20 19.1046 20 18V6C20 4.89543 19.1046 4 18 4H6C4.89543 4 4 4.89543 4 6V18C4 19.1046 4.89543 20 6 20Z" />
                </svg>
                Metrics
              </a>
            </li>
          </ul>
        </div>

        {/* Bottom section with profile and create button */}
        <div class="border-t border-base-300 p-4">
          <button class="btn btn-primary w-full mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path d="M12 6V12M12 12V18M12 12H18M12 12H6" />
            </svg>
            Create Agent
          </button>
          
          <div class="dropdown dropdown-top w-full">
            <label tabindex={0} class="btn btn-ghost w-full flex items-center gap-4">
              <div class="avatar">
                <div class="w-8 rounded-full">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Profile" />
                </div>
              </div>
              <span class="flex-1 text-left">Profile</span>
            </label>
            <ul tabindex={0} class="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-full">
              <li><a>Settings</a></li>
              <li><a>Logout</a></li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
}
