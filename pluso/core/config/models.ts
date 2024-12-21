export interface Model {
  id: string;
  name: string;
  provider: string;
  type: "text" | "voice" | "multimodal";
  description: string;
  capabilities: string[];
  parameters?: {
    [key: string]: number | string | boolean;
  };
}

export const models: Model[] = [
  {
    id: "ultravox-v1",
    name: "Ultravox",
    provider: "Pluso",
    type: "voice",
    description: "High-quality voice synthesis model for natural-sounding speech",
    capabilities: [
      "Text-to-speech synthesis",
      "Multiple voice styles",
      "Emotion control",
      "Speech rate adjustment",
      "Pitch control"
    ],
    parameters: {
      temperature: 0.7,
      voice_style: "natural",
      speed: 1.0
    }
  },
  {
    id: "palm-chat-bison-001",
    name: "PaLM Chat",
    provider: "Google",
    type: "text",
    description: "Advanced language model for chat and text generation",
    capabilities: [
      "Natural language understanding",
      "Context-aware responses",
      "Code generation",
      "Task completion",
      "Knowledge retrieval"
    ],
    parameters: {
      temperature: 0.7,
      top_p: 0.95,
      top_k: 40
    }
  },
  {
    id: "together-yi-34b-chat",
    name: "Yi-34B Chat",
    provider: "Together AI",
    type: "text",
    description: "High-performance chat model based on Yi architecture",
    capabilities: [
      "Multi-turn conversations",
      "Complex reasoning",
      "Task completion",
      "Knowledge synthesis"
    ],
    parameters: {
      temperature: 0.8,
      top_p: 0.9,
      repetition_penalty: 1.1
    }
  },
  {
    id: "together-llama-2-70b",
    name: "Llama-2 70B",
    provider: "Together AI",
    type: "text",
    description: "Large-scale language model with broad capabilities",
    capabilities: [
      "Complex reasoning",
      "Code generation",
      "Creative writing",
      "Knowledge retrieval",
      "Task completion"
    ],
    parameters: {
      temperature: 0.7,
      top_p: 0.9,
      max_tokens: 2048
    }
  },
  {
    id: "together-mixtral-8x7b",
    name: "Mixtral 8x7B",
    provider: "Together AI",
    type: "text",
    description: "Mixture of experts model with specialized capabilities",
    capabilities: [
      "Domain-specific expertise",
      "Multi-task processing",
      "Complex problem solving",
      "Efficient reasoning"
    ],
    parameters: {
      temperature: 0.8,
      top_p: 0.9,
      presence_penalty: 0.1
    }
  }
];
