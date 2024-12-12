// pluso/core/v8/isolate.ts
interface IsolateOptions {
    memoryLimit?: number;  // in MB
    timeoutMs?: number;
    namespace?: string;
  }
  
  export class V8Isolate {
    private context: any;  // Deno.Context
    private memoryLimit: number;
    private namespace: string;
  
    constructor(options: IsolateOptions = {}) {
      this.memoryLimit = options.memoryLimit ?? 128;  // Default 128MB
      this.namespace = options.namespace ?? crypto.randomUUID();
      this.initializeContext();
    }
  
    private async initializeContext() {
      const contextOptions = {
        name: this.namespace,
        memoryLimit: this.memoryLimit * 1024 * 1024, // Convert to bytes
        snapshots: {
          enabled: true,
          path: `./cache/snapshots/${this.namespace}`
        }
      };
  
      // Create isolated context
      this.context = await Deno.createContext(contextOptions);
    }
  
    async evaluate<T>(code: string, timeout?: number): Promise<T> {
      const timeoutMs = timeout ?? 5000;  // Default 5s timeout
      
      try {
        return await Promise.race([
          this.context.eval(code),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Execution timeout')), timeoutMs)
          )
        ]);
      } catch (error) {
        throw new Error(`Isolate execution error: ${error.message}`);
      }
    }
  
    async dispose(): Promise<void> {
      await this.context.dispose();
    }
  }