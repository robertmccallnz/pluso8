// core/module/registry.ts
export class ModuleRegistry {
    private modules: Map<string, ModuleRef> = new Map();
    private dependencyGraph: Map<string, Set<string>> = new Map();
  
    async registerModule(config: ModuleConfig): Promise<ModuleRef> {
      const id = `${config.name}@${config.version}`;
      
      if (this.modules.has(id)) {
        throw new Error(`Module ${id} is already registered`);
      }
  
      const moduleRef: ModuleRef = {
        id,
        config,
        instance: null,
        dependencies: new Set(),
        dependents: new Set(),
        state: 'loading'
      };
  
      this.modules.set(id, moduleRef);
      this.dependencyGraph.set(id, new Set());
  
      return moduleRef;
    }
  
    async resolveModule(id: string): Promise<ModuleRef> {
      const moduleRef = this.modules.get(id);
      if (!moduleRef) {
        throw new Error(`Module ${id} not found`);
      }
  
      if (moduleRef.state === 'ready') {
        return moduleRef;
      }
  
      try {
        await this.loadDependencies(moduleRef);
        moduleRef.instance = await this.instantiateModule(moduleRef);
        moduleRef.state = 'ready';
        return moduleRef;
      } catch (error) {
        moduleRef.state = 'error';
        moduleRef.error = error as Error;
        throw error;
      }
    }
  
    private async loadDependencies(moduleRef: ModuleRef): Promise<void> {
      const deps = Object.entries(moduleRef.config.dependencies);
      
      for (const [name, version] of deps) {
        const depId = `${name}@${version}`;
        moduleRef.dependencies.add(depId);
        
        const depRef = await this.resolveModule(depId);
        depRef.dependents.add(moduleRef.id);
        
        this.dependencyGraph.get(moduleRef.id)?.add(depId);
      }
    }
  
    private async instantiateModule(moduleRef: ModuleRef): Promise<any> {
      // Import and instantiate the module using the entry point
      const module = await import(moduleRef.config.entry);
      return module.default || module;
    }
  
    getDependencyGraph(): Map<string, Set<string>> {
      return new Map(this.dependencyGraph);
    }
  
    getModuleInfo(id: string): ModuleRef | undefined {
      return this.modules.get(id);
    }
  }