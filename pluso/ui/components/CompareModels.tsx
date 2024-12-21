import { JSX } from "preact";
import { useState } from "preact/hooks";

interface Model {
  name: string;
  description: string;
  type: string;
  provider: string;
  parameters?: string;
  context?: string;
  pricing?: string;
  icon: string;
}

interface CompareModelsProps {
  models: Model[];
  selectedModels: string[];
  onModelSelect: (modelName: string) => void;
}

export function CompareModels({ models, selectedModels, onModelSelect }: CompareModelsProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  const compareFeatures = [
    "Type",
    "Provider",
    "Parameters",
    "Context Window",
    "Pricing",
  ];

  const getModelValue = (model: Model, feature: string): string => {
    switch (feature) {
      case "Type":
        return model.type;
      case "Provider":
        return model.provider;
      case "Parameters":
        return model.parameters || "N/A";
      case "Context Window":
        return model.context || "N/A";
      case "Pricing":
        return model.pricing || "Contact for pricing";
      default:
        return "N/A";
    }
  };

  return (
    <div class="fixed bottom-0 left-0 right-0 bg-white shadow-lg transform transition-transform duration-300"
         style={{ transform: isOpen ? "translateY(0)" : "translateY(calc(100% - 48px))" }}>
      {/* Header */}
      <div
        class="flex items-center justify-between px-6 py-3 bg-gray-50 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div class="flex items-center space-x-2">
          <h3 class="text-lg font-semibold">Compare Models</h3>
          <span class="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
            {selectedModels.length} selected
          </span>
        </div>
        <button class="text-gray-500 hover:text-gray-700">
          <svg
            class={`w-6 h-6 transform transition-transform ${isOpen ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </div>

      {/* Comparison Table */}
      <div class="p-6">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Feature
                </th>
                {selectedModels.map((modelName) => {
                  const model = models.find((m) => m.name === modelName);
                  return (
                    <th key={modelName} class="px-6 py-3 bg-gray-50">
                      <div class="flex items-center space-x-2">
                        <img src={model?.icon} alt={modelName} class="w-6 h-6" />
                        <span class="text-sm font-medium text-gray-900">{modelName}</span>
                        <button
                          onClick={() => onModelSelect(modelName)}
                          class="text-gray-400 hover:text-gray-600"
                        >
                          <svg
                            class="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              {compareFeatures.map((feature) => (
                <tr key={feature}>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {feature}
                  </td>
                  {selectedModels.map((modelName) => {
                    const model = models.find((m) => m.name === modelName);
                    return (
                      <td key={`${modelName}-${feature}`} class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {model ? getModelValue(model, feature) : "N/A"}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
