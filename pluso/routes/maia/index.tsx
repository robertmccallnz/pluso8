import { Head } from "$fresh/runtime.ts";
import MaiaChat from "../../islands/interfaces/MaiaChat.tsx";

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
          class="bg-[#333333]/10 p-3 rounded-lg text-[#333333]"
        >
          {type === 'en' ? service.english : service.maori}
        </li>
      ))}
    </ul>
  );
}

export default function MaiaPage() {
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

  return (
    <div class="min-h-screen bg-[#F5F5F5]">
      <Head>
        <title>Maia | Bilingual AI Assistant</title>
      </Head>

      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        <div class="text-center space-y-4 mb-16">
          <h1 class="text-7xl font-bold text-[#333333]">
            Maia
          </h1>
          <p class="text-xl text-[#333333]/70">Bilingual AI Assistant</p>
          <div class="flex justify-center space-x-4 mt-6">
            <a href="/agents" class="text-[#333333] hover:text-[#333333]/70 underline">
              View All Agents
            </a>
            <a href="/docs/agents" class="text-[#333333] hover:text-[#333333]/70 underline">
              Documentation
            </a>
          </div>
        </div>

        <div class="flex flex-col items-center space-y-6 mb-16">
          <div class="w-56 h-56 rounded-full border-4 border-[#333333] shadow-lg flex items-center justify-center">
            <span class="bg-[#333333] text-[#F5F5F5] text-4xl w-full h-full flex items-center justify-center rounded-full">
              M
            </span>
          </div>
        </div>

        <div class="bg-[#333333]/10 rounded-lg">
          <div class="p-6 space-y-6">
            <h2 class="text-2xl font-semibold text-[#333333]">Ratonga | Services</h2>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-4">
                <h3 class="text-xl font-medium text-[#333333] border-b-2 border-[#333333] pb-2">
                  English
                </h3>
                <ServicesList items={services} type="en" />
              </div>
              <div class="space-y-4">
                <h3 class="text-xl font-medium text-[#333333] border-b-2 border-[#333333] pb-2">
                  Te Reo Māori
                </h3>
                <ServicesList items={services} type="mi" />
              </div>
            </div>
          </div>
        </div>

        <div class="mt-16">
          <MaiaChat />
        </div>

        <footer class="text-center text-[#333333]/60 text-sm py-12 mt-16">
          © {new Date().getFullYear()} PluSO | Tel: +64 022 400 4387
        </footer>
      </div>
    </div>
  );
}