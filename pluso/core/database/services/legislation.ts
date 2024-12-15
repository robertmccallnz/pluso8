// core/database/services/legislation.ts

import axios from 'axios';
import cheerio from 'cheerio';
import { rateLimit } from 'bottleneck';
import { supabase } from '../supabase/client';

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

export class LegislationService {
  private limiter;

  constructor() {
    this.limiter = rateLimit({
      minTime: 1000,
      maxConcurrent: 2
    });
  }

  async scrapeAndStore(url: string): Promise<LegislationSection[]> {
    // Check for recent data
    const { data: existingData } = await supabase
      .from('legislation_sections')
      .select()
      .eq('url', url)
      .gte('last_scraped', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());

    if (existingData && existingData.length > 0) {
      return existingData;
    }

    // Scrape new data
    const response = await this.limiter.schedule(() => axios.get(url));
    const $ = cheerio.load(response.data);
    const sections: LegislationSection[] = [];

    $('.section').each((_, element) => {
      const $element = $(element);
      const section: LegislationSection = {
        id: $element.attr('id') || crypto.randomUUID(),
        title: $element.find('h1, h2, h3').first().text().trim(),
        content: $element.find('.sectionContent').text().trim(),
        url: url,
        last_scraped: new Date().toISOString()
      };

      sections.push(section);

      // Handle subsections
      $element.find('.subsection').each((_, subsection) => {
        const $subsection = $(subsection);
        sections.push({
          id: $subsection.attr('id') || crypto.randomUUID(),
          parent_id: section.id,
          title: $subsection.find('h1, h2, h3, h4').first().text().trim(),
          content: $subsection.find('.sectionContent').text().trim(),
          url: url,
          last_scraped: new Date().toISOString()
        });
      });
    });

    // Store in Supabase
    const { error } = await supabase
      .from('legislation_sections')
      .upsert(sections, {
        onConflict: 'id',
        ignoreDuplicates: false
      });

    if (error) throw error;
    return sections;
  }

  async search(query: string): Promise<SearchResult[]> {
    // Search existing data
    const { data: localResults, error: searchError } = await supabase
      .from('legislation_sections')
      .select()
      .textSearch('content', query)
      .limit(10);

    if (searchError) throw searchError;

    if (localResults && localResults.length > 0) {
      return localResults.map(result => ({
        id: result.id,
        title: result.title,
        url: result.url,
        excerpt: result.content.substring(0, 200) + '...',
        created_at: result.last_scraped
      }));
    }

    // Scrape new results if needed
    const searchUrl = `https://www.legislation.govt.nz/search/results?query=${encodeURIComponent(query)}`;
    const response = await this.limiter.schedule(() => axios.get(searchUrl));
    const $ = cheerio.load(response.data);

    const results: SearchResult[] = $('.searchResult')
      .map((_, element) => ({
        id: crypto.randomUUID(),
        title: $(element).find('.title').text().trim(),
        url: $(element).find('a').attr('href') || '',
        excerpt: $(element).find('.excerpt').text().trim(),
        created_at: new Date().toISOString()
      }))
      .get();

    if (results.length > 0) {
      await supabase
        .from('search_results')
        .upsert(results, {
          onConflict: 'url',
          ignoreDuplicates: false
        });
    }

    return results;
  }
}

// Export a singleton instance
export const legislationService = new LegislationService();