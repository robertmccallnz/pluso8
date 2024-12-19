import { useSignal } from "@preact/signals";
import LoadingStateIsland from "../LoadingStateIsland.tsx";
import IndustryStep from "../CreateAgentSteps/IndustryStep.tsx";
import TemplateStep from "../CreateAgentSteps/TemplateStep.tsx";
import ToolsStep from "../CreateAgentSteps/ToolsStep.tsx";
import ModelsStep from "../CreateAgentSteps/ModelsStep.tsx";
import ConfirmationStep from "../CreateAgentSteps/ConfirmationStep.tsx";
import ConfigurationStep from "../CreateAgentSteps/ConfigurationStep.tsx";
import SystemPromptStep from "../CreateAgentSteps/SystemPromptStep.tsx";
import EvaluationStep from "../CreateAgentSteps/EvaluationStep.tsx";

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  industry: string;
  systemPrompt: string;
  features: string[];
  requiredModels: {
    primary: string[];
    fallback: string[];
    embedding: string[];
  };
  evaluationCriteria: Array<{
    id: string;
    name: string;
    description: string;
    weight: number;
  }>;
}

interface CreateAgentProps {
  industries: Industry[];
  templates: Template[];
}

interface FormValues {
  industry: string;
  template: string;
  tools: string[];
  toolsConfig: Record<string, Record<string, string | number | boolean>>;
  models: {
    primary: string[];
    fallback: string[];
    embedding: string[];
  };
  name: string;
  description: string;
  systemPrompt: string;
  evaluationCriteria: Array<{
    id: string;
    name: string;
    description: string;
    weight: number;
  }>;
}

const STEPS = [
  { id: "industry", title: "Industry", component: IndustryStep },
  { id: "template", title: "Template", component: TemplateStep },
  { id: "tools", title: "Tools", component: ToolsStep },
  { id: "models", title: "Models", component: ModelsStep },
  { id: "config", title: "Configuration", component: ConfigurationStep },
  { id: "prompt", title: "System Prompt", component: SystemPromptStep },
  { id: "evaluation", title: "Evaluation", component: EvaluationStep },
  { id: "confirm", title: "Confirmation", component: ConfirmationStep },
];

export default function CreateAgent({ industries, templates }: CreateAgentProps) {
  const activeStep = useSignal(0);
  const isSubmitting = useSignal(false);
  const error = useSignal<string | null>(null);
  const formValues = useSignal<FormValues>({
    industry: "",
    template: "",
    tools: [],
    toolsConfig: {},
    models: {
      primary: [],
      fallback: [],
      embedding: [],
    },
    name: "",
    description: "",
    systemPrompt: "",
    evaluationCriteria: [],
  });

  const handleNext = () => {
    if (activeStep.value < STEPS.length - 1) {
      activeStep.value++;
    }
  };

  const handleBack = () => {
    if (activeStep.value > 0) {
      activeStep.value--;
    }
  };

  const handleSubmit = async () => {
    try {
      isSubmitting.value = true;
      error.value = null;

      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues.value),
      });

      if (!response.ok) {
        throw new Error("Failed to create agent");
      }

      // Reset form and show success
      formValues.value = {
        industry: "",
        template: "",
        tools: [],
        toolsConfig: {},
        models: {
          primary: [],
          fallback: [],
          embedding: [],
        },
        name: "",
        description: "",
        systemPrompt: "",
        evaluationCriteria: [],
      };
      activeStep.value = 0;
      
      // Redirect to the agents page
      window.location.href = "/dashboard/agents";
    } catch (err) {
      error.value = err instanceof Error ? err.message : "An error occurred";
    } finally {
      isSubmitting.value = false;
    }
  };

  const CurrentStep = STEPS[activeStep.value].component;

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="space-y-8">
          {/* Progress Steps */}
          <nav aria-label="Progress">
            <ol role="list" class="flex items-center">
              {STEPS.map((step, index) => (
                <li key={step.id} class={`relative ${index !== STEPS.length - 1 ? "pr-8 sm:pr-20" : ""}`}>
                  <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="h-0.5 w-full bg-gray-200" />
                  </div>
                  <div class={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                    index < activeStep.value
                      ? "bg-blue-600 group-hover:bg-blue-800"
                      : index === activeStep.value
                      ? "bg-blue-600"
                      : "bg-gray-200"
                  }`}>
                    <span class={`h-2.5 w-2.5 rounded-full ${
                      index <= activeStep.value ? "bg-white" : "bg-transparent"
                    }`} />
                  </div>
                  <div class="absolute top-10 whitespace-nowrap">
                    <span class="text-sm font-medium text-gray-900">{step.title}</span>
                  </div>
                </li>
              ))}
            </ol>
          </nav>

          {/* Current Step */}
          <div class="bg-white shadow rounded-lg p-6">
            {error.value && (
              <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p class="text-sm text-red-600">{error.value}</p>
              </div>
            )}

            <CurrentStep
              formValues={formValues}
              industries={industries}
              templates={templates}
              onNext={handleNext}
              onBack={handleBack}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting.value}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
