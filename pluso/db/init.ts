import { query } from "../utils/db.ts";

async function initDb() {
  try {
    console.log("Initializing database...");
    
    // Read and execute schema
    const schema = await Deno.readTextFile("./db/schema.sql");
    await query(schema);
    console.log("Schema created successfully");

    // Insert admin user
    const adminResult = await query(`
      INSERT INTO users (name, email, role, avatar_url)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET
        name = EXCLUDED.name,
        role = EXCLUDED.role,
        avatar_url = EXCLUDED.avatar_url
      RETURNING id
    `, [
      "Admin User",
      "admin@example.com",
      "admin",
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
    ]);

    const adminId = adminResult.rows[0].id;

    // Insert AI agents
    const agents = [
      {
        name: "Maia",
        description: "A friendly and knowledgeable AI assistant focused on helping with general tasks.",
        model: "gpt-4",
        system_prompt: "You are Maia, a helpful and friendly AI assistant. You excel at understanding context and providing clear, concise responses."
      },
      {
        name: "Jeff",
        description: "A specialized AI assistant for technical programming tasks and debugging.",
        model: "gpt-4",
        system_prompt: "You are Jeff, a technical AI assistant specializing in programming, debugging, and software development. You provide detailed technical solutions and code examples."
      },
      {
        name: "Petunia",
        description: "A creative AI assistant for brainstorming and content creation.",
        model: "gpt-4",
        system_prompt: "You are Petunia, a creative AI assistant focused on brainstorming, content creation, and innovative problem-solving. You think outside the box and encourage creative solutions."
      }
    ];

    for (const agent of agents) {
      await query(`
        INSERT INTO agents (name, description, model, system_prompt, created_by)
        VALUES ($1, $2, $3, $4, $5)
        ON CONFLICT (name) DO UPDATE SET
          description = EXCLUDED.description,
          model = EXCLUDED.model,
          system_prompt = EXCLUDED.system_prompt
      `, [
        agent.name,
        agent.description,
        agent.model,
        agent.system_prompt,
        adminId
      ]);
    }

    console.log("Sample data inserted successfully");
    
  } catch (error) {
    console.error("Error initializing database:", error);
    throw error;
  }
}

// Run initialization
if (import.meta.main) {
  await initDb();
  Deno.exit(0);
}
