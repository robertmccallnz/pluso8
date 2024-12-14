// TypeScript module for New Zealand-specific WebForge extension

interface WebsiteConfig {
  title: string;
  primaryColor?: string;
  meta?: Record<string, any>;
  sections?: Record<string, any>;
  scripts?: string[];
}

export interface NZWebsiteConfig extends WebsiteConfig {
  nzSpecific: {
    region?: string;
    iwi?: string[];
    maoriContent?: {
      title: string;
      description: string;
      keywords: string[];
    };
    bilingualMode: boolean;
    culturalElements?: {
      patterns?: string[];
      symbols?: string[];
      stories?: string[];
    };
  };
}

// Simplified WebForge base class
class WebForge {
  constructor(baseDir: string, options = {}) {}

  createTemplate(name: string, config: WebsiteConfig) {
    return config;
  }
}

export class WebForgeNZ extends WebForge {
  private nzContentAPI: string;
  private maoriDictAPI: string;

  constructor(baseDir: string, options = {}) {
    super(baseDir, options);
    this.nzContentAPI = "https://api.digitalnz.org/v3";
    this.maoriDictAPI = "https://maoridictionary.co.nz/api/v2";
  }

  async searchNZContent(query: string) {
    try {
      const response = await fetch(`${this.nzContentAPI}/records?text=${query}&and[primary_collection]=TAPUHI`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching NZ content:", error);
      return null;
    }
  }

  async createMaoriGlossary(terms: string[]) {
    const glossary = new Map<string, string>();
    for (const term of terms) {
      try {
        const response = await fetch(`${this.maoriDictAPI}/entries?q=${term}`);
        const data = await response.json();
        if (data.definitions?.[0]) {
          glossary.set(term, data.definitions[0]);
        }
      } catch (error) {
        console.error(`Error fetching definition for ${term}:`, error);
      }
    }
    return glossary;
  }

  async createTemplate(name: string, config: NZWebsiteConfig) {
    // Add NZ-specific metadata
    const enhancedConfig = {
      ...config,
      meta: {
        ...config.meta,
        region: config.nzSpecific.region || 'New Zealand',
        language: config.nzSpecific.bilingualMode ? ['en-NZ', 'mi'] : ['en-NZ']
      }
    };

    // Generate bilingual content if needed
    if (config.nzSpecific.bilingualMode && config.nzSpecific.maoriContent) {
      try {
        // Create glossary for important terms
        const glossary = await this.createMaoriGlossary(
          config.nzSpecific.maoriContent.keywords
        );

        // Bilingual support script
        const bilingualScript = `
          window.translations = {
            en: ${JSON.stringify(config.sections || {})},
            mi: ${JSON.stringify(config.nzSpecific.maoriContent)}
          };
          
          function toggleLanguage(lang) {
            document.querySelectorAll('[data-translate]').forEach(el => {
              el.textContent = window.translations[lang][el.dataset.translate] || el.textContent;
            });
          }
        `;

        // Glossary tooltip script
        const glossaryScript = `
          const glossary = ${JSON.stringify(Object.fromEntries(glossary))};
          document.querySelectorAll('[data-maori-term]').forEach(el => {
            el.setAttribute('title', glossary[el.textContent] || 'No definition');
          });
        `;

        enhancedConfig.scripts = [bilingualScript, glossaryScript];
      } catch (error) {
        console.error("Error creating bilingual content:", error);
      }
    }

    return super.createTemplate(name, enhancedConfig);
  }
}

// Utility function to create NZ WebForge instance
export function createNZWebForgeInstance(baseDir?: string, options = {}) {
  return new WebForgeNZ(baseDir, options);
}

export default function nzExtension() {
  return {
    name: "NZ WebForge Extension",
    version: "1.0.0",
    description: "A comprehensive WebForge extension for New Zealand-specific web development",
    createInstance: createNZWebForgeInstance
  };
}