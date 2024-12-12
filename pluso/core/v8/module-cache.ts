/ pluso/core/v8/module-cache.ts
export class ModuleCache {
  private static instance: ModuleCache;
  private cache: Map<string, any>;
  private stats: Map<string, { hits: number, lastAccess: number }>;

  private constructor() {
    this.cache = new Map();
    this.stats = new Map();
  }

  static getInstance(): ModuleCache {
    if (!ModuleCache.instance) {
      ModuleCache.instance = new ModuleCache();
    }
    return ModuleCache.instance;
  }

  async getModule(path: string): Promise<any> {
    if (this.cache.has(path)) {
      this.updateStats(path);
      return this.cache.get(path);
    }

    const module = await this.loadModule(path);
    this.cache.set(path, module);
    return module;
  }

  private updateStats(path: string): void {
    const stat = this.stats.get(path) ?? { hits: 0, lastAccess: 0 };
    stat.hits++;
    stat.lastAccess = Date.now();
    this.stats.set(path, stat);
  }

  private async loadModule(path: string): Promise<any> {
    try {
      return await import(path);
    } catch (error) {
      throw new Error(`Module loading error: ${error.message}`);
    }
  }
}