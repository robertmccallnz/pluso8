export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

export const INDUSTRIES: Industry[] = [
  {
    id: "customer-service",
    name: "Customer Service",
    description: "Enhance customer support with AI-powered assistance",
    icon: "👥",
    templates: ["support-agent", "onboarding-specialist", "retention-expert"]
  },
  {
    id: "retail",
    name: "Retail & E-commerce",
    description: "Optimize retail operations and customer experience",
    icon: "🛍️",
    templates: ["inventory-specialist", "marketing-specialist", "customer-service", "catalog-manager"]
  },
  {
    id: "agriculture",
    name: "Agriculture",
    description: "Streamline farming operations and resource management",
    icon: "🌾",
    templates: ["crop-specialist", "irrigation-expert", "livestock-manager", "equipment-coordinator"]
  },
  {
    id: "real-estate",
    name: "Real Estate",
    description: "Enhance property management and client services",
    icon: "🏢",
    templates: ["property-manager", "listing-specialist", "market-analyst", "tenant-coordinator"]
  },
  {
    id: "clubs",
    name: "Clubs & Entertainment",
    description: "Optimize club operations and member experience",
    icon: "🎯",
    templates: ["membership-coordinator", "event-planner", "communications-manager", "resource-coordinator"]
  },
  {
    id: "transportation",
    name: "Transportation & Logistics",
    description: "Streamline transportation and logistics operations",
    icon: "🚚",
    templates: ["fleet-manager", "route-optimizer", "safety-monitor", "logistics-coordinator"]
  },
  {
    id: "energy",
    name: "Energy & Utilities",
    description: "Optimize energy management and infrastructure",
    icon: "⚡",
    templates: ["grid-manager", "renewable-specialist", "demand-analyst", "maintenance-coordinator"]
  },
  {
    id: "media-entertainment",
    name: "Media & Entertainment",
    description: "Enhance content creation and audience engagement",
    icon: "🎬",
    templates: ["content-strategist", "production-coordinator", "audience-analyst", "rights-manager"]
  },
  {
    id: "events",
    name: "Events & Conferences",
    description: "Streamline event planning and management",
    icon: "📅",
    templates: ["event-planner", "venue-coordinator", "registration-manager", "vendor-coordinator"]
  },
  {
    id: "travel",
    name: "Travel & Tourism",
    description: "Optimize travel planning and customer experience",
    icon: "✈️",
    templates: ["travel-planner", "accommodation-specialist", "experience-curator", "concierge-specialist"]
  }
];
