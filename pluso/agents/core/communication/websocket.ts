import { Handler } from "$fresh/server.ts";

export class WebSocketHandler {
  private ws: WebSocket | null = null;

  constructor() {}

  public handleUpgrade(req: Request): Response {
    const { socket, response } = Deno.upgradeWebSocket(req);
    this.ws = socket;

    this.ws.onopen = () => {
      console.log("WebSocket connection established");
    };

    this.ws.onmessage = (event) => {
      console.log("Received message:", event.data);
    };

    this.ws.onclose = () => {
      console.log("WebSocket connection closed");
      this.ws = null;
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    return response;
  }

  public send(message: string | ArrayBufferLike | Blob | ArrayBufferView): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.warn("WebSocket is not connected");
    }
  }

  public close(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
