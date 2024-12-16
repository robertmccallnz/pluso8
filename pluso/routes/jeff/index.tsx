/** @jsxImportSource preact */
import { Head } from "$fresh/runtime.ts";
import NavBar from "../../islands/NavBar.tsx";
import LegalChat from "../../islands/interfaces/LegalChat.tsx";
import AgentMetricsPanel from "../../islands/components/AgentMetricsPanel.tsx";

function BrandText({ children }: { children: string }) {
  const [prefix, suffix] = children.split('_');
  return (
    <>
      <span class="text-pluso-blue font-normal">{prefix}_</span>
      <span class="text-gray-900 font-bold">{suffix}</span>
    </>
  );
}

export default function JeffLegal() {
  return (
    <>
      <Head>
        <title>Jeff Legal Assistant - Pluso</title>
      </Head>
      <div class="min-h-screen bg-gray-50">
        <NavBar />
        <main class="container mx-auto px-4 py-8 mt-20">
          <div class="max-w-7xl mx-auto">
            <div class="mb-8">
              <h1 class="text-4xl font-bold text-gray-900 mb-2">
                <BrandText>jeff_legal</BrandText>
              </h1>
              <p class="text-lg text-gray-600">
                Your AI-powered legal assistant
              </p>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Chat Interface */}
              <div class="lg:col-span-2">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <LegalChat />
                </div>
              </div>

              {/* Metrics Panel */}
              <div class="lg:col-span-1">
                <div class="bg-white rounded-lg shadow-sm p-6">
                  <h2 class="text-xl font-semibold text-gray-900 mb-4">
                    Agent Metrics
                  </h2>
                  <AgentMetricsPanel />
                </div>

                {/* Features List */}
                <div class="bg-white rounded-lg shadow-sm p-6 mt-6">
                  <h2 class="text-xl font-semibold text-gray-900 mb-4">
                    Features
                  </h2>
                  <ul class="space-y-3">
                    <li class="flex items-start">
                      <span class="material-icons-outlined text-pluso-blue mr-2">
                        check_circle
                      </span>
                      <span class="text-gray-700">Legal document analysis</span>
                    </li>
                    <li class="flex items-start">
                      <span class="material-icons-outlined text-pluso-blue mr-2">
                        check_circle
                      </span>
                      <span class="text-gray-700">Contract review</span>
                    </li>
                    <li class="flex items-start">
                      <span class="material-icons-outlined text-pluso-blue mr-2">
                        check_circle
                      </span>
                      <span class="text-gray-700">Legal research assistance</span>
                    </li>
                    <li class="flex items-start">
                      <span class="material-icons-outlined text-pluso-blue mr-2">
                        check_circle
                      </span>
                      <span class="text-gray-700">Case law citations</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}