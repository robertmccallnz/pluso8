import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import { ModelCard } from "../components/ModelCard.tsx";
import { ModelFilter, type ModelFilters } from "../components/ModelFilter.tsx";
import { CompareModels } from "../components/CompareModels.tsx";
import { COLORS, TYPOGRAPHY, COMPONENTS } from "../lib/constants/styles.ts";

interface Model {
  name: string;
  description: string;
  type: "Chat" | "Image" | "Code" | "Language" | "Embeddings" | "Rerank" | "Vision" | "Voice" | "Multimodal";
  provider: "Open Source" | "Corporate";
  parameters?: string;
  context?: string;
  pricing?: string;
  icon: string;
}

const models: Model[] = [
  {
    name: "GPT-4V",
    description: "OpenAI's most advanced vision model, capable of understanding and analyzing images with high accuracy while maintaining conversation.",
    type: "Vision",
    provider: "Corporate",
    parameters: "Unknown",
    context: "128K",
    icon: "/icons/openai.svg",
  },
  {
    name: "Llama 3.3 70B",
    description: "The Meta Llama 3.3 multilingual large language model (LLM) is a pretrained and instruction tuned generative model in 70B (text in/text out). The Llama 3.3 instruction tuned text only model is optimized for multilingual dialogue use cases and outperform many of the available open source and closed chat models on common industry benchmarks.",
    type: "Chat",
    provider: "Open Source",
    parameters: "70B",
    context: "128K",
    icon: "/icons/meta.svg",
  },
  {
    name: "FLUX1.1 [pro]",
    description: "Premium image generation model by Black Forest Labs.",
    type: "Image",
    provider: "Corporate",
    icon: "/icons/flux.svg",
  },
  {
    name: "Gemma-2 Instruct (27B)",
    description: "Gemma is a family of lightweight, state-of-the-art open models from Google, built from the same research and technology used to create the Gemini models.",
    type: "Chat",
    provider: "Open Source",
    parameters: "27B",
    icon: "/icons/google.svg",
  },
  {
    name: "Qwen 2.5 72B",
    description: "Powerful decoder-only models available in 7B and 72B variants, developed by Alibaba Cloud's Qwen team for advanced language processing.",
    type: "Chat",
    provider: "Corporate",
    parameters: "72B",
    icon: "/icons/alibaba.svg",
  },
  {
    name: "Llama 3.1 Nemotron 70B Instruct",
    description: "This LLM is customized by NVIDIA to improve the helpfulness of LLM generated responses to user queries.",
    type: "Chat",
    provider: "Corporate",
    parameters: "70B",
    icon: "/icons/nvidia.svg",
  },
  {
    name: "Mixtral-8x22B",
    description: "The Mixtral-8x22B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts.",
    type: "Language",
    provider: "Open Source",
    parameters: "8x22B",
    icon: "/icons/mistral.svg",
  },
  {
    name: "DBRX-Instruct",
    description: "DBRX Instruct is a mixture-of-experts (MoE) large language model trained from scratch by Databricks. DBRX Instruct specializes in few-turn.",
    type: "Chat",
    provider: "Corporate",
    icon: "/icons/databricks.svg",
  },
  {
    name: "Deepseek-67B",
    description: "Trained from scratch on a vast dataset of 2 trillion tokens in both English and Chinese.",
    type: "Chat",
    provider: "Open Source",
    parameters: "67B",
    icon: "/icons/deepseek.svg",
  },
  {
    name: "Arctic-Instruct",
    description: "Arctic is a dense-MoE Hybrid transformer architecture pre-trained from scratch by the Snowflake AI Research Team.",
    type: "Chat",
    provider: "Corporate",
    icon: "/icons/snowflake.svg",
  },
  {
    name: "Striped Hyena Nous",
    description: "A hybrid architecture composed of multi-head, grouped-query attention and gated convolutions arranged in Hyena blocks, different from traditional decoder-only Transformers",
    type: "Chat",
    provider: "Open Source",
    icon: "/icons/nous.svg",
  },
  {
    name: "Llama 3.2 11B Free",
    description: "Free endpoint to try Llama 3.2 11B.",
    type: "Chat",
    provider: "Open Source",
    parameters: "11B",
    icon: "/icons/meta.svg",
  },
  {
    name: "Llama 3.2 90B",
    description: "The Llama 3.2-Vision collection features multimodal LLMs (11B and 90B) optimized for visual recognition, image reasoning, captioning, and answering image-related questions.",
    type: "Chat",
    provider: "Open Source",
    parameters: "90B",
    icon: "/icons/meta.svg",
  },
  {
    name: "UAE-Large v1",
    description: "An universal English sentence embedding model by WhereIsAI. Its embedding dimension is 1024, it takes up to 512 context length.",
    type: "Embeddings",
    provider: "Open Source",
    context: "512",
    icon: "/icons/whereisai.svg",
  },
  {
    name: "Qwen 2.5 Coder 32B Instruct",
    description: "SOTA code LLM with advanced code generation, reasoning, fixing, and support for up to 128K tokens.",
    type: "Code",
    provider: "Corporate",
    parameters: "32B",
    context: "128K",
    icon: "/icons/alibaba.svg",
  },
  {
    name: "Mixtral 8x7B",
    description: "The Mixtral-8x7B Large Language Model (LLM) is a pretrained generative Sparse Mixture of Experts.",
    type: "Chat",
    provider: "Open Source",
    parameters: "8x7B",
    icon: "/icons/mistral.svg",
  },
  {
    name: "Stable Diffusion XL 1.0",
    description: "A text-to-image generative AI model that excels at creating 1024x1024 images.",
    type: "Image",
    provider: "Open Source",
    icon: "/icons/stability.svg",
  },
  {
    name: "Mistral Instruct",
    description: "instruct fine-tuned version of Mistral-7B-v0.1",
    type: "Chat",
    provider: "Open Source",
    parameters: "7B",
    icon: "/icons/mistral.svg",
  },
  {
    name: "BGE-Large-EN v1.5",
    description: "BAAI general embedding - large, english - model v1.5. FlagEmbedding can map any text to a low-dimensional dense vector which can be used for tasks like retrieval, classification, clustering, or semantic search. And it also can be used in vector databases for LLMs.",
    type: "Embeddings",
    provider: "Open Source",
    icon: "/icons/baai.svg",
  }
];

export default function ModelsPageIsland() {
  if (!IS_BROWSER) {
    return <div>Loading models...</div>;
  }

  const [filters, setFilters] = useState<ModelFilters>({
    type: [],
    provider: [],
    search: "",
  });

  const [selectedModels, setSelectedModels] = useState<string[]>([]);

  const modelTypes = Array.from(new Set(models.map((model) => model.type)));
  const providers = Array.from(new Set(models.map((model) => model.provider)));

  const filteredModels = models.filter((model) => {
    const matchesSearch = !filters.search || 
      model.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      model.description.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesType = filters.type.length === 0 || filters.type.includes(model.type);
    const matchesProvider = filters.provider.length === 0 || filters.provider.includes(model.provider);

    return matchesSearch && matchesType && matchesProvider;
  });

  const handleModelSelect = (modelName: string) => {
    setSelectedModels(prev => 
      prev.includes(modelName)
        ? prev.filter((name) => name !== modelName)
        : prev.length >= 3
        ? [...prev.slice(1), modelName]
        : [...prev, modelName]
    );
  };

  const handleFilterChange = (category: keyof ModelFilters, value: string[] | string) => {
    setFilters(prev => ({
      ...prev,
      [category]: value
    }));
  };

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
      {/* Filter Section */}
      <div class={`${COMPONENTS.card.base} mb-8`}>
        <ModelFilter
          modelTypes={modelTypes}
          providers={providers}
          filters={filters}
          onFilterChange={handleFilterChange}
        />
      </div>

      {/* Models Grid */}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredModels.map((model) => (
          <div class={`${COMPONENTS.card.base} ${COMPONENTS.card.hover}`} key={model.name}>
            <ModelCard
              model={model}
              isSelected={selectedModels.includes(model.name)}
              onSelect={() => handleModelSelect(model.name)}
            />
          </div>
        ))}
      </div>

      {/* Compare Panel */}
      {selectedModels.length > 0 && (
        <div class={`fixed bottom-0 left-0 right-0 bg-white border-t ${COMPONENTS.shadow.lg} p-4`}>
          <div class="max-w-7xl mx-auto">
            <CompareModels
              models={models.filter((model) => selectedModels.includes(model.name))}
              onClose={() => setSelectedModels([])}
            />
          </div>
        </div>
      )}
    </div>
  );
}