import { AgentConfig } from "../types.ts";

interface ModeOption {
  id: string;
  title: string;
  description: string;
  icon: string;
}

const MODES: ModeOption[] = [
  {
    id: "text",
    title: "Text",
    description: "Create an agent that processes and generates text",
    icon: "📝"
  },
  {
    id: "image",
    title: "Image",
    description: "Create an agent that can analyze and generate images",
    icon: "🖼️"
  },
  {
    id: "voice",
    title: "Voice",
    description: "Create an agent that can process and generate speech",
    icon: "🎤"
  },
  {
    id: "multimodal",
    title: "Multimodal",
    description: "Create an agent that can handle multiple types of input and output",
    icon: "🔄"
  }
];

interface Props {
  config: AgentConfig;
  onUpdate: (update: Partial<AgentConfig>) => void;
}

const ModeSelection = ({ config, onUpdate }: Props) => {
  return (
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      {MODES.map((mode) => (
        <button
          key={mode.id}
          onClick={() => onUpdate({ mode: mode.id as AgentConfig["mode"] })}
          class={`
            p-6 rounded-lg border-2 transition-all duration-200
            flex flex-col items-center text-center
            ${config.mode === mode.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
            }
          `}
        >
          <span class="text-4xl mb-4">{mode.icon}</span>
          <h3 class="text-xl font-semibold mb-2">{mode.title}</h3>
          <p class="text-gray-600">{mode.description}</p>
        </button>
      ))}
    </div>
  );
};

export default ModeSelection;
