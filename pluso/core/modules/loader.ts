// core/module/loader.ts
export class ModuleLoader {
    private cache: Map<string, any> = new Map();
    private loading: Map<string, Promise<any>> = new Map();
  
    constructor(
      private registry: ModuleRegistry,
      private maxCacheSize: number = 100
    ) {}
  
    async load(moduleId: string): Promise<any> {
      // Check cache first
      if (this.cache.has(moduleId)) {
        return this.cache.get(moduleId);
      }
  
      // Check if already loading
      if (this.loading.has(moduleId)) {
        return this.loading.get(moduleId);
      }
  
      // Start loading process
      const loadPromise = this.loadModule(moduleId);
      this.loading.set(moduleId, loadPromise);
  
      try {
        const module = await loadPromise;
        this.cache.set(moduleId, module);
        return module;
      } finally {
        this.loading.delete(moduleId);
      }
    }
  
    private async loadModule(moduleId: string): Promise<any> {
      const moduleRef = await this.registry.resolveModule(moduleId);
      
      // Ensure all dependencies are loaded
      const deps = Array.from(moduleRef.dependencies);
      await Promise.all(deps.map(depId => this.load(depId)));
  
      return moduleRef.instance;
    }
  
    clearCache(): void {
      this.cache.clear();
    }
  
    async preloadModule(moduleId: string): Promise<void> {
      if (!this.cache.has(moduleId)) {
        await this.load(moduleId);
      }
    }
  }
  