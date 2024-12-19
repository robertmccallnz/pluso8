import { PageProps } from "$fresh/server.ts";
import { signal } from "@preact/signals";
import { ApiKey } from "../../types/dashboard.ts";
import { AgentIndustry, AgentType, REGISTERED_AGENTS } from "../../agents/core/registry.ts";

interface UserSettings {
  id: string;
  email: string;
  name: string;
  company?: string;
  role: string;
  preferences: {
    theme: "light" | "dark" | "system";
    notifications: boolean;
    language: string;
  };
}

const activeTabSignal = signal("profile");
const settingsSignal = signal<UserSettings | null>(null);
const apiKeysSignal = signal<Record<string, ApiKey[]>>({});
const loadingSignal = signal(true);
const errorSignal = signal<string | null>(null);

export default function SettingsPage(props: PageProps) {
  async function fetchSettings() {
    try {
      const response = await fetch("/api/user/settings");
      if (!response.ok) throw new Error("Failed to fetch settings");
      const data = await response.json();
      settingsSignal.value = data;
    } catch (err) {
      errorSignal.value = "Failed to load user settings";
      console.error(err);
    }
  }

  async function fetchAllApiKeys() {
    try {
      const keys: Record<string, ApiKey[]> = {};
      for (const agentId of Object.keys(REGISTERED_AGENTS)) {
        const response = await fetch(`/api/agents/${agentId}/api-keys`);
        if (!response.ok) throw new Error(`Failed to fetch keys for ${agentId}`);
        const agentKeys = await response.json();
        keys[agentId] = agentKeys;
      }
      apiKeysSignal.value = keys;
    } catch (err) {
      errorSignal.value = "Failed to load API keys";
      console.error(err);
    } finally {
      loadingSignal.value = false;
    }
  }

  async function createApiKey(agentId: string, name: string) {
    try {
      const response = await fetch(`/api/agents/${agentId}/api-keys`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) throw new Error("Failed to create API key");
      
      const newKey = await response.json();
      apiKeysSignal.value = {
        ...apiKeysSignal.value,
        [agentId]: [...(apiKeysSignal.value[agentId] || []), newKey],
      };

      // Show the key to the user (only shown once)
      alert(`Your new API key: ${newKey.key}\nPlease save this key as it won't be shown again.`);
    } catch (err) {
      errorSignal.value = "Failed to create API key";
      console.error(err);
    }
  }

  async function revokeApiKey(agentId: string, keyId: string) {
    try {
      const response = await fetch(`/api/agents/${agentId}/api-keys/${keyId}/revoke`, {
        method: "POST",
      });

      if (!response.ok) throw new Error("Failed to revoke API key");
      
      apiKeysSignal.value = {
        ...apiKeysSignal.value,
        [agentId]: apiKeysSignal.value[agentId].map(key => 
          key.id === keyId ? { ...key, status: "revoked" } : key
        ),
      };
    } catch (err) {
      errorSignal.value = "Failed to revoke API key";
      console.error(err);
    }
  }

  fetchSettings();
  fetchAllApiKeys();

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div class="flex space-x-8">
        {/* Sidebar */}
        <div class="w-64">
          <nav class="space-y-1">
            <button
              onClick={() => activeTabSignal.value = "profile"}
              class={`w-full text-left px-3 py-2 rounded-md ${
                activeTabSignal.value === "profile"
                  ? "bg-pluso-blue text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              Profile Settings
            </button>
            <button
              onClick={() => activeTabSignal.value = "api-keys"}
              class={`w-full text-left px-3 py-2 rounded-md ${
                activeTabSignal.value === "api-keys"
                  ? "bg-pluso-blue text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              API Keys
            </button>
            <button
              onClick={() => activeTabSignal.value = "preferences"}
              class={`w-full text-left px-3 py-2 rounded-md ${
                activeTabSignal.value === "preferences"
                  ? "bg-pluso-blue text-white"
                  : "hover:bg-gray-50"
              }`}
            >
              Preferences
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div class="flex-1">
          {errorSignal.value && (
            <div class="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p class="text-red-700">{errorSignal.value}</p>
            </div>
          )}

          {activeTabSignal.value === "profile" && settingsSignal.value && (
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-medium mb-6">Profile Settings</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Name
                  </label>
                  <input
                    type="text"
                    value={settingsSignal.value.name}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pluso-blue focus:ring-pluso-blue"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settingsSignal.value.email}
                    disabled
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-50"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Company
                  </label>
                  <input
                    type="text"
                    value={settingsSignal.value.company || ""}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pluso-blue focus:ring-pluso-blue"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTabSignal.value === "api-keys" && (
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-medium mb-6">API Keys</h2>
              
              {loadingSignal.value ? (
                <div class="text-center py-4">Loading API keys...</div>
              ) : (
                <div class="space-y-6">
                  {Object.entries(REGISTERED_AGENTS).map(([agentId, agent]) => (
                    <div key={agentId} class="border rounded-lg p-4">
                      <div class="flex justify-between items-center mb-4">
                        <div>
                          <h3 class="text-lg font-medium">{agent.name}</h3>
                          <p class="text-sm text-gray-500">
                            {agent.type} | {agent.industry}
                          </p>
                        </div>
                        <button
                          onClick={() => createApiKey(agentId, `${agent.name} API Key`)}
                          class="px-4 py-2 bg-pluso-blue text-white rounded-md hover:bg-pluso-blue-hover"
                        >
                          Create New Key
                        </button>
                      </div>

                      <div class="overflow-x-auto">
                        <table class="min-w-full">
                          <thead>
                            <tr class="border-b">
                              <th class="px-4 py-2 text-left">Name</th>
                              <th class="px-4 py-2 text-left">Prefix</th>
                              <th class="px-4 py-2 text-left">Created</th>
                              <th class="px-4 py-2 text-left">Last Used</th>
                              <th class="px-4 py-2 text-left">Status</th>
                              <th class="px-4 py-2 text-left">Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {apiKeysSignal.value[agentId]?.map((key) => (
                              <tr key={key.id} class="border-b">
                                <td class="px-4 py-2">{key.name}</td>
                                <td class="px-4 py-2 font-mono">{key.prefix}...</td>
                                <td class="px-4 py-2">
                                  {new Date(key.createdAt).toLocaleDateString()}
                                </td>
                                <td class="px-4 py-2">
                                  {key.lastUsed
                                    ? new Date(key.lastUsed).toLocaleDateString()
                                    : "Never"}
                                </td>
                                <td class="px-4 py-2">
                                  <span
                                    class={`px-2 py-1 rounded-full text-xs ${
                                      key.status === "active"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-red-100 text-red-800"
                                    }`}
                                  >
                                    {key.status}
                                  </span>
                                </td>
                                <td class="px-4 py-2">
                                  {key.status === "active" && (
                                    <button
                                      onClick={() => revokeApiKey(agentId, key.id)}
                                      class="text-red-600 hover:text-red-800"
                                    >
                                      Revoke
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                            {(!apiKeysSignal.value[agentId] || apiKeysSignal.value[agentId].length === 0) && (
                              <tr>
                                <td colspan="6" class="px-4 py-4 text-center text-gray-500">
                                  No API keys found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTabSignal.value === "preferences" && settingsSignal.value && (
            <div class="bg-white shadow rounded-lg p-6">
              <h2 class="text-lg font-medium mb-6">Preferences</h2>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Theme
                  </label>
                  <select
                    value={settingsSignal.value.preferences.theme}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pluso-blue focus:ring-pluso-blue"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">
                    Language
                  </label>
                  <select
                    value={settingsSignal.value.preferences.language}
                    class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-pluso-blue focus:ring-pluso-blue"
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                <div class="flex items-center">
                  <input
                    type="checkbox"
                    checked={settingsSignal.value.preferences.notifications}
                    class="h-4 w-4 text-pluso-blue focus:ring-pluso-blue border-gray-300 rounded"
                  />
                  <label class="ml-2 block text-sm text-gray-700">
                    Enable notifications
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
