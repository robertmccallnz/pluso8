import { assertEquals, assertNotEquals } from "https://deno.land/std@0.170.0/testing/asserts.ts";
import { analyzeComponent, fixComponent } from "./helpers/component-analyzer.ts";

const mockIslandComponent = `
import { useState } from "preact/hooks";

export default function TestIsland() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
`;

const mockRouteComponent = `
import { useState } from "preact/hooks";

export default function TestRoute() {
  const [value, setValue] = useState("");
  
  return (
    <div>
      <input value={value} onInput={(e) => setValue(e.target.value)} />
    </div>
  );
}
`;

Deno.test("Component analyzer detects hooks", () => {
  const analysis = analyzeComponent(mockIslandComponent);
  assertEquals(analysis.hasHooks, true);
  assertEquals(analysis.issues.length > 0, true);
});

Deno.test("Component analyzer detects hooks in route component", () => {
  const analysis = analyzeComponent(mockRouteComponent);
  assertEquals(analysis.hasHooks, true);
  assertEquals(analysis.issues.includes("Hooks found outside of island components"), true);
});

Deno.test("Component fixer adds IS_BROWSER check", async () => {
  const fixed = await fixComponent(mockIslandComponent);
  const analysis = analyzeComponent(fixed);
  assertEquals(analysis.hasBrowserCheck, true);
  assertEquals(fixed.includes('import { IS_BROWSER } from "$fresh/runtime.ts"'), true);
  assertEquals(fixed.includes("if (!IS_BROWSER)"), true);
});

Deno.test("Component fixer converts hooks to signals", async () => {
  const fixed = await fixComponent(mockIslandComponent);
  console.log("Fixed content:", fixed);
  assertEquals(fixed.includes("import { signal } from \"@preact/signals\""), true);
  assertEquals(fixed.includes("const countSignal = signal(0)"), true);
  assertEquals(fixed.includes("countSignal.value"), true);
  assertEquals(fixed.includes("useState"), false);
});

Deno.test("Component fixer handles both IS_BROWSER and signals", async () => {
  const fixed = await fixComponent(mockIslandComponent);
  const analysis = analyzeComponent(fixed);
  console.log("Analysis:", analysis);
  console.log("Fixed content:", fixed);
  assertEquals(analysis.hasBrowserCheck, true);
  assertEquals(fixed.includes("import { signal }"), true);
  assertEquals(analysis.hasHooks, false);
});
