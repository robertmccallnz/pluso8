export interface Model {
  id: string;
  name: string;
  description: string;
  type: ModelType;
  provider: ModelProvider;
  contextWindow: number;
  costPer1kTokens: number;
}

export type ModelType = 
  | "chat"
  | "completion"
  | "embedding"
  | "image"
  | "audio"
  | "multimodal";

export type ModelProvider =
  | "together"
  | "openai"
  | "anthropic"
  | "mistral"
  | "cohere";

export const AVAILABLE_MODELS: Model[] = [
  // Together AI Chat Models
  {
    id: "mistral-7b-instruct",
    name: "Mistral 7B Instruct",
    description: "Fast and efficient open-source model",
    type: "chat",
    provider: "together",
    contextWindow: 8192,
    costPer1kTokens: 0.0002,
  },
  {
    id: "llama-2-70b-chat",
    name: "Llama 2 70B Chat",
    description: "Meta's largest chat model",
    type: "chat",
    provider: "together",
    contextWindow: 4096,
    costPer1kTokens: 0.0009,
  },
  {
    id: "codellama-34b-instruct",
    name: "CodeLlama 34B Instruct",
    description: "Specialized for code generation",
    type: "chat",
    provider: "together",
    contextWindow: 16384,
    costPer1kTokens: 0.0006,
  },
  {
    id: "yi-34b-chat",
    name: "Yi 34B Chat",
    description: "Strong multilingual capabilities",
    type: "chat",
    provider: "together",
    contextWindow: 4096,
    costPer1kTokens: 0.0004,
  },
  {
    id: "qwen-72b-chat",
    name: "Qwen 72B Chat",
    description: "Alibaba's largest chat model",
    type: "chat",
    provider: "together",
    contextWindow: 32768,
    costPer1kTokens: 0.0007,
  },
  
  // OpenAI Chat Models
  {
    id: "gpt-4-turbo",
    name: "GPT-4 Turbo",
    description: "Most capable model, best for complex tasks",
    type: "chat",
    provider: "openai",
    contextWindow: 128000,
    costPer1kTokens: 0.01,
  },
  {
    id: "gpt-4",
    name: "GPT-4",
    description: "Strong reasoning and analysis capabilities",
    type: "chat",
    provider: "openai",
    contextWindow: 8192,
    costPer1kTokens: 0.03,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    description: "Fast and efficient, good for most tasks",
    type: "chat",
    provider: "openai",
    contextWindow: 4096,
    costPer1kTokens: 0.002,
  },
  {
    id: "text-davinci-003",
    name: "Davinci",
    description: "Most capable completion model",
    type: "completion",
    provider: "openai",
    contextWindow: 4097,
    costPer1kTokens: 0.02,
  },
  {
    id: "text-curie-001",
    name: "Curie",
    description: "Fast and efficient completion model",
    type: "completion",
    provider: "openai",
    contextWindow: 2048,
    costPer1kTokens: 0.002,
  },
  {
    id: "dall-e-3",
    name: "DALL-E 3",
    description: "Most advanced image generation",
    type: "image",
    provider: "openai",
    contextWindow: 4096,
    costPer1kTokens: 0.04,
  },
  {
    id: "stable-diffusion-xl",
    name: "Stable Diffusion XL",
    description: "High-quality image generation",
    type: "image",
    provider: "openai",
    contextWindow: 2048,
    costPer1kTokens: 0.02,
  },
  {
    id: "whisper-1",
    name: "Whisper",
    description: "Speech-to-text transcription and translation",
    type: "audio",
    provider: "openai",
    contextWindow: 0,
    costPer1kTokens: 0.006,
  },
  {
    id: "gpt-4-vision",
    name: "GPT-4 Vision",
    description: "Image and text understanding",
    type: "multimodal",
    provider: "openai",
    contextWindow: 128000,
    costPer1kTokens: 0.01,
  },
  
  // Anthropic Chat Models
  {
    id: "claude-2",
    name: "Claude 2",
    description: "Strong reasoning and analysis capabilities",
    type: "chat",
    provider: "anthropic",
    contextWindow: 100000,
    costPer1kTokens: 0.01,
  },
  
  // Mistral Chat Models
  {
    id: "mistral-medium",
    name: "Mistral Medium",
    description: "Open-source model with strong performance",
    type: "chat",
    provider: "mistral",
    contextWindow: 32768,
    costPer1kTokens: 0.002,
  },
  
  // Cohere Embedding Models
  {
    id: "text-embedding-ada-002",
    name: "Ada Embeddings",
    description: "State-of-the-art text embeddings",
    type: "embedding",
    provider: "cohere",
    contextWindow: 8191,
    costPer1kTokens: 0.0001,
  },
  {
    id: "cohere-embed-english-v3.0",
    name: "Cohere Embeddings",
    description: "Multilingual embedding model",
    type: "embedding",
    provider: "cohere",
    contextWindow: 2048,
    costPer1kTokens: 0.0001,
  },
];
