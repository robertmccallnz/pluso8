import { Task } from '../multi-agent/TaskRouter';
import { AgentConfig } from '../multi-agent/AgentOrchestrator';

interface PerformanceMetric {
  timestamp: string;
  value: number;
  metadata?: Record<string, any>;
}

interface AgentMetrics {
  successRate: PerformanceMetric[];
  responseTime: PerformanceMetric[];
  tokenUsage: PerformanceMetric[];
  errorRate: PerformanceMetric[];
  costEfficiency: PerformanceMetric[];
  qualityScore: PerformanceMetric[];
}

interface SystemMetrics {
  throughput: PerformanceMetric[];
  latency: PerformanceMetric[];
  concurrency: PerformanceMetric[];
  resourceUsage: PerformanceMetric[];
  queueLength: PerformanceMetric[];
}

export class PerformanceAnalytics {
  private agentMetrics: Map<string, AgentMetrics> = new Map();
  private systemMetrics: SystemMetrics = {
    throughput: [],
    latency: [],
    concurrency: [],
    resourceUsage: [],
    queueLength: []
  };

  recordAgentMetric(
    agentId: string,
    metricType: keyof AgentMetrics,
    value: number,
    metadata?: Record<string, any>
  ): void {
    if (!this.agentMetrics.has(agentId)) {
      this.agentMetrics.set(agentId, {
        successRate: [],
        responseTime: [],
        tokenUsage: [],
        errorRate: [],
        costEfficiency: [],
        qualityScore: []
      });
    }

    const metrics = this.agentMetrics.get(agentId)!;
    metrics[metricType].push({
      timestamp: new Date().toISOString(),
      value,
      metadata
    });
  }

  recordSystemMetric(
    metricType: keyof SystemMetrics,
    value: number,
    metadata?: Record<string, any>
  ): void {
    this.systemMetrics[metricType].push({
      timestamp: new Date().toISOString(),
      value,
      metadata
    });
  }

  getAgentPerformance(agentId: string, timeRange?: { start: string; end: string }): {
    current: Record<keyof AgentMetrics, number>;
    trend: Record<keyof AgentMetrics, 'up' | 'down' | 'stable'>;
    insights: string[];
  } {
    const metrics = this.agentMetrics.get(agentId);
    if (!metrics) {
      return {
        current: {
          successRate: 0,
          responseTime: 0,
          tokenUsage: 0,
          errorRate: 0,
          costEfficiency: 0,
          qualityScore: 0
        },
        trend: {
          successRate: 'stable',
          responseTime: 'stable',
          tokenUsage: 'stable',
          errorRate: 'stable',
          costEfficiency: 'stable',
          qualityScore: 'stable'
        },
        insights: ['No data available']
      };
    }

    const current: Record<keyof AgentMetrics, number> = {} as any;
    const trend: Record<keyof AgentMetrics, 'up' | 'down' | 'stable'> = {} as any;
    const insights: string[] = [];

    // Calculate current values and trends
    Object.entries(metrics).forEach(([key, values]) => {
      const filteredValues = timeRange
        ? values.filter(
            m =>
              m.timestamp >= timeRange.start &&
              m.timestamp <= timeRange.end
          )
        : values;

      if (filteredValues.length === 0) {
        current[key as keyof AgentMetrics] = 0;
        trend[key as keyof AgentMetrics] = 'stable';
        return;
      }

      // Calculate current value (average of last 5 measurements)
      const recentValues = filteredValues.slice(-5);
      current[key as keyof AgentMetrics] =
        recentValues.reduce((sum, m) => sum + m.value, 0) / recentValues.length;

      // Calculate trend
      const oldValues = filteredValues.slice(-10, -5);
      if (oldValues.length > 0) {
        const oldAvg =
          oldValues.reduce((sum, m) => sum + m.value, 0) / oldValues.length;
        const change = ((current[key as keyof AgentMetrics] - oldAvg) / oldAvg) * 100;

        trend[key as keyof AgentMetrics] =
          Math.abs(change) < 5 ? 'stable' : change > 0 ? 'up' : 'down';

        // Generate insights
        if (Math.abs(change) > 20) {
          insights.push(
            `${key} has ${change > 0 ? 'increased' : 'decreased'} by ${Math.abs(
              change
            ).toFixed(1)}%`
          );
        }
      } else {
        trend[key as keyof AgentMetrics] = 'stable';
      }
    });

    // Add additional insights
    if (current.errorRate > 0.1) {
      insights.push('High error rate detected');
    }
    if (current.responseTime > 1000) {
      insights.push('Response time is above threshold');
    }
    if (current.costEfficiency < 0.7) {
      insights.push('Cost efficiency could be improved');
    }

    return { current, trend, insights };
  }

  getSystemPerformance(timeRange?: { start: string; end: string }): {
    metrics: Record<keyof SystemMetrics, number>;
    trends: Record<keyof SystemMetrics, 'up' | 'down' | 'stable'>;
    insights: string[];
    recommendations: string[];
  } {
    const metrics: Record<keyof SystemMetrics, number> = {} as any;
    const trends: Record<keyof SystemMetrics, 'up' | 'down' | 'stable'> = {} as any;
    const insights: string[] = [];
    const recommendations: string[] = [];

    Object.entries(this.systemMetrics).forEach(([key, values]) => {
      const filteredValues = timeRange
        ? values.filter(
            m =>
              m.timestamp >= timeRange.start &&
              m.timestamp <= timeRange.end
          )
        : values;

      if (filteredValues.length === 0) {
        metrics[key as keyof SystemMetrics] = 0;
        trends[key as keyof SystemMetrics] = 'stable';
        return;
      }

      // Calculate current value
      const recentValues = filteredValues.slice(-5);
      metrics[key as keyof SystemMetrics] =
        recentValues.reduce((sum, m) => sum + m.value, 0) / recentValues.length;

      // Calculate trend
      const oldValues = filteredValues.slice(-10, -5);
      if (oldValues.length > 0) {
        const oldAvg =
          oldValues.reduce((sum, m) => sum + m.value, 0) / oldValues.length;
        const change = ((metrics[key as keyof SystemMetrics] - oldAvg) / oldAvg) * 100;

        trends[key as keyof SystemMetrics] =
          Math.abs(change) < 5 ? 'stable' : change > 0 ? 'up' : 'down';

        // Generate insights and recommendations
        if (key === 'throughput' && change < -10) {
          insights.push('System throughput has decreased');
          recommendations.push('Consider scaling up resources');
        }
        if (key === 'latency' && change > 10) {
          insights.push('System latency has increased');
          recommendations.push('Investigate potential bottlenecks');
        }
        if (key === 'queueLength' && change > 20) {
          insights.push('Task queue length is growing');
          recommendations.push('Add more worker agents');
        }
      } else {
        trends[key as keyof SystemMetrics] = 'stable';
      }
    });

    // Add system-wide insights
    if (metrics.resourceUsage > 80) {
      insights.push('High resource usage detected');
      recommendations.push('Consider optimizing resource allocation');
    }
    if (metrics.concurrency < metrics.queueLength * 0.5) {
      insights.push('Low concurrency relative to queue length');
      recommendations.push('Increase concurrent task processing');
    }

    return { metrics, trends, insights, recommendations };
  }

  generateReport(timeRange: { start: string; end: string }): {
    summary: string;
    details: Record<string, any>;
    recommendations: string[];
  } {
    const systemPerf = this.getSystemPerformance(timeRange);
    const agentPerfs = Array.from(this.agentMetrics.entries()).map(
      ([agentId, _]) => ({
        agentId,
        ...this.getAgentPerformance(agentId, timeRange)
      })
    );

    const summary = [
      'System Performance Summary:',
      `- Average throughput: ${systemPerf.metrics.throughput.toFixed(2)} tasks/s`,
      `- Average latency: ${systemPerf.metrics.latency.toFixed(2)}ms`,
      `- Resource usage: ${systemPerf.metrics.resourceUsage.toFixed(2)}%`,
      '',
      'Agent Performance Summary:',
      ...agentPerfs.map(
        perf =>
          `- Agent ${perf.agentId}: ${(perf.current.successRate * 100).toFixed(
            1
          )}% success rate`
      )
    ].join('\\n');

    return {
      summary,
      details: {
        system: systemPerf,
        agents: agentPerfs
      },
      recommendations: [
        ...systemPerf.recommendations,
        ...agentPerfs.flatMap(perf => perf.insights)
      ]
    };
  }
}
