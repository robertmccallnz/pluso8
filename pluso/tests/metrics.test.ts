/// <reference lib="deno.ns" />

import { assertEquals } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { PerformanceMonitor } from "../core/metrics/performance-monitor.ts";

Deno.test("PerformanceMonitor Test Suite", async (t) => {
  const monitor = new PerformanceMonitor(5);

  await t.step("should track metric history", () => {
    const values = [1, 2, 3, 4, 5];
    values.forEach(v => monitor.record("test", v));

    const metrics = monitor.getMetrics("test");
    assertEquals(metrics?.current, 5);
    assertEquals(metrics?.min, 1);
    assertEquals(metrics?.max, 5);
    assertEquals(metrics?.avg, 3);
  });

  await t.step("should maintain history size limit", () => {
    const values = [1, 2, 3, 4, 5, 6];
    values.forEach(v => monitor.record("test2", v));

    const metrics = monitor.getMetrics("test2");
    assertEquals(metrics?.history.length, 5);
    assertEquals(metrics?.history[0], 2);
  });
});