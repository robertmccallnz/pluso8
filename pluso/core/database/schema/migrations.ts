import { getClient } from './client'

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

// Example migration
const migrations: Migration[] = [
  {
    id: 1,
    name: 'initial_schema',
    up: `-- Your initial schema SQL here`,
    down: `-- Your rollback SQL here`,
  },
]

export const migrationManager = new MigrationManager()