import { Head } from "$fresh/runtime.ts";
import { COLORS } from "../lib/constants/styles.ts";
import NavBar from "../islands/NavBar.tsx";
import MaiaChat from "../islands/interfaces/MaiaChat.tsx";
import { useState } from "preact/hooks";
import SEO from "../components/SEO.tsx";

function BrandText({ children }: { children: string }) {
  const [prefix, suffix] = children.split('_');
  return (
    <>
      <span style={{ color: COLORS.brand.blue }} class="font-normal">{prefix}_</span>
      <span style={{ color: COLORS.brand.cyan }} class="font-bold">{suffix}</span>
    </>
  );
}

interface AgentCard {
  name: string;
  description: string;
  icon: string;
  link: string;
  maori: string;
}

export default function Home() {
  const agents: AgentCard[] = [
    {
      name: "mai_A",
      description: "Your AI development companion, specializing in chat agent creation and customization",
      icon: "✨",
      link: "/maia",
      maori: "Kaihanga Kaiao"
    },
    {
      name: "jeff_legal",
      description: "Legal AI assistant with expertise in New Zealand legislation and legal research",
      icon: "⚖️",
      link: "/jeff",
      maori: "Kaiāwhina Ture"
    },
    {
      name: "petunia",
      description: "Your ecological garden companion, specializing in New Zealand native plants and sustainable practices",
      icon: "🌺",
      link: "/petunia",
      maori: "Kaitiaki Māra"
    }
  ];

  return (
    <>
      <Head>
        <title>PluSO | People Like Us Systems Orchestrator</title>
        <link rel="stylesheet" href="/styles.css" />
        <SEO 
          title="PluSO - AI Systems That Work For Everyone | People Like Us Systems Orchestrator"
          description="PluSO creates intelligent AI assistants that work for everyone. Our bilingual AI agents help businesses automate tasks, provide customer service, and deliver legal assistance in both English and te reo Māori."
          keywords={[
            "AI orchestration",
            "systems automation",
            "bilingual AI assistant",
            "custom AI solutions",
            "New Zealand AI",
            "legal AI",
            "customer service AI",
            "mai_A",
            "jeff_A",
            "pet_A"
          ]}
        />
      </Head>
      <div class="min-h-screen bg-pluso-offwhite font-mono">
        <NavBar />
        
        {/* Hero Section */}
        <section class="pt-32 pb-20 px-4">
          <div class="container mx-auto text-center">
            <h1 class="text-8xl font-bold mb-4">
              <BrandText>plu_SO</BrandText>
            </h1>
            <p class="text-2xl mb-4" style={{ color: COLORS.brand.blue }}>
              People Like Us Systems Orchestrator
            </p>
            <p class="text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
              AI Systems That Work For Everyone | Hangarau Atamai mō te Katoa
            </p>
            <div class="flex justify-center gap-6">
              <a 
                href="/maia"
                class="px-8 py-4 rounded-lg text-white font-semibold transition-all"
                style={{ backgroundColor: COLORS.brand.blue }}
              >
                Build Your Agent
              </a>
              <button
                onClick={() => {
                  const chatModal = document.getElementById('chat-modal');
                  if (chatModal) chatModal.style.display = 'block';
                }}
                class="px-8 py-4 rounded-lg font-semibold transition-all border-2"
                style={{ borderColor: COLORS.brand.blue, color: COLORS.brand.blue }}
              >
                Meet mai_A
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section class="py-20 bg-white">
          <div class="container mx-auto px-4">
            <h2 class="text-4xl font-bold text-center mb-16" style={{ color: COLORS.brand.blue }}>
              Our AI Agents
            </h2>
            <div class="grid md:grid-cols-3 gap-8">
              {agents.map((agent) => (
                <a 
                  href={agent.link}
                  class="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="text-3xl mb-4" style={{ color: COLORS.brand.blue }}>
                    {agent.icon}
                  </div>
                  <h3 class="text-2xl font-bold mb-2">
                    <BrandText>{agent.name}</BrandText>
                  </h3>
                  <p class="text-gray-600 mb-2">{agent.description}</p>
                  <p class="text-sm font-medium" style={{ color: COLORS.brand.blue }}>
                    {agent.maori}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* Business Solutions */}
        <section class="py-20">
          <div class="container mx-auto px-4">
            <div class="max-w-4xl mx-auto text-center">
              <h2 class="text-4xl font-bold mb-4" style={{ color: COLORS.brand.blue }}>
                Systems That Work For People
              </h2>
              <p class="text-xl text-gray-600 mb-12">
                At PluSO, we believe AI should work for everyone. Our systems are designed with people in mind, 
                creating solutions that are accessible, understandable, and truly helpful for your organization.
              </p>
              <div class="grid md:grid-cols-3 gap-6 mb-12">
                <div class="bg-white rounded-lg p-6 shadow-sm">
                  <div class="text-2xl mb-4">🤝</div>
                  <h3 class="font-bold mb-2">People-First</h3>
                  <p class="text-gray-600">Designed for real people with real needs</p>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                  <div class="text-2xl mb-4">🔄</div>
                  <h3 class="font-bold mb-2">Systems</h3>
                  <p class="text-gray-600">Intelligent orchestration of complex workflows</p>
                </div>
                <div class="bg-white rounded-lg p-6 shadow-sm">
                  <div class="text-2xl mb-4">🌟</div>
                  <h3 class="font-bold mb-2">Orchestration</h3>
                  <p class="text-gray-600">Seamlessly coordinated AI solutions</p>
                </div>
              </div>
              <a 
                href="/maia"
                class="inline-block px-8 py-4 rounded-lg text-white font-semibold transition-all"
                style={{ backgroundColor: COLORS.brand.blue }}
              >
                Start Building
              </a>
            </div>
          </div>
        </section>

        {/* Chat Modal */}
        <div 
          id="chat-modal"
          class="fixed inset-0 bg-black/50 hidden"
          style={{ zIndex: 1000 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              const modal = e.currentTarget as HTMLElement;
              modal.style.display = 'none';
            }
          }}
        >
          <div class="fixed inset-4 md:inset-10 bg-white rounded-xl shadow-2xl flex flex-col">
            <div class="flex justify-between items-center p-4 border-b">
              <h3 class="text-xl font-bold">
                <BrandText>mai_A</BrandText> - Chat Agent Assistant
              </h3>
              <button 
                onClick={() => {
                  const modal = document.getElementById('chat-modal');
                  if (modal) modal.style.display = 'none';
                }}
                class="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div class="flex-1 overflow-hidden">
              <MaiaChat />
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer class="text-center text-gray-500 text-sm py-12">
          <div>
            &copy; {new Date().getFullYear()} <BrandText>plu_SO</BrandText>
          </div>
          <div class="flex justify-center space-x-4 mt-2">
            <span>Tel: 022 400 4387</span>
            <span>|</span>
            <a href="mailto:hello@pluso.co.nz" class="hover:text-gray-700">
              hello@pluso.co.nz
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}