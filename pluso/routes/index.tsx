// routes/index.tsx
import { PageProps } from "$fresh/runtime.ts";
import { ServicesList } from "../components/ServicesList.tsx";
import AnimatedBackground from "../islands/AnimatedBackground.tsx";
import NavBar from "../islands/NavBar.tsx";

export default function Home(props: PageProps) {
  const services = [
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
    <>
      <AnimatedBackground />
      <NavBar />
      <div class="min-h-screen bg-black/90">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          {/* Hero Section */}
          <div class="text-center space-y-8 mb-16">
            {/* Main Logo */}
            <img 
              src="/logo.svg" 
              alt="PluSO Logo" 
              class="w-64 mx-auto"
            />
            <p class="font-mono text-xl text-[#FF6B00]/70">intelligent conversation solutions</p>
            <div class="flex justify-center space-x-4">
              <a href="/agents" class="text-[#FF6B00] hover:text-[#FF6B00]/70 underline font-mono">
                View Agents
              </a>
              <a href="/docs" class="text-[#FF6B00] hover:text-[#FF6B00]/70 underline font-mono">
                Documentation
              </a>
            </div>
          </div>

          {/* Feature Icons */}
          <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* Deno Feature */}
            <div class="bg-black/40 p-6 rounded-lg border border-[#FF6B00]/20">
              <svg viewBox="0 0 35 35" class="w-12 h-12 mb-4">
                <path d="M15 0 C5 0 0 10 0 20 C0 30 10 35 20 35 C30 35 35 25 35 15 C35 5 25 0 15 0 Z" 
                      fill="#FF6B00" fill-opacity="0.9"/>
                <circle cx="10" cy="15" r="2" fill="#1A1A1A"/>
              </svg>
              <h3 class="font-mono text-lg">
                <span class="text-[#FF6B00]">deno_</span>
                <span class="text-white">TS</span>
              </h3>
              <p class="text-[#FF6B00]/70 text-sm font-mono">typescript runtime</p>
            </div>

            {/* V8 Feature */}
            <div class="bg-black/40 p-6 rounded-lg border border-[#FF6B00]/20">
              <svg viewBox="0 0 35 50" class="w-12 h-12 mb-4">
                <path d="M5 0 L20 0 L35 25 L20 50 L5 50 L20 25 L5 0" 
                      fill="#FF6B00" fill-opacity="0.9"/>
              </svg>
              <h3 class="font-mono text-lg">
                <span class="text-[#FF6B00]">v8_</span>
                <span class="text-white">POWER</span>
              </h3>
              <p class="text-[#FF6B00]/70 text-sm font-mono">high performance engine</p>
            </div>

            {/* Memory Feature */}
            <div class="bg-black/40 p-6 rounded-lg border border-[#FF6B00]/20">
              <svg viewBox="0 0 35 35" class="w-12 h-12 mb-4">
                <path d="M5 5 h30 v30 h-30 z M10 10 h20 v20 h-20 z" 
                      fill="none" stroke="#FF6B00" stroke-width="2.5"/>
                <path d="M20 5 v30 M5 20 h30" 
                      stroke="#FF6B00" stroke-width="2.5"/>
              </svg>
              <h3 class="font-mono text-lg">
                <span class="text-[#FF6B00]">mem_</span>
                <span class="text-white">SAFE</span>
              </h3>
              <p class="text-[#FF6B00]/70 text-sm font-mono">secure state handling</p>
            </div>

            {/* Security Feature */}
            <div class="bg-black/40 p-6 rounded-lg border border-[#FF6B00]/20">
              <svg viewBox="0 0 30 45" class="w-12 h-12 mb-4">
                <path d="M15 0 L30 10 L30 20 C30 35 20 40 15 45 C10 40 0 35 0 20 L0 10 Z" 
                      fill="#FF6B00" fill-opacity="0.9"/>
              </svg>
              <h3 class="font-mono text-lg">
                <span class="text-[#FF6B00]">sec_</span>
                <span class="text-white">URE</span>
              </h3>
              <p class="text-[#FF6B00]/70 text-sm font-mono">enterprise security</p>
            </div>
          </div>

          {/* Services Section */}
          <div class="bg-black/40 rounded-lg border border-[#FF6B00]/20 mb-16">
            <div class="p-6 space-y-6">
              <h2 class="font-mono text-2xl text-[#FF6B00]">Ratonga | Services</h2>
              <div class="grid md:grid-cols-2 gap-6">
                <div class="space-y-4">
                  <h3 class="font-mono text-xl text-[#FF6B00] border-b border-[#FF6B00]/20 pb-2">
                    English
                  </h3>
                  <ServicesList items={services} type="en" />
                </div>
                <div class="space-y-4">
                  <h3 class="font-mono text-xl text-[#FF6B00] border-b border-[#FF6B00]/20 pb-2">
                    Te Reo Māori
                  </h3>
                  <ServicesList items={services} type="mi" />
                </div>
              </div>
            </div>
          </div>

          <footer class="text-center text-[#FF6B00]/60 font-mono text-sm py-12">
            © {new Date().getFullYear()} PluSO | Building the future of conversation
          </footer>
        </div>
      </div>
    </>
  );
}