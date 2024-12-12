import * as KupuScraper from "../kupu-scraper/mod.ts";
import { TeReoEntry, TeReoConfig, LanguageLevel } from "./types.ts";
import { CommonPhrases } from "./phrases.ts";
import { 
  checkGrammarPattern,
  suggestCorrection,
  verbTenses,
  basicPatterns,
  particles,
  possessives,
  questions,
  sentencePatterns
} from "./grammar.ts";

// WebForge and NZ-specific configuration interfaces
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

// Integrated Te Reo Assistant Class
export class TeReoAssistant {
  private kupuScraper: KupuScraper.default;
  private config: TeReoConfig;
  private cache: Map<string, TeReoEntry>;

  constructor(config?: Partial<TeReoConfig>) {
    this.config = {
      cacheTimeout: 24 * 60 * 60 * 1000, // 24 hours
      languageLevel: LanguageLevel.Beginner,
      includeExamples: true,
      includePronunciation: true,
      ...config
    };

    this.kupuScraper = new KupuScraper.default({
      rateLimitMs: 500,
      cacheExpiration: this.config.cacheTimeout
    });

    this.cache = new Map();
  }

  async translate(text: string, targetLang: 'mi' | 'en'): Promise<string> {
    const words = text.match(/[\wāēīōū]+|\s+|[^\s\wāēīōū]+/gi) || [];
    const translations = await Promise.all(
      words.map(word => this.translateWord(word, targetLang))
    );
    return translations.join('');
  }

  private async translateWord(word: string, targetLang: 'mi' | 'en'): Promise<string> {
    if (!word.match(/[\wāēīōū]+/i)) return word;

    const cached = this.cache.get(word);
    if (cached && Date.now() - cached.timestamp < this.config.cacheTimeout) {
      return targetLang === 'mi' ? cached.maori : cached.english;
    }

    try {
      const kupuEntry = await this.kupuScraper.lookup(word);
      
      const entry: TeReoEntry = {
        english: word,
        maori: kupuEntry.translations[0] || word,
        examples: kupuEntry.examples[0]?.reo || '',
        pronunciation: this.generatePronunciation(word),
        level: this.determineLanguageLevel(word),
        timestamp: Date.now()
      };

      if (kupuEntry.translations.length > 0) {
        this.cache.set(word, entry);
      }

      const translation = targetLang === 'mi' ? entry.maori : entry.english;
      if (word === word.toUpperCase()) return translation.toUpperCase();
      if (word[0] === word[0].toUpperCase()) {
        return translation.charAt(0).toUpperCase() + translation.slice(1);
      }
      return translation;

    } catch (error) {
      console.log(`Translation not found for '${word}', keeping original`);
      return word;
    }
  }

  // Simplified pronunciation generation
  private generatePronunciation(word: string): string {
    return word.toLowerCase()
      .replace(/wh/g, 'f')
      .replace(/ng/g, 'ŋ')
      .replace(/ā/g, 'aa')
      .replace(/ē/g, 'ee')
      .replace(/ī/g, 'ii')
      .replace(/ō/g, 'oo')
      .replace(/ū/g, 'uu');
  }

  private determineLanguageLevel(word: string): LanguageLevel {
    if (CommonPhrases.basic.includes(word)) {
      return LanguageLevel.Beginner;
    }
    return LanguageLevel.Intermediate;
  }
}

// Simplified WebForge base class
class WebForge {
  constructor(baseDir: string, options = {}) {}

  createTemplate(name: string, config: WebsiteConfig) {
    return config;
  }
}

// WebForge NZ Extension
export class WebForgeNZ extends WebForge {
  private nzContentAPI: string;
  private maoriDictAPI: string;
  private teReoAssistant: TeReoAssistant;

  constructor(baseDir: string, options = {}) {
    super(baseDir, options);
    this.nzContentAPI = "https://api.digitalnz.org/v3";
    this.maoriDictAPI = "https://maoridictionary.co.nz/api/v2";
    this.teReoAssistant = new TeReoAssistant();
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
        const translation = await this.teReoAssistant.translate(term, 'en');
        glossary.set(term, translation);
      } catch (error) {
        console.error(`Error fetching definition for ${term}:`, error);
      }
    }
    return glossary;
  }

  async createTemplate(name: string, config: NZWebsiteConfig) {
    const enhancedConfig = {
      ...config,
      meta: {
        ...config.meta,
        region: config.nzSpecific.region || 'New Zealand',
        language: config.nzSpecific.bilingualMode ? ['en-NZ', 'mi'] : ['en-NZ']
      }
    };

    if (config.nzSpecific.bilingualMode && config.nzSpecific.maoriContent) {
      try {
        const glossary = await this.createMaoriGlossary(
          config.nzSpecific.maoriContent.keywords
        );

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

// Explicitly export createTeReoAssistant function
export function createTeReoAssistant(config?: Partial<TeReoConfig>): TeReoAssistant {
  return new TeReoAssistant(config);
}

export default function nzExtension() {
  return {
    name: "NZ WebForge Extension",
    version: "1.0.0",
    description: "A comprehensive WebForge extension for New Zealand-specific web development",
    createInstance: createNZWebForgeInstance,
    createTeReoAssistant: createTeReoAssistant
  };
}