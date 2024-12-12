/**
 * Language proficiency levels
 */
export enum LanguageLevel {
  Beginner = "beginner",
  Intermediate = "intermediate",
  Advanced = "advanced"
}

/**
 * Main configuration interface for Te Reo Assistant
 */
export interface TeReoConfig {
  /** Cache timeout in milliseconds */
  cacheTimeout: number;
  /** Target language proficiency level */
  languageLevel: LanguageLevel;
  /** Whether to include usage examples */
  includeExamples: boolean;
  /** Whether to include pronunciation guides */
  includePronunciation: boolean;
}

/**
 * Represents a single Te Reo Māori entry with translations and metadata
 */
export interface TeReoEntry {
  /** The English translation or word */
  english: string;
  /** The Te Reo Māori word */
  maori: string;
  /** Example usage in context */
  examples: string;
  /** Pronunciation guide */
  pronunciation: string;
  /** Language difficulty level */
  level: LanguageLevel;
  /** Timestamp when the entry was created/updated */
  timestamp: number;
}

/**
 * Common phrase categories
 */
export interface PhrasesData {
  greetings: string[];
  farewells: string[];
  basic: string[];
  intermediate: string[];
  advanced: string[];
  getForContext(context: string): string[];
}

/**
 * Translation request options
 */
export interface TranslationOptions {
  /** Include pronunciation guide */
  includePronunciation?: boolean;
  /** Include usage examples */
  includeExamples?: boolean;
  /** Target language level */
  targetLevel?: LanguageLevel;
  /** Context for translation */
  context?: string;
}

/**
 * Translation result with metadata
 */
export interface TranslationResult {
  /** Original text */
  original: string;
  /** Translated text */
  translated: string;
  /** Pronunciation guide if requested */
  pronunciation?: string;
  /** Usage examples if requested */
  examples?: string[];
  /** Additional context or notes */
  notes?: string[];
  /** Source language */
  sourceLang: 'en' | 'mi';
  /** Target language */
  targetLang: 'en' | 'mi';
}

/**
 * Enhancement options for text processing
 */
export interface EnhancementOptions {
  /** Add pronunciation guides */
  addPronunciation?: boolean;
  /** Add translations */
  addTranslations?: boolean;
  /** Add usage examples */
  addExamples?: boolean;
  /** Highlight specific grammar patterns */
  highlightGrammar?: boolean;
}

/**
 * Cache storage options
 */
export interface CacheOptions {
  /** Maximum cache size */
  maxSize?: number;
  /** Cache expiration time in milliseconds */
  expirationTime: number;
  /** Storage strategy ('memory' | 'local' | 'session') */
  storageType?: 'memory' | 'local' | 'session';
}

/**
 * Error types specific to Te Reo processing
 */
export enum TeReoErrorType {
  TRANSLATION_ERROR = 'translation_error',
  PRONUNCIATION_ERROR = 'pronunciation_error',
  GRAMMAR_ERROR = 'grammar_error',
  CACHE_ERROR = 'cache_error',
  NETWORK_ERROR = 'network_error',
  VALIDATION_ERROR = 'validation_error'
}

/**
 * Custom error class for Te Reo processing
 */
export class TeReoError extends Error {
  constructor(
    public type: TeReoErrorType,
    message: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'TeReoError';
  }
}