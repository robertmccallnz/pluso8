// tools/final-cleanup.ts

const emptyDirsToRemove = [
    "core/tokio"
  ];
  
  const filesToMove = [
    {
      from: "agents/base.ts",
      to: "core/agents/base.ts"
    }
  ];
  
  async function cleanup() {
    console.log("Starting final cleanup...");
  
    // Move files
    for (const move of filesToMove) {
      try {
        await Deno.mkdir(new URL("../core/agents", import.meta.url), { recursive: true });
        await Deno.rename(move.from, move.to);
        console.log(`Moved: ${move.from} -> ${move.to}`);
        
        // Remove empty agents directory after move
        await Deno.remove("agents", { recursive: true });
        console.log("Removed empty agents directory");
      } catch (error) {
        console.error(`Error during file operation:`, error.message);
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
  
    console.log("Final cleanup complete!");
  }
  
  if (import.meta.main) {
    await cleanup();
  }