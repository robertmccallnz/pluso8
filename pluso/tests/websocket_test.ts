import { describe, it, beforeEach, afterEach } from "tincan";
import { assertEquals, assertExists } from "testing/asserts.ts";
import { spy, stub } from "mock";
import { WebSocketClient } from "../utils/websocket.ts";
import {
  createMockWebSocket,
  createMockResponse,
  assertMessageSent,
  assertWebSocketConnected,
  type MockWebSocket,
} from "./test_helpers.ts";
import { TEST_CONFIG } from "./test_config.ts";

describe("WebSocketClient", () => {
  let mockWs: MockWebSocket;
  let wsClient: WebSocketClient;
  let onMessage: typeof spy;
  let onStatusChange: typeof spy;
  let onReconnecting: typeof spy;

  beforeEach(() => {
    mockWs = createMockWebSocket();
    onMessage = spy();
    onStatusChange = spy();
    onReconnecting = spy();

    // @ts-ignore - Mock WebSocket for testing
    globalThis.WebSocket = function() {
      return mockWs;
    };

    wsClient = new WebSocketClient("/test", {
      onMessage,
      onStatusChange,
      onReconnecting,
    });
  });

  afterEach(() => {
    wsClient.disconnect();
  });

  it("should connect to WebSocket server", () => {
    wsClient.connect();
    assertWebSocketConnected(mockWs);
  });

  it("should handle successful connection", () => {
    wsClient.connect();
    const openHandler = mockWs.addEventListener.calls.find(
      (call) => call.args[0] === "open"
    )?.args[1];
    
    openHandler?.();
    assertEquals(onStatusChange.calls[0].args[0], true);
  });

  it("should send messages", () => {
    wsClient.connect();
    const testMessage = "Hello, World!";
    wsClient.send(testMessage);
    assertMessageSent(mockWs, testMessage);
  });

  it("should handle incoming messages", () => {
    wsClient.connect();
    const messageHandler = mockWs.addEventListener.calls.find(
      (call) => call.args[0] === "message"
    )?.args[1];

    const testResponse = createMockResponse("Test response");
    messageHandler?.({ data: JSON.stringify(testResponse) });

    assertEquals(onMessage.calls[0].args[0], testResponse);
  });

  it("should handle connection errors", () => {
    wsClient.connect();
    const errorHandler = mockWs.addEventListener.calls.find(
      (call) => call.args[0] === "error"
    )?.args[1];

    errorHandler?.(new Error("Test error"));
    assertEquals(onStatusChange.calls[0].args[0], false);
    assertExists(
      onReconnecting.calls[0],
      "Expected reconnection attempt on error"
    );
  });

  it("should handle disconnection", () => {
    wsClient.connect();
    const closeHandler = mockWs.addEventListener.calls.find(
      (call) => call.args[0] === "close"
    )?.args[1];

    closeHandler?.({ wasClean: false });
    assertEquals(onStatusChange.calls[0].args[0], false);
    assertExists(
      onReconnecting.calls[0],
      "Expected reconnection attempt on unclean close"
    );
  });

  it("should handle clean disconnection without reconnect", () => {
    wsClient.connect();
    const closeHandler = mockWs.addEventListener.calls.find(
      (call) => call.args[0] === "close"
    )?.args[1];

    closeHandler?.({ wasClean: true });
    assertEquals(onStatusChange.calls[0].args[0], false);
    assertEquals(
      onReconnecting.calls.length,
      0,
      "Expected no reconnection attempt on clean close"
    );
  });
});
