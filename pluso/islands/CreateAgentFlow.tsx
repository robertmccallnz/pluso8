import { useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
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

const steps = [
  { id: "industry", title: "Select Industry", component: IndustryStep },
  { id: "template", title: "Choose Template", component: TemplateStep },
  { id: "model", title: "Configure Models", component: ModelConfigStep },
  { id: "prompt", title: "System Prompt", component: SystemPromptStep },
  { id: "tools", title: "Add Tools", component: ToolsStep },
  { id: "deployment", title: "Deploy", component: DeploymentStep },
];

export default function CreateAgentFlow() {
  const currentStep = useSignal(0);
  const config = useSignal<Partial<AgentConfig>>({});

  const handleNext = useCallback(() => {
    if (currentStep.value < steps.length - 1) {
      currentStep.value++;
    } else if (currentStep.value === steps.length - 1) {
      handleDeploy();
    }
  }, []);

  const handleBack = useCallback(() => {
    if (currentStep.value > 0) {
      currentStep.value--;
    }
  }, []);

  const handleUpdateConfig = useCallback((update: Partial<AgentConfig>) => {
    config.value = { ...config.value, ...update };
  }, []);

  const handleDeploy = async () => {
    try {
      const response = await fetch("/api/agents/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(config.value),
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
    <div class="p-6">
      {/* Progress Steps */}
      <nav aria-label="Progress">
        <ol role="list" class="flex items-center">
          {steps.map((step, index) => (
            <li key={step.id} class={`relative ${index !== steps.length - 1 ? "pr-8 sm:pr-20" : ""}`}>
              <div class="absolute inset-0 flex items-center" aria-hidden="true">
                {index !== steps.length - 1 && (
                  <div class={`h-0.5 w-full ${index < currentStep.value ? "bg-blue-600" : "bg-gray-200"}`} />
                )}
              </div>
              <div class={`relative flex h-8 w-8 items-center justify-center rounded-full ${
                index < currentStep.value
                  ? "bg-blue-600"
                  : index === currentStep.value
                  ? "bg-blue-600"
                  : "bg-gray-200"
              }`}>
                <span class="text-sm font-medium text-white">{index + 1}</span>
              </div>
              <div class="mt-2">
                <span class="text-sm font-medium">{step.title}</span>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      {/* Step Content */}
      <div class="mt-8">
        <CurrentStepComponent
          config={config.value}
          onUpdate={handleUpdateConfig}
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
  );
}
