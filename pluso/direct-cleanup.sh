// cleanup.ts
import { ensureDir, move, walk } from "https://deno.land/std/fs/mod.ts";
import { join, basename } from "https://deno.land/std/path/mod.ts";

async function cleanup() {
  console.log("Starting cleanup...");

  // Create core directory structure
  const dirs = [
    "core/agents",
    "core/services",
    "core/types",
    "core/utils",
    "core/routing",
    "core/state",
    "routes/api",
    "routes/pages",
    "ui/components",
    "ui/islands"
  ];

  for (const dir of dirs) {
    await ensureDir(dir);
    console.log(`Created directory: ${dir}`);
  }

  // Find and move files
  for await (const entry of walk(".", {
    includeDirs: false,
    exts: ["ts", "tsx"],
    skip: [/node_modules/, /\.git/],
  })) {
    const filename = basename(entry.path);
    let targetDir = "";

    // Determine target directory based on file patterns
    if (entry.path.includes("/types/")) {
      targetDir = "core/types";
    } else if (entry.path.includes("/utils/")) {
      targetDir = "core/utils";
    } else if (entry.path.includes("/services/")) {
      targetDir = "core/services";
    } else if (entry.path.includes("/agents/")) {
      targetDir = "core/agents";
    } else if (entry.path.includes("/routes/api/")) {
      targetDir = "routes/api";
    } else if (entry.path.includes("/components/")) {
      targetDir = "ui/components";
    } else if (entry.path.includes("/islands/")) {
      targetDir = "ui/islands";
    }

    if (targetDir) {
      const targetPath = join(targetDir, filename);
      try {
        await move(entry.path, targetPath);
        console.log(`Moved ${entry.path} to ${targetPath}`);
      } catch (error) {
        console.error(`Error moving ${entry.path}: ${error.message}`);
      }
    }
  }

  // Update deno.json
  const denoConfig = {
    imports: {
      "@/": "./",
      "@/core/": "./core/",
      "@/ui/": "./ui/",
      "@/routes/": "./routes/",
      "@/utils/": "./core/utils/",
      "@/types/": "./core/types/",
      "@/services/": "./core/services/"
    },
    tasks: {
      start: "deno run -A --watch=static/,routes/ dev.ts",
      build: "deno run -A build.ts",
      test: "deno test -A ./tests/"
    }
  };

  await Deno.writeTextFile("deno.json", JSON.stringify(denoConfig, null, 2));
  console.log("Updated deno.json");
}

if (import.meta.main) {
  cleanup().catch(console.error);
}