import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { join } from "https://deno.land/std@0.208.0/path/mod.ts";
import { analyzeComponent } from "../helpers/component-analyzer.ts";

const TEST_OPTIONS = {
  sanitizeOps: false,
  sanitizeResources: false,
};

// Test fixtures
const testComponents = {
  newIsland: `
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";

export default function NewIsland() {
  if (!IS_BROWSER) return <div>Loading...</div>;
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}`,
  newRoute: `
import { useState } from "preact/hooks";

export default function NewRoute() {
  const [count, setCount] = useState(0);
  return <div>{count}</div>;
}`
};

Deno.test({
  name: "File Creation Trigger Tests",
  ...TEST_OPTIONS,
  fn: async (t) => {
    const testDir = await Deno.makeTempDir();
    
    try {
      await t.step("analyzes newly created island component", async () => {
        const islandPath = join(testDir, "islands", "Counter.tsx");
        await Deno.mkdir(join(testDir, "islands"), { recursive: true });
        await Deno.writeTextFile(islandPath, testComponents.newIsland);
        
        const analysis = analyzeComponent(await Deno.readTextFile(islandPath));
        assertEquals(analysis.hasHooks, true);
        assertEquals(analysis.hasBrowserCheck, true);
        assertEquals(analysis.issues.length, 0);
      });

      await t.step("analyzes newly created route component", async () => {
        const routePath = join(testDir, "routes", "index.tsx");
        await Deno.mkdir(join(testDir, "routes"), { recursive: true });
        await Deno.writeTextFile(routePath, testComponents.newRoute);
        
        const analysis = analyzeComponent(await Deno.readTextFile(routePath));
        assertEquals(analysis.hasHooks, true);
        assertEquals(analysis.hasBrowserCheck, false);
        assertEquals(analysis.issues.length, 1);
        assertEquals(analysis.issues[0], "Hooks found outside of island components");
      });
    } finally {
      // Cleanup
      await Deno.remove(testDir, { recursive: true });
    }
  },
});
