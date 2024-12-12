// main.ts
/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.iterable" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />

import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import twindPlugin from "$fresh/plugins/twind.ts";
import twindConfig from "./twind.config.ts";
import { PermissionManager } from "./utils/permissions.ts";

async function initialize() {
  const permManager = PermissionManager.getInstance();

  try {
    // Essential permissions for Fresh
    await permManager.ensureNetworkPermissions([
      "localhost:8000",
      "api.pluso.ai"
    ]);

    // Config and static files
    await permManager.ensureFileSystemPermissions([
      "static/",
      "config/",
      "agents/prompts/"
    ]);

    // Required env variables
    await permManager.ensureEnvPermissions([
      "PLUSO_ENV",
      "PLUSO_API_KEY"
    ]);

    // Worker permissions for background tasks
    await permManager.ensureWorkerPermissions();

  } catch (error) {
    console.error("Permission initialization failed:", error);
    Deno.exit(1);
  }
}

// Initialize and start the server
await initialize();
await start(manifest, {
  plugins: [
    twindPlugin(twindConfig)
  ],
  port: 8000,
  hostname: "0.0.0.0",
  // Add secure headers
  render: (ctx, render) => {
    ctx.response.headers.set("X-Frame-Options", "DENY");
    ctx.response.headers.set("X-Content-Type-Options", "nosniff");
    ctx.response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    return render();
  }
});