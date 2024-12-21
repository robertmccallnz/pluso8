import { h } from "preact";
import { useSignal } from "@preact/signals";
import { useCallback, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";
import { AgentConfig, StepData } from "./types.ts";
import { initializeAgent, saveStepData, updateAgentConfig, completeStep } from "./api.ts";
import ModeSelection from "./steps/ModeSelection.tsx";
import IndustrySelection from "./steps/IndustrySelection.tsx";
import TypeSelection from "./steps/TypeSelection.tsx";
import YamlEditor from "./steps/YamlEditor.tsx";
import ModelSelection from "./steps/ModelSelection.tsx";
import ReviewAndCreate from "./steps/ReviewAndCreate.tsx";

interface Props {
  userId: string;
  initialStep?: number;
  onComplete?: (config: AgentConfig) => void;
  onError?: (error: string) => void;
}

const STEPS = [
  {
    id: "mode",
    title: "Select Mode",
    description: "Choose how your agent will interact",
    component: ModeSelection
  },
  {
    id: "industry",
    title: "Select Industry",
    description: "Choose your agent's domain",
    component: IndustrySelection
  },
  {
    id: "type",
    title: "Select Type",
    description: "Choose your agent's specific function",
    component: TypeSelection
  },
  {
    id: "yaml",
    title: "Configure YAML",
    description: "Customize your agent's behavior",
    component: YamlEditor
  },
  {
    id: "model",
    title: "Select Model",
    description: "Choose your agent's AI model",
    component: ModelSelection
  },
  {
    id: "review",
    title: "Review & Create",
    description: "Review and finalize your agent",
    component: ReviewAndCreate
  }
] as const;

export default function AgentWizard({ userId, initialStep = 0, onComplete, onError }: Props) {
  if (!IS_BROWSER) {
    return null;
  }

  const currentStep = useSignal(initialStep);
  const agentConfig = useSignal<AgentConfig | null>(null);
  const error = useSignal<string | null>(null);
  const isLoading = useSignal(false);

  useEffect(() => {
    const initAgent = async () => {
      try {
        isLoading.value = true;
        const config = await initializeAgent(userId);
        agentConfig.value = config;
      } catch (err) {
        const errorMessage = "Failed to initialize agent configuration";
        console.error(errorMessage, err);
        error.value = errorMessage;
        onError?.(errorMessage);
      } finally {
        isLoading.value = false;
      }
    };

    initAgent();
  }, [userId]);

  const handleStepComplete = async (stepData: StepData) => {
    if (!agentConfig.value?.id) return;

    try {
      isLoading.value = true;
      error.value = null;

      await saveStepData(agentConfig.value.id, STEPS[currentStep.value].id, stepData);
      const updatedConfig = await updateAgentConfig(agentConfig.value.id, stepData);
      await completeStep(agentConfig.value.id, STEPS[currentStep.value].id);
      
      agentConfig.value = updatedConfig;

      if (currentStep.value === STEPS.length - 1) {
        onComplete?.(updatedConfig);
      } else {
        currentStep.value++;
      }
    } catch (err) {
      const errorMessage = "Failed to save step data";
      console.error(errorMessage, err);
      error.value = errorMessage;
      onError?.(errorMessage);
    } finally {
      isLoading.value = false;
    }
  };

  if (isLoading.value) {
    return (
      <div class="flex items-center justify-center min-h-[400px] bg-white rounded-lg shadow-lg">
        <div class="flex flex-col items-center space-y-4">
          <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p class="text-gray-600">Creating your agent...</p>
        </div>
      </div>
    );
  }

  if (error.value) {
    return (
      <div class="min-h-[400px] bg-white rounded-lg shadow-lg p-6">
        <div class="flex flex-col items-center space-y-4">
          <div class="p-4 bg-red-50 border border-red-200 rounded-lg w-full">
            <div class="flex items-center space-x-2 text-red-600">
              <svg class="w-6 h-6 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span class="text-sm font-medium">{error.value}</span>
            </div>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            class="btn btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep.value].component;
  return (
    <div class="bg-white rounded-lg shadow-lg p-6">
      {/* Progress Steps */}
      <div class="mb-8">
        <div class="flex justify-between">
          {STEPS.map((step, index) => (
            <div key={step.id} class="flex-1">
              <div class="relative">
                {/* Progress Line */}
                <div class={`h-1 ${
                  index === 0 ? "rounded-l" : 
                  index === STEPS.length - 1 ? "rounded-r" : ""
                } ${
                  index <= currentStep.value ? "bg-primary" : "bg-gray-200"
                }`}></div>
                
                {/* Step Circle */}
                <div class={`absolute -top-2 left-1/2 w-5 h-5 rounded-full transform -translate-x-1/2
                  border-2 transition-colors duration-200 ${
                  index === currentStep.value ? "border-primary bg-white" :
                  index < currentStep.value ? "border-primary bg-primary" :
                  "border-gray-200 bg-white"
                }`}>
                  {index < currentStep.value && (
                    <svg class="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" 
                      fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                        clip-rule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
              
              {/* Step Title */}
              <div class="mt-3 text-center">
                <p class={`text-sm font-medium ${
                  index <= currentStep.value ? "text-primary" : "text-gray-500"
                }`}>
                  {step.title}
                </p>
                <p class="text-xs text-gray-500 mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div class="mt-8">
        <CurrentStepComponent
          config={agentConfig.value}
          onComplete={handleStepComplete}
          error={error.value}
        />
      </div>
    </div>
  );
}
