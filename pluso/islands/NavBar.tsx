import { h } from "preact";
import { useState } from "preact/hooks";

interface NavItem {
  name: string;
  href: string;
  icon: string;
  children?: NavItem[];
}

export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState("/");

  const navigation: NavItem[] = [
    { name: "Dashboard", href: "/dashboard", icon: "" },
    { name: "Agents", href: "/agents", icon: "" },
    { name: "Models", href: "/models", icon: "" },
    { name: "Metrics", href: "/metrics", icon: "" },
    { name: "About", href: "/about", icon: "" }
  ];

  return (
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <div class="flex-shrink-0 flex items-center">
              <a href="/" class="flex items-center space-x-2">
                <span class="text-blue-600">plu_</span>
                <span class="text-cyan-600">SO</span>
              </a>
            </div>
            <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  class={`border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    currentPath === item.href ? "border-indigo-500 text-gray-900" : ""
                  }`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
          <div class="flex items-center">
            <div class="hidden sm:ml-6 sm:flex sm:items-center">
              <button
                type="button"
                class="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <span class="sr-only">View notifications</span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.593 6 8.925 6 12v3.324c0 .759.273 1.457.76 2.001z"
                  />
                </svg>
              </button>

              <div class="ml-3 relative">
                <button
                  type="button"
                  class="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <span class="sr-only">Open user menu</span>
                  <img
                    class="h-8 w-8 rounded-full"
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                </button>
              </div>
            </div>
            <div class="-mr-2 flex items-center sm:hidden">
              <button
                type="button"
                class="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span class="sr-only">Open main menu</span>
                <svg
                  class={`h-6 w-6 ${isMenuOpen ? "hidden" : "block"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  class={`h-6 w-6 ${isMenuOpen ? "block" : "hidden"}`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div class={`sm:hidden ${isMenuOpen ? "block" : "hidden"}`}>
        <div class="pt-2 pb-3 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              class={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                currentPath === item.href ? "bg-indigo-50 border-indigo-500 text-indigo-700" : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {item.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}