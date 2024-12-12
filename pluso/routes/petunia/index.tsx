import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import ChatInterface from "../../islands/ChatInterface.tsx";

interface Message {
  role: "assistant" | "user";
  content: string;
}

export const handler: Handlers = {
  async POST(req, ctx) {
    const form = await req.formData();
    const message = form.get("message")?.toString() || "";

    // Example response structure
    const response = {
      messages: [
        { role: "user", content: message },
        { role: "assistant", content: "Kia ora! I'll help you with that..." }
      ]
    };

    return new Response(JSON.stringify(response));
  }
};

export default function PetuniaPage() {
  return (
    <>
      <Head>
        <title>Petunia - PluSO Nature Guide</title>
        <meta name="description" content="Expert in New Zealand flora and gardening" />
      </Head>

      <div class="min-h-screen bg-white">
        {/* Petunia Introduction */}
        <div class="max-w-4xl mx-auto pt-24 px-4">
          <div class="text-center mb-12">
            <svg viewBox="0 0 200 120" class="h-32 mx-auto mb-8">
              {/* ... SVG content ... */}
            </svg>

            <div class="space-y-4">
              <p class="font-mono text-xl">
                <span class="text-[#FF6B00]">Kia ora!</span> Welcome to your personal garden guide
              </p>
              <p class="font-mono text-gray-600 max-w-2xl mx-auto">
                Expert in New Zealand native plants, sustainable gardening practices, and ecological conservation. 
                Fluent in both te reo Māori and English.
              </p>
            </div>
          </div>

          {/* Expertise Areas */}
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {/* ... expertise areas content ... */}
          </div>

          {/* Chat Interface */}
          <div class="max-w-3xl mx-auto mb-12">
            <ChatInterface 
              endpoint="/petunia"
              agentName="PETUNIA"
              allowFiles={false}
            />
          </div>
        </div>
      </div>
    </>
  );
}