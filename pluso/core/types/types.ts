export interface Template {
  id: string;
  name: string;
  description: string;
  features: string[];
  category: string;
  systemPrompt: string;
  requiredModels: {
    primary: string[];
    fallback?: string[];
    embedding?: string[];
  };
  requiredTools?: string[]; // Array of tool IDs that should be pre-selected
}
