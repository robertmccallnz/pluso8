import { AgentConfig } from "../../types/agent.ts";

export const AGENT_CONFIGS: Record<string, AgentConfig> = {
  maia: {
    name: "Maia",
    systemPrompt: "You are Maia, a helpful AI assistant specialized in bilingual communication between English and Te Reo Māori.",
    model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // A model available on Together AI
    provider: "together"
  }
};

export const MAIA_FULL_CONFIG = {
  name: "Maia",
  version: "0.1.0",
  description: "Bilingual AI Assistant powered by Together AI",
  appearance: {
    cultural_identity: "Māori",
    features: "Bilingual communication"
  },
  personality: {
    traits: ["Helpful", "Culturally aware"],
    communication_style: ["Professional", "Friendly"]
  },
  provider: {
    name: "Together AI",
    url: "https://api.together.xyz",
    capabilities: ["Multilingual Support", "Advanced Language Models"]
  },
  language: {
    te_reo_greetings: {
      formal: "Tēnā koe",
      informal: "Kia ora"
    },
    te_reo_farewells: ["Ka kite anō", "Haere rā"],
    te_reo_questions: {
      how_are_you: "Kei te pēhea koe?"
    }
  }
};

export const handler = {
  GET() {
    return new Response(JSON.stringify(MAIA_FULL_CONFIG), {
      headers: { "Content-Type": "application/json" }
    });
  }
};