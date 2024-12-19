export interface ChatMessage {
  text: string;
  type: 'user' | 'assistant' | 'system';
  timestamp?: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 3;
  private readonly reconnectDelay = 2000;
  private reconnectTimeout: number | null = null;

  constructor(
    private readonly endpoint: string,
    private readonly callbacks: {
      onMessage: (message: ChatMessage) => void;
      onStatusChange: (connected: boolean) => void;
      onReconnecting?: (attempt: number, max: number) => void;
    }
  ) {
    this.url = this.getWebSocketUrl(endpoint);
  }

  private getWebSocketUrl(endpoint: string): string {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${endpoint}`;
  }

  connect(): void {
    if (this.isConnecting || (this.ws?.readyState === WebSocket.OPEN)) {
      console.log("[WebSocket] Already connected or connecting");
      return;
    }

    this.isConnecting = true;

    try {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }

      this.ws = new WebSocket(this.url);

      this.ws.addEventListener('open', () => {
        console.log('[WebSocket] Connected successfully');
        this.isConnecting = false;
        this.callbacks.onStatusChange(true);
        this.reconnectAttempts = 0;
        if (this.reconnectTimeout) {
          clearTimeout(this.reconnectTimeout);
          this.reconnectTimeout = null;
        }
      });

      this.ws.addEventListener('message', (event) => {
        try {
          const data = JSON.parse(event.data);
          if (!data.text) {
            throw new Error('Invalid message format: missing text field');
          }
          this.callbacks.onMessage({
            text: data.text,
            type: data.type || 'assistant',
            timestamp: Date.now(),
          });
        } catch (error) {
          console.error('[WebSocket] Error parsing message:', error);
          this.callbacks.onMessage({
            text: 'Error processing message. Please try again.',
            type: 'system',
            timestamp: Date.now(),
          });
        }
      });

      this.ws.addEventListener('close', (event) => {
        console.log(`[WebSocket] Connection closed. Code: ${event.code}, Reason: ${event.reason}`);
        this.isConnecting = false;
        this.callbacks.onStatusChange(false);
        if (!event.wasClean) {
          this.handleReconnect();
        }
      });

      this.ws.addEventListener('error', (error) => {
        console.error('[WebSocket] Connection error:', error);
        this.isConnecting = false;
        this.callbacks.onStatusChange(false);
        this.handleReconnect();
      });
    } catch (error) {
      console.error('[WebSocket] Failed to create connection:', error);
      this.isConnecting = false;
      this.callbacks.onStatusChange(false);
      this.handleReconnect();
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`[WebSocket] Reconnect attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`);
      this.callbacks.onReconnecting?.(this.reconnectAttempts, this.maxReconnectAttempts);
      
      const delay = this.reconnectDelay * this.reconnectAttempts;
      console.log(`[WebSocket] Waiting ${delay}ms before reconnecting`);
      this.reconnectTimeout = setTimeout(() => this.connect(), delay);
    }
  }

  send(message: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('WebSocket is not connected');
    }

    try {
      this.ws.send(JSON.stringify({ text: message }));
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  close(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }
}
