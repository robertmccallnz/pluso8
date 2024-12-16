import { JSX } from "preact";
import { useState } from "preact/hooks";

interface ModelFilterProps {
  onFilterChange: (filters: ModelFilters) => void;
  modelTypes: string[];
  providers: string[];
}

export interface ModelFilters {
  type: string[];
  provider: string[];
  search: string;
}

export function ModelFilter({ onFilterChange, modelTypes, providers }: ModelFilterProps): JSX.Element {
  const [filters, setFilters] = useState<ModelFilters>({
    type: [],
    provider: [],
    search: "",
  });

  const handleTypeChange = (type: string) => {
    const newTypes = filters.type.includes(type)
      ? filters.type.filter((t) => t !== type)
      : [...filters.type, type];
    
    const newFilters = { ...filters, type: newTypes };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleProviderChange = (provider: string) => {
    const newProviders = filters.provider.includes(provider)
      ? filters.provider.filter((p) => p !== provider)
      : [...filters.provider, provider];
    
    const newFilters = { ...filters, provider: newProviders };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSearchChange = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const newFilters = { ...filters, search: target.value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div class="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div class="space-y-6">
        {/* Search */}
        <div>
          <label htmlFor="search" class="block text-sm font-medium text-gray-700 mb-2">
            Search Models
          </label>
          <input
            type="text"
            id="search"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by name or description..."
            value={filters.search}
            onInput={handleSearchChange}
          />
        </div>

        {/* Model Types */}
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Model Types</h3>
          <div class="flex flex-wrap gap-2">
            {modelTypes.map((type) => (
              <button
                key={type}
                onClick={() => handleTypeChange(type)}
                class={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.type.includes(type)
                    ? "bg-blue-100 text-blue-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Providers */}
        <div>
          <h3 class="text-sm font-medium text-gray-700 mb-3">Providers</h3>
          <div class="flex flex-wrap gap-2">
            {providers.map((provider) => (
              <button
                key={provider}
                onClick={() => handleProviderChange(provider)}
                class={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  filters.provider.includes(provider)
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {provider}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
