/// <reference lib="deno.ns" />

// tests/agent-config.test.ts
import { assertEquals, assertThrows } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { AgentConfigValidator } from "../core/config/agent-validator.ts";

const TEST_CONFIG = {
  name: "test-agent",
  version: "1.0.0",
  description: "Test agent configuration",
  type: "chat",
  capabilities: ["text", "code"],
  systemPrompt: "You are a helpful assistant",
  model: {
    provider: "openai",
    name: "gpt-4",
    apiKey: "test-key"
  },
  tools: [],
  parameters: {
    temperature: 0.7,
    maxTokens: 1000
  }
};

const INVALID_CONFIG = {
  name: "test-agent",
  // Missing required fields like systemPrompt and model
  version: "1.0.0",
  description: "Invalid test config",
  type: "chat",
  capabilities: ["text"]
};

Deno.test("Agent Configuration Validator", async (t) => {
  await t.step("validates valid agent config", async () => {
    const validator = new AgentConfigValidator();
    const validationResult = await validator.validate(TEST_CONFIG);
    assertEquals(validationResult.isValid, true);
    assertEquals(validationResult.errors, []);
  });

  await t.step("throws on invalid config", async () => {
    const validator = new AgentConfigValidator();
    const validationResult = await validator.validate(INVALID_CONFIG);
    assertEquals(validationResult.isValid, false);
    assertEquals(validationResult.errors.length > 0, true);
  });
});
