import { assertEquals, assertExists, spy } from "../deps.ts";
import { WebSocketClient } from "../utils/websocket.ts";
import {
  createMockWebSocket,
  createMockResponse,
  assertMessageSent,
  assertWebSocketConnected,
  type MockWebSocket,
} from "./test_helpers.ts";

Deno.test("WebSocket Tests", async (t) => {
  let mockWs: MockWebSocket;
  let wsClient: WebSocketClient;
  let onMessage: typeof spy;
  let onStatusChange: typeof spy;
  let onReconnecting: typeof spy;

  await t.step("setup", () => {
    mockWs = createMockWebSocket();
    onMessage = spy();
    onStatusChange = spy();
    onReconnecting = spy();

    // Mock WebSocket constructor
    (globalThis as any).WebSocket = class {
      constructor() {
        return mockWs;
      }
    };

    wsClient = new WebSocketClient("/test", {
      onMessage,
      onStatusChange,
      onReconnecting,
    });
  });

  await t.step("should connect successfully", async () => {
    await wsClient.connect();
    assertWebSocketConnected(mockWs);
    mockWs.onopen?.();
    assertEquals(onStatusChange.calls[0].args[0], true);
  });

  await t.step("should handle messages", () => {
    const testMessage = "test message";
    mockWs.onmessage?.({ data: testMessage });
    assertEquals(onMessage.calls[0].args[0], testMessage);
  });

  await t.step("should handle reconnection", () => {
    mockWs.onclose?.({} as CloseEvent);
    assertEquals(onStatusChange.calls[1].args[0], false);
    assertEquals(onReconnecting.calls[0].args[0], 1);
  });

  await t.step("cleanup", () => {
    wsClient.disconnect();
    delete (globalThis as any).WebSocket;
  });
});
