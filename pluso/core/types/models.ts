export interface Model {
  name: string;
  provider: string;
  type: string;
  description: string;
  pricing?: string;
  context_length?: number;
  documentation_url?: string;
  parameters?: Record<string, unknown>;
  capabilities?: string[];
  limitations?: string[];
}
