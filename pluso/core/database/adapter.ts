// core/database/adapter.ts
export interface VectorDBAdapter {
    store(embedding: number[], metadata: Record<string, unknown>): Promise<void>;
    search(query: number[], limit: number): Promise<SearchResult[]>;
  }
  
  export class SupabaseVectorAdapter implements VectorDBAdapter {
    constructor(private config: AgentConfig['database']) {
      if (config?.type !== 'supabase') {
        throw new Error('Invalid database configuration');
      }
    }
    // Implementation...
  }
  