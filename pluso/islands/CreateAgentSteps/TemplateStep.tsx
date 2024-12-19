import { Signal } from "@preact/signals";
import { Template } from "../../types/templates.ts";

interface TemplateStepProps {
  formValues: Signal<{
    industry: string;
    template: string;
    tools: string[];
    toolsConfig: Record<string, Record<string, string | number | boolean>>;
    models: {
      primary: string[];
      fallback?: string[];
      embedding?: string[];
    };
    name: string;
    description: string;
    systemPrompt: string;
    evaluationCriteria: Array<{
      id: string;
      threshold: number;
      weight: number;
    }>;
  }>;
  templates: Template[];
  onNext: () => void;
  onBack: () => void;
}

export default function TemplateStep({ formValues, templates, onNext, onBack }: TemplateStepProps) {
  const industryTemplates = templates.filter(t => t.industry === formValues.value.industry);

  return (
    <div class="space-y-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900">Choose Template</h2>
        <p class="mt-2 text-sm text-gray-600">
          Select a template that matches your agent's functionality
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6">
        {industryTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => {
              formValues.value = {
                ...formValues.value,
                template: template.id,
                systemPrompt: template.systemPrompt,
                tools: template.tools,
                models: template.models,
                evaluationCriteria: template.evaluationCriteria
              };
              onNext();
            }}
            class={`relative rounded-lg border p-6 text-left shadow-sm focus:outline-none ${
              formValues.value.template === template.id
                ? "border-blue-500 ring-2 ring-blue-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div>
              <h3 class="text-lg font-medium text-gray-900">{template.name}</h3>
              <p class="mt-1 text-sm text-gray-500">{template.description}</p>
              
              {/* Features */}
              <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-900">Features</h4>
                <div class="mt-2 flex flex-wrap gap-2">
                  {template.tools.map((tool) => (
                    <span
                      key={tool}
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Models */}
              <div class="mt-4">
                <h4 class="text-sm font-medium text-gray-900">Models</h4>
                <div class="mt-2 space-y-2">
                  <div class="flex items-center space-x-2">
                    <span class="text-sm text-gray-500">Primary:</span>
                    <div class="flex flex-wrap gap-2">
                      {template.models.primary.map((model) => (
                        <span
                          key={model}
                          class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                        >
                          {model}
                        </span>
                      ))}
                    </div>
                  </div>
                  {template.models.fallback && (
                    <div class="flex items-center space-x-2">
                      <span class="text-sm text-gray-500">Fallback:</span>
                      <div class="flex flex-wrap gap-2">
                        {template.models.fallback.map((model) => (
                          <span
                            key={model}
                            class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800"
                          >
                            {model}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div class="flex justify-between pt-8">
        <button
          onClick={onBack}
          class="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!formValues.value.template}
          class={`px-4 py-2 text-sm font-medium text-white ${
            formValues.value.template
              ? "bg-blue-600 hover:bg-blue-700"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
