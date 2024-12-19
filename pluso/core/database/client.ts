import { createClient } from "../../deps.ts";
import { load } from "https://deno.land/std@0.211.0/dotenv/mod.ts";
import { join } from "https://deno.land/std@0.211.0/path/mod.ts";

// Load environment variables from .env file
const loadEnv = async () => {
  try {
    const currentDir = new URL('.', import.meta.url).pathname;
    const envPath = join(currentDir, '../../.env');
    console.log('Loading .env from:', envPath);
    const config = await load({
      envPath,
      export: true,
    });
    console.log('Loaded environment variables:', Object.keys(config));
    return config;
  } catch (error) {
    console.error('Error loading .env file:', error);
    return {};
  }
};

const env = await loadEnv();

// Try to get environment variables from different sources
const getEnvVar = (key: string, altKeys: string[] = []): string => {
  for (const k of [key, ...altKeys]) {
    const value = env[k] || Deno.env.get(k);
    if (value) return value;
  }
  throw new Error(`Missing environment variable: ${key} (or alternates: ${altKeys.join(', ')})`);
};

const supabaseUrl = getEnvVar("SUPABASE_URL", ["NEXT_PUBLIC_SUPABASE_URL"]);
const supabaseAnonKey = getEnvVar("SUPABASE_ANON_KEY", ["NEXT_PUBLIC_SUPABASE_ANON_KEY"]);
const supabaseServiceKey = getEnvVar("SUPABASE_SERVICE_ROLE_KEY");

// Create anonymous client for public access
export const supabaseAnon = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: false
    }
  }
);

// Create admin client for privileged access
export const supabaseAdmin = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false
    }
  }
);

// Default export for general use
export default supabaseAnon;
