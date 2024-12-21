import { assertEquals, assertExists } from "https://deno.land/std@0.208.0/testing/asserts.ts";
import { RouteAnalyzer } from "../services/route-analyzer.ts";
import { ErrorInterceptor } from "../services/error-interceptor.ts";
import { db } from "../utils/db.ts";

interface ErrorPattern {
  severity: string;
  context: {
    type: string;
  };
  count: number;
  type: string;
  suggestedFixes: string[];
}

Deno.test("Agent Loading Test Suite", async (t) => {
  const routeAnalyzer = RouteAnalyzer.getInstance();
  const errorInterceptor = ErrorInterceptor.getInstance();

  await t.step("initialize agent with missing database connection", async () => {
    // Simulate database connection issue
    const originalGetConnection = db.getConnection;
    db.getConnection = async () => { throw new Error("ECONNREFUSED"); };

    try {
      const response = await fetch("http://localhost:8000/api/agents/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "test-user" })
      });

      const data = await response.json();
      assertEquals(response.status, 500);
      assertExists(data.error);

      // Check error was intercepted
      const routeAnalysis = await routeAnalyzer.getRouteErrorSummary("/api/agents/initialize");
      assertExists(routeAnalysis);
      assertEquals(routeAnalysis.type, "api");
      
      // Verify error patterns
      const patterns = Array.from(routeAnalysis.errorPatterns.values()) as ErrorPattern[];
      assertEquals(patterns.length > 0, true);
      assertEquals(patterns[0].severity, "critical");
      
      // Check connected components
      assertEquals(routeAnalysis.connectedIslands.includes("AgentWizard"), true);
      
    } finally {
      // Restore original connection function
      db.getConnection = originalGetConnection;
    }
  });

  await t.step("initialize agent with invalid user", async () => {
    const response = await fetch("http://localhost:8000/api/agents/initialize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}) // Missing userId
    });

    const data = await response.json();
    assertEquals(response.status, 400);
    assertEquals(data.error, "User ID is required");

    // Check error was intercepted
    const routeAnalysis = await routeAnalyzer.getRouteErrorSummary("/api/agents/initialize");
    assertExists(routeAnalysis);
    
    // Verify validation error patterns
    const patterns = Array.from(routeAnalysis.errorPatterns.values()) as ErrorPattern[];
    const validationErrors = patterns.filter(p => p.context.type === "validation");
    assertEquals(validationErrors.length > 0, true);
  });

  await t.step("test error propagation to AgentWizard", async () => {
    // Simulate a chain of errors
    const errors: Array<{route: string; status?: number; error: string}> = [];
    try {
      // 1. Database error
      const originalGetConnection = db.getConnection;
      db.getConnection = async () => { throw new Error("ECONNREFUSED"); };
      
      // 2. API call from AgentWizard
      const response = await fetch("http://localhost:8000/api/agents/initialize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "test-user" })
      });

      const responseData = await response.json();
      errors.push({
        route: "/api/agents/initialize",
        status: response.status,
        error: responseData.error || "Unknown error"
      });

      // Restore connection function
      db.getConnection = originalGetConnection;

    } catch (error) {
      errors.push({
        route: "AgentWizard",
        error: error instanceof Error ? error.message : String(error)
      });
    }

    // Check error propagation
    const analysis = await routeAnalyzer.getErrorImpactAnalysis(errors[0].error);
    assertExists(analysis);
    
    // Verify error propagation path
    const { affectedRoutes } = analysis;
    assertEquals(affectedRoutes.includes("/api/agents/initialize"), true);
    assertEquals(affectedRoutes.includes("AgentWizard"), true);
    
    // Check dependency chain
    const dependencies = analysis.analysis.dependencyChain;
    assertEquals(dependencies.includes("db"), true);
    assertEquals(dependencies.includes("AgentConfig"), true);
  });

  await t.step("test error pattern learning", async () => {
    // Generate multiple similar errors
    const errors: Error[] = [];
    for (let i = 0; i < 5; i++) {
      try {
        await fetch("http://localhost:8000/api/agents/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}) // Missing userId each time
        });
      } catch (error) {
        if (error instanceof Error) {
          errors.push(error);
        }
      }
    }

    // Check if patterns were learned
    const routeAnalysis = await routeAnalyzer.getRouteErrorSummary("/api/agents/initialize");
    const patterns = Array.from(routeAnalysis.errorPatterns.values()) as ErrorPattern[];
    
    // Should have consolidated similar errors
    const uniquePatterns = new Set(patterns.map(p => p.type));
    assertEquals(uniquePatterns.size < errors.length, true);
    
    // Should have learned from repeated errors
    const learnedPattern = patterns.find(p => p.count > 1);
    assertExists(learnedPattern);
    assertEquals(learnedPattern.suggestedFixes.length > 0, true);
  });
});
