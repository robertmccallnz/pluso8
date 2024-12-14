// tools/restructure.ts

import { walk } from "https://deno.land/std/fs/walk.ts";
import { relative, resolve, dirname, join } from "https://deno.land/std/path/mod.ts";

interface PathUpdate {
  from: string;
  to: string;
}

const fileUpdates: PathUpdate[] = [
  // Core Runtime & V8
  { from: "core/runtime.ts", to: "core/runtime/engine.ts" },
  { from: "core/v8/agent-isolate.ts", to: "core/runtime/isolates/agent.ts" },
  { from: "core/v8/isolate.ts", to: "core/runtime/isolates/base.ts" },
  { from: "core/v8/module-cache.ts", to: "core/runtime/cache/module.ts" },
  { from: "core/v8/optimizer.ts", to: "core/runtime/optimizers/v8.ts" },

  // Memory & Buffer Management
  { from: "core/pressure/memory-manager.ts", to: "core/memory/manager.ts" },
  // Removed buffer-pool.ts as it doesn't exist
  { from: "core/tokio/stream-optimizer.ts", to: "core/memory/stream.ts" },

  // Worker System
  { from: "core/workers/chat-agent-worker.ts", to: "core/workers/agents/chat.ts" },
  { from: "core/workers/task-worker.ts", to: "core/workers/tasks/base.ts" },
  { from: "core/workers/worker-pool.ts", to: "core/workers/pool/manager.ts" },
  { from: "core/workers/error-handler.ts", to: "core/workers/errors/handler.ts" },

  // Module System
  { from: "core/module/dependency-resolver.ts", to: "core/modules/resolver.ts" },
  { from: "core/module/loader.ts", to: "core/modules/loader.ts" },
  { from: "core/module/module-manager.ts", to: "core/modules/manager.ts" },
  { from: "core/module/registry.ts", to: "core/modules/registry.ts" },
  { from: "core/module/types.ts", to: "core/modules/types.ts" },
  { from: "core/module/upgrader.ts", to: "core/modules/upgrader.ts" },
  { from: "core/module/version.ts", to: "core/modules/version.ts" },

  // Metrics & Performance
  { from: "core/metrics/performance-monitor.ts", to: "core/monitoring/performance.ts" },
  { from: "core/metrics/transpile-metrics.ts", to: "core/monitoring/transpiler.ts" },

  // Agent System
  { from: "core/agents/communications.ts", to: "core/agents/communication/manager.ts" },
  { from: "core/api/agent-chat.ts", to: "core/agents/communication/chat.ts" },
  { from: "core/api/agents.ts", to: "core/agents/management/controller.ts" },

  // API & Routes
  { from: "core/api/handlers.ts", to: "core/http/handlers/base.ts" },
  { from: "core/api/router.ts", to: "core/http/router/main.ts" },

  // Models & Providers
  { from: "models/providers/anthropic.ts", to: "core/providers/anthropic/client.ts" },
  { from: "models/providers/openai.ts", to: "core/providers/openai/client.ts" },
  { from: "models/providers/base.ts", to: "core/providers/base/client.ts" },

  // Routes
  { from: "routes/api/agent-chat.ts", to: "routes/api/agents/chat.ts" },
  { from: "routes/api/agents.ts", to: "routes/api/agents/management.ts" },
  { from: "routes/api/joke.ts", to: "routes/api/debug/joke.ts" },

  // Islands
  { from: "islands/ChatAgent.ts", to: "islands/agents/Chat.tsx" },
  { from: "islands/ChatInterface.tsx", to: "islands/interfaces/Chat.tsx" },
  { from: "islands/WidgetInterface.tsx", to: "islands/interfaces/Widget.tsx" },
  
  // Tools - Handle directories properly
  { from: "tools/kupu-scraper", to: "tools/scrapers/kupu" },
  { from: "tools/te-reo-assistant.ts", to: "tools/assistants/te-reo" },
  { from: "tools/web-forge", to: "tools/generators/web" }
];

async function fileExists(path: string): Promise<boolean> {
  try {
    await Deno.stat(path);
    return true;
  } catch {
    return false;
  }
}

async function isDirectory(path: string): Promise<boolean> {
  try {
    const stat = await Deno.stat(path);
    return stat.isDirectory;
  } catch {
    return false;
  }
}

async function moveFileOrDirectory(from: string, to: string) {
  try {
    // Check if source exists
    if (!await fileExists(from)) {
      console.log(`Skipping: ${from} (source doesn't exist)`);
      return;
    }

    // Create target directory
    await Deno.mkdir(dirname(to), { recursive: true });

    // Check if it's a directory
    if (await isDirectory(from)) {
      // For directories, we need to move all contents
      const entries = walk(from, { includeFiles: true, includeDirs: true });
      for await (const entry of entries) {
        const relativePath = relative(from, entry.path);
        const targetPath = join(to, relativePath);
        
        if (entry.isFile) {
          await Deno.mkdir(dirname(targetPath), { recursive: true });
          await Deno.rename(entry.path, targetPath);
        }
      }
      // Remove original directory after moving contents
      await Deno.remove(from, { recursive: true });
    } else {
      // For files, simple rename
      await Deno.rename(from, to);
    }
    
    console.log(`Moved: ${from} -> ${to}`);
  } catch (error) {
    console.error(`Error moving ${from}:`, error.message);
  }
}

async function updateImportPaths(updates: PathUpdate[]) {
  for await (const entry of walk(".", {
    exts: [".ts", ".tsx"],
    skip: [/node_modules/, /\.git/, /\.deno/]
  })) {
    // Skip if entry is a directory
    if (await isDirectory(entry.path)) continue;

    try {
      let content = await Deno.readTextFile(entry.path);
      let updated = false;

      for (const update of updates) {
        const oldImport = update.from.replace(/\.ts$/, "");
        const newImport = update.to.replace(/\.ts$/, "");
        
        const importRegex = new RegExp(
          `from ["'](\\.{1,2}/)*${oldImport}["']`,
          "g"
        );

        if (importRegex.test(content)) {
          const relativeNew = relative(
            dirname(entry.path),
            resolve(Deno.cwd(), newImport)
          );
          
          content = content.replace(
            importRegex,
            `from "${relativeNew.startsWith(".") ? relativeNew : "./" + relativeNew}"`
          );
          updated = true;
        }
      }

      if (updated) {
        await Deno.writeTextFile(entry.path, content);
        console.log(`Updated imports in: ${entry.path}`);
      }
    } catch (error) {
      console.error(`Error processing ${entry.path}:`, error.message);
    }
  }
}

async function updateFreshManifest() {
  try {
    const command = new Deno.Command("deno", {
      args: ["task", "manifest"],
      stdout: "piped",
      stderr: "piped",
    });

    const { code, stderr } = await command.output();
    
    if (code === 0) {
      console.log("Successfully updated fresh.gen.ts");
    } else {
      console.error("Error updating fresh.gen.ts:", new TextDecoder().decode(stderr));
    }
  } catch (error) {
    console.error("Failed to update Fresh manifest:", error.message);
  }
}

async function restructureProject() {
  console.log("Starting project restructure...");
  
  // First move all files/directories
  for (const update of fileUpdates) {
    await moveFileOrDirectory(update.from, update.to);
  }

  // Then update all import paths
  console.log("\nUpdating import paths...");
  await updateImportPaths(fileUpdates);
  
  // Finally regenerate Fresh manifest
  console.log("\nUpdating Fresh manifest...");
  await updateFreshManifest();
  
  console.log("\nProject restructure complete!");
}

// Run the restructure
if (import.meta.main) {
  await restructureProject();
}