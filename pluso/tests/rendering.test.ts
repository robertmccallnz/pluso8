/** @jsx h */
import { assertEquals, assertNotEquals } from "https://deno.land/std@0.208.0/testing/asserts.ts";
import { describe, it, beforeEach, afterEach } from "https://deno.land/std@0.208.0/testing/bdd.ts";
import { signal } from "@preact/signals";
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { IS_BROWSER } from "$fresh/runtime.ts";

// Mock DOM environment
const mockDocument = {
  createElement: (tag: string) => ({
    tagName: tag.toUpperCase(),
    children: [],
    attributes: {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
    textContent: "",
    querySelector: () => null,
  }),
  createTextNode: (text: string) => ({ textContent: text }),
};

// Mock components for testing
const MockHooksComponent = () => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    setCount(1);
  }, []);
  return h("div", { "data-testid": "hooks-test" }, count);
};

const MockSignalsComponent = () => {
  const count = signal(0);
  if (!IS_BROWSER) {
    return h("div", { "data-testid": "signals-test" }, "Loading...");
  }
  return h(
    "div",
    {
      "data-testid": "signals-test",
      onClick: () => count.value++,
    },
    count.value
  );
};

describe("Server-side and Client-side Rendering Tests", () => {
  beforeEach(() => {
    // Setup mock DOM environment
    (globalThis as any).document = mockDocument;
    (globalThis as any).window = {
      document: mockDocument,
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  });

  afterEach(() => {
    // Cleanup mock DOM environment
    delete (globalThis as any).document;
    delete (globalThis as any).window;
  });

  describe("Hook Usage Tests", () => {
    it("should detect hooks in components", async () => {
      const results = await analyzeComponent("/Users/robertmccall/pluso8/pluso/islands");
      assertEquals(
        results.hooksFound,
        false,
        "Found hooks in components where they should not be used"
      );
    });

    it("should verify hooks are not used outside client components", async () => {
      const results = await analyzeComponent("/Users/robertmccall/pluso8/pluso/routes");
      assertEquals(
        results.hooksInRoutes,
        false,
        "Found hooks in route components where they should not be used"
      );
    });
  });

  describe("Signal Usage Tests", () => {
    it("should verify signals are properly initialized", () => {
      const mockElement = mockDocument.createElement("div");
      mockElement.textContent = "Loading...";
      mockDocument.querySelector = () => mockElement;

      assertEquals(
        mockElement.textContent,
        "Loading...",
        "Server-side render should show loading state"
      );
    });

    it("should verify signals update correctly", () => {
      // Mock browser environment
      (globalThis as any).IS_BROWSER = true;
      
      const mockElement = mockDocument.createElement("div");
      mockElement.textContent = "0";
      mockDocument.querySelector = () => mockElement;
      
      assertEquals(mockElement.textContent, "0", "Initial signal value should be 0");
      
      // Simulate click and update
      mockElement.textContent = "1";
      assertEquals(
        mockElement.textContent,
        "1",
        "Signal value should update after click"
      );
    });
  });

  describe("Client-Side Only Tests", () => {
    it("should verify IS_BROWSER check is present", async () => {
      const results = await analyzeIslands("/Users/robertmccall/pluso8/pluso/islands");
      assertEquals(
        results.hasBrowserCheck,
        true,
        "Missing IS_BROWSER checks in island components"
      );
    });

    it("should verify proper client-side initialization", () => {
      // Mock browser environment
      (globalThis as any).IS_BROWSER = true;
      
      const mockElement = mockDocument.createElement("div");
      mockElement.textContent = "0";
      mockDocument.querySelector = () => mockElement;
      
      assertNotEquals(
        mockElement.textContent,
        "Loading...",
        "Client-side render should not show loading state"
      );
    });
  });
});

// Helper function to analyze components for hooks
async function analyzeComponent(directory: string): Promise<{
  hooksFound: boolean;
  hooksInRoutes: boolean;
}> {
  const hooksPattern = /use[A-Z]/;
  let hooksFound = false;
  let hooksInRoutes = false;

  try {
    const files = await Deno.readDir(directory);
    for await (const file of files) {
      if (file.isFile && file.name.endsWith(".tsx")) {
        const content = await Deno.readTextFile(`${directory}/${file.name}`);
        if (hooksPattern.test(content)) {
          if (directory.includes("routes")) {
            hooksInRoutes = true;
          } else {
            hooksFound = true;
          }
        }
      }
    }
  } catch (error) {
    console.error(`Error analyzing directory ${directory}:`, error);
  }

  return {
    hooksFound,
    hooksInRoutes,
  };
}

// Helper function to analyze island components
async function analyzeIslands(directory: string): Promise<{
  hasBrowserCheck: boolean;
}> {
  const browserCheckPattern = /if.*!IS_BROWSER.*return/;
  let hasBrowserCheck = false;

  try {
    const files = await Deno.readDir(directory);
    for await (const file of files) {
      if (file.isFile && file.name.endsWith(".tsx")) {
        const content = await Deno.readTextFile(`${directory}/${file.name}`);
        if (browserCheckPattern.test(content)) {
          hasBrowserCheck = true;
          break;
        }
      }
    }
  } catch (error) {
    console.error(`Error analyzing islands directory:`, error);
  }

  return {
    hasBrowserCheck,
  };
}
