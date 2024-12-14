// tests/agent-config.test.ts
import { AgentConfigValidator } from "../core/config/agent-validator.ts";
import { assertEquals, assertThrows } from "jsr:@std/testing/assert";

Deno.test("validates valid agent config", async () => {
  const validConfig = {
    name: "test-agent",
    description: "Test Agent",
    version: "1.0.0",
    systemPrompt: "You are a test agent",
    model: {
      provider: "openai",
      apiKey: "test-key",
      model: "gpt-4"
    },
    memory: {
      type: "buffer",
      maxMessages: 100
    },
    tools: []
  };

  const result = await AgentConfigValidator.validateYamlConfig(validConfig);
  assertEquals(result, validConfig);
});

Deno.test("throws on invalid config", () => {
  const invalidConfig = {
    name: "test-agent"
    // Missing required fields
  };

  assertThrows(() => AgentConfigValidator.validateYamlConfig(invalidConfig));
});
