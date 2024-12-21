import { useState } from "preact/hooks";
import MaiaChat from "./interfaces/MaiaChat.tsx";
import PetuniaChat from "./interfaces/PetuniaChat.tsx";
import JeffChat from "./interfaces/JeffChat.tsx";

interface Agent {
  name: string;
  description: string;
  avatar: string;
  widget: () => preact.JSX.Element;
}

const agents: Agent[] = [
  {
    name: "Maia",
    description: "Your AI companion focused on emotional intelligence and personal growth. Maia helps with self-reflection, meditation, and mindfulness practices.",
    avatar: "/avatars/maia.png",
    widget: MaiaChat
  },
  {
    name: "Petunia",
    description: "Expert gardening assistant who knows everything about plants, soil, and sustainable gardening practices. From indoor plants to large gardens.",
    avatar: "/avatars/petunia.png",
    widget: PetuniaChat
  },
  {
    name: "Jeff",
    description: "Your efficient personal assistant for task management, scheduling, and productivity. Helps organize your work and daily routines.",
    avatar: "/avatars/jeff.png",
    widget: JeffChat
  }
];

export default function Examples() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const handleAgentClick = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  return (
    <div class="space-y-8">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <div 
            key={agent.name}
            class="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div class="p-6">
              <div class="flex items-center mb-4">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  class="w-12 h-12 rounded-full"
                />
                <h3 class="ml-4 text-xl font-semibold text-gray-900">
                  {agent.name}
                </h3>
              </div>
              <p class="text-gray-600 mb-4">{agent.description}</p>
              <div class="mt-4">
                <button
                  class="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAgentClick(agent);
                  }}
                >
                  Chat with {agent.name}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedAgent && (
        <div 
          class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedAgent(null)}
        >
          <div 
            class="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div class="p-4 border-b flex justify-between items-center">
              <div class="flex items-center">
                <img
                  src={selectedAgent.avatar}
                  alt={selectedAgent.name}
                  class="w-8 h-8 rounded-full"
                />
                <h3 class="ml-3 text-lg font-semibold">{selectedAgent.name}</h3>
              </div>
              <button
                onClick={() => setSelectedAgent(null)}
                class="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div class="p-4">
              {<selectedAgent.widget />}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
