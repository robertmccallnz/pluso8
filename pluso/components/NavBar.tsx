import { JSX } from "preact";
import { useState } from "preact/hooks";
import { COLORS, COMPONENTS, TYPOGRAPHY, SHADOWS, TRANSITIONS } from "../lib/constants/styles.ts";

interface NavItem {
  name: string;
  href: string;
  icon: JSX.Element;
  description?: string;
  children?: NavItem[];
}

const navigation: NavItem[] = [
  {
    name: "Agents",
    href: "/agents",
    icon: (
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    children: [
      {
        name: "Petunia",
        href: "/petunia",
        icon: (
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        ),
        description: "Your ecological garden companion"
      },
      {
        name: "Jeff Legal",
        href: "/jeff",
        icon: (
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
          </svg>
        ),
        description: "Legal research assistant"
      },
      {
        name: "Maia",
        href: "/maia",
        icon: (
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        ),
        description: "AI development companion"
      }
    ]
  },
  {
    name: "Models",
    href: "/models",
    icon: (
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.871 4A17.926 17.926 0 003 12c0 2.874.673 5.59 1.871 8m14.13 0a17.926 17.926 0 001.87-8c0-2.874-.673-5.59-1.87-8M9 9h1.246a1 1 0 01.961.725l1.586 5.55a1 1 0 00.961.725H15m1-7h-.08a2 2 0 00-1.519.698L9.6 15.302A2 2 0 018.08 16H8" />
      </svg>
    ),
    children: [
      {
        name: "Try Models",
        href: "/dashboard/playground",
        icon: (
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        description: "Test different AI models"
      }
    ]
  },
  {
    name: "Metrics",
    href: "/dashboard/metrics",
    icon: (
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    name: "About",
    href: "/about",
    icon: (
      <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  }
];

export default function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  return (
    <nav class={COMPONENTS.navbar.base}>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            {/* Logo */}
            <div class="flex-shrink-0 flex items-center">
              <a 
                href="/" 
                class={`text-xl ${TYPOGRAPHY.fontFamily.mono}`}
              >
                plus<span class={`text-${COLORS.primary[500]}`}>o8</span>
              </a>
            </div>

            {/* Desktop Navigation */}
            <div class="hidden sm:ml-6 sm:flex sm:space-x-2">
              {navigation.map((item) => (
                <div class="relative inline-block" key={item.name}>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    class={`${COMPONENTS.navbar.link.base} ${
                      openDropdown === item.name 
                        ? COMPONENTS.navbar.link.active 
                        : COMPONENTS.navbar.link.inactive
                    }`}
                  >
                    {item.icon}
                    <span class="ml-2">{item.name}</span>
                    {item.children && (
                      <svg
                        class={`ml-1 h-4 w-4 transition-transform duration-${TRANSITIONS.fast} ${
                          openDropdown === item.name ? "rotate-180" : ""
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fill-rule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clip-rule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                  {item.children && openDropdown === item.name && (
                    <div 
                      class={`absolute left-0 mt-2 w-64 rounded-lg ${SHADOWS.lg} bg-white ring-1 ring-black ring-opacity-5 z-50`}
                    >
                      <div class="py-1">
                        {item.children.map((child) => (
                          <a
                            key={child.name}
                            href={child.href}
                            class={`block px-4 py-2 hover:bg-${COLORS.gray[50]} transition-colors duration-${TRANSITIONS.fast}`}
                          >
                            <div class="flex items-start">
                              <span class="flex-shrink-0 text-${COLORS.gray[500]}">{child.icon}</span>
                              <div class="ml-3">
                                <div class={`font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[900]}`}>
                                  {child.name}
                                </div>
                                {child.description && (
                                  <p class={`text-${TYPOGRAPHY.fontSize.xs} text-${COLORS.gray[500]} mt-0.5`}>
                                    {child.description}
                                  </p>
                                )}
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Mobile menu button */}
          <div class="flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              class={`inline-flex items-center justify-center p-2 rounded-md text-${COLORS.gray[500]} hover:text-${COLORS.gray[600]} hover:bg-${COLORS.gray[100]} focus:outline-none focus:ring-2 focus:ring-inset focus:ring-${COLORS.primary[500]}`}
            >
              <span class="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div class="sm:hidden">
          <div class="pt-2 pb-3 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                <button
                  onClick={() => toggleDropdown(item.name)}
                  class={`w-full flex items-center px-3 py-2 text-base font-medium ${
                    openDropdown === item.name
                      ? `text-${COLORS.primary[600]} bg-${COLORS.primary[50]}`
                      : `text-${COLORS.gray[600]} hover:text-${COLORS.gray[800]} hover:bg-${COLORS.gray[50]}`
                  }`}
                >
                  {item.icon}
                  <span class="ml-3">{item.name}</span>
                  {item.children && (
                    <svg
                      class={`ml-auto h-5 w-5 transition-transform duration-${TRANSITIONS.fast} ${
                        openDropdown === item.name ? "rotate-180" : ""
                      }`}
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  )}
                </button>
                {item.children && openDropdown === item.name && (
                  <div class="mt-2 space-y-2">
                    {item.children.map((child) => (
                      <a
                        key={child.name}
                        href={child.href}
                        class={`block pl-10 pr-4 py-2 text-base font-medium text-${COLORS.gray[600]} hover:text-${COLORS.gray[800]} hover:bg-${COLORS.gray[50]}`}
                      >
                        <div class="flex items-center">
                          {child.icon}
                          <span class="ml-3">{child.name}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
