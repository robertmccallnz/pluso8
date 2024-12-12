import { z } from "zod";

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

export function loadEnvConfig() {
  try {
    const config = envSchema.parse({
      // AI Services
      OPENAI_API_KEY: Deno.env.get("OPENAI_API_KEY"),
      ANTHROPIC_API_KEY: Deno.env.get("ANTHROPIC_API_KEY"),
      HUGGINGFACE_API_KEY: Deno.env.get("HUGGINGFACE_API_KEY"),
      TOGETHER_API_KEY: Deno.env.get("TOGETHER_API_KEY"),
      
      // Database & Infrastructure
      SUPABASE_URL: Deno.env.get("SUPABASE_URL"),
      SUPABASE_ANON_KEY: Deno.env.get("SUPABASE_ANON_KEY"),
      SUPABASE_SERVICE_ROLE_KEY: Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
      
      // Email & Payments
      STRIPE_SECRET_KEY: Deno.env.get("STRIPE_SECRET_KEY"),
      STRIPE_WEBHOOK_SECRET: Deno.env.get("STRIPE_WEBHOOK_SECRET"),
      STRIPE_PRICE_ID: Deno.env.get("STRIPE_PRICE_ID"),
      RESEND_API_KEY: Deno.env.get("RESEND_API_KEY"),
      
      // Search & Other Services
      SERPER_API_KEY: Deno.env.get("SERPER_API_KEY"),
      
      // App Configuration
      APP_URL: Deno.env.get("APP_URL"),
      NODE_ENV: Deno.env.get("NODE_ENV"),
    });

    return config;
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Invalid environment variables:", JSON.stringify(error.errors, null, 2));
    } else {
      console.error("❌ Error loading environment variables:", error);
    }
    Deno.exit(1);
  }
}

// Export a singleton instance
export const env = loadEnvConfig();