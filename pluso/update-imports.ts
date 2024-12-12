// fresh-pluso/scripts/update-imports.ts
import { walk } from "https://deno.land/std/fs/mod.ts";

async function updateImports(dir: string) {
  for await (const entry of walk(dir)) {
    if (entry.isFile && entry.name.endsWith('.ts' || '.tsx')) {
      let content = await Deno.readTextFile(entry.path);
      
      // Update import paths based on your mapping
      content = content.replace(
        /from ['"]@\/components\//g,
        'from "../components/'
      );
      
      await Deno.writeTextFile(entry.path, content);
    }
  }
}