import { useSignal } from "@preact/signals";

interface NavBarProps {
  currentPath: string;
}

export default function NavBar({ currentPath }: NavBarProps) {  
  const isMenuOpen = useSignal(false);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return currentPath.startsWith("/dashboard") ? "bg-primary text-white" : "hover:bg-gray-100";
    }
    return currentPath === path ? "bg-primary text-white" : "hover:bg-gray-100";
  };

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  return (
    <nav class="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          {/* Logo and Brand */}
          <div class="flex items-center">
            <a href="/" class="flex items-center">
              <span class="text-xl font-bold text-gray-900">Pluso</span>
            </a>
          </div>

          {/* Desktop Navigation */}
          <div class="hidden md:flex md:items-center md:space-x-4">
            <a 
              href="/tools" 
              class={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 ${isActive("/tools")}`}
            >
              Tools
            </a>
            <a 
              href="/dashboard"
              class={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 ${isActive("/dashboard")}`}
            >
              Dashboard
            </a>
            <a 
              href="/contact" 
              class={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 ${isActive("/contact")}`}
            >
              Contact
            </a>
            <a 
              href="/about" 
              class={`px-3 py-2 rounded-md text-sm font-medium text-gray-700 ${isActive("/about")}`}
            >
              About
            </a>
          </div>

          {/* Mobile menu button */}
          <div class="flex md:hidden">
            <button
              onClick={toggleMenu}
              class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
            >
              <svg
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen.value ? (
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen.value && (
        <div class="md:hidden">
          <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <a
              href="/tools"
              class={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/tools")}`}
            >
              Tools
            </a>
            <a
              href="/dashboard"
              class={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/dashboard")}`}
            >
              Dashboard
            </a>
            <a
              href="/contact"
              class={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/contact")}`}
            >
              Contact
            </a>
            <a
              href="/about"
              class={`block px-3 py-2 rounded-md text-base font-medium ${isActive("/about")}`}
            >
              About
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
