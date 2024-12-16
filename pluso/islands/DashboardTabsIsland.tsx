import { IS_BROWSER } from "$fresh/runtime.ts";
import { useSignal } from "@preact/signals";
import { AgentMetrics, AgentTemplate, IndustryCategory } from "../core/types/dashboard.ts";
import { COLORS, COMPONENTS, TYPOGRAPHY } from "../lib/constants/styles.ts";
import CreateAgentFormIsland from "./CreateAgentFormIsland.tsx";

interface DashboardTabsProps {
  metrics: AgentMetrics[];
  industries: IndustryCategory[];
  templates: AgentTemplate[];
}

export default function DashboardTabsIsland({ 
  metrics,
  industries,
  templates,
}: DashboardTabsProps) {
  const activeTab = useSignal("agents");

  if (!IS_BROWSER) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* Tab Navigation */}
      <div class="border-b border-gray-200 mb-6">
        <nav class="-mb-px flex space-x-8">
          {[
            { id: "agents", label: "Agents", icon: "group" },
            { id: "analytics", label: "Analytics", icon: "analytics" },
            { id: "playground", label: "Playground", icon: "science" },
            { id: "settings", label: "Settings", icon: "settings" },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => activeTab.value = id}
              class={`
                group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab.value === id
                  ? `border-${COLORS.primary[600]} text-${COLORS.primary[600]}`
                  : `border-transparent text-${COLORS.gray[500]} hover:text-${COLORS.gray[700]} hover:border-${COLORS.gray[300]}`
                }
              `}
            >
              <span class="material-icons-outlined mr-2 text-lg">{icon}</span>
              {label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div class="py-4">
        {activeTab.value === "agents" && (
          <AgentsTab metrics={metrics} industries={industries} templates={templates} />
        )}
        {activeTab.value === "analytics" && (
          <AnalyticsTab metrics={metrics} />
        )}
        {activeTab.value === "playground" && (
          <PlaygroundTab />
        )}
        {activeTab.value === "settings" && (
          <SettingsTab />
        )}
      </div>
    </div>
  );
}

function AgentsTab({ 
  metrics,
  industries,
  templates,
}: {
  metrics: AgentMetrics[];
  industries: IndustryCategory[];
  templates: AgentTemplate[];
}) {
  const showCreateForm = useSignal(false);

  return (
    <div>
      <div class="flex justify-between items-center mb-6">
        <h2 class={`text-${TYPOGRAPHY.fontSize["2xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.gray[900]}`}>
          Your Agents
        </h2>
        <button
          onClick={() => showCreateForm.value = true}
          class={`${COMPONENTS.button.base} ${COMPONENTS.button.sizes.lg} ${COMPONENTS.button.variants.primary}`}
        >
          <span class="material-icons-outlined mr-2">add</span>
          Create Agent
        </button>
      </div>

      {showCreateForm.value ? (
        <CreateAgentFormIsland
          industries={industries}
          templates={templates}
          onClose={() => showCreateForm.value = false}
        />
      ) : (
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {metrics.map((agent) => (
            <div key={agent.id} class={`${COMPONENTS.card.base} ${COMPONENTS.card.hover}`}>
              <div class="p-6">
                <div class="flex items-start justify-between">
                  <div class="flex items-center">
                    <span class={`material-icons-outlined text-${COLORS.gray[500]} mr-3`}>
                      {agent.icon || "smart_toy"}
                    </span>
                    <div>
                      <h3 class={`text-${TYPOGRAPHY.fontSize.lg} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[900]}`}>
                        {agent.name}
                      </h3>
                      <p class={`text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[500]}`}>
                        {agent.description}
                      </p>
                    </div>
                  </div>
                </div>
                <div class="mt-4 grid grid-cols-2 gap-4">
                  <div>
                    <p class={`text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[500]}`}>Messages</p>
                    <p class={`text-${TYPOGRAPHY.fontSize.lg} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[900]}`}>
                      {agent.messageCount}
                    </p>
                  </div>
                  <div>
                    <p class={`text-${TYPOGRAPHY.fontSize.sm} text-${COLORS.gray[500]}`}>Uptime</p>
                    <p class={`text-${TYPOGRAPHY.fontSize.lg} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[900]}`}>
                      {agent.uptime}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AnalyticsTab({ metrics }: { metrics: AgentMetrics[] }) {
  return (
    <div>
      <h2 class={`text-${TYPOGRAPHY.fontSize["2xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.gray[900]} mb-6`}>
        Analytics
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class={COMPONENTS.card.base}>
          <div class="p-6">
            <h3 class={`text-${TYPOGRAPHY.fontSize.sm} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]}`}>
              Total Messages
            </h3>
            <p class={`mt-2 text-${TYPOGRAPHY.fontSize["3xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.gray[900]}`}>
              {metrics.reduce((sum, agent) => sum + agent.messageCount, 0)}
            </p>
          </div>
        </div>
        <div class={COMPONENTS.card.base}>
          <div class="p-6">
            <h3 class={`text-${TYPOGRAPHY.fontSize.sm} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]}`}>
              Active Agents
            </h3>
            <p class={`mt-2 text-${TYPOGRAPHY.fontSize["3xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.gray[900]}`}>
              {metrics.length}
            </p>
          </div>
        </div>
        <div class={COMPONENTS.card.base}>
          <div class="p-6">
            <h3 class={`text-${TYPOGRAPHY.fontSize.sm} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]}`}>
              Average Uptime
            </h3>
            <p class={`mt-2 text-${TYPOGRAPHY.fontSize["3xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.gray[900]}`}>
              {Math.round(metrics.reduce((sum, agent) => sum + agent.uptime, 0) / metrics.length)}%
            </p>
          </div>
        </div>
        <div class={COMPONENTS.card.base}>
          <div class="p-6">
            <h3 class={`text-${TYPOGRAPHY.fontSize.sm} font-${TYPOGRAPHY.fontWeight.medium} text-${COLORS.gray[500]}`}>
              Total Users
            </h3>
            <p class={`mt-2 text-${TYPOGRAPHY.fontSize["3xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.gray[900]}`}>
              {metrics.reduce((sum, agent) => sum + agent.userCount, 0)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaygroundTab() {
  return (
    <div>
      <h2 class={`text-${TYPOGRAPHY.fontSize["2xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.gray[900]} mb-6`}>
        Playground
      </h2>
      <p class={`text-${TYPOGRAPHY.fontSize.lg} text-${COLORS.gray[600]}`}>
        Test and evaluate different models in our interactive playground.
      </p>
    </div>
  );
}

function SettingsTab() {
  return (
    <div>
      <h2 class={`text-${TYPOGRAPHY.fontSize["2xl"]} font-${TYPOGRAPHY.fontWeight.bold} text-${COLORS.gray[900]} mb-6`}>
        Settings
      </h2>
      <p class={`text-${TYPOGRAPHY.fontSize.lg} text-${COLORS.gray[600]}`}>
        Configure your dashboard preferences and agent settings.
      </p>
    </div>
  );
}
