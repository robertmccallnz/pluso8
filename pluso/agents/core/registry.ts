export enum AgentType {
  ASSISTANT = "ASSISTANT",
  EVALUATOR = "EVALUATOR",
  RESEARCHER = "RESEARCHER",
  SPECIALIST = "SPECIALIST",
  ADVISOR = "ADVISOR",
}

export enum AgentIndustry {
  TECH = "TECH",
  FINANCE = "FINANCE",
  HEALTHCARE = "HEALTHCARE",
  EDUCATION = "EDUCATION",
  GENERAL = "GENERAL",
  AGRICULTURE = "AGRICULTURE",
  LEGAL = "LEGAL",
  TECHNOLOGY = "TECHNOLOGY",
}

export interface AgentRegistration {
  id: string;
  name: string;
  type: AgentType;
  industry: AgentIndustry;
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
}

export const REGISTERED_AGENTS: Record<string, AgentRegistration> = {
  AGR_SPEC_PETUNIA_0001: {
    id: "AGR_SPEC_PETUNIA_0001",
    name: "Petunia",
    type: AgentType.SPECIALIST,
    industry: AgentIndustry.AGRICULTURE,
    model: "mistralai/Mistral-7B-Instruct-v0.1",
    maxTokens: 2000,
    temperature: 0.7,
    systemPrompt: "You are Petunia, an AI garden and ecology assistant specializing in New Zealand native plants and sustainable gardening practices...",
  },
  LEG_ADVR_JEFF_0001: {
    id: "LEG_ADVR_JEFF_0001",
    name: "Jeff",
    type: AgentType.ADVISOR,
    industry: AgentIndustry.LEGAL,
    model: "gpt-4-1106-preview",
    maxTokens: 2000,
    temperature: 0.7,
    systemPrompt: "You are Jeff, an AI legal assistant specializing in New Zealand law and legal research...",
  },
  TECH_ASST_MAIA_0001: {
    id: "TECH_ASST_MAIA_0001",
    name: "Maia",
    type: AgentType.ASSISTANT,
    industry: AgentIndustry.TECHNOLOGY,
    model: "claude-2.1",
    maxTokens: 2000,
    temperature: 0.7,
    systemPrompt: "You are Maia, an AI assistant specializing in helping users understand and work with artificial intelligence and machine learning...",
  },
};
