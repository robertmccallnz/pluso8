import { query } from "../utils/db.ts";

async function checkAgents() {
  const result = await query('SELECT id, name, description FROM agents ORDER BY id');
  console.log("\nAgent IDs and Names:");
  console.log("------------------");
  for (const row of result.rows) {
    console.log(`ID: ${row.id}, Name: ${row.name}`);
  }
}

if (import.meta.main) {
  await checkAgents();
  Deno.exit(0);
}
