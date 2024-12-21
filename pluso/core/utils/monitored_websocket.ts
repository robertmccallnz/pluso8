import { WebSocketClient, type WebSocketOptions } from "../deps.ts";

const ENVIRONMENT = Deno.env.get("DENO_ENV") || "development";

// Basic metrics collection for WebSocket monitoring
export interface WebSocketMetrics {
  connections: number;
  messages: number;
  errors: number;
  reconnects: number;
  avgLatency: number;
}

class MetricsCollector {
  private static instance: MetricsCollector;
  private metrics: WebSocketMetrics = {
    connections: 0,
    messages: 0,
    errors: 0,
    reconnects: 0,
    avgLatency: 0,
  };

  private constructor() {}

  static getInstance(): MetricsCollector {
    if (!MetricsCollector.instance) {
      MetricsCollector.instance = new MetricsCollector();
    }
    return MetricsCollector.instance;
  }

  recordConnection(): void {
    this.metrics.connections++;
  }

  recordMessage(): void {
    this.metrics.messages++;
  }

  recordError(): void {
    this.metrics.errors++;
  }

  recordReconnect(): void {
    this.metrics.reconnects++;
  }

  recordLatency(latency: number): void {
    this.metrics.avgLatency = (this.metrics.avgLatency + latency) / 2;
  }

  getMetrics(): WebSocketMetrics {
    return { ...this.metrics };
  }

  reset(): void {
    this.metrics = {
      connections: 0,
      messages: 0,
      errors: 0,
      reconnects: 0,
      avgLatency: 0,
    };
  }
}

export const metricsCollector = MetricsCollector.getInstance();

export class MonitoredWebSocket {
  private ws: WebSocketClient;
  private agentType: string;
  private startTime: number;
  private messageCount = 0;

  constructor(url: string, options: WebSocketOptions, agentType: string) {
    this.agentType = agentType;
    this.startTime = Date.now();

    // Initialize WebSocket with monitoring
    this.ws = new WebSocketClient(url, {
      ...options,
      onOpen: () => {
        metricsCollector.recordConnection();
        this.updateLatency();
        options.onOpen?.();
      },
      onClose: () => {
        options.onClose?.();
      },
      onMessage: (event) => {
        this.handleMessage(event);
        options.onMessage?.(event);
      },
      onError: (error) => {
        this.handleError(error);
        options.onError?.(error);
      }
    });

    // Start memory monitoring
    this.monitorMemory();
  }

  private updateLatency() {
    const latency = Date.now() - this.startTime;
    metricsCollector.recordLatency(latency);
  }

  private handleMessage(event: MessageEvent) {
    metricsCollector.recordMessage();

    try {
      const data = JSON.parse(event.data);
    } catch (error) {
      this.handleError(error);
    }
  }

  private handleError(error: unknown) {
    metricsCollector.recordError();
  }

  private async monitorMemory() {
    while (true) {
      const memory = await Deno.metrics();
      // Removed memory usage metrics
      await new Promise(resolve => setTimeout(resolve, 5000)); // Update every 5 seconds
    }
  }

  // Public methods that mirror WebSocketClient
  public send(data: string | ArrayBufferLike | Blob | ArrayBufferView) {
    metricsCollector.recordMessage();
    this.ws.send(data);
  }

  public close(code?: number, reason?: string) {
    this.ws.close(code, reason);
  }

  public get readyState(): number {
    return this.ws.readyState;
  }
}
