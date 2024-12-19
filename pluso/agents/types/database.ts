export interface DatabaseConfig {
  // Connection settings
  maxConnections?: number;
  connectionTimeout?: number;
  idleTimeout?: number;

  // Security settings
  allowedOperations?: string[];
  allowedTables?: string[];
  maxQueryTimeout?: number;
  
  // Query limits
  maxRowsPerQuery?: number;
  maxConcurrentQueries?: number;
  
  // Monitoring
  enableMetrics?: boolean;
  enableLogging?: boolean;
  
  // Caching
  enableResultCache?: boolean;
  cacheDuration?: number;
}

export interface DatabaseMetrics {
  totalQueries: number;
  successfulQueries: number;
  failedQueries: number;
  averageResponseTime: number;
  activeConnections: number;
  lastError?: {
    message: string;
    timestamp: string;
    query?: string;
  };
}

export interface DatabaseQueryResult {
  success: boolean;
  rows?: any[];
  rowCount?: number;
  error?: string;
  executionTime?: number;
}
