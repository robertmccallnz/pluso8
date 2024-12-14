// /src/tools/kupuscraper/types.ts

/**
 * Configuration options for the KupuScraper
 */
export interface KupuScraperConfig {
    /** Rate limit between requests in milliseconds */
    rateLimitMs: number;
    /** Cache expiration time in milliseconds */
    cacheExpiration: number;
    /** Optional base URL for the dictionary API */
    baseUrl?: string;
    /** Optional custom headers for requests */
    headers?: Record<string, string>;
  }
  
  /**
   * Represents a single Māori word entry
   */
  export interface KupuEntry {
    /** The word in Te Reo Māori */
    kupu: string;
    /** Part of speech (noun, verb, etc.) */
    wordType: WordType;
    /** English translations */
    translations: string[];
    /** Example usage in sentences */
    examples: KupuExample[];
    /** Related words or variations */
    related?: RelatedWord[];
    /** Additional notes or context */
    notes?: string[];
  }
  
  /**
   * Represents an example usage of a word
   */
  export interface KupuExample {
    /** The example sentence in Te Reo Māori */
    reo: string;
    /** English translation of the example */
    english: string;
    /** Optional context or usage notes */
    context?: string;
  }
  
  /**
   * Represents a related word or variation
   */
  export interface RelatedWord {
    /** The related word */
    word: string;
    /** Type of relationship (synonym, antonym, variation) */
    relationshipType: RelationType;
    /** Optional explanation of the relationship */
    description?: string;
  }
  
  /**
   * Valid word types in Te Reo Māori
   */
  export enum WordType {
    NOUN = 'noun',
    VERB = 'verb',
    ADJECTIVE = 'adjective',
    ADVERB = 'adverb',
    PARTICLE = 'particle',
    PRONOUN = 'pronoun',
    DETERMINER = 'determiner',
    PREPOSITION = 'preposition',
    CONJUNCTION = 'conjunction',
    EXCLAMATION = 'exclamation'
  }
  
  /**
   * Types of relationships between words
   */
  export enum RelationType {
    SYNONYM = 'synonym',
    ANTONYM = 'antonym',
    VARIATION = 'variation',
    COMPOUND = 'compound',
    RELATED = 'related'
  }
  
  /**
   * Scraping result with status and data
   */
  export interface ScrapingResult {
    /** Success status of the scraping operation */
    success: boolean;
    /** The scraped data if successful */
    data?: KupuEntry;
    /** Error message if unsuccessful */
    error?: string;
    /** HTTP status code if applicable */
    statusCode?: number;
    /** Timestamp of when the data was scraped */
    timestamp: number;
  }
  
  /**
   * Cache entry structure
   */
  export interface CacheEntry {
    /** The cached data */
    data: KupuEntry;
    /** When the cache entry expires */
    expiresAt: number;
  }
  
  /**
   * Search options for the scraper
   */
  export interface SearchOptions {
    /** Maximum number of results to return */
    limit?: number;
    /** Word type filter */
    wordType?: WordType;
    /** Whether to include examples */
    includeExamples?: boolean;
    /** Whether to include related words */
    includeRelated?: boolean;
  }
  
  /**
   * Error types that can occur during scraping
   */
  export enum ScrapingErrorType {
    NETWORK_ERROR = 'network_error',
    RATE_LIMIT = 'rate_limit',
    NOT_FOUND = 'not_found',
    PARSE_ERROR = 'parse_error',
    INVALID_INPUT = 'invalid_input',
    UNKNOWN = 'unknown'
  }
  
  /**
   * Custom error class for scraping errors
   */
  export class KupuScraperError extends Error {
    constructor(
      public type: ScrapingErrorType,
      message: string,
      public statusCode?: number
    ) {
      super(message);
      this.name = 'KupuScraperError';
    }
  }