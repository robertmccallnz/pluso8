import { DOMParser, Element as DenoElement } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";

// Enums and Types
export enum WordType {
  NOUN = "noun",
  VERB = "verb",
  ADJECTIVE = "adjective",
  ADVERB = "adverb",
  PRONOUN = "pronoun",
  PREPOSITION = "preposition",
  CONJUNCTION = "conjunction",
  INTERJECTION = "interjection"
}

export enum RelationType {
  SYNONYM = "synonym",
  ANTONYM = "antonym",
  RELATED = "related",
  DERIVATIVE = "derivative"
}

export enum ScrapingErrorType {
  NETWORK_ERROR = "network_error",
  PARSE_ERROR = "parse_error",
  NOT_FOUND = "not_found",
  INVALID_INPUT = "invalid_input"
}

export class KupuScraperError extends Error {
  constructor(
    public type: ScrapingErrorType, 
    message: string, 
    public statusCode?: number
  ) {
    super(message);
    this.name = "KupuScraperError";
  }
}

export interface KupuExample {
  reo: string;
  english: string;
  context?: string;
}

export interface RelatedWord {
  word: string;
  relationshipType: RelationType;
  description?: string;
}

export interface KupuEntry {
  kupu: string;
  wordType: WordType;
  translations: string[];
  examples: KupuExample[];
  notes?: string[];
  related?: RelatedWord[];
}

export interface KupuScraperConfig {
  rateLimitMs?: number;
  cacheExpiration?: number;
  baseUrl?: string;
  headers?: Record<string, string>;
}

export class KupuScraper {
  private baseUrl: string;
  private cache: MemoryCache;
  private lastRequestTime: number = 0;
  private rateLimitMs: number;
  private config: Required<KupuScraperConfig>;

  constructor(config: KupuScraperConfig = {}) {
    const defaultConfig: Required<KupuScraperConfig> = {
      rateLimitMs: 1000,
      cacheExpiration: 24 * 60 * 60 * 1000, // 24 hours
      baseUrl: "https://maoridictionary.co.nz/search?keywords=",
      headers: {}
    };

    this.config = { ...defaultConfig, ...config };
    
    this.baseUrl = this.config.baseUrl;
    this.rateLimitMs = this.config.rateLimitMs;
    this.cache = new MemoryCache();
  }

  // Static factory method
  static create(config: KupuScraperConfig = {}): KupuScraper {
    return new KupuScraper(config);
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitMs) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitMs - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  private async makeRequest(word: string): Promise<Response> {
    try {
      const response = await fetch(`${this.baseUrl}${encodeURIComponent(word)}`, {
        headers: this.config.headers
      });
      
      if (!response.ok) {
        throw new KupuScraperError(
          ScrapingErrorType.NETWORK_ERROR,
          `Network request failed with status ${response.status}`,
          response.status
        );
      }
      
      return response;
    } catch (error) {
      if (error instanceof KupuScraperError) {
        throw error;
      }
      throw new KupuScraperError(
        ScrapingErrorType.NETWORK_ERROR,
        error instanceof Error ? error.message : "Network request failed"
      );
    }
  }

  private async processResponse(response: Response, word: string): Promise<KupuEntry> {
    const html = await response.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    
    if (!doc) {
      throw new KupuScraperError(
        ScrapingErrorType.PARSE_ERROR,
        `Failed to parse HTML for word '${word}'`
      );
    }

    const mainContent = doc.querySelector(".search-results");
    if (!mainContent) {
      throw new KupuScraperError(
        ScrapingErrorType.NOT_FOUND,
        `No results found for word '${word}'`
      );
    }

    const mainContentElement = mainContent as DenoElement;

    return {
      kupu: word,
      wordType: this.parseWordType(mainContentElement),
      translations: this.parseTranslations(mainContentElement),
      examples: this.parseExamples(mainContentElement),
      notes: this.parseNotes(mainContentElement),
      related: this.parseRelated(mainContentElement)
    };
  }

  async lookup(word: string): Promise<KupuEntry> {
    try {
      if (!word?.trim()) {
        throw new KupuScraperError(
          ScrapingErrorType.INVALID_INPUT,
          "Word parameter cannot be empty"
        );
      }
  
      const cached = await this.cache.get(word);
      if (cached) {
        console.log(`Cache hit for word: ${word}`);
        return cached;
      }
  
      await this.rateLimit();
      const response = await this.makeRequest(word);
      const entry = await this.processResponse(response, word);
      await this.cache.set(word, entry, this.config.cacheExpiration);
      
      return entry;
  
    } catch (error) {
      if (error instanceof KupuScraperError) {
        throw error;
      }
      throw new KupuScraperError(
        ScrapingErrorType.NETWORK_ERROR,
        error instanceof Error ? error.message : "Network request failed"
      );
    }
  }

  private parseWordType(element: DenoElement): WordType {
    try {
      const typeText = element.querySelector(".part-of-speech")?.textContent?.trim().toLowerCase() || "";
      return Object.values(WordType).find(type => type === typeText) || WordType.NOUN;
    } catch (error) {
      throw new KupuScraperError(
        ScrapingErrorType.PARSE_ERROR,
        "Failed to parse word type"
      );
    }
  }

  private parseTranslations(element: DenoElement): string[] {
    try {
      return Array.from(element.querySelectorAll(".meaning"))
        .map(el => (el as DenoElement).textContent?.trim())
        .filter((text): text is string => typeof text === "string" && text.length > 0);
    } catch (error) {
      throw new KupuScraperError(
        ScrapingErrorType.PARSE_ERROR,
        "Failed to parse translations"
      );
    }
  }

  private parseExamples(element: DenoElement): KupuExample[] {
    try {
      return Array.from(element.querySelectorAll(".example"))
        .map(el => ({
          reo: (el as DenoElement).querySelector(".reo")?.textContent?.trim() || "",
          english: (el as DenoElement).querySelector(".english")?.textContent?.trim() || "",
          context: (el as DenoElement).querySelector(".context")?.textContent?.trim() || undefined
        }));
    } catch (error) {
      throw new KupuScraperError(
        ScrapingErrorType.PARSE_ERROR,
        "Failed to parse examples"
      );
    }
  }

  private parseNotes(element: DenoElement): string[] {
    try {
      return Array.from(element.querySelectorAll(".notes"))
        .map(el => (el as DenoElement).textContent?.trim())
        .filter((text): text is string => typeof text === "string" && text.length > 0);
    } catch (error) {
      throw new KupuScraperError(
        ScrapingErrorType.PARSE_ERROR,
        "Failed to parse notes"
      );
    }
  }

  private parseRelated(element: DenoElement): RelatedWord[] {
    try {
      const relatedElements = element.querySelectorAll(".related-word");
      return Array.from(relatedElements).map(el => {
        const relatedEl = el as DenoElement;
        const wordElement = relatedEl.querySelector(".word");
        const typeElement = relatedEl.querySelector(".relation-type");
        const descriptionElement = relatedEl.querySelector(".description");

        return {
          word: wordElement?.textContent?.trim() || "",
          relationshipType: typeElement?.textContent?.trim() as RelationType || RelationType.RELATED,
          description: descriptionElement?.textContent?.trim()
        };
      });
    } catch (error) {
      throw new KupuScraperError(
        ScrapingErrorType.PARSE_ERROR,
        "Failed to parse related words"
      );
    }
  }
}

// Simple in-memory cache strategy
class MemoryCache {
  private cache = new Map<string, { data: any; expiry: number }>();

  async get(key: string): Promise<any | null> {
    const cached = this.cache.get(key);
    if (cached && Date.now() < cached.expiry) {
      return cached.data;
    }
    return null;
  }

  async set(key: string, data: any, ttl: number): Promise<void> {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttl
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

export default KupuScraper.create();