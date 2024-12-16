import { defineConfig } from "$fresh/server.ts";
import tailwind from "$fresh/plugins/tailwind.ts";

// Load environment variables
await import("$std/dotenv/load.ts");

export default defineConfig({
  plugins: [
    tailwind({
      cssPath: "./static/styles.css",
      configPath: "./tailwind.config.ts",
    }),
  ],
});