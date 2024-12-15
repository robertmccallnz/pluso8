// routes/jeff/config.ts
import { z } from "https://deno.land/x/zod/mod.ts";

// Type definitions
export interface LegalRouteEndpoints {
  chat: string;
  legislation: string;
  search: string;
}

export interface LegalRouteSettings {
  temperature: number;
  model: string;
  top_p: number;
  top_k: number;
  repetition_penalty: number;
  safety_model: string;
  maxTokens: number | undefined;
}

export interface LegalRouteConfig {
  title: string;
  description: string;
  basePath: string;
  endpoints: LegalRouteEndpoints;
  settings: LegalRouteSettings;
}

// Validation schema
const legalRouteSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  basePath: z.string().startsWith("/"),
  endpoints: z.object({
    chat: z.string().startsWith("/api/"),
    legislation: z.string().startsWith("/api/"),
    search: z.string().startsWith("/api/")
  }),
  settings: z.object({
    maxTokens: z.number().int().min(1).max(4096).optional(),
    temperature: z.number().min(0).max(1),
    model: z.string(),
    top_p: z.number().min(0).max(1),
    top_k: z.number().int().min(1),
    repetition_penalty: z.number().min(1),
    safety_model: z.string()
  })
});

export const jeffRouteConfig: LegalRouteConfig = {
  title: "Jeff Legal Assistant",
  description: "Legal assistance and legislation search",
  basePath: "/jeff",
  endpoints: {
    chat: "/api/legal-chat",
    legislation: "/api/legislation",
    search: "/api/legislation/search"
  },
  settings: {
    temperature: 0.7,
    model: "Qwen/QwQ-32B-Preview",
    top_p: 0.7,
    top_k: 50,
    repetition_penalty: 1.4,
    safety_model: "meta-llama/Meta-Llama-Guard-3-8B"
  }
} as const;

// Validate configuration at runtime
const validationResult = legalRouteSchema.safeParse(jeffRouteConfig);

if (!validationResult.success) {
  console.error("Invalid route configuration:");
  console.error(validationResult.error.format());
  throw new Error("Route configuration validation failed");
}

// Helper functions
export function getFullEndpointPath(endpoint: keyof LegalRouteEndpoints): string {
  return `${jeffRouteConfig.basePath}${jeffRouteConfig.endpoints[endpoint]}`;
}

export function validateEndpoint(endpoint: string): boolean {
  return Object.values(jeffRouteConfig.endpoints).includes(endpoint);
}

// Route configuration hook for components
export function useRouteConfig() {
  return {
    config: jeffRouteConfig,
    getFullPath: getFullEndpointPath,
    validateEndpoint
  };
}

// Export constant values for reuse
export const ROUTE_CONSTANTS = {
  DEFAULT_TEMPERATURE: jeffRouteConfig.settings.temperature,
  MODEL: jeffRouteConfig.settings.model,
  TOP_P: jeffRouteConfig.settings.top_p,
  TOP_K: jeffRouteConfig.settings.top_k,
  REPETITION_PENALTY: jeffRouteConfig.settings.repetition_penalty,
  SAFETY_MODEL: jeffRouteConfig.settings.safety_model,
  BASE_PATH: jeffRouteConfig.basePath
} as const;

// Type guard for endpoint validation
export function isValidEndpoint(
  endpoint: string
): endpoint is keyof LegalRouteEndpoints {
  return endpoint in jeffRouteConfig.endpoints;
}