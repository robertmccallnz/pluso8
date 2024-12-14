// tools/cleanup.ts

import { walk } from "jsr:@std/fs/walk";


const emptyDirsToRemove = [
  "core/api",
  "core/metrics",
  "core/module",
  "core/pressure",
  "core/v8",
  "models/providers"
];

const filesToMove = [
  {
    from: "core/tokio/buffer--pool.ts",
    to: "core/buffer/pool.ts"
  }
];

async function cleanup() {
  console.log("Starting cleanup...");

  // Move files
  for (const move of filesToMove) {
    try {
      await Deno.mkdir(new URL("../core/buffer", import.meta.url), { recursive: true });
      await Deno.rename(move.from, move.to);
      console.log(`Moved: ${move.from} -> ${move.to}`);
    } catch (error) {
      console.error(`Error moving ${move.from}:`, error.message);
    }
  }

  // Remove empty directories
  for (const dir of emptyDirsToRemove) {
    try {
      await Deno.remove(dir, { recursive: true });
      console.log(`Removed empty directory: ${dir}`);
    } catch (error) {
      console.error(`Error removing ${dir}:`, error.message);
    }
  }

  console.log("Cleanup complete!");
}

if (import.meta.main) {
  await cleanup();
}