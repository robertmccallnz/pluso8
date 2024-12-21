import { load } from "https://deno.land/std@0.211.0/dotenv/mod.ts";

// Load environment variables
try {
  const env = await load({
    envPath: "./.env",
    export: true,
    allowEmptyValues: true,
  });
  
  // Explicitly set all variables to Deno.env
  for (const [key, value] of Object.entries(env)) {
    if (value) {
      await Deno.env.set(key, value);
    }
  }
  
  console.log("✅ Environment variables loaded:", Object.keys(env).length);
} catch (error) {
  console.error("❌ Error loading environment variables:", error);
}
