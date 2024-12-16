import { useSignal } from "@preact/signals";
import { useState } from "preact/hooks";
import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

interface NavItem {
  name: string;
  href: string;
  icon?: string;
  children?: NavItem[];
  requiresAuth?: boolean;
  roles?: string[];
}

const navigation: NavItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: "📊",
  },
  {
    name: "Agents",
    href: "/agents",
    icon: "🤖",
    children: [
      {
        name: "Petunia",
        href: "/agents/petunia",
        icon: "🌸"
      },
      {
        name: "Jeff Legal",
        href: "/agents/jeff-legal",
        icon: "⚖️"
      },
      {
        name: "Maia",
        href: "/agents/maia",
        icon: "🎯"
      }
    ]
  },
  {
    name: "Models",
    href: "/models",
    icon: "🧠",
  },
  {
    name: "Metrics",
    href: "/metrics",
    icon: "📈",
  }
];

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div class="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        class="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <span class="inline-block h-8 w-8 rounded-full overflow-hidden bg-gray-100">
          <svg class="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <div class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5">
          <a
            href="/profile"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Your Profile
          </a>
          <a
            href="/settings"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Settings
          </a>
          <button
            class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

export default function NavBar({ active }: { active: string }) {
  const isOpen = useSignal(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<string | null>(null);

  const toggleMenu = () => {
    isOpen.value = !isOpen.value;
  };

  const toggleDropdown = (href: string) => {
    setIsDropdownOpen(isDropdownOpen === href ? null : href);
  };

  return (
    <nav class="bg-white shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a href="/" class="flex items-center">
                <img
                  class="h-8 w-auto"
                  src="/logo.svg"
                  alt="PluSO"
                />
                <span class="ml-2 text-xl font-bold text-gray-900">PluSO</span>
              </a>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <div
                  key={item.href}
                  class="relative"
                  onMouseEnter={() => item.children && toggleDropdown(item.href)}
                  onMouseLeave={() => item.children && toggleDropdown(null)}
                >
                  <a
                    href={item.href}
                    class={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      active === item.href
                        ? "border-blue-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`}
                  >
                    {item.icon && <span class="mr-2">{item.icon}</span>}
                    {item.name}
                    {item.children && <span class="ml-1">▼</span>}
                  </a>
                  
                  {item.children && isDropdownOpen === item.href && (
                    <div class="absolute z-10 -ml-4 mt-3 transform px-2 w-screen max-w-md sm:px-0 lg:ml-0 lg:left-1/2 lg:-translate-x-1/2">
                      <div class="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden">
                        <div class="relative grid gap-6 bg-white px-5 py-6 sm:gap-8 sm:p-8">
                          {item.children.map((child) => (
                            <a
                              key={child.href}
                              href={child.href}
                              class="-m-3 p-3 flex items-start rounded-lg hover:bg-gray-50"
                            >
                              {child.icon && (
                                <span class="flex-shrink-0 h-6 w-6 text-blue-600">
                                  {child.icon}
                                </span>
                              )}
                              <div class="ml-4">
                                <p class="text-base font-medium text-gray-900">
                                  {child.name}
                                </p>
                              </div>
                            </a>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div class="flex items-center">
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <UserMenu />
            </div>
            <div class="-mr-2 flex items-center sm:hidden">
              <button
                onClick={toggleMenu}
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              >
                <span class="sr-only">Open main menu</span>
                {isOpen.value ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen.value && (
        <div class="sm:hidden">
          <div class="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.href}>
                <a
                  href={item.href}
                  class={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                    active === item.href
                      ? "bg-blue-50 border-blue-500 text-blue-700"
                      : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  {item.icon && <span class="mr-2">{item.icon}</span>}
                  {item.name}
                </a>
                {item.children && (
                  <div class="ml-4">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        class="block pl-3 pr-4 py-2 border-l-4 text-base font-medium border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                      >
                        {child.icon && <span class="mr-2">{child.icon}</span>}
                        {child.name}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div class="pt-4 pb-3 border-t border-gray-200">
            <UserMenu />
          </div>
        </div>
      )}
    </nav>
  );
}
