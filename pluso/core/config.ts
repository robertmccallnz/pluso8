// pluso/core/config.ts
export class Configuration {
    private env: Record<string, string>;
  
    constructor() {
      this.env = {
        PLUSO_API_KEY: Deno.env.get("PLUSO_API_KEY") ?? "",
        PLUSO_ENV: Deno.env.get("PLUSO_ENV") ?? "development",
      };
    }
  }
  