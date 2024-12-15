// pluso/core/workers/tasks/legislation-scraper.ts

import { DOMParser } from "https://deno.land/x/deno_dom/deno-dom-wasm.ts";
import { poolManager } from "../pool/manager.ts";

interface LegislationChunk {
  id: string;
  title: string;
  content: string;
  section: string;
  lastUpdated: Date;
}

export class LegislationScraper {
  private url: string;
  private cacheExpiration: number;

  constructor(url: string, cacheExpiration = 604800) {
    this.url = url;
    this.cacheExpiration = cacheExpiration;
  }

  async scrape(): Promise<LegislationChunk[]> {
    const response = await fetch(this.url);
    const html = await response.text();
    const doc = new DOMParser().parseFromString(html, "text/html");
    
    if (!doc) throw new Error("Failed to parse legislation document");

    const chunks: LegislationChunk[] = [];
    const sections = doc.querySelectorAll(".section");

    for (const section of sections) {
      const id = section.getAttribute("id") || crypto.randomUUID();
      const title = section.querySelector("h2")?.textContent || "";
      const content = section.textContent || "";

      chunks.push({
        id,
        title,
        content,
        section: this.extractSectionNumber(title),
        lastUpdated: new Date()
      });
    }

    await this.updateCache(chunks);
    return chunks;
  }

  private extractSectionNumber(title: string): string {
    const match = title.match(/^\d+/);
    return match ? match[0] : "";
  }

  private async updateCache(chunks: LegislationChunk[]): Promise<void> {
    const client = await poolManager.getDatabaseClient();
    
    for (const chunk of chunks) {
      await client.query(
        `INSERT INTO legal_legislation_cache (section_id, content, url, last_updated)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (section_id) DO UPDATE
         SET content = $2, last_updated = $4`,
        [chunk.id, chunk.content, this.url, chunk.lastUpdated]
      );
    }
  }
}

// Initialize scraper worker
const worker = new LegislationScraper(
  "https://www.legislation.govt.nz/act/public/2007/0091/latest/whole.html"
);

// Set up periodic scraping
Deno.cron("legislation-update", "0 0 * * 0", async () => {
  try {
    await worker.scrape();
    console.log("Legislation cache updated successfully");
  } catch (error) {
    console.error("Failed to update legislation cache:", error);
  }
});