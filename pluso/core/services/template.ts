import templatesConfig from "../../static/data/templates.json" with { type: "json" };

export interface Template {
  id: string;
  name: string;
  description: string;
  type: string;
  industry: string;
  systemPrompt: string;
  features: string[];
  requiredModels: {
    primary: string[];
    fallback: string[];
    embedding: string[];
  };
  evaluationCriteria: Array<{
    id: string;
    name: string;
    description: string;
    weight: number;
  }>;
}

export async function listTemplates(): Promise<Template[]> {
  try {
    return templatesConfig.templates;
  } catch (error) {
    console.error('Error in listTemplates:', error);
    throw error;
  }
}
