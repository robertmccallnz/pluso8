import { Signal } from "@preact/signals";
import { AgentTemplate } from "../../core/types/dashboard.ts";
import { COLORS, TYPOGRAPHY, COMPONENTS } from "../../lib/constants/styles.ts";

interface PromptStepProps {
  template: AgentTemplate;
  systemPrompt: Signal<string>;
}

export default function PromptStep({ template, systemPrompt }: PromptStepProps) {
  return (
    <div class="space-y-6">
      <div>
        <h3 class={`text-${TYPOGRAPHY.fontSize.lg} font-${TYPOGRAPHY.fontWeight.semibold} mb-4 text-${COLORS.gray[900]}`}>
          System Prompt
        </h3>
        <p class={`text-${TYPOGRAPHY.fontSize.sm} mb-4 text-${COLORS.gray[600]}`}>
          Customize the system prompt for your agent. This defines the agent's behavior and capabilities.
        </p>
        <textarea
          value={systemPrompt.value}
          onChange={(e) => systemPrompt.value = (e.target as HTMLTextAreaElement).value}
          class={`w-full px-3 py-2 rounded-lg border font-mono bg-${COLORS.gray[50]} border-${COLORS.gray[300]} text-${COLORS.gray[900]} focus:ring-${COLORS.primary[500]} focus:border-${COLORS.primary[500]}`}
          rows={12}
          required
        />
      </div>

      <div>
        <h4 class={`text-${TYPOGRAPHY.fontSize.md} font-${TYPOGRAPHY.fontWeight.semibold} mb-2 text-${COLORS.gray[900]}`}>
          Template Variables
        </h4>
        <div class="grid grid-cols-2 gap-4">
          <div class={`${COMPONENTS.card.base} p-4`}>
            <h5 class={`text-${TYPOGRAPHY.fontSize.sm} font-${TYPOGRAPHY.fontWeight.medium} mb-2 text-${COLORS.gray[900]}`}>
              Available Variables
            </h5>
            <ul class={`text-${TYPOGRAPHY.fontSize.sm} space-y-1 text-${COLORS.gray[600]}`}>
              <li>{'{{agent_name}}'} - Agent's name</li>
              <li>{'{{features}}'} - Enabled features</li>
              <li>{'{{models}}'} - Available models</li>
              <li>{'{{tools}}'} - Available tools</li>
            </ul>
          </div>
          <div class={`${COMPONENTS.card.base} p-4`}>
            <h5 class={`text-${TYPOGRAPHY.fontSize.sm} font-${TYPOGRAPHY.fontWeight.medium} mb-2 text-${COLORS.gray[900]}`}>
              Tips
            </h5>
            <ul class={`text-${TYPOGRAPHY.fontSize.sm} space-y-1 text-${COLORS.gray[600]}`}>
              <li>Be specific about capabilities</li>
              <li>Define clear boundaries</li>
              <li>Include error handling</li>
              <li>Consider edge cases</li>
            </ul>
          </div>
        </div>
      </div>

      <div>
        <h4 class={`text-${TYPOGRAPHY.fontSize.md} font-${TYPOGRAPHY.fontWeight.semibold} mb-2 text-${COLORS.gray[900]}`}>
          Test Your Prompt
        </h4>
        <button
          class={`${COMPONENTS.button.base} ${COMPONENTS.button.variants.primary}`}
          onClick={() => {
            // Navigate to playground with current prompt
            const params = new URLSearchParams({
              prompt: systemPrompt.value,
              template: template.id
            });
            window.open(`/playground?${params.toString()}`, '_blank');
          }}
        >
          Open in Playground
        </button>
      </div>
    </div>
  );
}
