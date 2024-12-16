import { useCallback, useEffect, useState } from "preact/hooks";

interface SystemPromptStepProps {
  config: Partial<{
    template: string;
    industry: string;
    systemPrompt: string;
  }>;
  onUpdate: (update: Partial<{ systemPrompt: string }>) => void;
  onNext: () => void;
  onBack: () => void;
}

// This would come from your templates in a real app
const TEMPLATE_PROMPTS: Record<string, string> = {
  "legal-researcher": `You are a legal research assistant with expertise in case law analysis and legal document review.

Key Responsibilities:
1. Analyze legal documents and case law
2. Extract relevant legal principles and precedents
3. Provide accurate citations and references
4. Maintain client confidentiality
5. Follow legal ethics guidelines

Guidelines:
- Always cite sources and legal precedents
- Maintain professional tone and legal terminology
- Highlight key findings and recommendations
- Indicate confidence level in analysis
- Flag potential risks or concerns

Remember: Your analysis should be thorough but concise, focusing on relevant legal principles and practical implications.`,

  "contract-analyzer": `You are a contract analysis specialist focused on identifying risks and ensuring compliance.

Key Responsibilities:
1. Review contract terms and conditions
2. Identify potential risks and liabilities
3. Ensure regulatory compliance
4. Flag unusual or concerning clauses
5. Suggest improvements and alternatives

Guidelines:
- Maintain systematic review approach
- Highlight critical terms and conditions
- Assess risk levels and implications
- Compare against standard practices
- Suggest specific improvements

Remember: Focus on practical implications while maintaining legal accuracy and compliance requirements.`,
};

export default function SystemPromptStep({ config, onUpdate, onNext }: SystemPromptStepProps) {
  const [prompt, setPrompt] = useState(config.systemPrompt || "");
  const [isEditing, setIsEditing] = useState(!config.systemPrompt);
  const [tokenCount, setTokenCount] = useState(0);

  // Load template prompt when template changes
  useEffect(() => {
    if (config.template && !config.systemPrompt) {
      const templatePrompt = TEMPLATE_PROMPTS[config.template];
      if (templatePrompt) {
        setPrompt(templatePrompt);
        onUpdate({ systemPrompt: templatePrompt });
      }
    }
  }, [config.template]);

  // Simple token count estimation (this should be replaced with a proper tokenizer)
  const estimateTokenCount = useCallback((text: string) => {
    return Math.ceil(text.split(/\s+/).length * 1.3);
  }, []);

  // Update token count when prompt changes
  useEffect(() => {
    setTokenCount(estimateTokenCount(prompt));
  }, [prompt, estimateTokenCount]);

  const handlePromptChange = (e: Event) => {
    const target = e.target as HTMLTextAreaElement;
    setPrompt(target.value);
    onUpdate({ systemPrompt: target.value });
  };

  return (
    <div class="max-w-4xl mx-auto p-6">
      <div class="text-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">System Prompt</h2>
        <p class="text-gray-600">
          Customize the system prompt that defines your agent's behavior and capabilities.
        </p>
      </div>

      <div class="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div class="flex items-center justify-between p-4 border-b border-gray-200">
          <div class="flex items-center space-x-4">
            <span class="text-sm text-gray-500">
              Estimated Tokens: {tokenCount}
            </span>
            <span class="text-sm text-gray-500">
              Characters: {prompt.length}
            </span>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            class="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
          >
            {isEditing ? "Preview" : "Edit"}
          </button>
        </div>

        <div class="p-4">
          {isEditing ? (
            <textarea
              value={prompt}
              onChange={handlePromptChange}
              class="w-full h-96 p-4 text-gray-900 border-0 focus:ring-0 resize-none"
              placeholder="Enter your system prompt..."
            />
          ) : (
            <div class="w-full h-96 p-4 text-gray-900 whitespace-pre-wrap overflow-auto">
              {prompt}
            </div>
          )}
        </div>
      </div>

      <div class="mt-8">
        <h3 class="text-lg font-medium text-gray-900 mb-4">Tips for writing effective system prompts:</h3>
        <ul class="list-disc list-inside space-y-2 text-gray-600">
          <li>Be specific about the agent's role and responsibilities</li>
          <li>Define clear boundaries and limitations</li>
          <li>Include relevant domain knowledge and expertise</li>
          <li>Specify the desired tone and communication style</li>
          <li>Add guidelines for handling edge cases</li>
        </ul>
      </div>

      <div class="mt-8 flex justify-end">
        <button
          onClick={onNext}
          disabled={!prompt.trim()}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
