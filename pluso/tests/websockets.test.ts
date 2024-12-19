/// <reference lib="deno.ns" />
/// <reference lib="dom" />

import { assertEquals, assertExists, assertRejects } from "https://deno.land/std@0.208.0/assert/mod.ts";
import { delay } from "https://deno.land/std@0.208.0/async/delay.ts";

const BASE_URL = Deno.env.get("WS_URL") || "ws://localhost:8000";

interface WSEndpoint {
  path: string;
  testMessages: Array<{
    send: Record<string, unknown>;
    expectedResponse?: Record<string, unknown>;
    validateResponse?: (response: unknown) => boolean;
  }>;
  timeoutMs?: number;
}

const WS_ENDPOINTS: WSEndpoint[] = [
  // Chat WebSocket endpoints
  {
    path: "/api/agents/ws",
    testMessages: [
      {
        send: {
          type: "message",
          content: "test message",
          sessionId: "test-session"
        },
        validateResponse: (response) => {
          // Handle both string and JSON responses
          if (typeof response === "string") {
            return true; // Accept any string response
          }
          const data = response as Record<string, unknown>;
          return data.type === "message" && typeof data.content === "string";
        }
      }
    ],
    timeoutMs: 5000
  },
  {
    path: "/api/metrics/ws",
    testMessages: [
      {
        send: {
          type: "subscribe",
          metrics: ["activeAgents", "totalConversations"]
        },
        validateResponse: (response) => {
          if (typeof response === "string") {
            try {
              const data = JSON.parse(response);
              return data.type === "metrics" && 
                     Array.isArray(data.metrics) && 
                     data.metrics.length > 0;
            } catch {
              return false;
            }
          }
          const data = response as Record<string, unknown>;
          return data.type === "metrics" && 
                 Array.isArray(data.metrics) && 
                 data.metrics.length > 0;
        }
      }
    ],
    timeoutMs: 3000
  }
];

class WebSocketTestClient {
  private ws: WebSocket;
  private messageQueue: Array<{
    resolve: (value: unknown) => void;
    reject: (reason?: unknown) => void;
  }> = [];
  private connected = false;

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.setupEventHandlers();
  }

  private setupEventHandlers() {
    this.ws.onopen = () => {
      this.connected = true;
    };

    this.ws.onmessage = (event) => {
      const handler = this.messageQueue.shift();
      if (handler) {
        try {
          // Try to parse as JSON, but accept string responses
          let data: unknown;
          try {
            data = JSON.parse(event.data);
          } catch {
            data = event.data; // Use raw string if not JSON
          }
          handler.resolve(data);
        } catch (error) {
          handler.reject(error);
        }
      }
    };

    this.ws.onerror = (event) => {
      console.error("WebSocket error:", event);
      const handler = this.messageQueue.shift();
      if (handler) {
        handler.reject(new Error("WebSocket error"));
      }
    };

    this.ws.onclose = () => {
      this.connected = false;
    };
  }

  async waitForConnection(timeoutMs = 5000): Promise<void> {
    if (this.connected) return;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("WebSocket connection timeout"));
      }, timeoutMs);

      const checkConnection = () => {
        if (this.connected) {
          clearTimeout(timeout);
          resolve();
        } else if (this.ws.readyState === WebSocket.CLOSED) {
          clearTimeout(timeout);
          reject(new Error("WebSocket connection failed"));
        } else {
          setTimeout(checkConnection, 100);
        }
      };

      checkConnection();
    });
  }

  async sendAndWaitForResponse(
    message: Record<string, unknown>,
    timeoutMs = 5000
  ): Promise<unknown> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Response timeout"));
      }, timeoutMs);

      this.messageQueue.push({
        resolve: (value) => {
          clearTimeout(timeout);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timeout);
          reject(error);
        },
      });

      this.ws.send(JSON.stringify(message));
    });
  }

  close() {
    this.ws.close();
  }
}

async function testWebSocketEndpoint(endpoint: WSEndpoint): Promise<void> {
  const client = new WebSocketTestClient(`${BASE_URL}${endpoint.path}`);

  try {
    // Wait for connection
    await client.waitForConnection(endpoint.timeoutMs);
    console.log(`Connected to ${endpoint.path}`);

    // Test each message sequence
    for (const test of endpoint.testMessages) {
      console.log(`Testing message on ${endpoint.path}:`, test.send);
      const response = await client.sendAndWaitForResponse(
        test.send,
        endpoint.timeoutMs
      );
      console.log(`Received response from ${endpoint.path}:`, response);

      if (test.expectedResponse) {
        assertEquals(
          response,
          test.expectedResponse,
          `Unexpected response from ${endpoint.path}`
        );
      }

      if (test.validateResponse) {
        assertEquals(
          test.validateResponse(response),
          true,
          `Invalid response format from ${endpoint.path}`
        );
      }
    }
  } catch (error) {
    console.error(`Error testing ${endpoint.path}:`, error);
    throw error;
  } finally {
    client.close();
    // Allow time for cleanup
    await delay(100);
  }
}

Deno.test("WebSocket Endpoints Test Suite", async (t) => {
  for (const endpoint of WS_ENDPOINTS) {
    await t.step(`Testing WebSocket ${endpoint.path}`, async () => {
      await testWebSocketEndpoint(endpoint);
    });
  }
});
