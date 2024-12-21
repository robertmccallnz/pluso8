import { assertEquals, assertExists } from "../deps.ts";
import { mockSupabaseClient } from "./test_helpers.ts";

// Mock Supabase client
const originalModule = await import("../core/database/supabase/client.ts");
originalModule.supabaseClient = mockSupabaseClient;
originalModule.supabaseAdmin = mockSupabaseClient;

Deno.test("API Endpoints Test Suite", async (t) => {
  await t.step("Health Check Endpoints", async () => {
    // Test /api/health
    const healthResponse = await fetch("http://localhost:8000/api/health");
    assertEquals(healthResponse.status, 200);
    const healthData = await healthResponse.json();
    assertEquals(healthData.status, "ok");

    // Test /api/health/islands
    const islandsResponse = await fetch("http://localhost:8000/api/health/islands");
    assertEquals(islandsResponse.status, 200);
    const islandsData = await islandsResponse.json();
    assertEquals(islandsData.status, "ok");

    // Test /api/health/metrics
    const metricsResponse = await fetch("http://localhost:8000/api/health/metrics");
    assertEquals(metricsResponse.status, 200);
    const metricsData = await metricsResponse.json();
    assertEquals(metricsData.status, "ok");
  });

  await t.step("Metrics Endpoints", async () => {
    // Test /api/metrics
    const metricsResponse = await fetch("http://localhost:8000/api/metrics");
    assertEquals(metricsResponse.status, 200);
    const metricsData = await metricsResponse.json();
    assertExists(metricsData.metrics);

    // Test /api/metrics/verify
    const verifyResponse = await fetch("http://localhost:8000/api/metrics/verify");
    assertEquals(verifyResponse.status, 200);
    const verifyData = await verifyResponse.json();
    assertEquals(verifyData.status, "ok");

    // Test /api/metrics/record
    const recordResponse = await fetch("http://localhost:8000/api/metrics/record", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metric: "test", value: 1 }),
    });
    assertEquals(recordResponse.status, 200);
    const recordData = await recordResponse.json();
    assertEquals(recordData.status, "ok");
  });

  await t.step("Model Endpoint", async () => {
    const response = await fetch("http://localhost:8000/api/models");
    assertEquals(response.status, 200);
    const data = await response.json();
    assertExists(data.models);
  });

  await t.step("Test Endpoint", async () => {
    const response = await fetch("http://localhost:8000/api/ping");
    assertEquals(response.status, 200);
    const data = await response.json();
    assertEquals(data.status, "ok");
  });

  await t.step("Authentication Endpoints", async () => {
    // Test /api/auth/login
    const loginResponse = await fetch("http://localhost:8000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com", password: "password" }),
    });
    assertEquals(loginResponse.status, 200);

    // Test /api/auth/logout
    const logoutResponse = await fetch("http://localhost:8000/api/auth/logout", {
      method: "POST",
    });
    assertEquals(logoutResponse.status, 200);

    // Test /api/auth/check
    const checkResponse = await fetch("http://localhost:8000/api/auth/check");
    assertEquals(checkResponse.status, 200);
    const checkData = await checkResponse.json();
    assertEquals(checkData.authenticated, false);
  });
});
