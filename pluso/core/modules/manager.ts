/ core/module/module-manager.ts
export interface ModuleMetadata {
  specifier: string;
  dependencies: string[];
  size: number;
  lastAccessed: number;
}

export class ModuleManager {
  private modules: Map<string, ModuleMetadata> = new Map();
  private cache: Map<string, unknown> = new Map();
  private readonly maxCacheSize: number;

  constructor(maxCacheSize = 100 * 1024 * 1024) { // 100MB default
    this.maxCacheSize = maxCacheSize;
  }

  async loadModule(specifier: string): Promise<unknown> {
    if (this.cache.has(specifier)) {
      const metadata = this.modules.get(specifier)!;
      metadata.lastAccessed = Date.now();
      return this.cache.get(specifier);
    }

    const module = await this.importModule(specifier);
    const metadata: ModuleMetadata = {
      specifier,
      dependencies: this.extractDependencies(module),
      size: this.calculateSize(module),
      lastAccessed: Date.now()
    };

    this.modules.set(specifier, metadata);
    this.cache.set(specifier, module);
    this.enforceCacheLimit();

    return module;
  }

  private async importModule(specifier: string): Promise<unknown> {
    // Implement actual module loading logic here
    return await import(specifier);
  }

  private extractDependencies(module: unknown): string[] {
    // Implement dependency extraction logic
    return [];
  }

  private calculateSize(module: unknown): number {
    // Implement size calculation logic
    return 0;
  }

  private enforceCacheLimit() {
    let totalSize = Array.from(this.modules.values())
      .reduce((sum, meta) => sum + meta.size, 0);

    if (totalSize > this.maxCacheSize) {
      const entries = Array.from(this.modules.entries())
        .sort(([, a], [, b]) => a.lastAccessed - b.lastAccessed);

      while (totalSize > this.maxCacheSize && entries.length > 0) {
        const [specifier, metadata] = entries.shift()!;
        this.cache.delete(specifier);
        this.modules.delete(specifier);
        totalSize -= metadata.size;
      }
    }
  }
}