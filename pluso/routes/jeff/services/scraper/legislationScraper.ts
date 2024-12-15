// routes/jeff/services/scraper/legislationScraper.ts
import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.38/deno-dom-wasm.ts";

export interface LegislationSection {
  id: string;
  title: string;
  content: string;
  parent_id?: string;
  url: string;
  last_scraped: string;
}

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  excerpt: string;
  created_at: string;
}

export class LegislationScraper {
  private lastRequest = 0;
  private minRequestInterval = 1000;
  private cache = new Map<string, LegislationSection[]>();

  constructor() {
    // Initialize with in-memory cache instead of Supabase
  }

  private async rateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequest;
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }
    this.lastRequest = Date.now();
  }

  async scrapeAndStore(url: string): Promise<LegislationSection[]> {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url)!;
    }

    await this.rateLimit();
    
    try {
      const response = await axiod.get(url);
      const parser = new DOMParser();
      const document = parser.parseFromString(response.data, "text/html");

      if (!document) {
        throw new Error("Failed to parse HTML");
      }

      const sections: LegislationSection[] = [];
      const contentElements = document.querySelectorAll('.section-content');

      contentElements.forEach((element, index) => {
        const titleElement = element.querySelector('.section-title');
        sections.push({
          id: crypto.randomUUID(),
          title: titleElement?.textContent || `Section ${index + 1}`,
          content: element.textContent || '',
          url: url,
          last_scraped: new Date().toISOString()
        });
      });

      // Store in cache
      this.cache.set(url, sections);
      return sections;
    } catch (error) {
      console.error('Error scraping legislation:', error);
      return [];
    }
  }

  async search(query: string): Promise<SearchResult[]> {
    // Search through cached content first
    const results: SearchResult[] = [];
    
    for (const [url, sections] of this.cache.entries()) {
      const matchingSections = sections.filter(section => 
        section.content.toLowerCase().includes(query.toLowerCase()) ||
        section.title.toLowerCase().includes(query.toLowerCase())
      );

      results.push(...matchingSections.map(section => ({
        id: section.id,
        title: section.title,
        url: section.url,
        excerpt: this.generateExcerpt(section.content, query),
        created_at: section.last_scraped
      })));
    }

    // If no results in cache, scrape default legislation URLs
    if (results.length === 0) {
      const defaultUrls = [
        'https://www.legislation.govt.nz/act/public/2007/0091/latest/whole.html',
        'https://www.legislation.govt.nz/act/public/2010/0022/latest/whole.html'
      ];

      for (const url of defaultUrls) {
        const sections = await this.scrapeAndStore(url);
        const matchingSections = sections.filter(section =>
          section.content.toLowerCase().includes(query.toLowerCase()) ||
          section.title.toLowerCase().includes(query.toLowerCase())
        );

        results.push(...matchingSections.map(section => ({
          id: section.id,
          title: section.title,
          url: section.url,
          excerpt: this.generateExcerpt(section.content, query),
          created_at: section.last_scraped
        })));
      }
    }

    return results;
  }

  private generateExcerpt(content: string, query: string): string {
    const lowerContent = content.toLowerCase();
    const lowerQuery = query.toLowerCase();
    const index = lowerContent.indexOf(lowerQuery);
    
    if (index === -1) {
      return content.slice(0, 150) + '...';
    }

    const start = Math.max(0, index - 75);
    const end = Math.min(content.length, index + query.length + 75);
    return (start > 0 ? '...' : '') + 
           content.slice(start, end) + 
           (end < content.length ? '...' : '');
  }
}