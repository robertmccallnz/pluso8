import { Pool, PoolClient } from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const POOL_CONNECTIONS = 20;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;

async function createPool(): Promise<Pool> {
  const connectionString = Deno.env.get("POSTGRES_URL_NON_POOLING");
  
  if (!connectionString) {
    throw new Error("Database connection string not found in environment variables");
  }

  return new Pool(connectionString, POOL_CONNECTIONS);
}

let pool: Pool | null = null;

export const db = {
  async getConnection(): Promise<PoolClient> {
    if (!pool) {
      pool = await createPool();
    }

    let lastError: Error | null = null;
    for (let i = 0; i < MAX_RETRIES; i++) {
      try {
        return await pool.connect();
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        console.error(`Database connection attempt ${i + 1} failed:`, error);
        lastError = error;
        if (i < MAX_RETRIES - 1) {
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        }
      }
    }

    throw lastError || new Error("Failed to connect to database after multiple attempts");
  },

  async query(sql: string, params?: any[]) {
    const client = await this.getConnection();
    try {
      return await client.queryObject(sql, params);
    } finally {
      client.release();
    }
  },

  // Helper functions for common database operations
  async findOne(table: string, conditions: Record<string, any>) {
    const keys = Object.keys(conditions);
    const where = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");
    const sql = `SELECT * FROM ${table}${where ? ` WHERE ${where}` : ""} LIMIT 1`;
    const result = await this.query(sql, Object.values(conditions));
    return result.rows[0];
  },

  async findMany(table: string, conditions: Record<string, any> = {}) {
    const keys = Object.keys(conditions);
    const where = keys.map((key, i) => `${key} = $${i + 1}`).join(" AND ");
    const sql = `SELECT * FROM ${table}${where ? ` WHERE ${where}` : ""}`;
    const result = await this.query(sql, Object.values(conditions));
    return result.rows;
  },

  async insertOne(table: string, data: Record<string, any>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = values.map((_, i) => `$${i + 1}`).join(", ");
    const sql = `
      INSERT INTO ${table} (${keys.join(", ")})
      VALUES (${placeholders})
      RETURNING *
    `;
    const result = await this.query(sql, values);
    return result.rows[0];
  },

  async updateOne(table: string, id: number, data: Record<string, any>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key, i) => `${key} = $${i + 1}`).join(", ");
    const sql = `
      UPDATE ${table}
      SET ${set}
      WHERE id = $${values.length + 1}
      RETURNING *
    `;
    const result = await this.query(sql, [...values, id]);
    return result.rows[0];
  },

  async deleteOne(table: string, id: number) {
    const sql = `DELETE FROM ${table} WHERE id = $1 RETURNING *`;
    const result = await this.query(sql, [id]);
    return result.rows[0];
  }
};
