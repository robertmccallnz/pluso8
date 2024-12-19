// Define metrics-related types
export interface MetricsData {
    timestamp: string;
    value: number;
    label?: string;
}

export interface MetricsSummary {
    id: string;
    name: string;
    value: number;
    timestamp: string;
    change?: number;
    trend?: 'up' | 'down' | 'stable';
}
