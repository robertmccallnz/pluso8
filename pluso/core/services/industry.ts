import industriesConfig from "../../static/data/industries.json" with { type: "json" };

export interface Industry {
  id: string;
  name: string;
  description: string;
  icon: string;
  templates: string[];
}

export async function listIndustries(): Promise<Industry[]> {
  try {
    return industriesConfig.industries;
  } catch (error) {
    console.error('Error in listIndustries:', error);
    throw error;
  }
}
