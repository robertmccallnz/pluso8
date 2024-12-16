import { getClient } from './client'
import { readFileSync } from "https://deno.land/std/fs/mod.ts";

interface Migration {
  id: number
  name: string
  up: string
  down: string
}

export class MigrationManager {
  private client = getClient()

  private async createMigrationsTable() {
    await this.client.from('migrations').upsert([
      {
        id: 0,
        name: 'create_migrations_table',
        executed_at: new Date().toISOString(),
      },
    ])
  }

  private async getCurrentMigration(): Promise<number> {
    const { data, error } = await this.client
      .from('migrations')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
    
    if (error) throw error
    return data?.[0]?.id ?? -1
  }

  private async executeMigration(migration: Migration, direction: 'up' | 'down') {
    const sql = direction === 'up' ? migration.up : migration.down
    
    try {
      await this.client.rpc('exec_sql', { sql })
      
      if (direction === 'up') {
        await this.client.from('migrations').insert({
          id: migration.id,
          name: migration.name,
          executed_at: new Date().toISOString(),
        })
      } else {
        await this.client
          .from('migrations')
          .delete()
          .match({ id: migration.id })
      }
    } catch (error) {
      console.error(`Migration ${migration.name} failed:`, error)
      throw error
    }
  }

  async migrateUp(targetVersion?: number) {
    await this.createMigrationsTable()
    const currentVersion = await this.getCurrentMigration()
    
    for (const migration of migrations) {
      if (migration.id > currentVersion && (!targetVersion || migration.id <= targetVersion)) {
        await this.executeMigration(migration, 'up')
      }
    }
  }

  async migrateDown(targetVersion: number) {
    const currentVersion = await this.getCurrentMigration()
    
    for (const migration of [...migrations].reverse()) {
      if (migration.id <= currentVersion && migration.id > targetVersion) {
        await this.executeMigration(migration, 'down')
      }
    }
  }
}

// Migrations list
const migrations: Migration[] = [
  {
    id: 1,
    name: 'create_metrics_tables',
    up: `
      -- Agent Metrics Table
      CREATE TABLE IF NOT EXISTS agent_metrics (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_id TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        
        -- Conversation Metrics
        total_conversations INTEGER DEFAULT 0,
        active_conversations INTEGER DEFAULT 0,
        completed_conversations INTEGER DEFAULT 0,
        avg_response_time FLOAT DEFAULT 0,
        min_response_time FLOAT DEFAULT NULL,
        max_response_time FLOAT DEFAULT NULL,
        
        -- Performance Metrics
        memory_usage BIGINT DEFAULT 0,
        cpu_usage FLOAT DEFAULT 0,
        latency FLOAT DEFAULT 0,
        error_rate FLOAT DEFAULT 0,
        success_rate FLOAT DEFAULT 100,
        
        -- Knowledge Metrics
        total_tokens BIGINT DEFAULT 0,
        unique_topics INTEGER DEFAULT 0,
        context_size INTEGER DEFAULT 0,
        embedding_count INTEGER DEFAULT 0,
        
        -- Interaction Metrics
        user_satisfaction FLOAT DEFAULT 0,
        clarification_requests INTEGER DEFAULT 0,
        accuracy_score FLOAT DEFAULT 0,
        engagement_level FLOAT DEFAULT 0,
        
        -- Metadata
        metadata JSONB DEFAULT '{}'::jsonb,
        
        -- Indexes
        CONSTRAINT agent_metrics_agent_id_timestamp_idx UNIQUE (agent_id, timestamp)
      );
      
      CREATE INDEX IF NOT EXISTS agent_metrics_timestamp_idx ON agent_metrics (timestamp);
      CREATE INDEX IF NOT EXISTS agent_metrics_agent_id_idx ON agent_metrics (agent_id);
      
      -- Agent Error Logs
      CREATE TABLE IF NOT EXISTS agent_error_logs (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_id TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        error_type TEXT NOT NULL,
        error_message TEXT NOT NULL,
        stack_trace TEXT,
        metadata JSONB DEFAULT '{}'::jsonb
      );
      
      CREATE INDEX IF NOT EXISTS agent_error_logs_timestamp_idx ON agent_error_logs (timestamp);
      CREATE INDEX IF NOT EXISTS agent_error_logs_agent_id_idx ON agent_error_logs (agent_id);
      
      -- Agent Performance Snapshots
      CREATE TABLE IF NOT EXISTS agent_performance_snapshots (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        agent_id TEXT NOT NULL,
        timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        interval TEXT NOT NULL, -- '1m', '5m', '1h', '1d'
        
        -- Aggregated Metrics
        avg_response_time FLOAT DEFAULT 0,
        p50_response_time FLOAT DEFAULT 0,
        p95_response_time FLOAT DEFAULT 0,
        p99_response_time FLOAT DEFAULT 0,
        total_requests INTEGER DEFAULT 0,
        error_count INTEGER DEFAULT 0,
        success_rate FLOAT DEFAULT 100,
        avg_memory_usage BIGINT DEFAULT 0,
        peak_memory_usage BIGINT DEFAULT 0,
        total_tokens_used BIGINT DEFAULT 0,
        unique_users INTEGER DEFAULT 0,
        
        -- Cost and Resource Usage
        compute_cost FLOAT DEFAULT 0,
        token_cost FLOAT DEFAULT 0,
        storage_used BIGINT DEFAULT 0,
        bandwidth_used BIGINT DEFAULT 0,
        
        CONSTRAINT agent_performance_snapshots_interval_idx UNIQUE (agent_id, interval, timestamp)
      );
      
      CREATE INDEX IF NOT EXISTS agent_performance_snapshots_timestamp_idx 
        ON agent_performance_snapshots (timestamp);
      CREATE INDEX IF NOT EXISTS agent_performance_snapshots_agent_interval_idx 
        ON agent_performance_snapshots (agent_id, interval);
    `,
    down: `
      DROP TABLE IF EXISTS agent_performance_snapshots;
      DROP TABLE IF EXISTS agent_error_logs;
      DROP TABLE IF EXISTS agent_metrics;
    `
  },
  {
    id: 2,
    name: 'initial_schema',
    up: readFileSync('./schema/init.sql', 'utf-8'),
    down: 'DROP SCHEMA public CASCADE; CREATE SCHEMA public;',
  },
  {
    id: 3,
    name: 'add_triggers',
    up: readFileSync('./schema/triggers.sql', 'utf-8'),
    down: `
      DROP TRIGGER IF EXISTS update_agents_updated_at ON agents;
      DROP TRIGGER IF EXISTS update_legal_cases_updated_at ON legal_cases;
      DROP TRIGGER IF EXISTS archive_conversations ON conversations;
      DROP TRIGGER IF EXISTS check_document_size ON documents;
      DROP TRIGGER IF EXISTS sanitize_messages ON messages;
      DROP TRIGGER IF EXISTS audit_agents_changes ON agents;
      DROP TRIGGER IF EXISTS audit_conversations_changes ON conversations;
      DROP TRIGGER IF EXISTS audit_legal_cases_changes ON legal_cases;
      DROP FUNCTION IF EXISTS update_updated_at_column;
      DROP FUNCTION IF EXISTS archive_old_conversations;
      DROP FUNCTION IF EXISTS validate_document_size;
      DROP FUNCTION IF EXISTS sanitize_message_content;
      DROP FUNCTION IF EXISTS log_changes;
      DROP TABLE IF EXISTS audit_logs;
    `,
  },
  {
    id: 4,
    name: 'add_metrics_tables',
    up: readFileSync('./schema/metrics.sql', 'utf-8'),
    down: `
      DROP TABLE IF EXISTS agent_metrics_hourly;
      DROP TABLE IF EXISTS agent_metrics;
      DROP FUNCTION IF EXISTS aggregate_old_metrics;
    `,
  },
]

export const migrationManager = new MigrationManager()