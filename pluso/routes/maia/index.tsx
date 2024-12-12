// routes/index.tsx
import { PageProps } from "$fresh/server.ts";
import MaiaChat from "../../islands/MaiaChat.tsx";

interface ServiceItem {
  english: string;
  maori: string;
}

function ServicesList({ items, type }: { items: ServiceItem[]; type: 'en' | 'mi' }) {
  return (
    <ul class="space-y-2">
      {items.map((service, index) => (
        <li 
          key={`${type}-${index}`} 
          class="bg-[#1a4b8d]/20 p-3 rounded-lg text-[#1a4b8d]"
        >
          {type === 'en' ? service.english : service.maori}
        </li>
      ))}
    </ul>
  );
}

export default function MaiaPage(props: PageProps) {
  // Remove the useState hook from here
  const services: ServiceItem[] = [
    {
      english: "Customer Service Management",
      maori: "Whakahaerehia Ratonga Kiritaki"
    },
    {
      english: "Chat Support", 
      maori: "Tautoko Korero"
    },
    {
      english: "Client Interaction Optimization",
      maori: "Whakapai Whakawhitinga Kiritaki"
    },
    {
      english: "Real-time Communication Solutions",
      maori: "Whakangao Whakawhitinga Tere"
    }
  ];

  const translationServices: ServiceItem[] = [
    {
      english: "Professional Translation Services",
      maori: "Ratonga Whakamāori Ngā Mahi"
    },
    {
      english: "Multilingual Communication Support",
      maori: "Tautoko Whakawhitinga Reo Maha"
    },
    {
      english: "Interpretation and Localization",
      maori: "Whakamāori me te Whakaraupapa"
    }
  ];

  return (
    <div class="min-h-screen bg-white">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div class="text-center space-y-4 mb-16">
          <h1 class="text-7xl font-bold text-[#1a4b8d]">
            PluSO Chat Agents
          </h1>
          <p class="text-xl text-[#1a4b8d]/70">Intelligent Conversation Solutions</p>
          <div class="flex justify-center space-x-4 mt-6">
            <a href="/agents" class="text-[#1a4b8d] hover:text-[#1a4b8d]/70 underline">
              View All Agents
            </a>
            <a href="/docs/agents" class="text-[#1a4b8d] hover:text-[#1a4b8d]/70 underline">
              Documentation
            </a>
          </div>
        </div>

        <div class="flex flex-col items-center space-y-6 mb-16">
          <div class="w-56 h-56 rounded-full border-4 border-[#1a4b8d] shadow-lg flex items-center justify-center">
            <span class="bg-[#1a4b8d] text-white text-4xl w-full h-full flex items-center justify-center rounded-full">
              M
            </span>
          </div>
          <div class="text-center space-y-4">
            <h2 class="text-4xl font-bold text-[#1a4b8d]">Maia</h2>
            <p class="text-xl text-[#1a4b8d]/70">Bilingual AI Assistant</p>
          </div>
        </div>

        <div class="bg-[#1a4b8d]/10 rounded-lg">
          <div class="p-6 space-y-6">
            <h2 class="text-2xl font-semibold text-[#1a4b8d]">Ratonga | Services</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-xl font-medium text-[#1a4b8d] border-b-2 border-[#1a4b8d] pb-2">
                  English
                </h3>
                <ServicesList items={services} type="en" />
              </div>
              <div class="space-y-4">
                <h3 class="text-xl font-medium text-[#1a4b8d] border-b-2 border-[#1a4b8d] pb-2">
                  Te Reo Māori
                </h3>
                <ServicesList items={services} type="mi" />
              </div>
            </div>
          </div>
        </div>

        <MaiaChat />

        <footer class="text-center text-[#1a4b8d]/60 text-sm py-12 mt-16">
          © PluSO {new Date().getFullYear()} | Tel: +64 022 400 4387
        </footer>
      </div>
    </div>
  );
}