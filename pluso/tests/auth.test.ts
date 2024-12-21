import { assertEquals, assertExists, assert } from "https://deno.land/std@0.194.0/testing/asserts.ts";

// Test configuration
const TEST_BASE_URL = "http://localhost:8000";

// Mock fetch for testing
const originalFetch = globalThis.fetch;
let mockFetchResponse: Response | null = null;

function mockFetch(response: Response) {
  mockFetchResponse = response;
  globalThis.fetch = async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === 'string' ? new URL(input, TEST_BASE_URL) : input;
    console.log(`[Test] Mocked fetch to ${url.toString()}`);
    return mockFetchResponse!;
  };
}

function resetFetch() {
  mockFetchResponse = null;
  globalThis.fetch = originalFetch;
}

// Helper function to create mock responses
function createMockResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 
      "Content-Type": "application/json",
      "Set-Cookie": "sb-auth-token=test-token; Path=/; Secure; SameSite=Lax"
    }
  });
}

Deno.test({
  name: "Auth Test Suite",
  async fn(t) {
    await t.step("Login - Success", async () => {
      // Mock successful login response
      const mockSession = {
        access_token: "test-token",
        expires_at: Date.now() + 3600000
      };
      const mockUser = {
        id: "test-id",
        email: "test@example.com"
      };
      
      mockFetch(createMockResponse({
        success: true,
        redirectTo: "/dashboard",
        user: mockUser,
        session: mockSession
      }));

      // Test login request
      const response = await fetch(new URL("/api/auth/login", TEST_BASE_URL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123"
        }),
        credentials: "include"
      });

      const data = await response.json();

      // Assertions
      assertEquals(response.status, 200);
      assertEquals(data.success, true);
      assertEquals(data.redirectTo, "/dashboard");
      assertExists(data.user);
      assertEquals(data.user.email, "test@example.com");

      // Check cookie
      const cookies = response.headers.get("Set-Cookie");
      assertExists(cookies);
      assert(cookies.includes("sb-auth-token"));

      resetFetch();
    });

    await t.step("Login - Invalid Credentials", async () => {
      // Mock failed login response
      mockFetch(createMockResponse({
        error: "Invalid login credentials"
      }, 400));

      // Test login request
      const response = await fetch(new URL("/api/auth/login", TEST_BASE_URL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "wrongpassword"
        }),
        credentials: "include"
      });

      const data = await response.json();

      // Assertions
      assertEquals(response.status, 400);
      assertEquals(data.error, "Invalid login credentials");

      resetFetch();
    });

    await t.step("Login - Missing Fields", async () => {
      // Mock error response
      mockFetch(createMockResponse({
        error: "Missing required fields"
      }, 400));

      // Test login request without password
      const response = await fetch(new URL("/api/auth/login", TEST_BASE_URL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "test@example.com"
        }),
        credentials: "include"
      });

      const data = await response.json();

      // Assertions
      assertEquals(response.status, 400);
      assertExists(data.error);

      resetFetch();
    });

    await t.step("Auth Check - Valid Token", async () => {
      // Mock successful auth check
      const mockUser = {
        id: "test-id",
        email: "test@example.com"
      };

      mockFetch(createMockResponse({
        user: mockUser
      }));

      // Test auth check
      const response = await fetch(new URL("/api/dashboard", TEST_BASE_URL), {
        headers: {
          "Authorization": "Bearer test-token"
        },
        credentials: "include"
      });

      const data = await response.json();

      // Assertions
      assertEquals(response.status, 200);
      assertExists(data.user);
      assertEquals(data.user.email, "test@example.com");

      resetFetch();
    });

    await t.step("Auth Check - Invalid Token", async () => {
      // Mock failed auth check
      mockFetch(createMockResponse({
        error: "Invalid token"
      }, 401));

      // Test auth check
      const response = await fetch(new URL("/api/dashboard", TEST_BASE_URL), {
        headers: {
          "Authorization": "Bearer invalid-token"
        },
        credentials: "include"
      });

      const data = await response.json();

      // Assertions
      assertEquals(response.status, 401);
      assertEquals(data.error, "Invalid token");

      resetFetch();
    });

    await t.step("Logout", async () => {
      // Mock successful logout
      mockFetch(new Response(null, {
        status: 302,
        headers: {
          "Location": "/login",
          "Set-Cookie": "sb-auth-token=; Path=/; Secure; SameSite=Lax; Max-Age=0"
        }
      }));

      // Test logout
      const response = await fetch(new URL("/api/auth/logout", TEST_BASE_URL), {
        credentials: "include"
      });

      // Assertions
      assertEquals(response.status, 302);
      assertEquals(response.headers.get("Location"), "/login");

      // Check that cookie is cleared
      const cookies = response.headers.get("Set-Cookie");
      assertExists(cookies);
      assert(cookies.includes("Max-Age=0"));

      resetFetch();
    });

    await t.step("Integration Test - Full Login Flow", async () => {
      // 1. Start with login
      mockFetch(createMockResponse({
        success: true,
        redirectTo: "/dashboard",
        user: {
          id: "test-id",
          email: "test@example.com"
        },
        session: {
          access_token: "test-token",
          expires_at: Date.now() + 3600000
        }
      }));

      const loginResponse = await fetch(new URL("/api/auth/login", TEST_BASE_URL), {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: "test@example.com",
          password: "password123"
        }),
        credentials: "include"
      });

      const loginData = await loginResponse.json();
      assertEquals(loginResponse.status, 200);
      assertExists(loginData.user);

      // 2. Get auth token from cookie
      const cookies = loginResponse.headers.get("Set-Cookie");
      assertExists(cookies);
      const token = cookies.match(/sb-auth-token=([^;]*)/)?.[1];
      assertExists(token);

      // 3. Access dashboard with token
      mockFetch(createMockResponse({
        user: {
          id: "test-id",
          email: "test@example.com"
        }
      }));

      const dashboardResponse = await fetch(new URL("/api/dashboard", TEST_BASE_URL), {
        headers: {
          "Authorization": `Bearer ${token}`
        },
        credentials: "include"
      });

      const dashboardData = await dashboardResponse.json();
      assertEquals(dashboardResponse.status, 200);
      assertExists(dashboardData.user);

      // 4. Logout
      mockFetch(new Response(null, {
        status: 302,
        headers: {
          "Location": "/login",
          "Set-Cookie": "sb-auth-token=; Path=/; Secure; SameSite=Lax; Max-Age=0"
        }
      }));

      const logoutResponse = await fetch(new URL("/api/auth/logout", TEST_BASE_URL), {
        credentials: "include"
      });

      assertEquals(logoutResponse.status, 302);
      assertEquals(logoutResponse.headers.get("Location"), "/login");

      resetFetch();
    });
  }
});
