import { type useSignal } from "@preact/signals";

import { MessageSquare, X } from "https://esm.sh/lucide-preact@0.294.0";
import ChatInterface from "./PetuniaChat.tsx";


interface WidgetInterfaceProps {
  initialOpen?: boolean;
  agents?: Array<{
    id: string;
    name: string;
    avatar: string;
    description: string;
  }>;
  currentAgent?: string;
}

export default function WidgetInterface({
  initialOpen = false,
  agents = [],
  currentAgent,
}: WidgetInterfaceProps) {
  const isOpen = useSignal(initialOpen);

  return (
    <div class="fixed bottom-4 right-4 z-50">
      {/* Chat Toggle Button */}
      <button
        onClick={() => isOpen.value = !isOpen.value}
        class="bg-[#FF6B00] hover:bg-[#FF6B00]/90 text-white rounded-full p-3 shadow-lg"
      >
        {isOpen.value ? (
          <X class="w-6 h-6" />
        ) : (
          <MessageSquare class="w-6 h-6" />
        )}
      </button>

      {/* Chat Widget */}
      {isOpen.value && (
        <div class="absolute bottom-16 right-0 w-96 h-[600px] rounded-lg overflow-hidden shadow-xl border border-[#FF6B00]/20">
          <ChatInterface
            agents={agents}
            currentAgent={currentAgent}
            allowFiles={true}
            className="rounded-lg"
          />
        </div>
      )}
    </div>
  );
}