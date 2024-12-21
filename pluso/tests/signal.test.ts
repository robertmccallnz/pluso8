import { assertEquals, assertNotEquals } from "../deps.ts";
import { signal } from "@preact/signals";

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
