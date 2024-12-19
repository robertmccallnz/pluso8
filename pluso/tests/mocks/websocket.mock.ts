// Mock WebSocket implementation for testing
class WebSocketMock {
  private url: string;
  private listeners: Record<string, Array<(event: any) => void>> = {};

  constructor(url: string) {
    this.url = url;
  }

  addEventListener(event: string, callback: (event: any) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }

  removeEventListener(event: string, callback: (event: any) => void) {
    if (this.listeners[event]) {
      this.listeners[event] = this.listeners[event].filter(cb => cb !== callback);
    }
  }

  send(data: string) {
    // Mock implementation - can be enhanced based on testing needs
  }

  close() {
    // Mock implementation
  }

  // Helper method to simulate receiving messages in tests
  mockReceiveMessage(data: any) {
    const messageEvent = { data };
    this.listeners['message']?.forEach(callback => callback(messageEvent));
  }
}

// Make it globally available
(globalThis as any).WebSocket = WebSocketMock;
