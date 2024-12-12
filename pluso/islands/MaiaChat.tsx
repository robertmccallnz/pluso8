// islands/MaiaChat.tsx
import { useState } from "preact/hooks";

export default function MaiaChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <>
      <div class="text-center mt-12">
        <button 
          onClick={() => setIsChatOpen(true)}
          class="bg-[#1a4b8d] hover:bg-[#1a4b8d]/90 text-white px-8 py-4 rounded-lg text-xl"
        >
          Chat with Maia
        </button>
      </div>

      {isChatOpen && (
        <div class="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div class="bg-white p-6 rounded-lg max-w-md w-full">
            <h2 class="text-xl mb-4">Chat with Maia</h2>
            <button 
              onClick={() => setIsChatOpen(false)}
              class="bg-red-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}