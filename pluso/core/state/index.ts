import { signal, computed } from "@preact/signals";
import type { DashboardData } from "../../types/dashboard.ts";

// UI State
export const isLoading = signal(false);
export const error = signal<string | null>(null);

// Navigation State
export const activeTab = signal("overview"); 
export const showCreateForm = signal(false);
export const selectedAgent = signal<string | null>(null);

// Data State
export const dashboardData = signal<DashboardData | null>(null);

// Computed States
export const currentAgent = computed(() => {
  return dashboardData.value?.agent || null;
});

export const currentMetrics = computed(() => {
  return dashboardData.value?.metrics || null;
});

// State Reset Functions
export function resetUIState() {
  isLoading.value = false;
  error.value = null;
}

export function resetNavigationState() {
  activeTab.value = "overview"; 
  showCreateForm.value = false;
  selectedAgent.value = null;
}

export function resetDataState() {
  dashboardData.value = null;
}

// Reset all state
export function resetAllState() {
  resetUIState();
  resetNavigationState();
  resetDataState();
}
