// pluso/core/config.ts
export class Configuration {
  private env: Record<string, string>;

  constructor() {
    this.env = {
      PLUSO_API_KEY: Deno.env.get("PLUSO_API_KEY") ?? "",
      PLUSO_ENV: Deno.env.get("PLUSO_ENV") ?? "development",
      NEXT_PUBLIC_SUPABASE_URL: "https://qwfmkyvqcqbsxjidkaoj.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3Zm1reXZxY3Fic3hqaWRrYW9qIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNDIzMDgxNCwiZXhwIjoyMDQ5ODA2ODE0fQ.4oGHmS7FE89y-lkaqIeHbb_RC7gb9oxLLFhZw39DUMs",
    };
  }

  get(key: string): string {
    return this.env[key] ?? "";
  }
}

export const config = new Configuration();