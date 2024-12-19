// Script to verify and update import paths
import { walk } from "https://deno.land/std/fs/mod.ts";

const BASE_DIR = "/Users/robertmccall/pluso8/pluso";

// Old to new path mappings
const pathMappings = {
  "../../agents/types/agent.ts": "../../agents/types/agent.ts",
  "../../../agents/types/agent.ts": "../../../agents/types/agent.ts",
  "../../agents/core/": "../../agents/core/",
  "../../../agents/core/": "../../../agents/core/",
  "../../agents/types/core_agents.ts": "../../agents/types/core_agents.ts",
  "../../../agents/types/core_agents.ts": "../../../agents/types/core_agents.ts",
  "pluso/agents/core/base/base_agent.ts": "pluso/agents/core/base/base_agent.ts",
  "../../../agents/utils/validator.ts": "../../../agents/utils/validator.ts",
  "../../agents/types/metrics.ts": "../../agents/types/metrics.ts",
};

async function updateImports() {
  const files = walk(BASE_DIR, {
    exts: ["ts", "tsx"],
    skip: [/node_modules/, /\.git/],
  });

  for await (const entry of files) {
    if (entry.isFile) {
      let content = await Deno.readTextFile(entry.path);
      let modified = false;

      // Check for outdated imports
      for (const [oldPath, newPath] of Object.entries(pathMappings)) {
        if (content.includes(oldPath)) {
          content = content.replace(new RegExp(oldPath.replace(/\./g, "\\."), "g"), newPath);
          modified = true;
          console.log(`Updated import in ${entry.path}: ${oldPath} -> ${newPath}`);
        }
      }

      // Save if modified
      if (modified) {
        await Deno.writeTextFile(entry.path, content);
      }
    }
  }
}

// Run the update
console.log("Verifying and updating import paths...");
updateImports()
  .then(() => console.log("Import paths updated successfully"))
  .catch(console.error);
