import { AgentConfig } from "../types.ts";

interface TypeOption {
  id: string;
  title: string;
  description: string;
  modes: Array<AgentConfig["mode"]>;
  industries: string[];
  templatePath: string;
}

const AGENT_TYPES: TypeOption[] = [
  // Healthcare Types
  {
    id: "medical-analysis",
    title: "Medical Report Analysis",
    description: "Analyze medical reports, lab results, and clinical documentation",
    modes: ["text", "image"],
    industries: ["healthcare"],
    templatePath: "healthcare/medical-analysis.yaml"
  },
  {
    id: "patient-communication",
    title: "Patient Communication",
    description: "Handle patient inquiries and provide medical information",
    modes: ["text", "voice"],
    industries: ["healthcare"],
    templatePath: "healthcare/patient-communication.yaml"
  },
  
  // Finance Types
  {
    id: "investment-advisory",
    title: "Investment Advisory",
    description: "Provide investment recommendations and market analysis",
    modes: ["text"],
    industries: ["finance"],
    templatePath: "finance/investment-advisory.yaml"
  },
  {
    id: "fraud-detection",
    title: "Fraud Detection",
    description: "Analyze transactions and detect suspicious patterns",
    modes: ["text", "image"],
    industries: ["finance"],
    templatePath: "finance/fraud-detection.yaml"
  },
  
  // Legal Types
  {
    id: "contract-analysis",
    title: "Contract Analysis",
    description: "Review and analyze legal contracts and documents",
    modes: ["text"],
    industries: ["legal"],
    templatePath: "legal/contract-analysis.yaml"
  },
  
  // Education Types
  {
    id: "tutoring",
    title: "Personal Tutor",
    description: "Provide personalized tutoring and educational support",
    modes: ["text", "voice", "multimodal"],
    industries: ["education"],
    templatePath: "education/tutoring.yaml"
  },

  // Customer Service Types
  {
    id: "customer-support",
    title: "Customer Support",
    description: "Handle customer inquiries and provide support",
    modes: ["text", "voice"],
    industries: ["retail"],
    templatePath: "customer-service/support-agent.yaml"
  },

  // Technology Types
  {
    id: "code-assistant",
    title: "Code Assistant",
    description: "Help with coding tasks and technical problems",
    modes: ["text"],
    industries: ["technology"],
    templatePath: "technology/code-assistant.yaml"
  },
  {
    id: "technical-support",
    title: "Technical Support",
    description: "Provide technical troubleshooting and support",
    modes: ["text", "voice"],
    industries: ["technology"],
    templatePath: "technology/technical-support.yaml"
  }
];

interface Props {
  config: AgentConfig;
  onUpdate: (update: Partial<AgentConfig>) => void;
}

const TypeSelection = ({ config, onUpdate }: Props) => {
  // Filter types based on selected mode and industry
  const availableTypes = AGENT_TYPES.filter(
    type => 
      type.modes.includes(config.mode!) &&
      type.industries.includes(config.industry!)
  );

  if (availableTypes.length === 0) {
    return (
      <div class="text-center text-gray-600 py-8">
        <p>No agent types available for the selected mode and industry.</p>
        <p class="mt-2">Please go back and select different options.</p>
      </div>
    );
  }

  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {availableTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => onUpdate({ 
            type: type.id,
            yaml: type.templatePath
          })}
          class={`
            p-6 rounded-lg border-2 transition-all duration-200
            flex flex-col items-start text-left
            ${config.type === type.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
            }
          `}
        >
          <h3 class="text-xl font-semibold mb-2">{type.title}</h3>
          <p class="text-gray-600 mb-4">{type.description}</p>
          <div class="text-sm text-gray-500">
            Supported modes: {type.modes.join(", ")}
          </div>
        </button>
      ))}
    </div>
  );
};

export default TypeSelection;
