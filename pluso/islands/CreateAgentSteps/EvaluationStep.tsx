import { Signal } from "@preact/signals";
import { AgentTemplate, EvaluationCriteria, TestCase } from "../../core/types/dashboard.ts";
import { COLORS, TYPOGRAPHY, COMPONENTS } from "../../lib/constants/styles.ts";

interface EvaluationStepProps {
  template: AgentTemplate;
  enableEvaluations: Signal<boolean>;
  selectedCriteria: Signal<string[]>;
  customTestCases: Signal<Record<string, TestCase[]>>;
  onNext?: () => void;
  onBack?: () => void;
}

export default function EvaluationStep({ 
  template,
  enableEvaluations,
  selectedCriteria,
  customTestCases,
  onNext,
  onBack
}: EvaluationStepProps) {
  const toggleCriteria = (criteriaName: string) => {
    const criteria = new Set(selectedCriteria.value);
    if (criteria.has(criteriaName)) {
      criteria.delete(criteriaName);
    } else {
      criteria.add(criteriaName);
    }
    selectedCriteria.value = Array.from(criteria);
  };

  const addTestCase = (criteriaName: string) => {
    const cases = customTestCases.value[criteriaName] || [];
    customTestCases.value = {
      ...customTestCases.value,
      [criteriaName]: [...cases, { input: '', expectedOutput: '' }]
    };
  };

  const updateTestCase = (criteriaName: string, index: number, field: keyof TestCase, value: string) => {
    const cases = [...(customTestCases.value[criteriaName] || [])];
    cases[index] = {
      ...cases[index],
      [field]: value
    };
    customTestCases.value = {
      ...customTestCases.value,
      [criteriaName]: cases
    };
  };

  const removeTestCase = (criteriaName: string, index: number) => {
    const cases = [...(customTestCases.value[criteriaName] || [])];
    cases.splice(index, 1);
    customTestCases.value = {
      ...customTestCases.value,
      [criteriaName]: cases
    };
  };

  return (
    <div class="space-y-6">
      {/* Enable Evaluations */}
      <div class={`flex items-center justify-between p-4 rounded-lg bg-${COLORS.gray[100]}`}>
        <div>
          <h3 class={`text-${TYPOGRAPHY.fontSize.lg} font-${TYPOGRAPHY.fontWeight.semibold} mb-1 text-${COLORS.gray[900]}`}>
            Enable Evaluations
          </h3>
          <p class={`text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[600]}`}>
            Run automated tests to ensure your agent meets quality standards
          </p>
        </div>
        <label class="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            class="sr-only peer"
            checked={enableEvaluations.value}
            onChange={(e) => enableEvaluations.value = (e.target as HTMLInputElement).checked}
          />
          <div class={`w-11 h-6 bg-${COLORS.gray[200]} peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-${COLORS.primary[300]} rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-${COLORS.gray[300]} after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-${COLORS.primary[600]}`}></div>
        </label>
      </div>

      {enableEvaluations.value && (
        <>
          {/* Evaluation Criteria */}
          <div>
            <h3 class={`text-${TYPOGRAPHY.fontSize.lg} font-${TYPOGRAPHY.fontWeight.semibold} mb-4 text-${COLORS.gray[900]}`}>
              Evaluation Criteria
            </h3>
            <div class="space-y-4">
              {template.evaluationCriteria.map((criteria) => (
                <div key={criteria.name} class={`${COMPONENTS.card.base} p-4`}>
                  <div class="flex items-start mb-4">
                    <input
                      type="checkbox"
                      checked={selectedCriteria.value.includes(criteria.name)}
                      onChange={() => toggleCriteria(criteria.name)}
                      class={`mt-1 mr-3 text-${COLORS.primary[600]} focus:ring-${COLORS.primary[500]}`}
                    />
                    <div>
                      <h4 class={`text-${TYPOGRAPHY.fontSize.md} font-${TYPOGRAPHY.fontWeight.medium} mb-1 text-${COLORS.gray[900]}`}>
                        {criteria.name}
                      </h4>
                      <p class={`text-${TYPOGRAPHY.fontSize.sm} mb-2 text-${COLORS.gray[600]}`}>
                        {criteria.description}
                      </p>
                      <div class={`flex space-x-4 text-${TYPOGRAPHY.fontSize.xs} text-${COLORS.gray[500]}`}>
                        <span>Type: {criteria.type}</span>
                        <span>Threshold: {criteria.threshold}</span>
                        <span>Weight: {criteria.weight}</span>
                      </div>
                    </div>
                  </div>

                  {/* Test Cases */}
                  {selectedCriteria.value.includes(criteria.name) && criteria.type === 'accuracy' && (
                    <div class="mt-4 pl-8">
                      <div class="flex justify-between items-center mb-3">
                        <h5 class={`text-${TYPOGRAPHY.fontSize.sm} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[900]}`}>
                          Test Cases
                        </h5>
                        <button
                          onClick={() => addTestCase(criteria.name)}
                          class={`text-${TYPOGRAPHY.fontSize.sm} px-3 py-1 rounded bg-${COLORS.gray[100]} text-${COLORS.gray[900]} hover:bg-${COLORS.gray[200]}`}
                        >
                          Add Test Case
                        </button>
                      </div>
                      <div class="space-y-4">
                        {(customTestCases.value[criteria.name] || []).map((testCase, index) => (
                          <div key={index} class={`space-y-2 p-3 rounded bg-${COLORS.gray[100]}`}>
                            <div>
                              <label class={`block text-${TYPOGRAPHY.fontSize.xs} mb-1 text-${COLORS.gray[600]}`}>
                                Input
                              </label>
                              <input
                                type="text"
                                value={testCase.input}
                                onChange={(e) => updateTestCase(criteria.name, index, 'input', (e.target as HTMLInputElement).value)}
                                class={`w-full px-2 py-1 rounded border text-${TYPOGRAPHY.fontSize.sm} bg-white border-${COLORS.gray[300]} text-${COLORS.gray[900]} focus:ring-${COLORS.primary[500]} focus:border-${COLORS.primary[500]}`}
                              />
                            </div>
                            <div>
                              <label class={`block text-${TYPOGRAPHY.fontSize.xs} mb-1 text-${COLORS.gray[600]}`}>
                                Expected Output
                              </label>
                              <input
                                type="text"
                                value={testCase.expectedOutput}
                                onChange={(e) => updateTestCase(criteria.name, index, 'expectedOutput', (e.target as HTMLInputElement).value)}
                                class={`w-full px-2 py-1 rounded border text-${TYPOGRAPHY.fontSize.sm} bg-white border-${COLORS.gray[300]} text-${COLORS.gray[900]} focus:ring-${COLORS.primary[500]} focus:border-${COLORS.primary[500]}`}
                              />
                            </div>
                            <button
                              onClick={() => removeTestCase(criteria.name, index)}
                              class={`text-${TYPOGRAPHY.fontSize.xs} px-2 py-1 rounded text-${COLORS.gray[600]} hover:text-${COLORS.gray[900]}`}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {/* Navigation Buttons */}
      <div class="flex justify-between mt-8">
        <button
          onClick={onBack}
          class={`${COMPONENTS.button.base} ${COMPONENTS.button.variants.secondary}`}
        >
          Back
        </button>
        <button
          onClick={onNext}
          class={`${COMPONENTS.button.base} ${COMPONENTS.button.variants.primary}`}
          disabled={enableEvaluations.value && selectedCriteria.value.length === 0}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
