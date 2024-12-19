import { useSignal } from "@preact/signals";

interface SideBarProps {
  currentPath: string;
}

export default function SideBar({ currentPath }: SideBarProps) {
  const isCollapsed = useSignal(false);

  const isActive = (path: string) => {
    return currentPath === path ? "bg-primary/10" : "";
  };

  return (
    <div
      class={`h-[calc(100vh-4rem)] bg-base-100 border-r border-base-200 transition-all duration-300 ${
        isCollapsed.value ? "w-16" : "w-64"
      }`}
    >
      <div class="flex justify-end p-4">
        <button
          onClick={() => isCollapsed.value = !isCollapsed.value}
          class="p-2 rounded-md hover:bg-base-200"
        >
          {isCollapsed.value ? (
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>

      <nav class="px-4 space-y-2">
        <div class={`transition-opacity duration-300 ${isCollapsed.value ? "opacity-0" : "opacity-100"}`}>
          <div class="text-sm font-semibold text-base-content/60 px-3 py-2">
            Dashboard
          </div>
        </div>

        {/* Navigation Links */}
        <a
          href="/dashboard/profile"
          class={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-base-200 ${isActive("/dashboard/profile")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
          </svg>
          {!isCollapsed.value && <span>Profile</span>}
        </a>

        <a
          href="/dashboard/settings"
          class={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-base-200 ${isActive("/dashboard/settings")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          {!isCollapsed.value && <span>Settings</span>}
        </a>

        <div class={`transition-opacity duration-300 ${isCollapsed.value ? "opacity-0" : "opacity-100"}`}>
          <div class="text-sm font-semibold text-base-content/60 px-3 py-2 mt-4">
            AI Tools
          </div>
        </div>

        <a
          href="/dashboard/agents"
          class={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-base-200 ${isActive("/dashboard/agents")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
          {!isCollapsed.value && <span>Agents</span>}
        </a>

        <a
          href="/dashboard/agents/create"
          class={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-base-200 ${isActive("/dashboard/agents/create")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          {!isCollapsed.value && <span>Create Agent</span>}
        </a>

        <a
          href="/dashboard/models"
          class={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-base-200 ${isActive("/dashboard/models")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
          </svg>
          {!isCollapsed.value && <span>Models</span>}
        </a>

        <div class={`transition-opacity duration-300 ${isCollapsed.value ? "opacity-0" : "opacity-100"}`}>
          <div class="text-sm font-semibold text-base-content/60 px-3 py-2 mt-4">
            Analytics
          </div>
        </div>

        <a
          href="/dashboard/metrics"
          class={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-base-200 ${isActive("/dashboard/metrics")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
          {!isCollapsed.value && <span>Metrics</span>}
        </a>

        <a
          href="/dashboard/analytics"
          class={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-base-200 ${isActive("/dashboard/analytics")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {!isCollapsed.value && <span>Analytics</span>}
        </a>

        <a
          href="/dashboard/playground"
          class={`flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-base-200 ${isActive("/dashboard/playground")}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
          </svg>
          {!isCollapsed.value && <span>Playground</span>}
        </a>
      </nav>
    </div>
  );
}
