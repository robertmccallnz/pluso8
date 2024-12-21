import { query } from "../utils/db.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";

async function runMigrations() {
  try {
    console.log("Running database migrations...");
    
    // Read and execute migration files
    const migrationPath = join(Deno.cwd(), "db", "migrations");
    const migrationFiles = Array.from(Deno.readDirSync(migrationPath))
      .filter(file => file.name.endsWith(".sql"))
      .sort((a, b) => a.name.localeCompare(b.name));

    for (const file of migrationFiles) {
      console.log(`Executing migration: ${file.name}`);
      const sql = await Deno.readTextFile(join(migrationPath, file.name));
      await query(sql);
    }

    console.log("Migrations completed successfully");
  } catch (error) {
    console.error("Error running migrations:", error);
    throw error;
  }
}

// Run migrations if this file is executed directly
if (import.meta.main) {
  await runMigrations();
}
