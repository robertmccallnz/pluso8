import { useSignal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface NavBarProps {
  currentPath: string;
  isAdmin?: boolean;
}

export default function NavBar({ currentPath, isAdmin }: NavBarProps) {
  const isMenuOpen = useSignal(false);
  const isDashboardOpen = useSignal(false);

  const isActive = (path: string) => {
    return currentPath === path ? "bg-primary/10" : "";
  };

  const isDashboardActive = () => {
    return currentPath.startsWith("/dashboard") ? "bg-primary/10" : "";
  };

  return (
    <nav class="bg-base-100 border-b border-base-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          {/* Logo and Brand */}
          <div class="flex">
            <a href="/" class="flex items-center">
              <span class="text-xl font-bold text-primary">Pluso</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div class="hidden md:flex md:items-center md:space-x-4">
            <a href="/tools" class={`px-3 py-2 rounded-md text-sm font-medium hover:bg-base-200 ${isActive("/tools")}`}>
              Tools
            </a>
            {/* Dashboard Dropdown */}
            <div class="relative">
              <div class="flex items-center">
                <a 
                  href="/dashboard"
                  class={`px-3 py-2 rounded-md text-sm font-medium hover:bg-base-200 ${isDashboardActive()}`}
                >
                  Dashboard
                </a>
                <button
                  onClick={() => isDashboardOpen.value = !isDashboardOpen.value}
                  class="p-1 hover:bg-base-200 rounded-md ml-1"
                  aria-label="Toggle dashboard menu"
                >
                  <svg
                    class={`h-4 w-4 transform ${isDashboardOpen.value ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>
              {/* Dashboard Dropdown Menu */}
              {isDashboardOpen.value && (
                <div class="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-base-100 ring-1 ring-black ring-opacity-5">
                  <div class="py-1" role="menu">
                    <a href="/dashboard/profile" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/dashboard/profile")}`}>Profile</a>
                    <a href="/dashboard/settings" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/dashboard/settings")}`}>Settings</a>
                    <a href="/dashboard/agents" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/dashboard/agents")}`}>Agents</a>
                    <a href="/dashboard/agents/create" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/dashboard/agents/create")}`}>Create Agent</a>
                    <a href="/dashboard/models" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/dashboard/models")}`}>Models</a>
                    <a href="/dashboard/metrics" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/dashboard/metrics")}`}>Metrics</a>
                    <a href="/dashboard/analytics" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/dashboard/analytics")}`}>Analytics</a>
                    <a href="/dashboard/playground" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/dashboard/playground")}`}>Playground</a>
                    {isAdmin && (
                      <a href="/admin" class={`block px-4 py-2 text-sm hover:bg-base-200 ${isActive("/admin")}`}>Admin Dashboard</a>
                    )}
                  </div>
                </div>
              )}
            </div>
            <a href="/contact" class={`px-3 py-2 rounded-md text-sm font-medium hover:bg-base-200 ${isActive("/contact")}`}>
              Contact
            </a>
            <a href="/about" class={`px-3 py-2 rounded-md text-sm font-medium hover:bg-base-200 ${isActive("/about")}`}>
              About
            </a>
            {isAdmin && (
              <a href="/admin" class={`px-3 py-2 rounded-md text-sm font-medium hover:bg-base-200 ${isActive("/admin")}`}>
                Admin
              </a>
            )}
          </div>

          {/* Mobile menu button */}
          <div class="flex md:hidden">
            <button
              type="button"
              class="inline-flex items-center justify-center p-2 rounded-md hover:bg-base-200"
              onClick={() => isMenuOpen.value = !isMenuOpen.value}
            >
              <span class="sr-only">Open main menu</span>
              {!isMenuOpen.value ? (
                <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen.value && (
        <div class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <a href="/tools" class={`block px-3 py-2 rounded-md text-base font-medium hover:bg-base-200 ${isActive("/tools")}`}>
              Tools
            </a>
            <a href="/dashboard" class={`block px-3 py-2 rounded-md text-base font-medium hover:bg-base-200 ${isDashboardActive()}`}>
              Dashboard
            </a>
            <a href="/contact" class={`block px-3 py-2 rounded-md text-base font-medium hover:bg-base-200 ${isActive("/contact")}`}>
              Contact
            </a>
            <a href="/about" class={`block px-3 py-2 rounded-md text-base font-medium hover:bg-base-200 ${isActive("/about")}`}>
              About
            </a>
            {isAdmin && (
              <a href="/admin" class={`block px-3 py-2 rounded-md text-base font-medium hover:bg-base-200 ${isActive("/admin")}`}>
                Admin Dashboard
              </a>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
