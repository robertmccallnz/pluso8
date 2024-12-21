import { AgentConfig } from "../types.ts";

interface IndustryOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  templates: string[];
}

const INDUSTRIES: IndustryOption[] = [
  {
    id: "healthcare",
    title: "Healthcare",
    description: "Medical, clinical, and healthcare applications",
    icon: "🏥",
    templates: ["patient-communication", "medical-analysis", "clinical-documentation"]
  },
  {
    id: "finance",
    title: "Finance",
    description: "Banking, investment, and financial services",
    icon: "💰",
    templates: ["investment-advisory", "risk-analysis", "fraud-detection"]
  },
  {
    id: "legal",
    title: "Legal",
    description: "Legal research, documentation, and analysis",
    icon: "⚖️",
    templates: ["contract-analysis", "legal-research", "compliance"]
  },
  {
    id: "education",
    title: "Education",
    description: "Teaching, learning, and educational content",
    icon: "📚",
    templates: ["tutoring", "content-creation", "assessment"]
  },
  {
    id: "retail",
    title: "Retail",
    description: "E-commerce, retail, and customer service",
    icon: "🛍️",
    templates: ["customer-service", "product-recommendation", "inventory"]
  },
  {
    id: "technology",
    title: "Technology",
    description: "Software development and technical support",
    icon: "💻",
    templates: ["code-assistant", "technical-support", "documentation"]
  }
];

interface Props {
  config: AgentConfig;
  onUpdate: (update: Partial<AgentConfig>) => void;
}

const IndustrySelection = ({ config, onUpdate }: Props) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {INDUSTRIES.map((industry) => (
        <button
          key={industry.id}
          onClick={() => onUpdate({ industry: industry.id })}
          class={`
            p-6 rounded-lg border-2 transition-all duration-200
            flex flex-col items-center text-center
            ${config.industry === industry.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
            }
          `}
        >
          <span class="text-4xl mb-4">{industry.icon}</span>
          <h3 class="text-xl font-semibold mb-2">{industry.title}</h3>
          <p class="text-gray-600 mb-4">{industry.description}</p>
          <div class="text-sm text-gray-500">
            {industry.templates.length} templates available
          </div>
        </button>
      ))}
    </div>
  );
};

export default IndustrySelection;
