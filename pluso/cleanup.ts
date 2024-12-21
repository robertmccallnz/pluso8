// cleanup.ts
import { ensureDir, move } from "https://deno.land/std/fs/mod.ts";
import { join } from "https://deno.land/std/path/mod.ts";

async function cleanup() {
  try {
    // 1. Create core directories
    const coreDirs = [
      "core/config",
      "core/types",
      "core/utils",
      "core/services",
      "core/agents",
      "core/state",
      "core/routing"
    ];

    for (const dir of coreDirs) {
      await ensureDir(dir);
      console.log(`Created directory: ${dir}`);
    }

    // 2. Move configurations
    const configFiles = [
      ["config/models.ts", "core/config/models.ts"],
      ["fresh.config.ts", "core/config/fresh.config.ts"],
      ["tsconfig.json", "core/config/tsconfig.json"]
    ];

    for (const [src, dest] of configFiles) {
      try {
        await move(src, dest);
        console.log(`Moved ${src} to ${dest}`);
      } catch (e) {
        console.log(`Skipping ${src}: ${e.message}`);
      }
    }

    // 3. Move types
    if (await Deno.stat("types").then(() => true).catch(() => false)) {
      const typeFiles = await Array.fromAsync(Deno.readDir("types"));
      for (const file of typeFiles) {
        if (file.isFile && file.name.endsWith(".ts")) {
          await move(
            join("types", file.name),
            join("core/types", file.name)
          );
          console.log(`Moved types/${file.name} to core/types/${file.name}`);
        }
      }
    }

    // 4. Move utils
    if (await Deno.stat("utils").then(() => true).catch(() => false)) {
      const utilFiles = await Array.fromAsync(Deno.readDir("utils"));
      for (const file of utilFiles) {
        if (file.isFile && file.name.endsWith(".ts")) {
          await move(
            join("utils", file.name),
            join("core/utils", file.name)
          );
          console.log(`Moved utils/${file.name} to core/utils/${file.name}`);
        }
      }
    }

    // 5. Update deno.json with new import map
    const denoConfig = {
      imports: {
        "@/": "./",
        "@/core/": "./core/",
        "@/ui/": "./ui/",
        "@/routes/": "./routes/",
        "@/utils/": "./core/utils/",
        "@/types/": "./core/types/",
        "@/services/": "./core/services/",
        "@/config/": "./core/config/"
      },
      tasks: {
        start: "deno run -A --watch=static/,routes/ dev.ts",
        build: "deno run -A build.ts",
        test: "deno test -A ./tests/"
      }
    };

    await Deno.writeTextFile("deno.json", JSON.stringify(denoConfig, null, 2));
    console.log("Updated deno.json");

  } catch (error) {
    console.error("Error during cleanup:", error);
  }
}

if (import.meta.main) {
  cleanup().catch(console.error);
}