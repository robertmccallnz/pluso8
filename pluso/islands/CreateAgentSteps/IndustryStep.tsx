interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

interface IndustryStepProps {
  config: Partial<{
    industry: string;
  }>;
  onUpdate: (update: Partial<{ industry: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const INDUSTRIES: Industry[] = [
  {
    id: "legal",
    name: "Legal",
    description: "AI agents for legal research, document analysis, and compliance",
    icon: "⚖️",
    templates: ["legal-researcher", "contract-analyzer", "compliance-checker"],
  },
  {
    id: "healthcare",
    name: "Healthcare",
    description: "AI agents for medical research, patient support, and healthcare operations",
    icon: "🏥",
    templates: ["medical-researcher", "patient-support", "health-ops"],
  },
  {
    id: "finance",
    name: "Finance",
    description: "AI agents for financial analysis, risk assessment, and market research",
    icon: "💰",
    templates: ["financial-analyst", "risk-assessor", "market-researcher"],
  },
  {
    id: "education",
    name: "Education",
    description: "AI agents for tutoring, course creation, and educational content",
    icon: "🎓",
    templates: ["tutor", "course-creator", "content-curator"],
  },
  {
    id: "customer-service",
    name: "Customer Service",
    description: "AI agents for customer support, FAQ handling, and ticket management",
    icon: "🎯",
    templates: ["support-agent", "faq-bot", "ticket-handler"],
  },
];

export default function IndustryStep({ config, onUpdate, onNext }: IndustryStepProps) {
  return (
    <div class="max-w-3xl mx-auto p-6">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Select Your Industry</h2>
        <p class="text-gray-600">
          Choose the industry that best matches your business needs. This helps us provide
          the most relevant agent templates and configurations.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {INDUSTRIES.map((industry) => (
          <div
            key={industry.id}
            class={`relative rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md ${
              config.industry === industry.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
            onClick={() => {
              onUpdate({ industry: industry.id });
              // Auto advance to next step after selection
              setTimeout(onNext, 500);
            }}
          >
            <div class="flex items-center justify-between mb-4">
              <span class="text-4xl">{industry.icon}</span>
              <div class="h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center">
                {config.industry === industry.id && (
                  <div class="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
            </div>
            <h3 class="text-lg font-medium text-gray-900 mb-2">{industry.name}</h3>
            <p class="text-sm text-gray-500">{industry.description}</p>
            <div class="mt-4">
              <div class="text-xs text-gray-400">Available Templates:</div>
              <div class="flex flex-wrap gap-2 mt-2">
                {industry.templates.map((template) => (
                  <span
                    key={template}
                    class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {template}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
