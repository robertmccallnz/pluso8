import { AgentConfig } from "../types/agent.ts";
import { DatabaseConfig } from "../types/database.ts";

export interface DatabaseCredentials {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl?: boolean;
}

export class DatabaseConnectorService {
  private static instance: DatabaseConnectorService;
  private connections: Map<string, any> = new Map();
  
  private constructor() {}
  
  static getInstance(): DatabaseConnectorService {
    if (!this.instance) {
      this.instance = new DatabaseConnectorService();
    }
    return this.instance;
  }

  async connectDatabase(
    agentId: string,
    credentials: DatabaseCredentials,
    config: DatabaseConfig
  ): Promise<boolean> {
    try {
      // Validate credentials and configuration
      this.validateConfig(credentials, config);
      
      // Create encrypted connection string
      const connectionString = this.createEncryptedConnectionString(credentials);
      
      // Initialize metrics database connection if not exists
      if (config.type === 'metrics' && !this.connections.has('metrics')) {
        await this.initializeMetricsConnection(credentials);
      }
      
      // Store connection with agent ID
      this.connections.set(agentId, {
        connectionString,
        config,
        lastAccessed: new Date(),
        status: 'connected'
      });
      
      return true;
    } catch (error) {
      console.error(`Database connection error for agent ${agentId}:`, error);
      throw new Error(`Failed to connect database: ${error.message}`);
    }
  }

  async executeQuery(
    agentId: string,
    query: string,
    params: any[] = []
  ): Promise<any> {
    const connection = this.connections.get(agentId);
    if (!connection) {
      throw new Error('Database not connected for this agent');
    }

    try {
      // Execute query with safety checks
      return await this.executeSafeQuery(connection, query, params);
    } catch (error) {
      console.error(`Query execution error for agent ${agentId}:`, error);
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }

  private validateConfig(
    credentials: DatabaseCredentials,
    config: DatabaseConfig
  ): void {
    // Validate required fields
    if (!credentials.host || !credentials.database || !credentials.username) {
      throw new Error('Missing required database credentials');
    }

    // Validate security settings
    if (config.allowedOperations) {
      const validOperations = ['SELECT', 'INSERT', 'UPDATE', 'DELETE'];
      const invalidOps = config.allowedOperations.filter(
        op => !validOperations.includes(op.toUpperCase())
      );
      if (invalidOps.length > 0) {
        throw new Error(`Invalid operations specified: ${invalidOps.join(', ')}`);
      }
    }

    // Validate connection limits
    if (config.maxConnections && config.maxConnections > 10) {
      throw new Error('Maximum connections cannot exceed 10');
    }
  }

  private createEncryptedConnectionString(
    credentials: DatabaseCredentials
  ): string {
    // Implement secure connection string creation
    // This should include encryption of sensitive data
    return `postgresql://${credentials.username}:${credentials.password}@${credentials.host}:${credentials.port}/${credentials.database}`;
  }

  private async executeSafeQuery(
    connection: any,
    query: string,
    params: any[]
  ): Promise<any> {
    // Implement query safety checks
    const uppercaseQuery = query.toUpperCase().trim();
    
    // Prevent dangerous operations
    if (uppercaseQuery.includes('DROP') || 
        uppercaseQuery.includes('TRUNCATE') ||
        uppercaseQuery.includes('ALTER')) {
      throw new Error('Operation not allowed');
    }

    // Add query logging for security
    console.log(`Executing query for connection ${connection.id}`);
    
    // Execute query with timeout
    const timeout = setTimeout(() => {
      throw new Error('Query timeout exceeded');
    }, 5000);

    try {
      // Actual query execution would go here
      // Return mock response for now
      return { success: true, rows: [] };
    } finally {
      clearTimeout(timeout);
    }
  }

  private async initializeMetricsConnection(credentials: DatabaseCredentials): Promise<void> {
    try {
      const metricsConfig = {
        type: 'metrics',
        poolSize: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000
      };
      
      // Create metrics connection pool
      const pool = await this.createConnectionPool(credentials, metricsConfig);
      
      // Initialize metrics tables if they don't exist
      await pool.query(`
        DO $$ 
        BEGIN
          IF NOT EXISTS (SELECT FROM pg_tables WHERE tablename = 'agent_metrics') THEN
            \i ${process.cwd()}/core/database/schema/metrics.sql
          END IF;
        END $$;
      `);
      
      this.connections.set('metrics', {
        pool,
        config: metricsConfig,
        lastAccessed: new Date(),
        status: 'connected'
      });
    } catch (error) {
      console.error('Failed to initialize metrics connection:', error);
      throw error;
    }
  }

  async disconnect(agentId: string): Promise<void> {
    const connection = this.connections.get(agentId);
    if (connection) {
      // Clean up connection
      this.connections.delete(agentId);
    }
  }

  private async createConnectionPool(credentials: DatabaseCredentials, config: DatabaseConfig): Promise<any> {
    // Implement connection pool creation
    // This should include handling of pool size, idle timeout, and connection timeout
    // For now, return a mock pool object
    return {
      query: async (query: string) => {
        // Mock query execution
        return { success: true, rows: [] };
      }
    };
  }
}
