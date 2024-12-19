import { Signal } from "@preact/signals";
import { INDUSTRIES } from "../../types/industries.ts";
import { INDUSTRY_AGENT_TYPES } from "../../agents/types/agent_types.ts";
import { useState } from "preact/hooks";

interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

interface IndustryStepProps {
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
  industries: Industry[];
  onNext: () => void;
  onBack: () => void;
}

export default function IndustryStep({ formValues, industries, onNext, onBack }: IndustryStepProps) {
  return (
    <div class="space-y-8">
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900">Select Industry</h2>
        <p class="mt-2 text-sm text-gray-600">
          Choose the industry that best matches your agent's purpose
        </p>
      </div>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {industries.map((industry) => (
          <button
            key={industry.id}
            onClick={() => {
              formValues.value = {
                ...formValues.value,
                industry: industry.id
              };
              onNext();
            }}
            class={`relative rounded-lg border p-6 text-left shadow-sm focus:outline-none ${
              formValues.value.industry === industry.id
                ? "border-blue-500 ring-2 ring-blue-500"
                : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <div class="flex items-center space-x-4">
              <div class="flex-shrink-0 text-2xl">{industry.icon}</div>
              <div>
                <h3 class="text-lg font-medium text-gray-900">{industry.name}</h3>
                <p class="mt-1 text-sm text-gray-500">{industry.description}</p>
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
      </div>
    </div>
  );
}
