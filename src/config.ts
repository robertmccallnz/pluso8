// src/config.ts
import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";

export async function loadEnvironment() {
  try {
    // Load .env file
    const env = await load({
      export: true,
      allowEmptyValues: true
    });

    // Verify critical environment variables
    const requiredVars = ['OPENAI_API_KEY'];
    const missingVars = requiredVars.filter(varName => !Deno.env.get(varName));
    
    if (missingVars.length > 0) {
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
    }

    return env;
  } catch (error) {
    if (error instanceof Deno.errors.PermissionDenied) {
      throw new Error(
        "Permission denied. Run with --allow-read and --allow-env flags:\n" +
        "deno run --allow-read --allow-env main.ts"
      );
    }
    throw error;
  }
}