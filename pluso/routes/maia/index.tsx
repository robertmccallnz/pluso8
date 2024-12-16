import { Head } from "$fresh/runtime.ts";
import { COLORS } from "../../lib/constants/styles.ts";
import MaiaChat from "../../islands/interfaces/MaiaChat.tsx";
import NavBar from "../../islands/NavBar.tsx";
import SEO from "../../components/SEO.tsx";
import AgentMetricsPanel from "../../islands/components/AgentMetricsPanel.tsx";

function BrandText({ children }: { children: string }) {
  const [prefix, suffix] = children.split('_');
  return (
    <>
      <span style={{ color: COLORS.brand.blue }} class="font-normal">{prefix}_</span>
      <span style={{ color: COLORS.brand.cyan }} class="font-bold">{suffix}</span>
    </>
  );
}

export default function Maia() {
  return (
    <>
      <Head>
        <title>mai_A | PluSO AI Assistant</title>
        <link rel="stylesheet" href="/styles.css" />
        <SEO 
          title="mai_A - AI Development Assistant | PluSO"
          description="Meet mai_A, your AI development companion. Specialized in creating custom chat agents, mai_A helps you build intelligent AI solutions with support for both English and te reo Māori."
          keywords={[
            "AI development",
            "chat agent creation",
            "custom AI assistant",
            "AI development tools",
            "bilingual AI development",
            "Claude 3 Haiku",
            "AI customization",
            "mai_A assistant"
          ]}
        />
      </Head>

      <div class="min-h-screen bg-gradient-to-b from-white to-gray-50">
        <div class="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
          <NavBar />
        </div>

        <main class="container mx-auto px-4 py-8 mt-20">
          <div class="max-w-7xl mx-auto">
            <h1 class="text-4xl font-bold mb-4">
              <BrandText>mai_A</BrandText>
            </h1>
            
            <p class="text-lg text-gray-600 mb-8">
              Your AI development companion, specializing in creating custom chat agents with bilingual support.
            </p>

            <div class="space-y-6">
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-semibold mb-4">Agent Metrics</h2>
                <AgentMetricsPanel agentId="maia" />
              </div>

              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-semibold mb-4">Chat Interface</h2>
                <MaiaChat />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}