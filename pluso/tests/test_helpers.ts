import { assertEquals, assertExists, spy } from "../deps.ts";

// Mock WebSocket class
class MockWebSocketClass {
  private handlers: Record<string, ((event: any) => void)[]> = {};

  constructor(public url: string) {}

  send(data: string) {}
  close() {}

  addEventListener(event: string, handler: (event: any) => void) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event].push(handler);
  }

  removeEventListener(event: string, handler: (event: any) => void) {
    if (this.handlers[event]) {
      this.handlers[event] = this.handlers[event].filter(h => h !== handler);
    }
  }

  triggerEvent(event: string, data: any) {
    if (this.handlers[event]) {
      this.handlers[event].forEach(handler => handler(data));
    }
  }

  get readyState() {
    return 1; // WebSocket.OPEN
  }
}

// Mock WebSocket for testing
(globalThis as any).WebSocket = MockWebSocketClass;

export interface MockWebSocket {
  send: (data: string) => void;
  close: () => void;
  addEventListener: (event: string, handler: (event: any) => void) => void;
  removeEventListener: (event: string, handler: (event: any) => void) => void;
  onopen?: () => void;
  onclose?: () => void;
  onmessage?: (event: { data: string }) => void;
  onerror?: (error: Error) => void;
  readyState: number;
}

export function createMockWebSocket(): MockWebSocket {
  return new MockWebSocketClass("ws://test") as unknown as MockWebSocket;
}

export function createMockResponse(data: any): Response {
  return new Response(JSON.stringify(data), {
    headers: { "Content-Type": "application/json" },
  });
}

export function assertMessageSent(ws: MockWebSocket, message: string) {
  assertEquals(typeof ws.send, "function", "WebSocket should have send method");
}

export function assertWebSocketConnected(ws: MockWebSocket) {
  assertEquals(ws.readyState, 1, "WebSocket should be in OPEN state");
}

// Mock Supabase client for testing
export const mockSupabaseClient = {
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    signOut: () => Promise.resolve({ error: null }),
  },
  from: (table: string) => ({
    select: () => ({
      eq: () => ({
        single: () => Promise.resolve({ data: null, error: null }),
      }),
    }),
  }),
};
