import { Template } from "./types.ts";

export const INDUSTRY_TEMPLATES: Record<string, Template[]> = {
  "customer-service": [
    {
      id: "support-agent",
      name: "Customer Support Specialist",
      description: "AI assistant specialized in handling customer inquiries and support tickets",
      features: ["Ticket Management", "Query Resolution", "Customer Communication", "Knowledge Base Access"],
      category: "customer-service",
      systemPrompt: "You are a customer support specialist focused on resolving customer inquiries efficiently...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "onboarding-specialist",
      name: "Customer Onboarding Specialist",
      description: "Guides new customers through product setup and initial usage",
      features: ["Onboarding Process", "Product Training", "Account Setup", "Documentation"],
      category: "customer-service",
      systemPrompt: "You are an onboarding specialist helping new customers get started with our products...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa"],
    },
    {
      id: "retention-expert",
      name: "Customer Retention Expert",
      description: "Specializes in maintaining customer relationships and reducing churn",
      features: ["Churn Prevention", "Customer Engagement", "Feedback Analysis", "Loyalty Programs"],
      category: "customer-service",
      systemPrompt: "You are a customer retention expert focused on maintaining strong customer relationships...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    }
  ],
  "retail": [
    {
      id: "inventory-specialist",
      name: "Inventory Management Specialist",
      description: "Manages inventory levels, stock optimization, and supply chain",
      features: ["Inventory Tracking", "Stock Optimization", "Supply Chain Management", "Demand Forecasting"],
      category: "retail",
      systemPrompt: "You are an inventory management specialist focused on optimizing stock levels...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    },
    {
      id: "marketing-specialist",
      name: "Digital Marketing Specialist",
      description: "Handles digital marketing strategies and customer engagement",
      features: ["Campaign Management", "Customer Engagement", "Analytics", "Content Creation"],
      category: "retail",
      systemPrompt: "You are a digital marketing specialist creating engaging campaigns...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["web-search", "email"],
    },
    {
      id: "customer-service",
      name: "Retail Customer Service Expert",
      description: "Handles customer inquiries, returns, and satisfaction",
      features: ["Customer Support", "Returns Processing", "Complaint Resolution", "Product Information"],
      category: "retail",
      systemPrompt: "You are a retail customer service expert focused on customer satisfaction...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "catalog-manager",
      name: "Product Catalog Manager",
      description: "Manages product listings, categories, and descriptions",
      features: ["Catalog Management", "Product Classification", "Content Optimization", "Pricing Strategy"],
      category: "retail",
      systemPrompt: "You are a catalog manager maintaining accurate and engaging product information...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    }
  ],
  "agriculture": [
    {
      id: "crop-specialist",
      name: "Crop Management Specialist",
      description: "Manages crop planning, monitoring, and optimization",
      features: ["Crop Planning", "Growth Monitoring", "Yield Optimization", "Weather Integration"],
      category: "agriculture",
      systemPrompt: "You are a crop management specialist focused on optimizing crop yields...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["web-search", "document-qa"],
    },
    {
      id: "irrigation-expert",
      name: "Irrigation Management Expert",
      description: "Optimizes irrigation systems and water usage",
      features: ["Water Management", "System Monitoring", "Efficiency Optimization", "Schedule Planning"],
      category: "agriculture",
      systemPrompt: "You are an irrigation expert managing water resources efficiently...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa"],
    },
    {
      id: "farm-manager",
      name: "Farm Operations Manager",
      description: "Manages farm operations, including crop management and livestock care",
      features: ["Farm Operations", "Crop Management", "Livestock Care", "Equipment Maintenance"],
      category: "agriculture",
      systemPrompt: "You are a farm operations manager overseeing daily farm activities...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "supply-chain-specialist",
      name: "Agricultural Supply Chain Specialist",
      description: "Manages the supply chain for agricultural products",
      features: ["Supply Chain Management", "Inventory Control", "Logistics Coordination", "Quality Control"],
      category: "agriculture",
      systemPrompt: "You are an agricultural supply chain specialist ensuring efficient product delivery...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    }
  ],
  "real-estate": [
    {
      id: "property-manager",
      name: "Property Management Specialist",
      description: "Manages property operations and tenant relations",
      features: ["Property Operations", "Tenant Management", "Maintenance Coordination", "Financial Tracking"],
      category: "real-estate",
      systemPrompt: "You are a property management specialist handling operations and tenant needs...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "listing-specialist",
      name: "Listing Management Specialist",
      description: "Handles property listings and marketing",
      features: ["Listing Creation", "Market Analysis", "Marketing Strategy", "Lead Management"],
      category: "real-estate",
      systemPrompt: "You are a listing specialist focused on property marketing and sales...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["web-search", "email"],
    },
    {
      id: "realtor",
      name: "Real Estate Agent",
      description: "Assists clients in buying, selling, and renting properties",
      features: ["Client Representation", "Market Analysis", "Property Showings", "Transaction Management"],
      category: "real-estate",
      systemPrompt: "You are a real estate agent helping clients achieve their property goals...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "mortgage-specialist",
      name: "Mortgage Financing Specialist",
      description: "Assists clients in securing mortgage financing",
      features: ["Mortgage Options", "Credit Analysis", "Loan Processing", "Rate Negotiation"],
      category: "real-estate",
      systemPrompt: "You are a mortgage financing specialist helping clients secure the best mortgage rates...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    }
  ],
  "clubs": [
    {
      id: "membership-coordinator",
      name: "Membership Management Specialist",
      description: "Manages member relations and club operations",
      features: ["Member Relations", "Event Planning", "Facility Management", "Communication"],
      category: "clubs",
      systemPrompt: "You are a membership coordinator managing club operations and member satisfaction...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "activities-planner",
      name: "Activities Planning Specialist",
      description: "Plans and coordinates club activities and events",
      features: ["Activity Planning", "Schedule Management", "Member Engagement", "Resource Coordination"],
      category: "clubs",
      systemPrompt: "You are an activities planner creating engaging experiences for club members...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "event-coordinator",
      name: "Event Coordination Specialist",
      description: "Coordinates events, including logistics and marketing",
      features: ["Event Planning", "Logistics Management", "Marketing Strategy", "Budgeting"],
      category: "clubs",
      systemPrompt: "You are an event coordinator managing events from start to finish...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "marketing-manager",
      name: "Club Marketing Manager",
      description: "Develops and implements marketing strategies for the club",
      features: ["Marketing Strategy", "Campaign Management", "Social Media Management", "Promotions"],
      category: "clubs",
      systemPrompt: "You are a club marketing manager creating engaging marketing campaigns...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["web-search", "document-qa"],
    }
  ],
  "transportation": [
    {
      id: "fleet-manager",
      name: "Fleet Management Specialist",
      description: "Manages vehicle fleet operations and maintenance",
      features: ["Fleet Operations", "Maintenance Scheduling", "Route Optimization", "Cost Management"],
      category: "transportation",
      systemPrompt: "You are a fleet manager optimizing vehicle operations and maintenance...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    },
    {
      id: "logistics-coordinator",
      name: "Logistics Coordination Specialist",
      description: "Coordinates transportation logistics and scheduling",
      features: ["Route Planning", "Schedule Optimization", "Delivery Management", "Resource Allocation"],
      category: "transportation",
      systemPrompt: "You are a logistics coordinator managing transportation operations efficiently...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["web-search", "email"],
    },
    {
      id: "dispatch-specialist",
      name: "Dispatch Management Specialist",
      description: "Manages the dispatch of vehicles and drivers",
      features: ["Dispatch Management", "Route Optimization", "Driver Management", "Time Management"],
      category: "transportation",
      systemPrompt: "You are a dispatch management specialist ensuring efficient vehicle dispatch...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "safety-specialist",
      name: "Transportation Safety Specialist",
      description: "Ensures the safety of drivers, vehicles, and cargo",
      features: ["Safety Protocols", "Risk Management", "Compliance Management", "Training Programs"],
      category: "transportation",
      systemPrompt: "You are a transportation safety specialist maintaining a safe and compliant transportation environment...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    }
  ],
  "energy": [
    {
      id: "energy-analyst",
      name: "Energy Analysis Specialist",
      description: "Analyzes energy consumption and optimization opportunities",
      features: ["Usage Analysis", "Efficiency Planning", "Cost Optimization", "Sustainability"],
      category: "energy",
      systemPrompt: "You are an energy analyst identifying optimization opportunities...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    },
    {
      id: "grid-manager",
      name: "Grid Management Specialist",
      description: "Manages power grid operations and maintenance",
      features: ["Grid Operations", "Load Balancing", "Maintenance Planning", "Emergency Response"],
      category: "energy",
      systemPrompt: "You are a grid manager ensuring reliable power distribution...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "renewable-energy-specialist",
      name: "Renewable Energy Specialist",
      description: "Develops and implements renewable energy solutions",
      features: ["Renewable Energy Sources", "System Design", "Installation Management", "Maintenance Planning"],
      category: "energy",
      systemPrompt: "You are a renewable energy specialist creating sustainable energy solutions...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "energy-auditor",
      name: "Energy Auditor",
      description: "Conducts energy audits to identify energy-saving opportunities",
      features: ["Energy Audits", "Energy Efficiency", "Cost Savings", "Recommendations"],
      category: "energy",
      systemPrompt: "You are an energy auditor identifying energy-saving opportunities...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    }
  ],
  "media": [
    {
      id: "content-strategist",
      name: "Content Strategy Specialist",
      description: "Develops and manages content strategy",
      features: ["Content Planning", "Audience Analysis", "Distribution Strategy", "Performance Tracking"],
      category: "media",
      systemPrompt: "You are a content strategist creating engaging media strategies...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["web-search", "document-qa"],
    },
    {
      id: "production-coordinator",
      name: "Production Coordination Specialist",
      description: "Coordinates media production and scheduling",
      features: ["Production Planning", "Resource Management", "Schedule Coordination", "Quality Control"],
      category: "media",
      systemPrompt: "You are a production coordinator managing media creation efficiently...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "social-media-manager",
      name: "Social Media Manager",
      description: "Develops and implements social media strategies",
      features: ["Social Media Planning", "Content Creation", "Engagement Management", "Analytics"],
      category: "media",
      systemPrompt: "You are a social media manager creating engaging social media experiences...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["web-search", "document-qa"],
    },
    {
      id: "public-relations-specialist",
      name: "Public Relations Specialist",
      description: "Manages public relations and communications",
      features: ["Public Relations", "Media Relations", "Crisis Management", "Reputation Management"],
      category: "media",
      systemPrompt: "You are a public relations specialist maintaining a positive public image...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    }
  ],
  "events": [
    {
      id: "event-planner",
      name: "Event Planning Specialist",
      description: "Plans and coordinates comprehensive events",
      features: ["Event Planning", "Vendor Management", "Budget Control", "Timeline Management"],
      category: "events",
      systemPrompt: "You are an event planner creating memorable experiences...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "logistics-manager",
      name: "Event Logistics Manager",
      description: "Manages event logistics and operations",
      features: ["Logistics Planning", "Resource Coordination", "Site Management", "Risk Management"],
      category: "events",
      systemPrompt: "You are a logistics manager ensuring smooth event operations...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "marketing-coordinator",
      name: "Event Marketing Coordinator",
      description: "Coordinates event marketing and promotion",
      features: ["Marketing Strategy", "Promotions Management", "Social Media Management", "Public Relations"],
      category: "events",
      systemPrompt: "You are an event marketing coordinator creating engaging event promotions...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["web-search", "document-qa"],
    },
    {
      id: "operations-manager",
      name: "Event Operations Manager",
      description: "Manages event operations, including setup and teardown",
      features: ["Event Operations", "Setup Management", "Teardown Management", "Staff Management"],
      category: "events",
      systemPrompt: "You are an event operations manager ensuring smooth event execution...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    }
  ],
  "travel": [
    {
      id: "travel-planner",
      name: "Travel Planning Specialist",
      description: "Plans and coordinates travel experiences",
      features: ["Itinerary Planning", "Booking Management", "Customer Preferences", "Travel Research"],
      category: "travel",
      systemPrompt: "You are a travel planner creating personalized travel experiences...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["web-search", "email"],
    },
    {
      id: "concierge-specialist",
      name: "Concierge Service Specialist",
      description: "Provides comprehensive concierge services",
      features: ["Service Coordination", "Local Knowledge", "Preference Management", "Experience Enhancement"],
      category: "travel",
      systemPrompt: "You are a concierge specialist delivering exceptional travel services...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["web-search", "email"],
    },
    {
      id: "destination-specialist",
      name: "Destination Management Specialist",
      description: "Manages destination-specific travel experiences",
      features: ["Destination Knowledge", "Itinerary Planning", "Activity Coordination", "Local Insights"],
      category: "travel",
      systemPrompt: "You are a destination management specialist creating immersive travel experiences...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
      requiredTools: ["document-qa", "email"],
    },
    {
      id: "travel-agent",
      name: "Travel Agent",
      description: "Assists clients in planning and booking travel",
      features: ["Travel Planning", "Booking Management", "Customer Service", "Travel Recommendations"],
      category: "travel",
      systemPrompt: "You are a travel agent helping clients plan their dream trips...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
      requiredTools: ["document-qa"],
    }
  ],
};
