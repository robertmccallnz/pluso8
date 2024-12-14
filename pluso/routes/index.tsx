// routes/index.tsx
import { Head } from "$fresh/runtime.ts";
import AgentCreationCard from "../islands/AgentCreationCard.tsx";
import FeatureHighlight from "../islands/FeatureHighlight.tsx";

export default function Home() {
  const features = [
    {
      title: "YAML-Based Configuration",
      description: "Create and customize agents using simple YAML configuration files",
      icon: "📄"
    },
    {
      title: "RAG Integration",
      description: "Powerful Retrieval Augmented Generation for enhanced contextual responses",
      icon: "🔍"
    },
    {
      title: "V8 Performance",
      description: "Leverage V8's speed and Tokio's async capabilities for optimal performance",
      icon: "⚡"
    },
    {
      title: "Agent Interoperability",
      description: "Enable seamless communication between different chat agents",
      icon: "🤝"
    }
  ];

  return (
    <>
      <Head>
        <title>PluSO - Pluralistic System Orchestrator</title>
      </Head>
      <div class="min-h-screen bg-gradient-to-b from-[#86efac] to-[#60a5fa]">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="text-center">
            <h1 class="text-5xl font-extrabold text-gray-900 sm:text-6xl">
              PluSO
            </h1>
            <p class="mt-3 max-w-md mx-auto text-xl text-gray-600 sm:text-2xl md:mt-5 md:max-w-3xl">
              Build, Deploy, and Orchestrate Chat Agents with Ease
            </p>
            <div class="mt-10 flex justify-center">
              <button class="rounded-md bg-indigo-600 px-6 py-3 text-lg font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600">
                Create Agent
              </button>
            </div>
          </div>

          <div class="mt-24 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <FeatureHighlight
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
              />
            ))}
          </div>

          <div class="mt-24">
            <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">
              Get Started with PluSO
            </h2>
            <AgentCreationCard />
          </div>
        </div>
      </div>
    </>
  );
}