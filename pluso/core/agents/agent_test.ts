import { assertEquals, assertExists } from "https://deno.land/std@0.211.0/testing/asserts.ts";
import { BaseAgent } from "../agents/core/base/base_agent.ts";
import { AgentConfig } from "../agents/types/agent.ts";

class TestAgent extends BaseAgent {
  async process(input: string): Promise<string> {
    return `Processed: ${input}`;
  }
}

Deno.test("BaseAgent", async (t) => {
  await t.step("should create agent with valid config", () => {
    const config: AgentConfig = {
      id: "test",
      name: "Test Agent",
      provider: "openai",
      modelId: "gpt-4",
      maxTokens: 100,
      temperature: 0.7,
      systemPrompt: "You are a test agent"
    };

    const agent = new TestAgent("test", config);
    assertExists(agent);
    assertEquals(agent.getId(), "test");
    assertEquals(agent.getConfig(), config);
  });

  await t.step("should process input", async () => {
    const config: AgentConfig = {
      id: "test",
      name: "Test Agent",
      provider: "openai",
      modelId: "gpt-4"
    };

    const agent = new TestAgent("test", config);
    const result = await agent.process("test input");
    assertEquals(result, "Processed: test input");
  });
});
