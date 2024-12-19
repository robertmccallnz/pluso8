import { signal } from "@preact/signals";
import { IS_BROWSER } from "$fresh/runtime.ts";
import IndustryStep from "./CreateAgentSteps/IndustryStep.tsx";
import TemplateStep from "./CreateAgentSteps/TemplateStep.tsx";
import ModelConfigStep from "./CreateAgentSteps/ModelConfigStep.tsx";
import SystemPromptStep from "./CreateAgentSteps/SystemPromptStep.tsx";
import ToolsStep from "./CreateAgentSteps/ToolsStep.tsx";
import DeploymentStep from "./CreateAgentSteps/DeploymentStep.tsx";

export interface AgentConfig {
  industry: string;
  template: string;
  models: {
    primary: string;
    fallback?: string;
    embedding?: string;
  };
  systemPrompt: string;
  tools: string[];
  toolsConfig: Record<string, Record<string, string | number | boolean>>;
}

// Global signals for state management
export const currentStep = signal(0);
export const agentConfig = signal<AgentConfig>({
  industry: "",
  template: "",
  models: {
    primary: "",
    fallback: "",
    embedding: "",
  },
  systemPrompt: "",
  tools: [],
  toolsConfig: {},
});

const steps = [
  { id: "industry", title: "Select Industry", component: IndustryStep },
  { id: "template", title: "Choose Template", component: TemplateStep },
  { id: "model", title: "Configure Models", component: ModelConfigStep },
  { id: "prompt", title: "System Prompt", component: SystemPromptStep },
  { id: "tools", title: "Add Tools", component: ToolsStep },
  { id: "deployment", title: "Deploy", component: DeploymentStep },
];

export default function CreateAgentFlow() {
  if (!IS_BROWSER) {
    return <div>Loading...</div>;
  }

  const handleNext = () => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
    } else if (currentStep.value === steps.length - 1) {
      handleDeploy();
    }
  };

  const handleBack = () => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  };

  const handleDeploy = async () => {
    try {
      const response = await fetch("/api/agents/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(agentConfig.value),
      });

      if (!response.ok) {
        throw new Error("Failed to deploy agent");
      }

      const result = await response.json();
      console.log("Agent deployed successfully:", result);

      // Redirect to the agent's playground for evaluation and testing
      window.location.href = `/dashboard/playground/${result.id}`;
    } catch (error) {
      console.error("Error deploying agent:", error);
    }
  };

  const CurrentStepComponent = steps[currentStep.value].component;

  return (
    <div class="min-h-screen bg-gray-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress bar */}
        <nav class="mb-8">
          <ol class="flex items-center">
            {steps.map((step, index) => (
              <li key={step.id} class="relative">
                {index > 0 && (
                  <div class="absolute inset-0 -left-px flex items-center" aria-hidden="true">
                    <div class={`h-0.5 w-full ${
                      index <= currentStep.value ? "bg-blue-600" : "bg-gray-200"
                    }`} />
                  </div>
                )}
                <div class={`relative flex items-center justify-center w-8 h-8 rounded-full ${
                  index < currentStep.value
                    ? "bg-blue-600"
                    : index === currentStep.value
                    ? "border-2 border-blue-600"
                    : "border-2 border-gray-300"
                } ${index <= currentStep.value ? "text-white" : "text-gray-500"}`}>
                  {index < currentStep.value ? (
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div class="ml-4 min-w-0 flex flex-col">
                  <span class={`text-sm font-medium ${
                    index <= currentStep.value ? "text-blue-600" : "text-gray-500"
                  }`}>
                    {step.title}
                  </span>
                </div>
              </li>
            ))}
          </ol>
        </nav>

        {/* Current step */}
        <div class="mt-8">
          <CurrentStepComponent
            config={agentConfig.value}
            onUpdate={(updates: Partial<AgentConfig>) => {
              agentConfig.value = { ...agentConfig.value, ...updates };
            }}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>

        {/* Navigation */}
        <div class="mt-8 flex justify-between">
          <button
            onClick={handleBack}
            disabled={currentStep.value === 0}
            class="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={currentStep.value === steps.length - 1}
            class="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
          >
            {currentStep.value === steps.length - 1 ? "Finish" : "Next"}
          </button>
        </div>
      </div>
    </div>
  );
}
