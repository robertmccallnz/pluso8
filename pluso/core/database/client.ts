import { createClient } from "https://cdn.skypack.dev/@supabase/supabase-js@2.39.1";
import { loadEnvConfig } from "https://deno.land/std@0.177.0/dotenv/mod.ts";

let client: ReturnType<typeof createClient>;

export function getClient() {
  if (!client) {
    const config = loadEnvConfig();
    client = createClient(
      config.SUPABASE_URL,
      config.SUPABASE_ANON_KEY,
      {
        auth: {
          persistSession: false
        }
      }
    );
  }
  return client;
}
