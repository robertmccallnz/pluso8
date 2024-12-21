// Mock database for testing
class MockDB {
  private tables: Map<string, any[]>;

  constructor() {
    this.tables = new Map();
    this.initializeTables();
  }

  private initializeTables() {
    // Initialize tables with empty arrays
    this.tables.set("allowed_domains", []);
    this.tables.set("verified_resources", []);
    this.tables.set("model_registry", []);
    this.tables.set("enhancements", []);
    this.tables.set("download_failures", []);
    this.tables.set("verification_failures", []);
    this.tables.set("security_threats", []);
    this.tables.set("security_patterns", []);
    this.tables.set("risk_factors", []);
  }

  async query(sql: string, params?: any[]) {
    // Simple mock implementation that returns empty results
    return {
      rows: [],
      rowCount: 0
    };
  }

  async queryObject(sql: string, params?: any[]) {
    return await this.query(sql, params);
  }
}

export const mockDb = new MockDB();

// Mock the database module
export function mockDatabase() {
  const originalDb = require("../../utils/db.ts");
  originalDb.query = mockDb.query.bind(mockDb);
  return mockDb;
}
