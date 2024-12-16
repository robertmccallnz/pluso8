import { ModelConfig } from "./types";

export interface ModelPreset {
  name: string;
  description: string;
  category: "general" | "industry" | "custom";
  config: ModelConfig;
  costPerToken?: number;
}

export interface PresetCategory {
  name: string;
  presets: Record<string, ModelPreset>;
}

interface PresetStore {
  customPresets: Record<string, ModelPreset>;
  savePreset: (key: string, preset: ModelPreset) => void;
  deletePreset: (key: string) => void;
  updatePreset: (key: string, preset: ModelPreset) => void;
}

// Initialize preset store with localStorage
export const presetStore: PresetStore = {
  customPresets: JSON.parse(localStorage.getItem("customPresets") || "{}"),
  savePreset: (key: string, preset: ModelPreset) => {
    presetStore.customPresets[key] = preset;
    localStorage.setItem("customPresets", JSON.stringify(presetStore.customPresets));
  },
  deletePreset: (key: string) => {
    delete presetStore.customPresets[key];
    localStorage.setItem("customPresets", JSON.stringify(presetStore.customPresets));
  },
  updatePreset: (key: string, preset: ModelPreset) => {
    if (presetStore.customPresets[key]) {
      presetStore.customPresets[key] = preset;
      localStorage.setItem("customPresets", JSON.stringify(presetStore.customPresets));
    }
  },
};

export const generalPresets: Record<string, ModelPreset> = {
  creative: {
    name: "Creative Writing",
    description: "Optimized for creative and engaging content generation",
    category: "general",
    config: {
      temperature: 0.8,
      maxTokens: 2000,
      topP: 0.9,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
      systemPrompt: "You are a creative writing assistant focused on engaging and imaginative content.",
    },
    costPerToken: 0.002,
  },
  precise: {
    name: "Precise & Factual",
    description: "Optimized for accurate and factual responses",
    category: "general",
    config: {
      temperature: 0.2,
      maxTokens: 1000,
      topP: 0.95,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      systemPrompt: "You are a precise assistant focused on providing accurate and factual information.",
    },
    costPerToken: 0.002,
  },
};

export const industryPresets: Record<string, ModelPreset> = {
  healthcare: {
    name: "Healthcare",
    description: "Optimized for medical and healthcare content with HIPAA compliance focus",
    category: "industry",
    config: {
      temperature: 0.3,
      maxTokens: 1500,
      topP: 0.95,
      frequencyPenalty: 0.2,
      presencePenalty: 0.2,
      systemPrompt: "You are a healthcare assistant focused on providing accurate medical information while maintaining HIPAA compliance. Always include relevant disclaimers.",
    },
    costPerToken: 0.003,
  },
  legal: {
    name: "Legal",
    description: "Optimized for legal document analysis and generation",
    category: "industry",
    config: {
      temperature: 0.2,
      maxTokens: 2000,
      topP: 0.95,
      frequencyPenalty: 0.3,
      presencePenalty: 0.3,
      systemPrompt: "You are a legal assistant focused on precise legal terminology and accurate document analysis.",
    },
    costPerToken: 0.003,
  },
  finance: {
    name: "Finance",
    description: "Optimized for financial analysis and reporting",
    category: "industry",
    config: {
      temperature: 0.3,
      maxTokens: 1500,
      topP: 0.9,
      frequencyPenalty: 0.2,
      presencePenalty: 0.2,
      systemPrompt: "You are a financial assistant focused on accurate financial analysis and reporting.",
    },
    costPerToken: 0.003,
  },
  education: {
    name: "Education",
    description: "Optimized for educational content and tutoring",
    category: "industry",
    config: {
      temperature: 0.6,
      maxTokens: 2000,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.3,
      systemPrompt: "You are an educational assistant focused on clear explanations and engaging learning content.",
    },
    costPerToken: 0.002,
  },
  ecommerce: {
    name: "E-commerce",
    description: "Optimized for product descriptions and marketing content",
    category: "industry",
    config: {
      temperature: 0.7,
      maxTokens: 1000,
      topP: 0.9,
      frequencyPenalty: 0.4,
      presencePenalty: 0.4,
      systemPrompt: "You are an e-commerce assistant focused on creating compelling product descriptions and marketing content.",
    },
    costPerToken: 0.002,
  },
  realestate: {
    name: "Real Estate",
    description: "Optimized for property descriptions, market analysis, and real estate documentation",
    category: "industry",
    config: {
      temperature: 0.6,
      maxTokens: 1500,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.3,
      systemPrompt: "You are a real estate assistant focused on creating compelling property descriptions, market analysis, and professional real estate documentation. Maintain accuracy while highlighting key property features and market insights.",
    },
    costPerToken: 0.002,
  },
  hospitality: {
    name: "Hospitality",
    description: "Optimized for guest communications, service descriptions, and hospitality management",
    category: "industry",
    config: {
      temperature: 0.7,
      maxTokens: 1200,
      topP: 0.9,
      frequencyPenalty: 0.4,
      presencePenalty: 0.4,
      systemPrompt: "You are a hospitality assistant focused on creating welcoming, professional communications and detailed service descriptions. Maintain a warm, customer-focused tone while ensuring clarity and accuracy in all responses.",
    },
    costPerToken: 0.002,
  },
  logistics: {
    name: "Logistics",
    description: "Optimized for supply chain documentation, shipping instructions, and logistics planning",
    category: "industry",
    config: {
      temperature: 0.3,
      maxTokens: 1500,
      topP: 0.95,
      frequencyPenalty: 0.2,
      presencePenalty: 0.2,
      systemPrompt: "You are a logistics assistant focused on creating precise shipping documentation, supply chain analysis, and logistics planning. Maintain accuracy and clarity while following industry standards and regulations.",
    },
    costPerToken: 0.002,
  },
  luxuryrealestate: {
    name: "Luxury Real Estate",
    description: "Optimized for high-end property marketing, luxury amenities, and exclusive client communication",
    category: "industry",
    config: {
      temperature: 0.7,
      maxTokens: 2000,
      topP: 0.9,
      frequencyPenalty: 0.4,
      presencePenalty: 0.4,
      systemPrompt: "You are a luxury real estate specialist focused on creating sophisticated, compelling content for high-end properties. Emphasize exclusivity, premium features, and unique value propositions while maintaining a tone of elegance and discretion.",
    },
    costPerToken: 0.003,
  },
  hotelmanagement: {
    name: "Hotel Management",
    description: "Optimized for hotel operations, staff training, and guest experience management",
    category: "industry",
    config: {
      temperature: 0.5,
      maxTokens: 1500,
      topP: 0.9,
      frequencyPenalty: 0.3,
      presencePenalty: 0.3,
      systemPrompt: "You are a hotel management specialist focused on creating professional documentation for operations, training materials, and guest experience protocols. Maintain consistency with luxury hospitality standards while emphasizing service excellence.",
    },
    costPerToken: 0.002,
  },
  travel: {
    name: "Travel & Tourism",
    description: "Optimized for travel itineraries, destination guides, and tourism marketing",
    category: "industry",
    config: {
      temperature: 0.8,
      maxTokens: 2000,
      topP: 0.9,
      frequencyPenalty: 0.4,
      presencePenalty: 0.4,
      systemPrompt: "You are a travel specialist focused on creating engaging, informative content for travelers. Combine practical information with inspiring descriptions, emphasizing unique experiences and local insights.",
    },
    costPerToken: 0.002,
  },
};

export const modelPresets = {
  ...generalPresets,
  ...industryPresets,
  ...presetStore.customPresets,
};
