// Tool interface for custom implementations
export interface CustomTool {
  name: string;
  description: string;
  execute(input: unknown): Promise<unknown>;
  validateInput(input: unknown): boolean;
  validateOutput(output: unknown): boolean;
}

// Tool configuration
export interface ToolConfig {
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, unknown>;
  metrics?: ToolMetric[];
}

// Tool metric configuration
export interface ToolMetric {
  name: string;
  type: "counter" | "gauge" | "histogram";
  description?: string;
  labels?: string[];
}

// Tool execution result
export interface ToolResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
  metrics: {
    executionTime: number;
    memoryUsage?: number;
    customMetrics?: Record<string, number>;
  };
}
