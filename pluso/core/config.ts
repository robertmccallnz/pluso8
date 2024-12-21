// pluso/core/config.ts
import { getEnv } from "../utils/env.ts";

export const config = {
  env: await getEnv(),
  isDevelopment: Deno.env.get("DENO_ENV") === "development",
  isProduction: Deno.env.get("DENO_ENV") === "production",
  isTest: Deno.env.get("DENO_ENV") === "test",
};

export default config;