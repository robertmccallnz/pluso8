import { WebSocketClient } from "../deps.ts";
import { formatChatMessage, type FormattedMessage } from "./chat_formatting.ts";

// WebSocket configuration
export const wsConfig = {
  reconnectInterval: 1000,
  maxReconnectAttempts: 5,
  pingInterval: 30000,
};

// Network error handler
export function handleNetworkError(error: Error): void {
  console.error('WebSocket error:', error);
}

// WebSocket authentication parameters
export function getWsAuthParams(): Record<string, string> {
  return {
    // Add any authentication parameters here
    timestamp: new Date().toISOString(),
  };
}

export class WebSocketService {
  private ws: WebSocketClient | null = null;
  private url: string;
  private messageHandlers: Set<(message: FormattedMessage) => void> = new Set();
  private statusHandlers: Set<(connected: boolean) => void> = new Set();
  private reconnectHandlers: Set<(attempt: number, max: number) => void> = new Set();

  constructor(path: string) {
    this.url = `${path}?${new URLSearchParams(getWsAuthParams()).toString()}`;
  }

  connect(): void {
    try {
      this.ws = new WebSocketClient(this.url, wsConfig);

      this.ws.onOpen(() => {
        this.notifyStatusHandlers(true);
      });

      this.ws.onClose(() => {
        this.notifyStatusHandlers(false);
      });

      this.ws.onMessage((event) => {
        try {
          const data = JSON.parse(event.data);
          const message = formatChatMessage(data.text, data.type);
          this.notifyMessageHandlers(message);
        } catch (error) {
          handleNetworkError(error);
        }
      });

      this.ws.onReconnect((attempt: number) => {
        this.notifyReconnectHandlers(attempt, wsConfig.maxReconnectAttempts);
      });

      this.ws.onError((error) => {
        handleNetworkError(error);
      });

    } catch (error) {
      handleNetworkError(error);
    }
  }

  disconnect(): void {
    this.ws?.close();
    this.ws = null;
  }

  send(message: string): void {
    if (!this.ws) {
      throw new Error("WebSocket not connected");
    }
    this.ws.send(message);
  }

  onMessage(handler: (message: FormattedMessage) => void): () => void {
    this.messageHandlers.add(handler);
    return () => this.messageHandlers.delete(handler);
  }

  onStatusChange(handler: (connected: boolean) => void): () => void {
    this.statusHandlers.add(handler);
    return () => this.statusHandlers.delete(handler);
  }

  onReconnecting(handler: (attempt: number, max: number) => void): () => void {
    this.reconnectHandlers.add(handler);
    return () => this.reconnectHandlers.delete(handler);
  }

  private notifyMessageHandlers(message: FormattedMessage): void {
    this.messageHandlers.forEach((handler) => handler(message));
  }

  private notifyStatusHandlers(connected: boolean): void {
    this.statusHandlers.forEach((handler) => handler(connected));
  }

  private notifyReconnectHandlers(attempt: number, max: number): void {
    this.reconnectHandlers.forEach((handler) => handler(attempt, max));
  }
}
