/ dev.ts
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

// Development-specific initialization
async function initializeDev() {
  const permManager = PermissionManager.getInstance();

  try {
    // Development permissions (more permissive)
    await permManager.ensureNetworkPermissions([
      "localhost:8000",
      "localhost:9000", // Dev API
      "api.pluso.ai",
      "deno.land" // For development resources
    ]);

    // Broader file system access for development
    await permManager.ensureFileSystemPermissions([
      "./",  // Allow access to project root
      "static/",
      "config/",
      "agents/prompts/",
      "logs/"
    ]);

    // Development environment variables
    await permManager.ensureEnvPermissions([
      "PLUSO_ENV",
      "PLUSO_API_KEY",
      "PLUSO_DEV_MODE",
      "PLUSO_DEBUG_LEVEL"
    ]);

    await permManager.ensureWorkerPermissions();

  } catch (error) {
    console.error("Development permission initialization failed:", error);
    Deno.exit(1);
  }
}

if (import.meta.main) {
  // Enable development logging
  await initializeDev();
  
  await start(manifest, {
    plugins: [
      twindPlugin(twindConfig)
    ],
    port: 8000,
    // Development-specific options
    debug: true,
    hmr: {
      enabled: true,
      port: 8001
    }
  });
}