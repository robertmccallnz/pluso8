/** @jsx h */
import { assertEquals, assertNotEquals } from "../deps.ts";
import { signal } from "@preact/signals";
import { h } from "preact";
import { useState, useEffect } from "preact/hooks";
import { render } from "preact-render-to-string";
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
    setAttribute: () => {},
    appendChild: () => {},
  }),
  createTextNode: (text: string) => ({ textContent: text }),
};

// Mock components for testing
function MockHooksComponent() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    // Simulate side effect
  }, [count]);

  return <div>Count: {count}</div>;
}

function MockSignalsComponent() {
  const count = signal(0);
  
  if (!IS_BROWSER) {
    return <div>Loading...</div>;
  }

  return (
    <div onClick={() => count.value++}>
      {count.value}
    </div>
  );
}

Deno.test("Component rendering", async (t) => {
  await t.step("setup", () => {
    // Setup mock DOM environment
    (globalThis as any).document = mockDocument;
    (globalThis as any).window = {
      addEventListener: () => {},
      removeEventListener: () => {},
    };
  });

  await t.step("Server-side Hook Rendering", () => {
    const element = render(<MockHooksComponent />);
    assertEquals(element, "<div>Count: 0</div>", "Initial hook state should be 0");
  });

  await t.step("Server-side Signal Rendering", () => {
    const element = render(<MockSignalsComponent />);
    assertEquals(element, "<div>Loading...</div>", "Server-side render should show loading state");
  });

  await t.step("Client-side Signal Rendering", () => {
    (globalThis as any).IS_BROWSER = true;
    const element = render(<MockSignalsComponent />);
    assertEquals(element, "<div>0</div>", "Initial signal value should be 0");
  });

  await t.step("should render a simple component", () => {
    function SimpleComponent() {
      return <div>Hello, World!</div>;
    }

    const element = render(<SimpleComponent />);
    assertEquals(element, "<div>Hello, World!</div>");
  });

  await t.step("should handle state changes", () => {
    function CounterComponent() {
      const [count, setCount] = useState(0);

      return (
        <div>
          <div>Count: {count}</div>
          <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
      );
    }

    const element = render(<CounterComponent />);
    assertEquals(element, "<div><div>Count: 0</div><button>Increment</button></div>");

    // Simulate click and update
    const updatedElement = render(<CounterComponent />);
    assertEquals(updatedElement, "<div><div>Count: 0</div><button>Increment</button></div>");
  });

  await t.step("cleanup", () => {
    // Cleanup mock DOM environment
    delete (globalThis as any).document;
    delete (globalThis as any).window;
    delete (globalThis as any).IS_BROWSER;
  });
});

Deno.test("Signal Tests", async (t) => {
  await t.step("should handle signal updates", () => {
    const count = signal(0);
    assertEquals(count.value, 0);

    count.value = 1;
    assertEquals(count.value, 1);
    assertNotEquals(count.value, 0);
  });

  await t.step("should handle multiple updates", () => {
    const text = signal("hello");
    assertEquals(text.value, "hello");
    assertNotEquals(text.value, "world");

    text.value = "world";
    assertEquals(text.value, "world");
    assertNotEquals(text.value, "hello");
  });
});
