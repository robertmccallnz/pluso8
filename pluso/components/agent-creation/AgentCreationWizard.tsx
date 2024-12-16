import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import {
  AgentConfig,
  AgentUseCase,
  ModelConfig,
  AgentTemplate,
  EvaluationCriteria,
  DEFAULT_USE_CASES
} from './AgentCreationFlow';
import { ABTestingSystem } from '../rlhf/ABTesting';
import { BiasDetector } from '../rlhf/BiasDetector';
import { FeedbackCalibrator } from '../rlhf/FeedbackCalibrator';

type WizardStep =
  | 'use-case'
  | 'model'
  | 'template'
  | 'parameters'
  | 'evaluation'
  | 'testing'
  | 'deployment';

interface WizardState {
  step: WizardStep;
  useCase?: AgentUseCase;
  model?: ModelConfig;
  template?: AgentTemplate;
  parameters: Record<string, any>;
  evaluationCriteria: EvaluationCriteria[];
  testResults?: any;
  deploymentConfig?: AgentConfig['deploymentConfig'];
}

export function AgentCreationWizard() {
  const [state, setState] = useState<WizardState>({
    step: 'use-case',
    parameters: {},
    evaluationCriteria: []
  });

  const [testResponses, setTestResponses] = useState<Array<{
    input: string;
    output: string;
    scores: Record<string, number>;
  }>>([]);

  const steps: WizardStep[] = [
    'use-case',
    'model',
    'template',
    'parameters',
    'evaluation',
    'testing',
    'deployment'
  ];

  const handleUseCaseSelect = (useCase: AgentUseCase) => {
    setState({
      ...state,
      step: 'model',
      useCase
    });
  };

  const handleModelSelect = (model: ModelConfig) => {
    setState({
      ...state,
      step: 'template',
      model
    });
  };

  const handleTemplateSelect = (template: AgentTemplate) => {
    setState({
      ...state,
      step: 'parameters',
      template
    });
  };

  const handleParameterUpdate = (parameters: Record<string, any>) => {
    setState({
      ...state,
      step: 'evaluation',
      parameters
    });
  };

  const handleEvaluationCriteriaSet = (criteria: EvaluationCriteria[]) => {
    setState({
      ...state,
      step: 'testing',
      evaluationCriteria: criteria
    });
  };

  const handleTestingComplete = (results: any) => {
    setState({
      ...state,
      step: 'deployment',
      testResults: results
    });
  };

  const handleDeploy = (deploymentConfig: AgentConfig['deploymentConfig']) => {
    setState({
      ...state,
      deploymentConfig
    });
    // Trigger deployment
  };

  const renderUseCaseSelection = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Select Use Case</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.values(DEFAULT_USE_CASES).map(useCase => (
          <div
            key={useCase.id}
            class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleUseCaseSelect(useCase)}
          >
            <h3 class="text-lg font-semibold mb-2">{useCase.name}</h3>
            <p class="text-gray-600 mb-4">{useCase.description}</p>
            <div class="flex flex-wrap gap-2">
              {useCase.capabilities.map(cap => (
                <span
                  key={cap}
                  class="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {cap}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderModelSelection = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Select Model</h2>
      {state.useCase && (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.useCase.suggestedModels.map(modelId => (
            <div
              key={modelId}
              class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleModelSelect({ id: modelId } as ModelConfig)}
            >
              <h3 class="text-lg font-semibold mb-2">{modelId}</h3>
              {/* Add model details */}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderTemplateSelection = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Select Template</h2>
      {state.useCase && (
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.useCase.templates.map(templateId => (
            <div
              key={templateId}
              class="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => handleTemplateSelect({ id: templateId } as AgentTemplate)}
            >
              <h3 class="text-lg font-semibold mb-2">{templateId}</h3>
              {/* Add template details */}
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderParameterConfiguration = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Configure Parameters</h2>
      {state.template && (
        <div class="bg-white rounded-lg shadow p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleParameterUpdate(state.parameters);
            }}
          >
            {Object.entries(state.template.suggestedParameters || {}).map(
              ([key, param]) => (
                <div key={key} class="mb-4">
                  <label class="block text-sm font-medium text-gray-700">
                    {key}
                  </label>
                  <input
                    type={param.type}
                    value={state.parameters[key] || param.default}
                    onChange={(e) =>
                      setState({
                        ...state,
                        parameters: {
                          ...state.parameters,
                          [key]: (e.target as HTMLInputElement).value
                        }
                      })
                    }
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                  <p class="mt-1 text-sm text-gray-500">{param.description}</p>
                </div>
              )
            )}
            <button
              type="submit"
              class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Next
            </button>
          </form>
        </div>
      )}
    </div>
  );

  const renderEvaluationSetup = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Setup Evaluation Criteria</h2>
      {state.useCase && (
        <div class="bg-white rounded-lg shadow p-6">
          <div class="space-y-4">
            {state.useCase.evaluationCriteria.map(criterionId => (
              <div key={criterionId} class="flex items-center">
                <input
                  type="checkbox"
                  id={criterionId}
                  checked={state.evaluationCriteria.some(c => c.id === criterionId)}
                  onChange={(e) => {
                    const checked = (e.target as HTMLInputElement).checked;
                    setState({
                      ...state,
                      evaluationCriteria: checked
                        ? [...state.evaluationCriteria, { id: criterionId } as EvaluationCriteria]
                        : state.evaluationCriteria.filter(c => c.id !== criterionId)
                    });
                  }}
                  class="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <label
                  for={criterionId}
                  class="ml-2 block text-sm text-gray-700"
                >
                  {criterionId}
                </label>
              </div>
            ))}
          </div>
          <button
            onClick={() => handleEvaluationCriteriaSet(state.evaluationCriteria)}
            class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );

  const renderTesting = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Test Agent</h2>
      <div class="bg-white rounded-lg shadow p-6">
        <div class="space-y-6">
          <div>
            <h3 class="text-lg font-medium mb-4">Sample Responses</h3>
            <div class="space-y-4">
              {testResponses.map((response, index) => (
                <div key={index} class="border rounded-lg p-4">
                  <div class="font-medium mb-2">Test Case {index + 1}</div>
                  <div class="text-sm text-gray-600 mb-2">
                    Input: {response.input}
                  </div>
                  <div class="text-sm mb-2">Output: {response.output}</div>
                  <div class="grid grid-cols-2 gap-2">
                    {Object.entries(response.scores).map(([metric, score]) => (
                      <div key={metric} class="flex justify-between text-sm">
                        <span class="text-gray-600">{metric}:</span>
                        <span>{score.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={() => handleTestingComplete(testResponses)}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Complete Testing
          </button>
        </div>
      </div>
    </div>
  );

  const renderDeployment = () => (
    <div class="space-y-6">
      <h2 class="text-2xl font-bold">Deploy Agent</h2>
      <div class="bg-white rounded-lg shadow p-6">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDeploy(state.deploymentConfig!);
          }}
        >
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Endpoint Name
              </label>
              <input
                type="text"
                class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Scaling Rules
              </label>
              <div class="grid grid-cols-3 gap-4">
                <input
                  type="number"
                  placeholder="Min Instances"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                <input
                  type="number"
                  placeholder="Max Instances"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
                <input
                  type="number"
                  placeholder="Target Latency (ms)"
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Monitoring
              </label>
              <div class="mt-2 space-y-2">
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-600">
                    Enable Performance Monitoring
                  </span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-600">
                    Enable Error Tracking
                  </span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="checkbox"
                    class="h-4 w-4 text-blue-600 rounded border-gray-300"
                  />
                  <span class="ml-2 text-sm text-gray-600">
                    Enable Usage Analytics
                  </span>
                </label>
              </div>
            </div>
          </div>
          <button
            type="submit"
            class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Deploy Agent
          </button>
        </form>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (state.step) {
      case 'use-case':
        return renderUseCaseSelection();
      case 'model':
        return renderModelSelection();
      case 'template':
        return renderTemplateSelection();
      case 'parameters':
        return renderParameterConfiguration();
      case 'evaluation':
        return renderEvaluationSetup();
      case 'testing':
        return renderTesting();
      case 'deployment':
        return renderDeployment();
      default:
        return null;
    }
  };

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <h1 class="text-3xl font-bold">Create New Agent</h1>
          <div class="text-sm text-gray-500">
            Step {steps.indexOf(state.step) + 1} of {steps.length}
          </div>
        </div>
        <div class="mt-4">
          <div class="flex items-center">
            {steps.map((step, index) => (
              <div
                key={step}
                class="flex items-center"
              >
                <div
                  class={`flex items-center justify-center w-8 h-8 rounded-full ${
                    steps.indexOf(state.step) >= index
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    class={`w-20 h-1 mx-2 ${
                      steps.indexOf(state.step) > index
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div class="flex justify-between mt-2">
            {steps.map(step => (
              <div key={step} class="text-xs capitalize">
                {step}
              </div>
            ))}
          </div>
        </div>
      </div>
      {renderCurrentStep()}
    </div>
  );
}
