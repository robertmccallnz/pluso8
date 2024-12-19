import { AgentType } from "../types/agent.ts";

export interface AgentTool {
  id: string;
  name: string;
  description: string;
  icon: string;
  agentTypes: AgentType[];
  features: string[];
  requiredCapabilities: string[];
  component: string;
}

export const WEB_TOOLS: Record<string, AgentTool> = {
  "SCREENSHOT": {
    id: "SCREENSHOT",
    name: "Screenshot Tool",
    description: "Capture full-page screenshots of any website",
    icon: "📸",
    agentTypes: ["assistant", "automation"],
    features: ["web_automation", "image_capture"],
    requiredCapabilities: ["puppeteer"],
    component: "WebTools"
  },
  "PDF_GENERATOR": {
    id: "PDF_GENERATOR",
    name: "PDF Generator",
    description: "Convert any webpage to a downloadable PDF document",
    icon: "📄",
    agentTypes: ["assistant", "automation"],
    features: ["web_automation", "document_generation"],
    requiredCapabilities: ["puppeteer"],
    component: "WebTools"
  },
  "CONTENT_SCRAPER": {
    id: "CONTENT_SCRAPER",
    name: "Content Scraper",
    description: "Extract content from websites using CSS selectors",
    icon: "🔍",
    agentTypes: ["assistant", "automation", "research"],
    features: ["web_automation", "data_extraction"],
    requiredCapabilities: ["puppeteer"],
    component: "WebTools"
  },
  "SEO_ANALYZER": {
    id: "SEO_ANALYZER",
    name: "SEO Analyzer",
    description: "Analyze websites for SEO optimization",
    icon: "📊",
    agentTypes: ["assistant", "automation", "marketing"],
    features: ["web_automation", "seo_analysis"],
    requiredCapabilities: ["puppeteer"],
    component: "WebTools"
  },
  "FORM_FILLER": {
    id: "FORM_FILLER",
    name: "Form Filler",
    description: "Automate form filling and submission",
    icon: "🤖",
    agentTypes: ["assistant", "automation"],
    features: ["web_automation", "form_automation"],
    requiredCapabilities: ["puppeteer"],
    component: "WebTools"
  },
  "SITE_MONITOR": {
    id: "SITE_MONITOR",
    name: "Site Monitor",
    description: "Monitor website performance and accessibility",
    icon: "📈",
    agentTypes: ["assistant", "automation", "monitoring"],
    features: ["web_automation", "performance_monitoring"],
    requiredCapabilities: ["puppeteer"],
    component: "WebTools"
  }
};
