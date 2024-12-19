import { AgentConfig } from "../CreateAgentFlow.tsx";
import { COLORS } from "../../lib/constants/styles.ts";

interface DeploymentStepProps {
  config: Partial<AgentConfig>;
  onUpdate: (update: Partial<AgentConfig>) => void;
  onNext?: () => void;
  onBack?: () => void;
}

const industries = [
  "Aerospace & Defense",
  "Agriculture & Farming",
  "Automotive",
  "Banking & Financial Services",
  "Biotechnology",
  "Chemical Manufacturing",
  "Construction & Real Estate",
  "Consumer Electronics",
  "Consumer Goods",
  "Cybersecurity",
  "E-commerce",
  "Education & EdTech",
  "Energy & Utilities",
  "Entertainment & Media",
  "Environmental Services",
  "Fashion & Apparel",
  "Food & Beverage",
  "Gaming & Esports",
  "Government & Public Sector",
  "Healthcare & Medical Devices",
  "Hospitality & Tourism",
  "Industrial Manufacturing",
  "Information Technology",
  "Insurance",
  "Legal Services",
  "Logistics & Supply Chain",
  "Maritime & Shipping",
  "Marketing & Advertising",
  "Mining & Metals",
  "Non-Profit & NGO",
  "Oil & Gas",
  "Pharmaceutical",
  "Professional Services",
  "Renewable Energy",
  "Research & Development",
  "Retail",
  "Robotics & Automation",
  "Social Media",
  "Software Development",
  "Space Technology",
  "Sports & Recreation",
  "Telecommunications",
  "Transportation",
  "Urban Planning",
  "Venture Capital & Private Equity",
  "Waste Management",
  "Water Treatment",
  "Web Services",
  "Wholesale & Distribution",
  "Wireless Technology"
];

export default function DeploymentStep({
  config,
  onUpdate,
  onNext,
  onBack,
}: DeploymentStepProps) {
  const handleDeploy = async () => {
    console.log("Deploying agent with config:", config);
    onNext?.();
  };

  return (
    <div class="max-w-4xl mx-auto p-6">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold mb-3" style={{ color: COLORS.gray[900] }}>
          Deploy Your Agent
        </h2>
        <p class="text-gray-600">
          Select your industry and review your configuration.
        </p>
      </div>

      <div class="space-y-6 mb-8">
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4" style={{ color: COLORS.gray[900] }}>
            Select Your Industry
          </h3>
          
          <div class="relative">
            <select
              value={config.industry || ""}
              onChange={(e) => onUpdate({ industry: e.target.value })}
              class="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
              style={{ color: COLORS.gray[900] }}
            >
              <option value="">Select an industry...</option>
              {industries.map((industry) => (
                <option key={industry} value={industry}>
                  {industry}
                </option>
              ))}
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Configuration Summary */}
        <div class="bg-white p-6 rounded-lg shadow">
          <h3 class="text-lg font-semibold mb-4" style={{ color: COLORS.gray[900] }}>
            Configuration Summary
          </h3>
          
          <div class="space-y-4">
            {/* Industry */}
            <div>
              <h4 class="font-medium mb-1" style={{ color: COLORS.gray[900] }}>Selected Industry</h4>
              <p class="text-gray-600">{config.industry || "Not selected"}</p>
            </div>

            {/* Template */}
            <div>
              <h4 class="font-medium mb-1" style={{ color: COLORS.gray[900] }}>Template</h4>
              <p class="text-gray-600">{config.template}</p>
            </div>

            {/* Models */}
            <div>
              <h4 class="font-medium mb-1" style={{ color: COLORS.gray[900] }}>Models</h4>
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
              <h4 class="font-medium mb-1" style={{ color: COLORS.gray[900] }}>Tools</h4>
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
                <h4 class="font-medium mb-1" style={{ color: COLORS.gray[900] }}>Evaluations</h4>
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
            color: COLORS.gray[900]
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
