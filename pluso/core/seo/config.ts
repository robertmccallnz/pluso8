interface OpenGraph {
  title?: string;
  description?: string;
  type?: string;
  image?: string;
  url?: string;
  siteName?: string;
}

interface Twitter {
  card?: string;
  site?: string;
  creator?: string;
  image?: string;
  title?: string;
  description?: string;
}

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  type?: string;
  robots?: string;
  keywords?: string[];
  openGraph?: OpenGraph;
  twitter?: Twitter;
  canonical?: string;
  locale?: string;
  additionalMetaTags?: Array<{ name: string; content: string }>;
}

export const DEFAULT_TITLE = "Pluso - AI Agent Platform | Deploy Custom AI Agents with Voice, Image & Chat";
export const DEFAULT_DESCRIPTION = "Create and deploy custom AI agents with voice, image, and chat capabilities. Built with V8 and Tokio for lightning-fast performance. Deploy in seconds, scale infinitely.";

export const BASE_URL = "https://pluso.ai";

const defaultOpenGraph: OpenGraph = {
  type: "website",
  siteName: "Pluso AI",
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  image: `${BASE_URL}/og-image.jpg`,
};

const defaultTwitter: Twitter = {
  card: "summary_large_image",
  site: "@PlusoAI",
  creator: "@PlusoAI",
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  image: `${BASE_URL}/og-image.jpg`,
};

export const defaultSEOConfig: SEOProps = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: [
    "AI agents",
    "custom AI",
    "voice AI",
    "image recognition",
    "chat AI",
    "V8 engine",
    "Tokio runtime",
    "fast AI deployment",
    "scalable AI",
    "AI platform",
    "machine learning",
    "natural language processing",
    "computer vision",
    "enterprise AI",
    "AI automation",
    "AI integration",
    "AI development",
    "AI solutions",
    "AI services",
    "AI consulting",
    "customer service AI",
    "retail AI",
    "agriculture AI",
    "real estate AI",
    "club management AI",
    "transportation AI",
    "energy management AI",
    "media AI",
    "event management AI",
    "travel AI"
  ],
  type: "website",
  robots: "index,follow",
  locale: "en_NZ",
  openGraph: defaultOpenGraph,
  twitter: defaultTwitter,
  additionalMetaTags: [
    { name: "application-name", content: "Pluso AI" },
    { name: "apple-mobile-web-app-capable", content: "yes" },
    { name: "apple-mobile-web-app-status-bar-style", content: "default" },
    { name: "apple-mobile-web-app-title", content: "Pluso AI" },
    { name: "format-detection", content: "telephone=no" },
    { name: "mobile-web-app-capable", content: "yes" },
    { name: "theme-color", content: "#4F46E5" }
  ]
};

export const pageSEOConfig = {
  home: {
    ...defaultSEOConfig,
    title: "Pluso - Deploy Custom AI Agents for Every Industry",
    description: "Create and deploy specialized AI agents for customer service, retail, agriculture, real estate, clubs, transportation, energy, media, events, and travel industries. Built for enterprise performance.",
  },
  dashboard: {
    ...defaultSEOConfig,
    title: "Pluso Dashboard - Manage Your Industry-Specific AI Agents",
    description: "Monitor and manage your AI agents across multiple industries. From customer service to travel management, control all your AI assistants in one place.",
  },
  create: {
    ...defaultSEOConfig,
    title: "Create AI Agents - Industry-Specific Solutions | Pluso",
    description: "Build custom AI agents tailored for your industry. Choose from specialized templates for retail, agriculture, real estate, transportation, energy, media, events, and more.",
  },
  agents: {
    ...defaultSEOConfig,
    title: "AI Agent Templates - Industry-Specific Solutions | Pluso",
    description: "Explore our library of industry-specific AI agent templates. Find the perfect AI assistant for your business needs across multiple sectors.",
  }
};
