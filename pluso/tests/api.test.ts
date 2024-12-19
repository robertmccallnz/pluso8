import { assertEquals, assertExists } from "https://deno.land/std@0.211.0/testing/asserts.ts";

// Set test environment
Deno.env.set("DENO_ENV", "test");

const BASE_URL = Deno.env.get("API_URL") || "http://localhost:8000";

interface APIEndpoint {
  path: string;
  method: string;
  expectedStatus: number;
  requiresAuth?: boolean;
  testPayload?: Record<string, unknown>;
}

const API_ENDPOINTS: APIEndpoint[] = [
  // Health endpoints
  { path: "/api/health", method: "GET", expectedStatus: 200 },
  { path: "/api/health/islands", method: "GET", expectedStatus: 200 },
  { path: "/api/health/metrics", method: "GET", expectedStatus: 200 },

  // Metrics endpoints
  { path: "/api/metrics", method: "GET", expectedStatus: 200 },
  { path: "/api/metrics/verify", method: "GET", expectedStatus: 200 },
  { 
    path: "/api/metrics/record", 
    method: "POST", 
    expectedStatus: 200,
    requiresAuth: true,
    testPayload: {
      agentId: "test-agent",
      metric: "response_time",
      value: 100
    }
  },

  // Model endpoints
  { path: "/api/models", method: "GET", expectedStatus: 200 },

  // Agent endpoints
  { 
    path: "/api/agents", 
    method: "GET", 
    expectedStatus: 200,
    requiresAuth: true 
  }
];

async function getAuthToken(): Promise<string> {
  // In a real test, this would authenticate with your auth provider
  // For now, return a test token
  return "test-token";
}

async function testEndpoint(endpoint: APIEndpoint, authToken?: string): Promise<void> {
  const url = `${BASE_URL}${endpoint.path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (endpoint.requiresAuth && authToken) {
    headers["Authorization"] = `Bearer ${authToken}`;
  }

  const response = await fetch(url, {
    method: endpoint.method,
    headers,
    body: endpoint.testPayload ? JSON.stringify(endpoint.testPayload) : undefined,
  });

  assertEquals(
    response.status,
    endpoint.expectedStatus,
    `${endpoint.method} ${endpoint.path} failed with status ${response.status}`
  );

  const data = await response.json();
  assertExists(data, `${endpoint.method} ${endpoint.path} should return JSON data`);
}

Deno.test("API Endpoints Test Suite", async (t) => {
  // Get auth token once for all tests
  const authToken = await getAuthToken();

  for (const endpoint of API_ENDPOINTS) {
    await t.step(`${endpoint.method} ${endpoint.path}`, async () => {
      await testEndpoint(endpoint, authToken);
    });
  }
});
