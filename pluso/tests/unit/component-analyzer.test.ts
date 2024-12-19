import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.208.0/assert/mod.ts";
import { analyzeComponent, fixComponent } from "../helpers/component-analyzer.ts";

// Configure test options
const TEST_OPTIONS = {
  permissions: {
    read: true,
    write: true,
  },
  sanitizeResources: true,
  sanitizeOps: true,
};

// Test fixtures with proper Fresh architecture patterns
const mockComponents = {
  islandWithHooks: `
import { IS_BROWSER } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";
import { type Signal } from "@preact/signals";

export default function TestIsland() {
  if (!IS_BROWSER) {
    return <div>Loading...</div>;
  }

  const [count, setCount] = useState<number>(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}`,

  routeWithHooks: `
import { useState } from "preact/hooks";
import { type PageProps } from "$fresh/server.ts";

export default function TestRoute({ params }: PageProps) {
  const [value, setValue] = useState<string>("");
  
  return (
    <div>
      <input value={value} onInput={(e: Event) => setValue((e.target as HTMLInputElement).value)} />
    </div>
  );
}`,

  mixedSignalsAndHooks: `
import { signal, type Signal } from "@preact/signals";
import { useState } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

export default function MixedComponent() {
  const countSignal: Signal<number> = signal(0);
  const [name, setName] = useState<string>("");
  
  return (
    <div>
      <p>Count: {countSignal.value}</p>
      <p>Name: {name}</p>
    </div>
  );
}`
};

// Component Analysis Tests
Deno.test({
  name: "Component Analyzer - Static Analysis",
  ...TEST_OPTIONS,
  fn: async (t) => {
    await t.step("detects hooks in components", () => {
      const analysis = analyzeComponent(mockComponents.islandWithHooks);
      assertEquals(analysis.hasHooks, true);
      assertEquals(analysis.hasSignals, false);
      assertEquals(analysis.issues.length, 0); // No issues since it's an island component
    });

    await t.step("detects hooks in route components", () => {
      const analysis = analyzeComponent(mockComponents.routeWithHooks);
      assertEquals(analysis.hasHooks, true);
      assertEquals(analysis.hasSignals, false);
      assertEquals(analysis.issues.length, 1); // Should have issue for hooks outside island
    });

    await t.step("detects mixed signals and hooks", () => {
      const analysis = analyzeComponent(mockComponents.mixedSignalsAndHooks);
      assertEquals(analysis.hasHooks, true);
      assertEquals(analysis.hasSignals, true);
      assertEquals(analysis.issues.length, 1); // Should have issue for mixed usage
    });
  },
});

// Component Transformation Tests
Deno.test({
  name: "Component Fixer - Fresh Architecture Compliance",
  ...TEST_OPTIONS,
  fn: async (t) => {
    await t.step("adds IS_BROWSER check to island components", async () => {
      const fixed = await fixComponent(mockComponents.islandWithHooks);
      assertEquals(fixed.includes('import { IS_BROWSER } from "$fresh/runtime.ts"'), true);
      assertEquals(fixed.includes("if (!IS_BROWSER)"), true);
    });

    await t.step("converts hooks to signals with proper typing", async () => {
      const fixed = await fixComponent(mockComponents.islandWithHooks);
      assertEquals(fixed.includes('import { signal, type Signal } from "@preact/signals"'), true);
      assertEquals(fixed.includes("const countSignal: Signal<number> = signal(0)"), true);
      assertEquals(fixed.includes("countSignal.value"), true);
      assertEquals(fixed.includes("useState"), false);
    });
  },
});

// Event Handler Tests
Deno.test({
  name: "Component Fixer - Event Handler Transformation",
  ...TEST_OPTIONS,
  fn: async (t) => {
    await t.step("properly updates event handlers with type safety", async () => {
      const mockComponent = `
import { useState } from "preact/hooks";
import { type Signal } from "@preact/signals";

export default function TestComponent() {
  const [count, setCount] = useState<number>(0);
  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Increment</button>
      <input onInput={(e: Event) => setCount((e.target as HTMLInputElement).value)} />
    </div>
  );
}`;

      const fixed = await fixComponent(mockComponent);
      assertEquals(fixed.includes("const countSignal: Signal<number> = signal(0)"), true);
      assertEquals(fixed.includes("onClick={() => countSignal.value = countSignal.value + 1}"), true);
      assertEquals(fixed.includes("onInput={(e: Event) => countSignal.value = (e.target as HTMLInputElement).value}"), true);
    });
  },
});

// Signal Preservation Tests
Deno.test({
  name: "Component Fixer - Signal Handling",
  ...TEST_OPTIONS,
  fn: async (t) => {
    await t.step("preserves existing signals when converting hooks", async () => {
      const fixed = await fixComponent(mockComponents.mixedSignalsAndHooks);
      assertEquals(fixed.includes("countSignal: Signal<number> = signal(0)"), true);
      assertEquals(fixed.includes("nameSignal: Signal<string> = signal(\"\")"), true);
    });

    await t.step("maintains proper signal typing", async () => {
      const fixed = await fixComponent(mockComponents.mixedSignalsAndHooks);
      assertEquals(fixed.includes("Signal<number>"), true);
      assertEquals(fixed.includes("Signal<string>"), true);
    });
  },
});
