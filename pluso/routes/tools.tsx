import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import Layout from "../components/Layout.tsx";

const tools = [
  {
    name: "Screenshot Tool", 
    description: "Capture full-page screenshots of any website",
    icon: "📸",
    href: "/tools/screenshot",
    features: ["Full-page capture", "Instant download", "High-quality images"],
    status: "available"
  },
  {
    name: "PDF Generator",
    description: "Convert any webpage to a downloadable PDF document",
    icon: "📄", 
    href: "/tools/pdf",
    features: ["Clean formatting", "Maintains styles", "Quick conversion"],
    status: "available"
  },
  {
    name: "Content Scraper",
    description: "Extract content from websites using CSS selectors",
    icon: "🔍",
    href: "/tools/scraper", 
    features: ["CSS selector support", "Bulk extraction", "Copy to clipboard"],
    status: "available"
  },
  {
    name: "SEO Analyzer",
    description: "Analyze websites for SEO optimization",
    icon: "📊",
    href: "/tools/seo",
    features: ["Meta tag analysis", "Performance metrics", "Content structure"],
    status: "available"
  },
  {
    name: "Form Filler",
    description: "Automate form filling and submission",
    icon: "🤖",
    href: "/tools/form-filler",
    features: ["Multiple fields", "Dynamic forms", "Auto-submit"],
    status: "available"
  },
  {
    name: "Site Monitor",
    description: "Monitor website performance and accessibility",
    icon: "📈",
    href: "/tools/monitor",
    features: ["Performance tracking", "Network analysis", "Accessibility check"],
    status: "available"
  }
];

export default function ToolsPage({ url, ...props }: PageProps) {
  return h(Layout, null,
    h("div", { class: "min-h-screen bg-gray-50 py-20" },
      h("div", { class: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" },
        h("div", { class: "text-center mb-12" },
          h("h1", { class: "text-4xl font-bold text-gray-900 mb-4" }, "Web Automation Tools"),
          h("p", { class: "text-xl text-gray-600" }, 
            "Powerful tools powered by Puppeteer to automate your web tasks"
          )
        ),
        h("div", { class: "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3" },
          tools.map((tool) => 
            h("div", { key: tool.name, class: "relative group" },
              h("div", { class: "bg-white rounded-lg shadow-md overflow-hidden transition-all duration-200 transform group-hover:-translate-y-1 group-hover:shadow-xl" },
                h("div", { class: "p-6" },
                  h("div", { class: "flex items-center justify-between mb-4" },
                    h("span", { class: "text-3xl", role: "img", "aria-label": tool.name }, tool.icon),
                    tool.status === "coming-soon" && 
                      h("span", { class: "px-2 py-1 text-xs font-medium text-primary-700 bg-primary-100 rounded-full" },
                        "Coming Soon"
                      )
                  ),
                  h("h3", { class: "text-xl font-bold text-gray-900 mb-2" }, tool.name),
                  h("p", { class: "text-gray-600 mb-4" }, tool.description),
                  h("div", { class: "space-y-2" },
                    tool.features.map((feature) =>
                      h("div", { key: feature, class: "flex items-center text-sm text-gray-500" },
                        h("svg", { 
                          class: "h-4 w-4 text-green-500 mr-2",
                          fill: "none",
                          stroke: "currentColor",
                          viewBox: "0 0 24 24"
                        },
                          h("path", {
                            strokeLinecap: "round",
                            strokeLinejoin: "round",
                            strokeWidth: "2",
                            d: "M5 13l4 4L19 7"
                          })
                        ),
                        feature
                      )
                    )
                  )
                ),
                tool.status === "available" &&
                  h("a", {
                    href: tool.href,
                    class: "block bg-gray-50 px-6 py-3 text-center text-sm font-medium text-primary-600 hover:bg-gray-100 transition-colors duration-200"
                  }, "Try Now")
              )
            )
          )
        )
      )
    )
  );
}