import { Signal, useSignal } from "@preact/signals";
import { ApiKey } from "../../types/dashboard.ts";
import { useState } from "preact/hooks";

interface ApiKeyManagerProps {
  apiKeys: ApiKey[];
  onCreateKey: (keyData: Partial<ApiKey>) => Promise<void>;
  onRevokeKey: (keyId: string) => Promise<void>;
}

export default function ApiKeyManager({ apiKeys, onCreateKey, onRevokeKey }: ApiKeyManagerProps) {
  const showCreateModal = useSignal(false);
  const [newKeyData, setNewKeyData] = useState<Partial<ApiKey>>({
    name: "",
    metadata: {
      environment: "development",
      description: "",
      createdBy: "", // This should be set from the user context
    },
    permissions: {
      read: true,
      write: false,
      deploy: false,
      manage: false,
    },
    expiresAt: null,
  });

  const handleCreateKey = async (e: Event) => {
    e.preventDefault();
    await onCreateKey(newKeyData);
    showCreateModal.value = false;
    setNewKeyData({
      name: "",
      metadata: {
        environment: "development",
        description: "",
        createdBy: "",
      },
      permissions: {
        read: true,
        write: false,
        deploy: false,
        manage: false,
      },
      expiresAt: null,
    });
  };

  return (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">API Keys</h2>
        <button
          onClick={() => showCreateModal.value = true}
          class="btn-primary"
        >
          Create New Key
        </button>
      </div>

      {/* API Keys Table */}
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Prefix
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Environment
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Used
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Expires
              </th>
              <th scope="col" class="relative px-6 py-3">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            {apiKeys.map((key) => (
              <tr key={key.id}>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div class="text-sm font-medium text-gray-900">{key.name}</div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-900">{key.prefix}...</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span class={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    key.status === "active" ? "bg-green-100 text-green-800" :
                    key.status === "expired" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }`}>
                    {key.status}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {key.metadata.environment}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {key.lastUsed ? new Date(key.lastUsed).toLocaleDateString() : "Never"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {key.expiresAt ? new Date(key.expiresAt).toLocaleDateString() : "Never"}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => onRevokeKey(key.id)}
                    class="text-red-600 hover:text-red-900"
                    disabled={key.status !== "active"}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Key Modal */}
      {showCreateModal.value && (
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div class="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 class="text-lg font-medium mb-4">Create New API Key</h3>
            <form onSubmit={handleCreateKey} class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  value={newKeyData.name}
                  onChange={(e) => setNewKeyData({...newKeyData, name: (e.target as HTMLInputElement).value})}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Environment</label>
                <select
                  value={newKeyData.metadata?.environment}
                  onChange={(e) => setNewKeyData({
                    ...newKeyData,
                    metadata: {...newKeyData.metadata, environment: (e.target as HTMLSelectElement).value as "development" | "production"}
                  })}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="development">Development</option>
                  <option value="production">Production</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={newKeyData.metadata?.description}
                  onChange={(e) => setNewKeyData({
                    ...newKeyData,
                    metadata: {...newKeyData.metadata, description: (e.target as HTMLTextAreaElement).value}
                  })}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Permissions</label>
                <div class="mt-2 space-y-2">
                  {Object.entries(newKeyData.permissions || {}).map(([permission, enabled]) => (
                    <label key={permission} class="inline-flex items-center mr-4">
                      <input
                        type="checkbox"
                        checked={enabled}
                        onChange={(e) => setNewKeyData({
                          ...newKeyData,
                          permissions: {
                            ...newKeyData.permissions,
                            [permission]: (e.target as HTMLInputElement).checked
                          }
                        })}
                        class="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span class="ml-2 text-sm text-gray-700">{permission.charAt(0).toUpperCase() + permission.slice(1)}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700">Expiration</label>
                <input
                  type="date"
                  value={newKeyData.expiresAt?.split('T')[0] || ""}
                  onChange={(e) => setNewKeyData({
                    ...newKeyData,
                    expiresAt: (e.target as HTMLInputElement).value ? new Date((e.target as HTMLInputElement).value).toISOString() : null
                  })}
                  class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div class="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => showCreateModal.value = false}
                  class="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" class="btn-primary">
                  Create Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
