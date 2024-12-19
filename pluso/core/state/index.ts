import { signal, computed } from "@preact/signals";
import type { AgentMetrics } from "../../types/metrics.ts";

// UI State
export const isLoading = signal(false);
export const error = signal<string | null>(null);

// Navigation State
export const activeTab = signal("playground"); 
export const showCreateForm = signal(false);
export const selectedAgent = signal<string | null>(null);

// Data State
export const metrics = signal<AgentMetrics[]>([]);
export const selectedAgentId = signal<string | null>(null);
export const timeRange = signal<'24h' | '7d' | '30d'>('24h');

// Computed States
export const currentMetrics = computed(() => {
  const id = selectedAgentId.value;
  return metrics.value.find(m => m.agentId === id) || null;
});

// State Reset Functions
export function resetUIState() {
  isLoading.value = false;
  error.value = null;
}

export function resetNavigationState() {
  activeTab.value = "playground"; 
  showCreateForm.value = false;
  selectedAgent.value = null;
}

export function resetDataState() {
  metrics.value = [];
  selectedAgentId.value = null;
  timeRange.value = '24h';
}

// Reset all state
export function resetAllState() {
  resetUIState();
  resetNavigationState();
  resetDataState();
}
