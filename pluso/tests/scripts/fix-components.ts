import { walk } from "https://deno.land/std/fs/walk.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { analyzeComponent, fixComponent } from "../helpers/component-analyzer.ts";

async function fixAllComponents(directory: string) {
  console.log("Starting component fixes...\n");
  let totalFixed = 0;
  let totalFiles = 0;

  for await (const entry of walk(directory, {
    exts: ["tsx", "ts"],
    skip: [/node_modules/, /\.git/, /\.test\./, /\.spec\./],
  })) {
    if (!entry.isFile) continue;
    totalFiles++;

    const content = await Deno.readTextFile(entry.path);
    const analysis = analyzeComponent(content);

    if (analysis.issues.length > 0) {
      console.log(`Fixing ${entry.path}...`);
      console.log("Issues found:", analysis.issues);

      const fixedContent = await fixComponent(content);
      const newAnalysis = analyzeComponent(fixedContent);

      if (newAnalysis.issues.length < analysis.issues.length) {
        await Deno.writeTextFile(entry.path, fixedContent);
        console.log("✅ Fixed successfully\n");
        totalFixed++;
      } else {
        console.log("❌ Could not fix all issues\n");
      }
    }
  }

  console.log(`\nComponent fixes completed:`);
  console.log(`Total files processed: ${totalFiles}`);
  console.log(`Total files fixed: ${totalFixed}`);
}

// Get the directory from command line args or use default
const directory = Deno.args[0] || "./islands";

try {
  await fixAllComponents(directory);
} catch (error) {
  console.error("Error fixing components:", error);
  Deno.exit(1);
}
