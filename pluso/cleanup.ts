// cleanup.ts
import { walk } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

async function cleanupNodeModules() {
  const requiredDependencies = new Set([
    // Core UI dependencies
    '@radix-ui/react-dialog',
    '@radix-ui/react-slot',
    'class-variance-authority',
    'clsx',
    'tailwind-merge',
    'tailwindcss',
    'lucide-react',
    
    // Core functionality
    '@anthropic-ai/sdk',
    '@supabase/auth-js',
    '@supabase/postgrest-js',
    'together-ai'
  ]);

  const nodeModulesPath = "./node_modules";

  try {
    // First check if node_modules exists
    try {
      await Deno.stat(nodeModulesPath);
    } catch {
      console.log("No node_modules directory found.");
      return;
    }

    // Walk through node_modules
    for await (const entry of walk(nodeModulesPath, {
      maxDepth: 3, // Limit depth to avoid going too deep
      includeDirs: true,
      includeFiles: false,
    })) {
      if (!entry.isDirectory || entry.path === nodeModulesPath) {
        continue;
      }

      // Get relative path from node_modules
      const relativePath = entry.path.substring(nodeModulesPath.length + 1);
      if (!relativePath) continue;

      // Get the top-level package name
      const packageName = relativePath.split('/')[0];
      if (!packageName) continue;

      // If it's a scope package (@something/package)
      const isScopePackage = packageName.startsWith('@');
      const fullPackageName = isScopePackage && relativePath.split('/')[1] 
        ? `${packageName}/${relativePath.split('/')[1]}`
        : packageName;

      if (!requiredDependencies.has(fullPackageName)) {
        try {
          console.log(`Removing: ${fullPackageName}`);
          await Deno.remove(join(nodeModulesPath, isScopePackage ? relativePath.split('/')[0] : packageName), { recursive: true });
        } catch (e) {
          console.warn(`Failed to remove ${fullPackageName}:`, e);
        }
      }
    }

    // Try to update package.json if it exists
    try {
      const packageJsonPath = "./package.json";
      const packageJsonContent = await Deno.readTextFile(packageJsonPath);
      const packageJson = JSON.parse(packageJsonContent);
      const newDependencies: Record<string, string> = {};
      
      for (const [dep, version] of Object.entries(packageJson.dependencies || {})) {
        if (requiredDependencies.has(dep)) {
          newDependencies[dep] = version as string;
        }
      }
      
      packageJson.dependencies = newDependencies;
      await Deno.writeTextFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
      console.log("Updated package.json");
    } catch (e) {
      console.warn("Could not update package.json:", e);
    }

    // Try to update import map if it exists
    try {
      const importMapPath = "./import-map.json";
      const importMapContent = await Deno.readTextFile(importMapPath);
      const importMap = JSON.parse(importMapContent);
      const newImports: Record<string, string> = {};
      
      for (const [imp, path] of Object.entries(importMap.imports || {})) {
        const packageName = imp.split("/")[0];
        if (requiredDependencies.has(packageName)) {
          newImports[imp] = path as string;
        }
      }
      
      importMap.imports = newImports;
      await Deno.writeTextFile(importMapPath, JSON.stringify(importMap, null, 2));
      console.log("Updated import-map.json");
    } catch (e) {
      console.warn("Could not update import-map.json:", e);
    }

  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

if (import.meta.main) {
  await cleanupNodeModules();
}