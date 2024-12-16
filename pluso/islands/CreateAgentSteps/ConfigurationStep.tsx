import { FormikProps } from "formik";
import { COLORS } from "../../lib/constants/styles.ts";

interface ConfigurationStepProps {
  formik: FormikProps<any>;
  template: any;
}

const AVAILABLE_MODELS = {
  primary: [
    { id: "gpt-4", name: "GPT-4", description: "Most capable model, best for complex tasks" },
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and cost-effective" },
    { id: "claude-2", name: "Claude 2", description: "Anthropic's advanced model" }
  ],
  fallback: [
    { id: "gpt-3.5-turbo", name: "GPT-3.5 Turbo", description: "Fast and cost-effective" },
    { id: "claude-instant-1", name: "Claude Instant", description: "Fast and cost-effective Claude model" }
  ],
  embedding: [
    { id: "text-embedding-ada-002", name: "Ada 002", description: "OpenAI's text embedding model" }
  ]
};

export default function ConfigurationStep({ formik, template }: ConfigurationStepProps) {
  return (
    <div class="p-6 space-y-6">
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Model Configuration</h2>
        <p class="text-gray-600">Select the AI models that will power your agent</p>
      </div>

      <div class="space-y-6">
        {/* Primary Model Selection */}
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Primary Model
            <select
              name="primaryModel"
              value={formik.values.primaryModel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a model</option>
              {AVAILABLE_MODELS.primary.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
          </label>
          {formik.touched.primaryModel && formik.errors.primaryModel && (
            <p class="text-red-500 text-sm">{formik.errors.primaryModel}</p>
          )}
        </div>

        {/* Fallback Model Selection */}
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Fallback Model
            <select
              name="fallbackModel"
              value={formik.values.fallbackModel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a model</option>
              {AVAILABLE_MODELS.fallback.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
          </label>
          {formik.touched.fallbackModel && formik.errors.fallbackModel && (
            <p class="text-red-500 text-sm">{formik.errors.fallbackModel}</p>
          )}
        </div>

        {/* Embedding Model Selection */}
        <div class="space-y-2">
          <label class="block text-sm font-medium text-gray-700">
            Embedding Model
            <select
              name="embeddingModel"
              value={formik.values.embeddingModel}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a model</option>
              {AVAILABLE_MODELS.embedding.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} - {model.description}
                </option>
              ))}
            </select>
          </label>
          {formik.touched.embeddingModel && formik.errors.embeddingModel && (
            <p class="text-red-500 text-sm">{formik.errors.embeddingModel}</p>
          )}
        </div>

        {/* Features Selection */}
        <div class="space-y-2">
          <h3 class="text-lg font-medium">Features</h3>
          <div class="space-y-2">
            {template.features.map((feature: string) => (
              <label key={feature} class="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="features"
                  value={feature}
                  checked={formik.values.features.includes(feature)}
                  onChange={(e) => {
                    const features = [...formik.values.features];
                    if (e.target.checked) {
                      features.push(feature);
                    } else {
                      const index = features.indexOf(feature);
                      if (index > -1) {
                        features.splice(index, 1);
                      }
                    }
                    formik.setFieldValue('features', features);
                  }}
                  class="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <span class="text-sm text-gray-700">{feature}</span>
              </label>
            ))}
          </div>
          {formik.touched.features && formik.errors.features && (
            <p class="text-red-500 text-sm">{formik.errors.features}</p>
          )}
        </div>
      </div>
    </div>
  );
}
