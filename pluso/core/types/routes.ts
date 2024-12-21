//Jeff Route Configuration

// types/routes.ts
export interface BaseRouteConfig {
  title: string;
  description: string;
  basePath: string;
  endpoints: Record<string, string>;
  settings: {
    maxTokens: number;
    temperature: number;
    model: string;
  };
}

export interface LegalRouteEndpoints {
  chat: string;
  legislation: string;
  search: string;
}

export interface LegalRouteSettings {
  maxTokens: number;
  temperature: number;
  model: `claude-3-${string}`;  // Ensure model name follows Claude naming pattern
}

export interface LegalRouteConfig extends BaseRouteConfig {
  endpoints: LegalRouteEndpoints;
  settings: LegalRouteSettings;
}