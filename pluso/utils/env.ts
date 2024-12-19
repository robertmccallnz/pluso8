import { z } from "zod";
import { load } from "https://deno.land/std@0.211.0/dotenv/mod.ts";
import { join } from "https://deno.land/std@0.211.0/path/mod.ts";

const envSchema = z.object({
  // AI Services
  OPENAI_API_KEY: z.string().min(1),
  ANTHROPIC_API_KEY: z.string().min(1),
  HUGGINGFACE_API_KEY: z.string().min(1),
  TOGETHER_API_KEY: z.string().min(1),
  
  // Database & Infrastructure
  SUPABASE_URL: z.string().url(),
  SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  
  // Email & Payments
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_SECRET: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  
  // Search & Other Services
  SERPER_API_KEY: z.string().min(1),
  
  // App Configuration
  APP_URL: z.string().url().default("http://localhost:8000"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export async function loadEnvConfig() {
  try {
    // Load .env file
    const envPath = "./.env";
    console.log('🔄 Loading .env from:', new URL(envPath, import.meta.url).pathname);
    
    const loadedEnv = await load({
      envPath,
      export: true,
      allowEmptyValues: true,
    });

    console.log('📝 Loaded variables:', Object.keys(loadedEnv).length);
    
    // Debug TOGETHER_API_KEY specifically
    console.log('🔑 TOGETHER_API_KEY:', {
      inLoadedEnv: "TOGETHER_API_KEY" in loadedEnv,
      valueLength: loadedEnv["TOGETHER_API_KEY"]?.length ?? 0,
      rawValue: loadedEnv["TOGETHER_API_KEY"]?.substring(0, 5) + "..."
    });

    // Combine loaded env with Deno.env
    const combinedEnv = {
      // AI Services
      OPENAI_API_KEY: loadedEnv["OPENAI_API_KEY"] || Deno.env.get("OPENAI_API_KEY"),
      ANTHROPIC_API_KEY: loadedEnv["ANTHROPIC_API_KEY"] || Deno.env.get("ANTHROPIC_API_KEY"),
      HUGGINGFACE_API_KEY: loadedEnv["HUGGINGFACE_API_KEY"] || Deno.env.get("HUGGINGFACE_API_KEY"),
      TOGETHER_API_KEY: loadedEnv["TOGETHER_API_KEY"] || Deno.env.get("TOGETHER_API_KEY"),
      
      // Database & Infrastructure
      SUPABASE_URL: loadedEnv["SUPABASE_URL"] || Deno.env.get("SUPABASE_URL"),
      SUPABASE_ANON_KEY: loadedEnv["SUPABASE_ANON_KEY"] || Deno.env.get("SUPABASE_ANON_KEY"),
      SUPABASE_SERVICE_ROLE_KEY: loadedEnv["SUPABASE_SERVICE_ROLE_KEY"] || Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      
      // Email & Payments
      STRIPE_SECRET_KEY: loadedEnv["STRIPE_SECRET_KEY"] || Deno.env.get("STRIPE_SECRET_KEY"),
      STRIPE_WEBHOOK_SECRET: loadedEnv["STRIPE_WEBHOOK_SECRET"] || Deno.env.get("STRIPE_WEBHOOK_SECRET"),
      STRIPE_PRICE_ID: loadedEnv["STRIPE_PRICE_ID"] || Deno.env.get("STRIPE_PRICE_ID"),
      RESEND_API_KEY: loadedEnv["RESEND_API_KEY"] || Deno.env.get("RESEND_API_KEY"),
      
      // Search & Other Services
      SERPER_API_KEY: loadedEnv["SERPER_API_KEY"] || Deno.env.get("SERPER_API_KEY"),
      
      // App Configuration
      APP_URL: loadedEnv["APP_URL"] || Deno.env.get("APP_URL"),
      NODE_ENV: loadedEnv["NODE_ENV"] || Deno.env.get("NODE_ENV"),
    };

    // Debug combined env
    console.log('🔄 TOGETHER_API_KEY in combinedEnv:', {
      exists: "TOGETHER_API_KEY" in combinedEnv,
      valueLength: combinedEnv["TOGETHER_API_KEY"]?.length ?? 0
    });

    const config = envSchema.parse(combinedEnv);
    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:", JSON.stringify(error.errors, null, 2));
    } else {
      console.error("❌ Error loading environment variables:", error);
    }
    throw error; // Let's throw instead of exit so Fresh can handle it
  }
}

// Export a singleton instance
export const env = await loadEnvConfig();