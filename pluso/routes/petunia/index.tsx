import { Head } from "$fresh/runtime.ts";
import { COLORS } from "../../lib/constants/styles.ts";
import PetuniaChat from "../../islands/interfaces/PetuniaChat.tsx";
import NavBar from "../../islands/NavBar.tsx";
import SEO from "../../components/SEO.tsx";
import AgentMetricsPanel from "../../islands/components/AgentMetricsPanel.tsx";

function BrandText({ children }: { children: string }) {
  const [prefix, suffix] = children.split('_');
  return (
    <>
      <span style={{ color: COLORS.brand.blue }} class="font-normal">{prefix}_</span>
      <span style={{ color: COLORS.brand.green }} class="font-bold">{suffix}</span>
    </>
  );
}

export default function Petunia() {
  return (
    <>
      <Head>
        <title>pet_UNIA | PluSO AI Assistant</title>
        <link rel="stylesheet" href="/styles.css" />
        <SEO 
          title="pet_UNIA - Garden & Ecology Assistant | PluSO"
          description="Meet pet_UNIA, your garden and ecology companion. Specialized in New Zealand native plants, sustainable gardening, and traditional Māori plant knowledge."
          keywords={[
            "NZ native plants",
            "sustainable gardening",
            "ecological restoration",
            "garden planning",
            "rongoā Māori",
            "permaculture",
            "wildlife gardening",
            "pet_UNIA assistant"
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
              <BrandText>pet_UNIA</BrandText>
            </h1>
            
            <p class="text-lg text-gray-600 mb-8">
              Your garden and ecology companion, specializing in New Zealand native plants and sustainable practices.
            </p>

            <div class="space-y-6">
              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-semibold mb-4">Agent Metrics</h2>
                <AgentMetricsPanel agentId="petunia" />
              </div>

              <div class="bg-white rounded-lg shadow-sm p-6">
                <h2 class="text-2xl font-semibold mb-4">Chat Interface</h2>
                <PetuniaChat />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
