interface LegislationScraperConfig {
  rateLimitMs?: number;
  cacheExpiration?: number;
  baseUrl?: string;
  headers?: Record<string, string>;
}

interface LegislationSection {
  id: string;
  number: string;
  title: string;
  content: string;
  subsections: LegislationSection[];
}

interface LegislationDocument {
  id: string;
  title: string;
  year: string;
  number: string;
  type: string;
  status: string;
  lastUpdated: string;
  sections: LegislationSection[];
  url: string;
}

class MemoryCache {
  private cache: Map<string, { data: unknown; expires: number }>;

  constructor() {
    this.cache = new Map();
  }

  set(key: string, value: unknown, ttlMs: number): void {
    this.cache.set(key, {
      data: value,
      expires: Date.now() + ttlMs
    });
  }

  get(key: string): unknown | null {
    const item = this.cache.get(key);
    if (!item) return null;
    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
}

export class LegislationScraper {
  private config: Required<LegislationScraperConfig>;
  private baseUrl: string;
  private rateLimitMs: number;
  private cache: MemoryCache;
  private lastRequestTime: number;

  constructor(config: LegislationScraperConfig = {}) {
    const defaultConfig: Required<LegislationScraperConfig> = {
      rateLimitMs: 1000,
      cacheExpiration: 30 * 60 * 1000, // 30 minutes
      baseUrl: "https://legislation.govt.nz",
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-NZ,en;q=0.9',
        'Cache-Control': 'no-cache',
        'User-Agent': 'Mozilla/5.0 (compatible; PlusoBot/1.0; +https://pluso.ai)'
      }
    };

    this.config = { ...defaultConfig, ...config };
    this.baseUrl = this.config.baseUrl;
    this.rateLimitMs = this.config.rateLimitMs;
    this.cache = new MemoryCache();
    this.lastRequestTime = 0;
  }

  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.rateLimitMs) {
      await new Promise(resolve => setTimeout(resolve, this.rateLimitMs - timeSinceLastRequest));
    }
    this.lastRequestTime = Date.now();
  }

  async getLegislation(url: string): Promise<LegislationDocument> {
    console.log('Fetching legislation from:', url);
    
    const cacheKey = `legislation_${url}`;
    const cached = this.cache.get(cacheKey) as LegislationDocument | null;
    if (cached) {
      console.log('Returning cached legislation');
      return cached;
    }

    await this.rateLimit();

    try {
      // Use proxy to avoid CORS issues
      const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      console.log('Using proxy URL:', proxyUrl);
      
      const response = await fetch(proxyUrl, {
        headers: {
          ...this.config.headers,
          'Accept': 'text/html'
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch legislation: ${response.statusText}`);
      }

      const html = await response.text();
      console.log('Received HTML length:', html.length);
      
      // Create a temporary div to parse HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;

      // Extract legislation details
      const titleEl = tempDiv.querySelector('.heading-title, .title');
      const title = titleEl?.textContent?.trim() || 'Unknown Title';
      console.log('Found title:', title);

      const lastUpdatedEl = tempDiv.querySelector('.reprint-as-at, .status');
      const lastUpdated = lastUpdatedEl?.textContent?.trim() || new Date().toLocaleDateString();
      console.log('Found last updated:', lastUpdated);
      
      // Parse sections
      const sections: LegislationSection[] = [];
      const sectionElements = tempDiv.querySelectorAll('.section, .regulation');
      console.log('Found sections:', sectionElements.length);
      
      sectionElements.forEach((sectionEl) => {
        const numberEl = sectionEl.querySelector('.section-number, .regulation-number');
        const headingEl = sectionEl.querySelector('.section-heading, .regulation-heading');
        const contentEl = sectionEl.querySelector('.section-text, .regulation-text');

        const section: LegislationSection = {
          id: sectionEl.id || crypto.randomUUID(),
          number: numberEl?.textContent?.trim() || '',
          title: headingEl?.textContent?.trim() || '',
          content: contentEl?.textContent?.trim() || '',
          subsections: []
        };

        console.log('Processing section:', section.number);

        // Parse subsections
        const subsectionElements = sectionEl.querySelectorAll('.subsection, .subregulation');
        subsectionElements.forEach((subsectionEl) => {
          const subNumberEl = subsectionEl.querySelector('.subsection-number, .subregulation-number');
          const subContentEl = subsectionEl.querySelector('.subsection-text, .subregulation-text');

          section.subsections.push({
            id: subsectionEl.id || crypto.randomUUID(),
            number: subNumberEl?.textContent?.trim() || '',
            title: '',
            content: subContentEl?.textContent?.trim() || '',
            subsections: []
          });
        });

        sections.push(section);
      });

      const legislation: LegislationDocument = {
        id: url.split('/').pop() || crypto.randomUUID(),
        title,
        year: url.match(/\d{4}/)?.[ 0 ] || '',
        number: url.match(/\d{4}\/(\d+)/)?.[ 1 ] || '',
        type: 'regulation',
        status: 'current',
        lastUpdated,
        sections,
        url
      };

      console.log('Created legislation document with sections:', sections.length);

      this.cache.set(cacheKey, legislation, this.config.cacheExpiration);
      return legislation;
    } catch (error) {
      console.error('Error fetching legislation:', error);
      throw error;
    }
  }

  static create(config?: LegislationScraperConfig): LegislationScraper {
    return new LegislationScraper(config);
  }
}

export default LegislationScraper.create();
