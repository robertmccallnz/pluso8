import { assertEquals, spy } from "../deps.ts";
import { handler } from "../agents/routes/ws.ts";

Deno.test("Maia chat handler", async (t) => {
  let mockSocket: {
    send: typeof spy;
    onopen?: () => void;
    onmessage?: (event: { data: string }) => void;
    onclose?: () => void;
    onerror?: (error: Error) => void;
  };

  await t.step("setup", () => {
    mockSocket = {
      send: spy(),
    };

    // Mock Deno.upgradeWebSocket
    // @ts-ignore - Mock for testing
    globalThis.Deno = {
      ...globalThis.Deno,
      upgradeWebSocket: () => ({
        socket: mockSocket,
        response: new Response(),
      }),
    };
  });

  await t.step("should handle WebSocket upgrade", async () => {
    const req = new Request("ws://localhost/ws");
    const response = await handler(req, {} as any);

    assertEquals(response instanceof Response, true);
  });

  await t.step("should handle connection open", () => {
    // Simulate connection open
    mockSocket.onopen?.();

    assertEquals(mockSocket.send.calls.length, 1);
    const sentMessage = JSON.parse(mockSocket.send.calls[0].args[0]);
    assertEquals(sentMessage.type, "system");
    assertEquals(sentMessage.text, "Connected to Maia chat server");
  });

  await t.step("should handle user messages", () => {
    const testMessage = { text: "Test message" };
    mockSocket.onmessage?.({ data: JSON.stringify(testMessage) });

    // Should send "processing" message
    assertEquals(mockSocket.send.calls.length, 2);
    const processingMessage = JSON.parse(mockSocket.send.calls[1].args[0]);
    assertEquals(processingMessage.type, "system");
    assertEquals(
      processingMessage.text,
      "Processing your development question..."
    );
  });

  await t.step("should handle invalid JSON messages", () => {
    mockSocket.onmessage?.({ data: "invalid json" });

    assertEquals(mockSocket.send.calls.length, 3);
    const errorMessage = JSON.parse(mockSocket.send.calls[2].args[0]);
    assertEquals(errorMessage.type, "system");
    assertEquals(
      errorMessage.text,
      "Invalid message format. Please send a JSON object with a 'text' field."
    );
  });

  await t.step("should handle empty messages", () => {
    mockSocket.onmessage?.({ data: JSON.stringify({ text: "" }) });

    assertEquals(mockSocket.send.calls.length, 4);
    const emptyErrorMessage = JSON.parse(mockSocket.send.calls[3].args[0]);
    assertEquals(emptyErrorMessage.type, "system");
    assertEquals(emptyErrorMessage.text, "Message cannot be empty");
  });

  await t.step("should handle connection errors", () => {
    mockSocket.onerror?.(new Error("Test error"));

    assertEquals(mockSocket.send.calls.length, 5);
    const errorErrorMessage = JSON.parse(mockSocket.send.calls[4].args[0]);
    assertEquals(errorErrorMessage.type, "system");
    assertEquals(
      errorErrorMessage.text,
      "A connection error occurred. Please try refreshing the page."
    );
  });

  await t.step("cleanup", () => {
    mockSocket.onclose?.();
  });
});
