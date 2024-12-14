import { PutBlobResult, del, list, put } from '@vercel/blob';
import { CacheEntry, KupuEntry } from './types.ts';

export interface CacheStrategy {
  get(key: string): Promise<KupuEntry | null>;
  set(key: string, value: KupuEntry, ttl: number): Promise<void>;
  delete(key: string): Promise<void>;
  clear(): Promise<void>;
}

// In-memory cache for development
export class MemoryCache implements CacheStrategy {
  private cache: Map<string, CacheEntry> = new Map();

  async get(key: string): Promise<KupuEntry | null> {
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  async set(key: string, value: KupuEntry, ttl: number): Promise<void> {
    this.cache.set(key, {
      data: value,
      expiresAt: Date.now() + ttl
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  async clear(): Promise<void> {
    this.cache.clear();
  }
}

// Blob storage cache for production
export class BlobCache implements CacheStrategy {
  private pathPrefix: string = 'kupu-cache';

  private getKey(key: string): string {
    return `${this.pathPrefix}/${key}.json`;
  }

  async get(key: string): Promise<KupuEntry | null> {
    try {
      const response = await fetch(this.getKey(key));
      if (!response.ok) return null;
      
      const entry: CacheEntry = await response.json();
      
      if (Date.now() > entry.expiresAt) {
        await this.delete(key);
        return null;
      }
      
      return entry.data;
    } catch (error) {
      console.error('Blob cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: KupuEntry, ttl: number): Promise<void> {
    const entry: CacheEntry = {
      data: value,
      expiresAt: Date.now() + ttl
    };

    try {
      await put(this.getKey(key), JSON.stringify(entry), {
        access: 'public',
        addRandomSuffix: false
      });
    } catch (error) {
      console.error('Blob cache set error:', error);
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await del(this.getKey(key));
    } catch (error) {
      console.error('Blob cache delete error:', error);
    }
  }

  async clear(): Promise<void> {
    try {
      const blobs = await list({ prefix: this.pathPrefix });
      await Promise.all(blobs.blobs.map(blob => del(blob.url)));
    } catch (error) {
      console.error('Blob cache clear error:', error);
    }
  }
}

// Factory function to create the appropriate cache strategy
export function createCache(strategy: 'memory' | 'blob' = 'memory'): CacheStrategy {
  return strategy === 'memory' ? new MemoryCache() : new BlobCache();
}