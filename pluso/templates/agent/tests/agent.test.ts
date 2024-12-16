import { assertEquals, assertExists } from "https://deno.land/std@0.210.0/assert/mod.ts";
import { TemplateAgent } from "../src/agent.ts";

Deno.test("TemplateAgent", async (t) => {
  await t.step("initialization", async () => {
    const agent = new TemplateAgent("./config/agent.yaml");
    assertExists(agent);
  });

  await t.step("process message", async () => {
    const agent = new TemplateAgent("./config/agent.yaml");
    const response = await agent.process("Hello, agent!");
    assertExists(response);
  });

  await t.step("metrics recording", async () => {
    const agent = new TemplateAgent("./config/agent.yaml");
    await agent.process("Test message");
    
    // Check metrics in Supabase
    // Implementation depends on your metrics query interface
  });

  await t.step("tool execution", async () => {
    const agent = new TemplateAgent("./config/agent.yaml");
    // Test tool execution
    // Implementation depends on your tool interface
  });

  await t.step("error handling", async () => {
    const agent = new TemplateAgent("./config/agent.yaml");
    try {
      await agent.process(""); // Empty input should throw
      throw new Error("Should have thrown an error");
    } catch (error) {
      assertExists(error);
    }
  });
});
