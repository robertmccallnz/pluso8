import { assertEquals, assertExists, assertRejects } from "https://deno.land/std/testing/asserts.ts";
import { ServiceAgentRegistry } from "../../core/agents/services/registry.ts";
import { MetaPromptingService } from "../../core/agents/services/prompting/meta-prompt.ts";
import { AgentPromptingService } from "../../core/agents/services/prompting/agent-prompting.ts";
import { ServiceAgentType } from "../../core/agents/services/types.ts";

let registry: ServiceAgentRegistry;
let metaPrompting: MetaPromptingService;
let agentComm: AgentPromptingService;

Deno.test({
  name: "Agent Communication Test Suite",
  async fn() {
    // Setup
    registry = ServiceAgentRegistry.getInstance();
    await registry.initialize();

    metaPrompting = await registry.getAgent(ServiceAgentType.META_PROMPT) as MetaPromptingService;
    agentComm = await registry.getAgent(ServiceAgentType.AGENT_COMMUNICATION) as AgentPromptingService;

    await testSuccessfulCommunication();
    await testCommunicationErrors();
    await testMetrics();
  }
});

async function testSuccessfulCommunication() {
  // Test data
  const sourceAgentId = "test-agent-a";
  const targetAgentId = "test-agent-b";
  const task = "Analyze customer sentiment from social media data";

  // Generate a prompt using meta-prompting service
  const promptResult = await metaPrompting.processRequest({
    type: "generate",
    input: {
      task,
      strategy: "chain-of-thought",
      context: {
        domain: "sentiment-analysis",
        complexity: "medium"
      }
    }
  });

  assertExists(promptResult);
  assertExists(promptResult.prompt);

  // Use agent communication to share the prompt
  const commResult = await agentComm.requestPrompt({
    sourceAgentId,
    targetAgentId,
    task,
    prompt: promptResult.prompt,
    metadata: {
      timestamp: new Date("2024-12-21T12:23:13+13:00"),
      priority: "high",
      domain: "sentiment-analysis"
    }
  });

  assertExists(commResult);
  assertEquals(commResult.status, "success");
  assertExists(commResult.targetResponse);
}

async function testCommunicationErrors() {
  const sourceAgentId = "test-agent-a";
  const invalidTargetId = "non-existent-agent";
  const task = "Invalid task request";

  await assertRejects(
    async () => {
      await agentComm.requestPrompt({
        sourceAgentId,
        targetAgentId: invalidTargetId,
        task,
        prompt: "Test prompt",
        metadata: {
          timestamp: new Date("2024-12-21T12:23:13+13:00"),
          priority: "low"
        }
      });
    },
    Error,
    "Target agent not found"
  );
}

async function testMetrics() {
  const metrics = await registry.getMetrics();
  
  assertExists(metrics);
  assertExists(metrics.serviceMetrics[ServiceAgentType.AGENT_COMMUNICATION]);
  assertExists(metrics.serviceMetrics[ServiceAgentType.META_PROMPT]);
}
