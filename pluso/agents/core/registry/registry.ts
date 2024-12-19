export enum AgentIndustry {
  AGRICULTURE = "AGR",
  LEGAL = "LEG",
  TECHNOLOGY = "TECH",
  HEALTHCARE = "HLTH",
  EDUCATION = "EDU",
  FINANCE = "FIN",
  RETAIL = "RET",
  MANUFACTURING = "MFG",
  ENERGY = "NRG",
  REAL_ESTATE = "REAL"
}

export enum AgentType {
  SPECIALIST = "SPEC",    // Deep domain expertise
  ASSISTANT = "ASST",     // General assistance
  ANALYST = "ANLY",       // Data analysis
  TUTOR = "TUTR",        // Educational
  ADVISOR = "ADVR",      // Advisory
  RESEARCHER = "RSCH"    // Research focused
}

export interface AgentDefinition {
  id: string;            // Format: IND_TYPE_NAME_XXXX (e.g., AGR_SPEC_PETUNIA_0001)
  name: string;
  description: string;
  industry: AgentIndustry;
  type: AgentType;
  version: string;       // Semantic versioning
  systemPrompt: string;
  capabilities: string[];
  metadata: {
    icon?: string;
    color?: string;
    createdAt: string;   // ISO timestamp
    lastUpdated: string; // ISO timestamp
  };
}

// Helper function to generate agent IDs
export function generateAgentId(
  industry: AgentIndustry,
  type: AgentType,
  name: string,
  sequence: number = 1
): string {
  const cleanName = name.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const seq = sequence.toString().padStart(4, "0");
  return `${industry}_${type}_${cleanName}_${seq}`;
}

export const REGISTERED_AGENTS: Record<string, AgentDefinition> = {
  "AGR_SPEC_PETUNIA_0001": {
    id: "AGR_SPEC_PETUNIA_0001",
    name: "Petunia",
    description: "New Zealand native plants and sustainable gardening assistant",
    industry: AgentIndustry.AGRICULTURE,
    type: AgentType.SPECIALIST,
    version: "1.0.0",
    systemPrompt: `You are Petunia, an AI garden and ecology assistant specializing in New Zealand native plants and sustainable gardening practices...`,
    capabilities: [
      "NZ native plant knowledge",
      "Sustainable gardening",
      "Climate expertise",
      "Ecological restoration"
    ],
    metadata: {
      icon: "🌿",
      color: "#2E7D32",
      createdAt: "2024-12-18T10:19:48+13:00",
      lastUpdated: "2024-12-18T10:19:48+13:00"
    }
  },
  "LEG_ADVR_JEFF_0001": {
    id: "LEG_ADVR_JEFF_0001",
    name: "Jeff",
    description: "New Zealand legal research and assistance",
    industry: AgentIndustry.LEGAL,
    type: AgentType.ADVISOR,
    version: "1.0.0",
    systemPrompt: `You are Jeff, an AI legal assistant specializing in New Zealand law and legal research...`,
    capabilities: [
      "NZ legislation knowledge",
      "Property law expertise",
      "Contract law",
      "Legal research"
    ],
    metadata: {
      icon: "⚖️",
      color: "#1565C0",
      createdAt: "2024-12-18T10:19:48+13:00",
      lastUpdated: "2024-12-18T10:19:48+13:00"
    }
  },
  "TECH_ASST_MAIA_0001": {
    id: "TECH_ASST_MAIA_0001",
    name: "Maia",
    description: "AI/ML understanding and assistance",
    industry: AgentIndustry.TECHNOLOGY,
    type: AgentType.ASSISTANT,
    version: "1.0.0",
    systemPrompt: `You are Maia, an AI assistant specializing in helping users understand and work with artificial intelligence and machine learning...`,
    capabilities: [
      "AI/ML concepts",
      "Technical guidance",
      "Code assistance",
      "Learning resources"
    ],
    metadata: {
      icon: "🤖",
      color: "#6200EA",
      createdAt: "2024-12-18T10:19:48+13:00",
      lastUpdated: "2024-12-18T10:19:48+13:00"
    }
  }
};

// Helper function to get all agents by industry
export function getAgentsByIndustry(industry: AgentIndustry): AgentDefinition[] {
  return Object.values(REGISTERED_AGENTS).filter(agent => agent.industry === industry);
}

// Helper function to get all agents by type
export function getAgentsByType(type: AgentType): AgentDefinition[] {
  return Object.values(REGISTERED_AGENTS).filter(agent => agent.type === type);
}

// Helper function to get agent analytics data
export interface AgentAnalytics {
  totalByIndustry: Record<AgentIndustry, number>;
  totalByType: Record<AgentType, number>;
  latestCreated: AgentDefinition[];
  totalActive: number;
}

export function getAgentAnalytics(): AgentAnalytics {
  const agents = Object.values(REGISTERED_AGENTS);
  
  const totalByIndustry = Object.values(AgentIndustry).reduce((acc, industry) => {
    acc[industry] = agents.filter(agent => agent.industry === industry).length;
    return acc;
  }, {} as Record<AgentIndustry, number>);

  const totalByType = Object.values(AgentType).reduce((acc, type) => {
    acc[type] = agents.filter(agent => agent.type === type).length;
    return acc;
  }, {} as Record<AgentType, number>);

  const latestCreated = [...agents]
    .sort((a, b) => new Date(b.metadata.createdAt).getTime() - new Date(a.metadata.createdAt).getTime())
    .slice(0, 5);

  return {
    totalByIndustry,
    totalByType,
    latestCreated,
    totalActive: agents.length
  };
}
