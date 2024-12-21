import { assertEquals, assertNotEquals } from "https://deno.land/std@0.114.0/testing/asserts.ts";
import { mockDatabase } from "../mocks/db.ts";
import { ModelType } from "../../types/ml.ts";

// Mock the database before importing the modules that use it
const db = mockDatabase();

import { ResourceFetcher } from "../../core/agents/services/autonomous/resource-fetcher.ts";
import { EnhancementManager } from "../../core/agents/services/autonomous/enhancement-manager.ts";
import { ModelSearchAgent } from "../../core/agents/services/ml/model-search-agent.ts";
import { AutonomousController } from "../../core/agents/services/autonomous/autonomous-controller.ts";

Deno.test("Autonomous System Integration Test", async (t) => {
  const modelSearch = new ModelSearchAgent();
  const enhancer = EnhancementManager.getInstance();
  const controller = new AutonomousController();

  await t.step("Model Search - Find Best Model", async () => {
    const model = await modelSearch.findBestModel({
      task: "code_generation",
      requirements: {
        accuracy: 0.95,
        latency: 2000,
        contextSize: 16000,
        specialFeatures: ["code_completion", "type_inference"]
      },
      constraints: {
        maxCost: 0.01,
        maxLatency: 2000,
        minAccuracy: 0.9
      }
    });

    assertEquals(model !== null, true, "Should find a suitable model");
    assertEquals(model?.type, "code_generation", "Should match task type");
  });

  await t.step("Enhancement Manager - Process Enhancement", async () => {
    const request = {
      type: "model" as const,
      source: "https://huggingface.co/codegen-350M-mono",
      purpose: "code_completion",
      priority: 0.8,
      requirements: {
        accuracy: 0.9,
        latency: 1000
      },
      timestamp: new Date()
    };

    // Queue the enhancement
    const id = await enhancer.queueEnhancement(request);
    assertNotEquals(id, undefined, "Should return enhancement ID");

    // Check status
    const status = await enhancer.getStatus();
    assertEquals(status.queueSize > 0, true, "Should have queued enhancement");

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get result
    const result = await enhancer.getEnhancementResult(id);
    assertEquals(result !== null, true, "Should have processed enhancement");
  });

  await t.step("Autonomous Controller - System Management", async () => {
    // Simulate system state
    const state = {
      health: {
        cpu: 0.9,
        memory: 0.8,
        errorRate: 0.01
      },
      performance: {
        latency: 1500,
        throughput: 100,
        uptime: 99.9
      },
      resources: {
        available: 0.1,
        total: 1.0,
        reserved: 0.9
      }
    };

    // Get decisions
    const decisions = await controller.analyzeAndDecide(state);
    
    assertEquals(decisions.length > 0, true, "Should make decisions");
    assertEquals(
      decisions.some(d => d.type === "scale"),
      true,
      "Should decide to scale due to low resources"
    );
  });

  await t.step("Safety Protocol Test", async () => {
    const unsafeRequest = {
      type: "model" as const,
      source: "data:text/javascript,alert('xss')",
      purpose: "test_unsafe",
      priority: 1,
      requirements: {},
      timestamp: new Date()
    };

    try {
      await enhancer.queueEnhancement(unsafeRequest);
      throw new Error("Should have rejected unsafe content");
    } catch (error) {
      assertEquals(error.message.includes("Safety check failed"), true);
    }
  });

  await t.step("End-to-End Enhancement Flow", async () => {
    // Create a valid enhancement request
    const request = {
      type: "model" as const,
      source: "https://huggingface.co/gpt2",
      purpose: "test_valid_enhancement",
      priority: 0.5,
      requirements: {
        accuracy: 0.8,
        latency: 2000
      },
      timestamp: new Date()
    };

    // Queue the enhancement
    const id = await enhancer.queueEnhancement(request);
    assertNotEquals(id, undefined, "Should return enhancement ID");

    // Wait for processing
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check the result
    const result = await enhancer.getEnhancementResult(id);
    assertEquals(result !== null, true, "Should have processed enhancement");
    assertEquals(result?.status !== "error", true, "Should not have errored");
  });
});

// Run cleanup after tests
Deno.test("Cleanup", async () => {
  // Clean up test data
  await db.query("DELETE FROM enhancements WHERE purpose LIKE 'test_%'");
  await db.query("DELETE FROM model_registry WHERE name LIKE 'test_%'");
  await db.query("DELETE FROM verified_resources WHERE checksum LIKE 'test_%'");
});
