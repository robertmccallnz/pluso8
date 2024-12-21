import { Handlers, PageProps } from "$fresh/server.ts";
import AnimatedBackground from "../islands/AnimatedBackground.tsx";
import FeatureHighlight from "../islands/FeatureHighlight.tsx";
import { HomePageData } from "../core/types/index.ts";
import SEOHandler from "../components/SEOHandler.tsx";
import { pageSEOConfig } from "../core/seo/config.ts";
import MaiaWidget from "../islands/agents/maia/MaiaWidget.tsx";
import NavBar from "../islands/NavBar.tsx";

export const handler: Handlers<HomePageData> = {
  async GET(_req, ctx) {
    const features = [
      {
        title: "Voice-Enabled AI",
        description: "Create agents with natural voice interaction capabilities",
        icon: "mic"
      },
      {
        title: "Image Recognition",
        description: "Process and analyze images with state-of-the-art vision models",
        icon: "image"
      },
      {
        title: "Advanced Chat",
        description: "Build sophisticated chat agents with natural language understanding",
        icon: "chat"
      },
      {
        title: "V8 Performance",
        description: "Lightning-fast execution with V8 engine optimization",
        icon: "speed"
      },
      {
        title: "Tokio Runtime",
        description: "Highly concurrent and efficient async processing",
        icon: "bolt"
      },
      {
        title: "Instant Deploy",
        description: "Deploy agents in seconds with zero configuration",
        icon: "rocket_launch"
      }
    ];
    return ctx.render({ features });
  }
};

export default function Home({ data }: PageProps<HomePageData>) {
  return (
    <>
      <NavBar currentPath="/" />
      <div class="relative">
        <SEOHandler {...pageSEOConfig.home} path="/" />
        <div class="relative min-h-screen">
          <AnimatedBackground />
          <div class="relative z-10">
            <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
              <div class="text-center">
                <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                  <span class="block">Deploy Custom AI Agents</span>
                  <span class="block text-primary-600">Voice • Image • Chat</span>
                </h1>
                <p class="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
                  Create and deploy powerful AI agents with voice, image, and chat capabilities.
                  Built with V8 and Tokio for unmatched performance.
                </p>
                <div class="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
                  <div class="rounded-md shadow">
                    <a
                      href="/dashboard/create"
                      class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10"
                    >
                      Create Agent
                    </a>
                  </div>
                  <div class="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                    <a
                      href="/docs"
                      class="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                    >
                      Documentation
                    </a>
                  </div>
                </div>
              </div>

              <div class="mt-24">
                <h2 class="text-3xl font-extrabold text-gray-900 text-center mb-12">
                  Supercharged AI Platform
                </h2>
                <div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                  {data.features.map((feature) => (
                    <FeatureHighlight
                      key={feature.title}
                      title={feature.title}
                      description={feature.description}
                      icon={feature.icon}
                    />
                  ))}
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
      <MaiaWidget />
    </>
  );
}
