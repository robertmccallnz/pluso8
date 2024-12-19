import { open } from "deno-opn";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";

export interface AgentConfig {
  name: string;
  description: string;
  capabilities: string[];
  endpoints: {
    chat: string;
    api: string;
  };
  testCases: TestCase[];
}

export interface TestCase {
  name: string;
  input: string;
  expectedOutputContains: string[];
  timeout?: number;
}

export const AGENT_CONFIG: AgentConfig = {
  name: "Maia",
  description: "AI Development Assistant",
  capabilities: [
    "Code understanding and explanation",
    "Real-time chat interaction",
    "Development assistance",
    "Code generation and modification",
  ],
  endpoints: {
    chat: "/api/maia/ws",
    api: "/api/maia/chat",
  },
  testCases: [
    {
      name: "Basic greeting",
      input: "Hello",
      expectedOutputContains: ["Hi", "help"],
      timeout: 5000,
    },
    {
      name: "Code explanation request",
      input: "Explain how WebSocket connections work in this project",
      expectedOutputContains: [
        "WebSocket",
        "connection",
        "real-time",
        "communication",
      ],
      timeout: 10000,
    },
    {
      name: "Development assistance",
      input: "How do I implement error handling for WebSocket connections?",
      expectedOutputContains: ["error", "handler", "try", "catch"],
      timeout: 10000,
    },
  ],
};

export async function openTestReport(reportPath: string): Promise<void> {
  try {
    await open(reportPath);
    console.log(`Test report opened: ${reportPath}`);
  } catch (error) {
    console.error(`Failed to open test report: ${error.message}`);
  }
}

export function generateTestReport(results: TestResult[]): string {
  const timestamp = new Date().toISOString();
  const reportPath = `./test_reports/agent_test_${timestamp.replace(/[:.]/g, "-")}.html`;

  const report = `
<!DOCTYPE html>
<html>
<head>
  <title>Agent Test Report - ${AGENT_CONFIG.name}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 2rem; }
    .header { margin-bottom: 2rem; }
    .test-case { 
      border: 1px solid #ddd; 
      margin: 1rem 0; 
      padding: 1rem;
      border-radius: 4px;
    }
    .success { border-left: 4px solid #4CAF50; }
    .failure { border-left: 4px solid #f44336; }
    .details { margin-top: 1rem; font-family: monospace; }
  </style>
</head>
<body>
  <div class="header">
    <h1>Agent Test Report - ${AGENT_CONFIG.name}</h1>
    <p>Timestamp: ${timestamp}</p>
    <p>Description: ${AGENT_CONFIG.description}</p>
  </div>
  <div class="results">
    ${results.map(result => `
      <div class="test-case ${result.success ? 'success' : 'failure'}">
        <h3>${result.testCase.name}</h3>
        <p>Status: ${result.success ? 'Passed' : 'Failed'}</p>
        <p>Duration: ${result.duration}ms</p>
        <div class="details">
          <p>Input: ${result.testCase.input}</p>
          <p>Output: ${result.output}</p>
          ${result.error ? `<p>Error: ${result.error}</p>` : ''}
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>
  `;

  return report;
}

export interface TestResult {
  testCase: TestCase;
  success: boolean;
  output: string;
  duration: number;
  error?: string;
}

Deno.test("Agent Configuration", async (t) => {
  await t.step("should validate a valid agent configuration", () => {
    const config: AgentConfig = {
      name: "Test Agent",
      description: "Test Agent Description",
      capabilities: ["Test Capability"],
      endpoints: {
        chat: "/api/test/ws",
        api: "/api/test/chat",
      },
      testCases: [
        {
          name: "Test Case",
          input: "Test Input",
          expectedOutputContains: ["Test Output"],
        },
      ],
    };

    const result = validateAgentConfig(config);
    assertEquals(result.valid, true);
  });

  await t.step("should reject invalid agent configuration", () => {
    const config = {
      name: "Test Agent",
      // Missing required fields
    } as AgentConfig;

    const result = validateAgentConfig(config);
    assertEquals(result.valid, false);
    assertEquals(result.errors?.length, 4); // Should have description, capabilities, endpoints, and testCases errors
  });

  await t.step("should validate test cases", () => {
    const config: AgentConfig = {
      name: "Test Agent",
      description: "Test Agent Description",
      capabilities: ["Test Capability"],
      endpoints: {
        chat: "/api/test/ws",
        api: "/api/test/chat",
      },
      testCases: [
        {
          name: "Test Case",
          input: "Test Input",
          // Missing required field expectedOutputContains
        },
      ],
    };

    const result = validateAgentConfig(config);
    assertEquals(result.valid, false);
    assertEquals(result.errors?.some(e => e.includes("testCases")), true);
  });
});

function validateAgentConfig(config: AgentConfig) {
  const errors: string[] = [];

  if (!config.name) {
    errors.push("name is required");
  }

  if (!config.description) {
    errors.push("description is required");
  }

  if (!config.capabilities || config.capabilities.length === 0) {
    errors.push("capabilities is required and must not be empty");
  }

  if (!config.endpoints || !config.endpoints.chat || !config.endpoints.api) {
    errors.push("endpoints is required and must contain chat and api");
  }

  if (!config.testCases || config.testCases.length === 0) {
    errors.push("testCases is required and must not be empty");
  } else {
    config.testCases.forEach((testCase, index) => {
      if (!testCase.name) {
        errors.push(`testCases[${index}].name is required`);
      }

      if (!testCase.input) {
        errors.push(`testCases[${index}].input is required`);
      }

      if (!testCase.expectedOutputContains || testCase.expectedOutputContains.length === 0) {
        errors.push(`testCases[${index}].expectedOutputContains is required and must not be empty`);
      }
    });
  }

  return { valid: errors.length === 0, errors };
}
