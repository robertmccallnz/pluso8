import { JSX } from "preact";
import { useState } from "preact/hooks";
import { industryTemplates, type PromptTemplate } from "./IndustryTemplates";

interface IndustryTemplateSelectorProps {
  industry: string;
  onTemplateSelect: (template: PromptTemplate) => void;
}

export function IndustryTemplateSelector({
  industry,
  onTemplateSelect,
}: IndustryTemplateSelectorProps): JSX.Element {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [variables, setVariables] = useState<Record<string, string>>({});

  const templates = industryTemplates[industry]?.promptTemplates || [];
  const commonVars = industryTemplates[industry]?.commonVariables || {};

  const handleTemplateSelect = (templateName: string) => {
    setSelectedTemplate(templateName);
    setVariables({});
    const template = templates.find((t) => t.name === templateName);
    if (template) {
      // Initialize variables with empty strings
      const vars = extractVariables(template.prompt);
      const initialVars = Object.fromEntries(vars.map((v) => [v, ""]));
      setVariables(initialVars);
    }
  };

  const extractVariables = (prompt: string): string[] => {
    const matches = prompt.match(/\{([^}]+)\}/g) || [];
    return matches.map((match) => match.slice(1, -1));
  };

  const generatePrompt = () => {
    const template = templates.find((t) => t.name === selectedTemplate);
    if (!template) return;

    let filledPrompt = template.prompt;
    Object.entries(variables).forEach(([key, value]) => {
      filledPrompt = filledPrompt.replace(`{${key}}`, value);
    });

    let filledResponse = template.responseTemplate || "";
    Object.entries(variables).forEach(([key, value]) => {
      filledResponse = filledResponse.replace(new RegExp(`\\{${key}\\}`, "g"), value);
    });

    onTemplateSelect({
      ...template,
      prompt: filledPrompt,
      responseTemplate: filledResponse,
    });
  };

  return (
    <div class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Select Template
        </label>
        <select
          value={selectedTemplate}
          onChange={(e) =>
            handleTemplateSelect((e.target as HTMLSelectElement).value)
          }
          class="w-full px-3 py-2 border rounded-md"
        >
          <option value="">Choose a template...</option>
          {templates.map((template) => (
            <option key={template.name} value={template.name}>
              {template.name}
            </option>
          ))}
        </select>
      </div>

      {selectedTemplate && (
        <div class="space-y-4">
          <div class="text-sm text-gray-600">
            {templates.find((t) => t.name === selectedTemplate)?.description}
          </div>

          <div class="space-y-3">
            <h4 class="font-medium text-sm">Template Variables</h4>
            {Object.keys(variables).map((variable) => (
              <div key={variable}>
                <label class="block text-sm text-gray-700 mb-1">
                  {variable}
                  {commonVars[variable] && (
                    <span class="text-gray-500 ml-1">
                      ({commonVars[variable]})
                    </span>
                  )}
                </label>
                <input
                  type="text"
                  value={variables[variable]}
                  onInput={(e) =>
                    setVariables({
                      ...variables,
                      [variable]: (e.target as HTMLInputElement).value,
                    })
                  }
                  class="w-full px-3 py-2 border rounded-md text-sm"
                  placeholder={`Enter ${variable}`}
                />
              </div>
            ))}
          </div>

          <button
            onClick={generatePrompt}
            disabled={Object.values(variables).some((v) => !v)}
            class="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Generate Prompt
          </button>
        </div>
      )}
    </div>
  );
}
