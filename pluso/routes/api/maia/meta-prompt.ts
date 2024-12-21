import { Handlers } from "$fresh/server.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { metaPromptingService } from "../../../services/meta-prompting.ts";

interface MetaPromptRequest {
  query: string;
  context: {
    files: Array<{
      path: string;
      content: string;
    }>;
    currentFile?: string;
  };
  strategy: "iterative-refinement" | "zero-shot-decomposition" | "chain-of-thought" | "few-shot-learning";
}

interface FileChange {
  path: string;
  content: string;
  description: string;
}

async function applyChanges(changes: FileChange[]): Promise<void> {
  for (const change of changes) {
    const fullPath = join(Deno.cwd(), change.path);
    try {
      // Create parent directories if they don't exist
      const parentDir = fullPath.substring(0, fullPath.lastIndexOf('/'));
      await Deno.mkdir(parentDir, { recursive: true });
      
      // Write the file
      await Deno.writeTextFile(fullPath, change.content);
      console.log(`Successfully wrote changes to ${change.path}`);
    } catch (error) {
      console.error(`Failed to write changes to ${change.path}:`, error);
      throw error;
    }
  }
}

// Example changes for fixing agent creation
async function generateAgentCreationFixes(): Promise<FileChange[]> {
  return [
    {
      path: "islands/AgentCreation/steps/ModeSelection.tsx",
      content: `import { AgentConfig } from "../../../types/agent.ts";

interface Props {
  config: AgentConfig;
  onUpdate: (update: Partial<AgentConfig>) => void;
}

const ModeSelection = ({ config, onUpdate }: Props) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <button
        onClick={() => onUpdate({ mode: "assistant" })}
        class={\`p-6 rounded-lg border \${
          config.mode === "assistant" ? "border-blue-500 bg-blue-50" : "border-gray-200"
        }\`}
      >
        <h3 class="text-lg font-semibold">Assistant Mode</h3>
        <p class="mt-2 text-gray-600">Create an AI assistant that can help with specific tasks</p>
      </button>
      <button
        onClick={() => onUpdate({ mode: "agent" })}
        class={\`p-6 rounded-lg border \${
          config.mode === "agent" ? "border-blue-500 bg-blue-50" : "border-gray-200"
        }\`}
      >
        <h3 class="text-lg font-semibold">Agent Mode</h3>
        <p class="mt-2 text-gray-600">Create an autonomous agent that can perform complex tasks</p>
      </button>
    </div>
  );
};

export default ModeSelection;`,
      description: "Fixed ModeSelection component with proper styling and functionality"
    },
    {
      path: "islands/AgentCreation/AgentWizard.tsx",
      content: `import { useSignal } from "@preact/signals";
import { AgentConfig } from "../../types/agent.ts";
import ModeSelection from "./steps/ModeSelection.tsx";
import IndustrySelection from "./steps/IndustrySelection.tsx";
import TypeSelection from "./steps/TypeSelection.tsx";
import ModelSelection from "./steps/ModelSelection.tsx";
import YamlEditor from "./steps/YamlEditor.tsx";
import ReviewAndCreate from "./steps/ReviewAndCreate.tsx";

const STEPS = [
  { id: "mode", title: "Mode", component: ModeSelection },
  { id: "industry", title: "Industry", component: IndustrySelection },
  { id: "type", title: "Type", component: TypeSelection },
  { id: "model", title: "Model", component: ModelSelection },
  { id: "yaml", title: "Configuration", component: YamlEditor },
  { id: "review", title: "Review", component: ReviewAndCreate }
];

export default function AgentWizard() {
  const currentStep = useSignal(0);
  const config = useSignal<AgentConfig>({
    mode: undefined,
    industry: undefined,
    type: undefined,
    model: undefined,
    yaml: undefined
  });

  const handleUpdate = (update: Partial<AgentConfig>) => {
    config.value = { ...config.value, ...update };
  };

  const CurrentStepComponent = STEPS[currentStep.value].component;

  return (
    <div class="max-w-4xl mx-auto py-8">
      {/* Progress bar */}
      <div class="mb-8">
        <div class="flex justify-between">
          {STEPS.map((step, index) => (
            <div
              key={step.id}
              class={\`flex-1 \${
                index === currentStep.value
                  ? "text-blue-600"
                  : index < currentStep.value
                  ? "text-green-600"
                  : "text-gray-400"
              }\`}
            >
              <div class="relative">
                <div class="h-1 bg-current"></div>
                <div class="absolute -top-2 left-1/2 w-4 h-4 rounded-full bg-current"></div>
              </div>
              <div class="mt-2 text-center text-sm">{step.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div class="bg-white rounded-lg shadow-lg p-6">
        <CurrentStepComponent
          config={config.value}
          onUpdate={handleUpdate}
        />
      </div>

      {/* Navigation */}
      <div class="mt-6 flex justify-between">
        <button
          onClick={() => currentStep.value--}
          disabled={currentStep.value === 0}
          class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => currentStep.value++}
          disabled={currentStep.value === STEPS.length - 1}
          class="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}`,
      description: "Fixed AgentWizard component with proper step management and navigation"
    }
  ];
}

export const handler: Handlers = {
  async POST(req) {
    try {
      const body: MetaPromptRequest = await req.json();
      const { query, context, strategy } = body;

      if (!query || !context || !strategy) {
        return new Response(JSON.stringify({ 
          error: "Missing required fields" 
        }), { 
          status: 400,
          headers: { "Content-Type": "application/json" }
        });
      }

      // For now, we'll use hardcoded changes for fixing agent creation
      // Later, we can implement actual AI-based changes
      const changes = await generateAgentCreationFixes();
      
      // Apply the changes to the actual files
      await applyChanges(changes);

      return new Response(JSON.stringify({ 
        success: true,
        changes 
      }), {
        headers: { "Content-Type": "application/json" }
      });

    } catch (error) {
      return new Response(JSON.stringify({ 
        error: error.message 
      }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }
};
