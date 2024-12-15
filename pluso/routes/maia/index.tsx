import { Head } from "$fresh/runtime.ts";
import { COLORS } from "../../lib/constants/styles.ts";
import MaiaChat from "../../islands/interfaces/MaiaChat.tsx";
import NavBar from "../../islands/NavBar.tsx";

interface ServiceItem {
  english: string;
  maori: string;
  description?: string;
  icon?: string;
}

function ServicesList({ items, type }: { items: ServiceItem[]; type: 'en' | 'mi' }) {
  return (
    <ul class="space-y-3">
      {items.map((service, index) => (
        <li 
          key={`${type}-${index}`} 
          class="bg-white/80 p-4 rounded-lg text-gray-800 shadow-sm hover:shadow-md transition-shadow duration-200"
        >
          <div class="flex items-start space-x-3">
            {service.icon && (
              <span class="text-lg" style={{ color: COLORS.brand.blue }}>
                {service.icon}
              </span>
            )}
            <div>
              <div class="font-medium">
                {type === 'en' ? service.english : service.maori}
              </div>
              {service.description && type === 'en' && (
                <p class="text-sm text-gray-600 mt-1">
                  {service.description}
                </p>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function BrandText({ children }: { children: string }) {
  const [prefix, suffix] = children.split('_');
  return (
    <>
      <span style={{ color: COLORS.brand.blue }} class="font-normal">{prefix}_</span>
      <span style={{ color: COLORS.brand.cyan }} class="font-bold">{suffix}</span>
    </>
  );
}

export default function MaiaPage() {
  const services: ServiceItem[] = [
    {
      english: "Customer Service Management",
      maori: "Whakahaerehia Ratonga Kiritaki",
      description: "Intelligent customer service automation with cultural awareness",
      icon: "🤝"
    },
    {
      english: "Chat Support",
      maori: "Tautoko Korero",
      description: "24/7 bilingual chat support with natural language understanding",
      icon: "💬"
    },
    {
      english: "Client Interaction Optimization",
      maori: "Whakapai Whakawhitinga Kiritaki",
      description: "Data-driven insights to improve customer interactions",
      icon: "📈"
    },
    {
      english: "Real-time Communication Solutions",
      maori: "Whakangao Whakawhitinga Tere",
      description: "Instant messaging with seamless language switching",
      icon: "⚡"
    }
  ];

  return (
    <>
      <Head>
        <title>Maia - AI Assistant | Pluso</title>
        <meta name="description" content="Maia - Your bilingual AI assistant for customer service and communication" />
      </Head>
      <div class="min-h-screen bg-pluso-offwhite font-mono">
        <NavBar />
        <div class="container mx-auto px-4 pt-24">
          <header class="text-center space-y-4 mb-16">
            <h1 class="text-7xl font-bold relative inline-block">
              <BrandText>mai_A</BrandText>
              <div 
                class="absolute -top-6 right-0 text-sm px-3 py-1 rounded-full"
                style={{ backgroundColor: COLORS.brand.blue + '20', color: COLORS.brand.blue }}
              >
                Beta
              </div>
            </h1>
            <p class="text-xl text-gray-600">
              Intelligent Bilingual Assistant | Kaiwhakawhiti Kōrero Reo Rua
            </p>
            <nav class="flex justify-center space-x-6 mt-8">
              <a 
                href="/agents" 
                class="text-gray-800 hover:text-gray-600 underline decoration-2 underline-offset-4 hover:decoration-current"
              >
                View All Agents
              </a>
              <a 
                href="/docs/agents" 
                class="text-gray-800 hover:text-gray-600 underline decoration-2 underline-offset-4 hover:decoration-current"
              >
                Documentation
              </a>
            </nav>
          </header>

          <section class="bg-white rounded-lg shadow-sm mb-12">
            <div class="p-8 space-y-8">
              <h2 class="text-2xl font-semibold text-gray-800 flex items-center space-x-2">
                <span>Ratonga | Services</span>
                <div 
                  class="h-1 flex-1 ml-4 rounded-full"
                  style={{ backgroundColor: COLORS.brand.blue + '20' }}
                />
              </h2>
              <div class="grid md:grid-cols-2 gap-8">
                <div class="space-y-4">
                  <h3 
                    class="text-xl font-medium text-gray-800 border-b-2 pb-2" 
                    style={{ borderColor: COLORS.brand.blue }}
                  >
                    English
                  </h3>
                  <ServicesList items={services} type="en" />
                </div>
                <div class="space-y-4">
                  <h3 
                    class="text-xl font-medium text-gray-800 border-b-2 pb-2" 
                    style={{ borderColor: COLORS.brand.blue }}
                  >
                    Te Reo Māori
                  </h3>
                  <ServicesList items={services} type="mi" />
                </div>
              </div>
            </div>
          </section>

          <section class="rounded-lg overflow-hidden shadow-lg bg-white">
            <MaiaChat />
          </section>

          <footer class="text-center text-gray-500 text-sm py-12 mt-16 space-y-2">
            <div>
              &copy; {new Date().getFullYear()} <BrandText>plu_SO</BrandText>
            </div>
            <div class="flex justify-center space-x-4">
              <span>Tel: 022 400 4387</span>
              <span>|</span>
              <a href="mailto:hello@pluso.co.nz" class="hover:text-gray-700">
                hello@pluso.co.nz
              </a>
            </div>
          </footer>
        </div>
      </div>
    </>
  );
}