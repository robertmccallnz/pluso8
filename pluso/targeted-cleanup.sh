// targeted-cleanup.ts
import { ensureDir, move } from "https://deno.land/std/fs/mod.ts";
import { join, dirname } from "https://deno.land/std/path/mod.ts";

async function cleanup() {
  try {
    // 1. Create base structure
    const directories = [
      'core/agents/services',
      'core/agents/ui',
      'core/types',
      'core/utils',
      'core/services',
      'core/state',
      'routes/api',
      'routes/pages',
      'routes/layouts',
      'ui/components',
      'ui/islands'
    ];

    for (const dir of directories) {
      await ensureDir(dir);
      console.log(`Created directory: ${dir}`);
    }

    // 2. Move files with structure preservation
    const moves = [
      // Types consolidation
      { from: 'types/*.ts', to: 'core/types' },
      { from: 'lib/types/*.ts', to: 'core/types' },
      
      // Utils consolidation
      { from: 'utils/*.ts', to: 'core/utils' },
      { from: 'lib/utils/*.ts', to: 'core/utils' },
      
      // Move UI components
      { from: 'ui/components/**/*.tsx', to: 'ui/components' },
      { from: 'ui/islands/**/*.tsx', to: 'ui/islands' },
      
      // Move routes preserving structure
      { from: 'routes/api/**/*.ts', to: 'routes/api' },
      { from: 'routes/*.tsx', to: 'routes/pages' },
      { from: 'routes/_*.tsx', to: 'routes/layouts' }
    ];

    for (const moveOp of moves) {
      const files = await glob(moveOp.from);
      for (const file of files) {
        const dest = join(moveOp.to, basename(file));
        try {
          await ensureDir(dirname(dest));
          await move(file, dest);
          console.log(`Moved: ${file} -> ${dest}`);
        } catch (e) {
          console.error(`Failed to move ${file}: ${e.message}`);
        }
      }
    }

    // 3. Update imports in deno.json
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
    
    // 4. Clean up empty directories
    await removeEmptyDirs(".");
    
    console.log("Cleanup complete!");
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

async function glob(pattern: string): Promise<string[]> {
  const files: string[] = [];
  const root = pattern.split("/")[0];
  
  try {
    for await (const entry of walk(root, { 
      includeDirs: false,
      match: [new RegExp(pattern.replace("*", ".*"))]
    })) {
      files.push(entry.path);
    }
  } catch (e) {
    console.warn(`No matches found for pattern: ${pattern}`);
  }
  
  return files;
}

async function removeEmptyDirs(dir: string) {
  for await (const entry of Deno.readDir(dir)) {
    if (entry.isDirectory) {
      const path = join(dir, entry.name);
      await removeEmptyDirs(path);
      try {
        await Deno.remove(path);
        console.log(`Removed empty directory: ${path}`);
      } catch {
        // Directory not empty or other error
      }
    }
  }
}

if (import.meta.main) {
  cleanup().catch(console.error);
}