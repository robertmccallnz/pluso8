import { AgentConfig } from "../CreateAgentFlow.tsx";
import { COLORS } from "../../lib/constants/styles.ts";

interface DeploymentStepProps {
  config: Partial<AgentConfig>;
  onUpdate: (update: Partial<AgentConfig>) => void;
  onNext?: () => void;
  onBack?: () => void;
}

export default function DeploymentStep({
  config,
  onUpdate,
  onNext,
  onBack,
}: DeploymentStepProps) {
  const handleDeploy = async () => {
    // Here you would typically make an API call to deploy the agent
    console.log("Deploying agent with config:", config);
    
    // After successful deployment, move to the next step if available
    onNext?.();
  };

  return (
    <div class="max-w-4xl mx-auto p-6">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold mb-3" style={{ color: COLORS.text.primary }}>
          Deploy Your Agent
        </h2>
        <p class="text-gray-600">
          Review your configuration and deploy your agent.
        </p>
      </div>

      {/* Configuration Summary */}
      <div class="space-y-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4" style={{ color: COLORS.text.primary }}>
            Configuration Summary
          </h3>
          
          <div class="space-y-4">
            {/* Industry */}
            <div>
              <h4 class="font-medium mb-1" style={{ color: COLORS.text.primary }}>Industry</h4>
              <p class="text-gray-600">{config.industry}</p>
            </div>

            {/* Template */}
            <div>
              <h4 class="font-medium mb-1" style={{ color: COLORS.text.primary }}>Template</h4>
              <p class="text-gray-600">{config.template}</p>
            </div>

            {/* Models */}
            <div>
              <h4 class="font-medium mb-1" style={{ color: COLORS.text.primary }}>Models</h4>
              <div class="pl-4">
                <p class="text-gray-600">Primary: {config.models?.primary}</p>
                {config.models?.fallback && (
                  <p class="text-gray-600">Fallback: {config.models.fallback}</p>
                )}
                {config.models?.embedding && (
                  <p class="text-gray-600">Embedding: {config.models.embedding}</p>
                )}
              </div>
            </div>

            {/* Tools */}
            <div>
              <h4 class="font-medium mb-1" style={{ color: COLORS.text.primary }}>Tools</h4>
              <div class="pl-4">
                {config.tools?.map((tool) => (
                  <div key={tool} class="mb-2">
                    <p class="text-gray-600">{tool}</p>
                    {config.toolsConfig?.[tool] && (
                      <div class="pl-4 text-sm">
                        {Object.entries(config.toolsConfig[tool]).map(([key, value]) => (
                          <p key={key} class="text-gray-500">
                            {key}: {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Evaluations */}
            {config.evaluations?.enabled && (
              <div>
                <h4 class="font-medium mb-1" style={{ color: COLORS.text.primary }}>Evaluations</h4>
                <div class="pl-4">
                  <p class="text-gray-600">Selected Criteria:</p>
                  <ul class="list-disc pl-4">
                    {config.evaluations.selectedCriteria?.map((criteria) => (
                      <li key={criteria} class="text-gray-600">{criteria}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div class="flex justify-between">
        <button
          onClick={onBack}
          class="px-4 py-2 text-sm font-medium rounded-md border"
          style={{ 
            borderColor: COLORS.border.primary,
            color: COLORS.text.primary
          }}
        >
          Back
        </button>
        <button
          onClick={handleDeploy}
          class="px-4 py-2 text-sm font-medium text-white rounded-md"
          style={{ backgroundColor: COLORS.primary }}
        >
          Deploy Agent
        </button>
      </div>
    </div>
  );
}
