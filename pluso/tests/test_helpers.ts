import { spy, Spy } from "mock";
import { assertEquals, assertExists } from "testing/asserts.ts";
import { TEST_CONFIG } from "./test_config.ts";

export interface MockWebSocket {
  send: Spy;
  close: Spy;
  addEventListener: Spy;
  removeEventListener: Spy;
}

export function createMockWebSocket(): MockWebSocket {
  return {
    send: spy(),
    close: spy(),
    addEventListener: spy(),
    removeEventListener: spy(),
  };
}

export function createMockResponse(text: string, type: 'user' | 'assistant' | 'system' = 'assistant') {
  return {
    text,
    type,
    timestamp: Date.now(),
  };
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function assertMessageSent(ws: MockWebSocket, expectedMessage: string) {
  assertEquals(
    ws.send.calls.length,
    1,
    "Expected exactly one message to be sent"
  );
  const sentMessage = JSON.parse(ws.send.calls[0].args[0]);
  assertEquals(sentMessage.text, expectedMessage);
}

export function assertWebSocketConnected(ws: MockWebSocket) {
  assertExists(
    ws.addEventListener.calls.find((call) => call.args[0] === "open"),
    "Expected WebSocket to add 'open' event listener"
  );
  assertExists(
    ws.addEventListener.calls.find((call) => call.args[0] === "message"),
    "Expected WebSocket to add 'message' event listener"
  );
  assertExists(
    ws.addEventListener.calls.find((call) => call.args[0] === "close"),
    "Expected WebSocket to add 'close' event listener"
  );
  assertExists(
    ws.addEventListener.calls.find((call) => call.args[0] === "error"),
    "Expected WebSocket to add 'error' event listener"
  );
}
