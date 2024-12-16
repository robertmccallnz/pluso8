interface Template {
  id: string;
  name: string;
  description: string;
  features: string[];
  category: string;
  systemPrompt: string;
  requiredModels: {
    primary: string[];
    fallback?: string[];
    embedding?: string[];
  };
}

interface TemplateStepProps {
  config: Partial<{
    template: string;
    industry: string;
  }>;
  onUpdate: (update: Partial<{ template: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

const TEMPLATES: Record<string, Template[]> = {
  legal: [
    {
      id: "legal-researcher",
      name: "Legal Research Assistant",
      description: "AI assistant specialized in legal research, case law analysis, and document review",
      features: ["Case Law Analysis", "Document Review", "Legal Research", "Citation Management"],
      category: "legal",
      systemPrompt: "You are a legal research assistant with expertise in case law analysis and legal document review...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
        embedding: ["text-embedding-ada-002"],
      },
    },
    {
      id: "contract-analyzer",
      name: "Contract Analyzer",
      description: "Specialized in contract review, risk assessment, and compliance checking",
      features: ["Contract Review", "Risk Assessment", "Compliance Check", "Term Extraction"],
      category: "legal",
      systemPrompt: "You are a contract analysis specialist focused on identifying risks and ensuring compliance...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        fallback: ["gpt-3.5-turbo"],
      },
    },
  ],
  healthcare: [
    {
      id: "medical-researcher",
      name: "Medical Research Assistant",
      description: "AI assistant for medical research, literature review, and clinical data analysis",
      features: ["Literature Review", "Data Analysis", "Research Synthesis", "Citation Management"],
      category: "healthcare",
      systemPrompt: "You are a medical research assistant specializing in analyzing clinical data and research papers...",
      requiredModels: {
        primary: ["gpt-4", "claude-2"],
        embedding: ["text-embedding-ada-002"],
      },
    },
  ],
  // Add more templates for other industries...
};

export default function TemplateStep({ config, onUpdate, onNext }: TemplateStepProps) {
  const templates = TEMPLATES[config.industry || ""] || [];

  return (
    <div class="max-w-5xl mx-auto p-6">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Choose a Template</h2>
        <p class="text-gray-600">
          Select a template that matches your use case. You can customize it in the next steps.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
        {templates.map((template) => (
          <div
            key={template.id}
            class={`relative rounded-lg border p-6 cursor-pointer transition-all hover:shadow-md ${
              config.template === template.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-blue-200"
            }`}
            onClick={() => {
              onUpdate({ template: template.id });
              // Auto advance to next step after selection
              setTimeout(onNext, 500);
            }}
          >
            <div class="flex items-center justify-between mb-4">
              <h3 class="text-lg font-medium text-gray-900">{template.name}</h3>
              <div class="h-4 w-4 rounded-full border-2 flex-shrink-0 flex items-center justify-center">
                {config.template === template.id && (
                  <div class="h-2 w-2 rounded-full bg-blue-600" />
                )}
              </div>
            </div>
            
            <p class="text-sm text-gray-500 mb-4">{template.description}</p>

            <div class="space-y-3">
              <div>
                <div class="text-xs text-gray-400 mb-2">Features:</div>
                <div class="flex flex-wrap gap-2">
                  {template.features.map((feature) => (
                    <span
                      key={feature}
                      class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div class="text-xs text-gray-400 mb-2">Required Models:</div>
                <div class="space-y-1">
                  <div class="flex flex-wrap gap-2">
                    {template.requiredModels.primary.map((model) => (
                      <span
                        key={model}
                        class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                  {template.requiredModels.fallback && (
                    <div class="flex flex-wrap gap-2">
                      {template.requiredModels.fallback.map((model) => (
                        <span
                          key={model}
                          class="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-yellow-100 text-yellow-800"
                        >
                          {model} (fallback)
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {templates.length === 0 && (
        <div class="text-center py-12">
          <p class="text-gray-500">Please select an industry first to see available templates.</p>
        </div>
      )}
    </div>
  );
}
