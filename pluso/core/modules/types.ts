// core/module/types.ts
export interface ModuleConfig {
    name: string;
    version: string;
    dependencies: Record<string, string>;
    devDependencies?: Record<string, string>;
    entry: string;
    permissions: string[];
  }
  
  export interface ModuleRef {
    id: string;
    config: ModuleConfig;
    instance: any;
    dependencies: Set<string>;
    dependents: Set<string>;
    state: 'loading' | 'ready' | 'error';
    error?: Error;
  }