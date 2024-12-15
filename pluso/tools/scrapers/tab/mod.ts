// Simple in-memory cache implementation
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

interface Horse {
  id: string;
  name: string;
  number: number;
  jockey: string;
  trainer: string;
  weight: number;
  odds: number;
  position?: number;
  finishTime?: string;
}

interface RaceResult {
  winner: Horse;
  placings: Horse[];
  margins: string[];
  totalTime: string;
  trackCondition: string;
}

interface TabScraperConfig {
  rateLimitMs?: number;
  cacheExpiration?: number;
  baseUrl?: string;
  headers?: Record<string, string>;
}

interface RaceEvent {
  id: string;
  name: string;
  venue: string;
  startTime: string;
  status: string;
  type: 'racing' | 'sports';
  url: string;
  distance?: number;
  prize?: number;
  horses?: Horse[];
  result?: RaceResult;
}

export class TabScraper {
  private config: Required<TabScraperConfig>;
  private baseUrl: string;
  private rateLimitMs: number;
  private cache: MemoryCache;
  private lastRequestTime: number;

  constructor(config: TabScraperConfig = {}) {
    const defaultConfig: Required<TabScraperConfig> = {
      rateLimitMs: 1000,
      cacheExpiration: 5 * 60 * 1000, // 5 minutes
      baseUrl: "https://api.tab.co.nz",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
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

  private calculateWinner(horses: Horse[]): RaceResult {
    // Sort horses by their odds (lower odds = higher chance of winning)
    const sortedHorses = [...horses].sort((a, b) => a.odds - b.odds);
    
    // Add some randomness - horses with better odds have higher chance but can still lose
    const raceHorses = sortedHorses.map(horse => {
      // Calculate a score based on odds and random factor
      const randomFactor = Math.random() * 2; // Random number between 0 and 2
      const score = (1 / horse.odds) * randomFactor;
      return { ...horse, score };
    });

    // Sort by final score
    const results = raceHorses.sort((a, b) => b.score - a.score);
    
    // Calculate finish times and margins
    const baseTime = 70 + Math.random() * 10; // Base time around 70-80 seconds
    const margins = [];
    let prevTime = baseTime;
    
    results.forEach((horse, index) => {
      const margin = index === 0 ? 0 : Math.random() * 2.5; // Random margin up to 2.5 lengths
      const timeAdd = margin * 0.2; // Each length is about 0.2 seconds
      const finishTime = prevTime + timeAdd;
      horse.position = index + 1;
      horse.finishTime = this.formatRaceTime(finishTime);
      if (index > 0) {
        margins.push(`${margin.toFixed(1)}L`);
      }
      prevTime = finishTime;
    });

    return {
      winner: results[0],
      placings: results.slice(0, 3),
      margins,
      totalTime: this.formatRaceTime(baseTime),
      trackCondition: 'Good'
    };
  }

  private formatRaceTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(2);
    return `${mins}:${secs.padStart(5, '0')}`;
  }

  async getRaceEvents(type: 'racing' | 'sports' = 'racing'): Promise<RaceEvent[]> {
    console.log(`Fetching ${type} events...`);
    
    if (type === 'racing') {
      const mockHorses = [
        {
          id: 'h1',
          name: 'Kiwi Star',
          number: 1,
          jockey: 'James McDonald',
          trainer: 'Chris Waller',
          weight: 56.5,
          odds: 2.80
        },
        {
          id: 'h2',
          name: 'Thunder Express',
          number: 2,
          jockey: 'Opie Bosson',
          trainer: 'Jamie Richards',
          weight: 57.0,
          odds: 3.20
        },
        {
          id: 'h3',
          name: 'Mighty Runner',
          number: 3,
          jockey: 'Craig Williams',
          trainer: 'Murray Baker',
          weight: 55.5,
          odds: 4.50
        },
        {
          id: 'h4',
          name: 'Fast Fortune',
          number: 4,
          jockey: 'Hugh Bowman',
          trainer: 'Tony Pike',
          weight: 56.0,
          odds: 6.00
        }
      ];

      const events: RaceEvent[] = [
        {
          id: '1',
          name: 'R1 - Ellerslie Racecourse',
          venue: 'Ellerslie',
          startTime: new Date().toISOString(),
          status: 'Open',
          type: 'racing',
          url: 'https://www.tab.co.nz/racing/1/1',
          distance: 1200,
          prize: 80000,
          horses: mockHorses,
          result: this.calculateWinner(mockHorses)
        },
        {
          id: '2',
          name: 'R2 - Ellerslie Racecourse',
          venue: 'Ellerslie',
          startTime: new Date(Date.now() + 30 * 60000).toISOString(),
          status: 'Open',
          type: 'racing',
          url: 'https://www.tab.co.nz/racing/1/2',
          distance: 1600,
          prize: 100000,
          horses: mockHorses
        },
        {
          id: '3',
          name: 'R3 - Te Rapa',
          venue: 'Te Rapa',
          startTime: new Date(Date.now() + 60 * 60000).toISOString(),
          status: 'Open',
          type: 'racing',
          url: 'https://www.tab.co.nz/racing/2/1',
          distance: 2000,
          prize: 120000,
          horses: mockHorses
        }
      ];

      return events;
    } else {
      return [
        {
          id: 's1',
          name: 'Phoenix vs Wellington',
          venue: 'Sky Stadium',
          startTime: new Date(Date.now() + 120 * 60000).toISOString(),
          status: 'Upcoming',
          type: 'sports',
          url: 'https://www.tab.co.nz/sport/football/1'
        },
        {
          id: 's2',
          name: 'Black Caps vs Australia',
          venue: 'Eden Park',
          startTime: new Date(Date.now() + 180 * 60000).toISOString(),
          status: 'Upcoming',
          type: 'sports',
          url: 'https://www.tab.co.nz/sport/cricket/1'
        }
      ];
    }
  }

  static create(config?: TabScraperConfig): TabScraper {
    return new TabScraper(config);
  }
}

export default TabScraper.create();
