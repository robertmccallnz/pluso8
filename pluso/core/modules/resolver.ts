// core/module/dependency-resolver.ts
export class DependencyResolver {
    constructor(private registry: ModuleRegistry) {}
  
    async resolveTree(moduleId: string): Promise<Map<string, Set<string>>> {
      const tree = new Map<string, Set<string>>();
      await this.buildDependencyTree(moduleId, tree, new Set());
      return tree;
    }
  
    private async buildDependencyTree(
      moduleId: string,
      tree: Map<string, Set<string>>,
      visited: Set<string>
    ): Promise<void> {
      if (visited.has(moduleId)) {
        return;
      }
  
      visited.add(moduleId);
      const moduleRef = await this.registry.resolveModule(moduleId);
      
      tree.set(moduleId, moduleRef.dependencies);
      
      for (const depId of moduleRef.dependencies) {
        await this.buildDependencyTree(depId, tree, visited);
      }
    }
  
    detectCycles(tree: Map<string, Set<string>>): string[][] {
      const cycles: string[][] = [];
      const visited = new Set<string>();
      const path: string[] = [];
  
      const dfs = (moduleId: string) => {
        if (path.includes(moduleId)) {
          const cycle = path.slice(path.indexOf(moduleId));
          cycles.push([...cycle, moduleId]);
          return;
        }
  
        if (visited.has(moduleId)) {
          return;
        }
  
        visited.add(moduleId);
        path.push(moduleId);
  
        const deps = tree.get(moduleId) || new Set();
        for (const depId of deps) {
          dfs(depId);
        }
  
        path.pop();
      };
  
      for (const moduleId of tree.keys()) {
        dfs(moduleId);
      }
  
      return cycles;
    }
  }