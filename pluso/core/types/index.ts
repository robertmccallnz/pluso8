// Core type definitions
export * from './models.ts';
export * from '../../agents/types/agent.ts';
export * from './responses.ts';
export * from './home.ts';

// Metrics types
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

// Re-export specific types that are commonly used
export type { Model } from './models.ts';
export type { AgentConfig, AgentResponse } from '../../agents/types/agent.ts';
export type { Feature, HomePageData } from './home.ts';
