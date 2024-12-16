import { Task } from '../multi-agent/TaskRouter';
import { AgentMessage } from '../multi-agent/AgentOrchestrator';

interface DebugEvent {
  id: string;
  timestamp: string;
  type: 'error' | 'warning' | 'info' | 'debug';
  source: string;
  message: string;
  metadata: any;
}

interface AgentState {
  memory: Record<string, any>;
  context: Record<string, any>;
  activeTasks: string[];
  performance: {
    cpu: number;
    memory: number;
    latency: number;
  };
}

export class AgentDebugger {
  private events: DebugEvent[] = [];
  private states: Map<string, AgentState> = new Map();
  private breakpoints: Set<string> = new Set();
  private watchers: Map<string, (state: any) => void> = new Map();

  logEvent(event: DebugEvent): void {
    this.events.push(event);
    this.notifyWatchers('events', this.events);
  }

  setState(agentId: string, state: Partial<AgentState>): void {
    const currentState = this.states.get(agentId) || {
      memory: {},
      context: {},
      activeTasks: [],
      performance: { cpu: 0, memory: 0, latency: 0 }
    };
    
    this.states.set(agentId, { ...currentState, ...state });
    this.notifyWatchers(`state:${agentId}`, this.states.get(agentId));
  }

  setBreakpoint(condition: string): void {
    this.breakpoints.add(condition);
  }

  removeBreakpoint(condition: string): void {
    this.breakpoints.delete(condition);
  }

  watch(key: string, callback: (state: any) => void): void {
    this.watchers.set(key, callback);
  }

  unwatch(key: string): void {
    this.watchers.delete(key);
  }

  private notifyWatchers(key: string, data: any): void {
    this.watchers.forEach((callback, watchKey) => {
      if (watchKey === key || watchKey === '*') {
        callback(data);
      }
    });
  }

  inspectMessage(message: AgentMessage): {
    validation: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Validate message structure
    if (!message.content) {
      issues.push('Message content is empty');
      suggestions.push('Add content to the message');
    }

    if (!message.metadata?.conversationId) {
      issues.push('Missing conversation ID');
      suggestions.push('Add conversation tracking metadata');
    }

    // Check for potential issues
    if (typeof message.content === 'string' && message.content.length > 1000) {
      issues.push('Message content is very long');
      suggestions.push('Consider breaking down into smaller messages');
    }

    return {
      validation: issues.length === 0,
      issues,
      suggestions
    };
  }

  inspectTask(task: Task): {
    validation: boolean;
    issues: string[];
    suggestions: string[];
  } {
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Validate task structure
    if (!task.type) {
      issues.push('Task type is undefined');
      suggestions.push('Specify task type');
    }

    if (!task.metadata?.timeout) {
      issues.push('No timeout specified');
      suggestions.push('Add timeout to prevent hanging tasks');
    }

    // Check for potential issues
    if (task.metadata?.retryCount > 3) {
      issues.push('High retry count');
      suggestions.push('Investigate why task is failing frequently');
    }

    return {
      validation: issues.length === 0,
      issues,
      suggestions
    };
  }

  getPerformanceReport(agentId: string): {
    metrics: Record<string, number>;
    insights: string[];
    recommendations: string[];
  } {
    const state = this.states.get(agentId);
    if (!state) {
      return {
        metrics: {},
        insights: ['No data available'],
        recommendations: ['Start collecting metrics']
      };
    }

    const metrics = {
      cpu: state.performance.cpu,
      memory: state.performance.memory,
      latency: state.performance.latency,
      activeTasks: state.activeTasks.length
    };

    const insights = [];
    const recommendations = [];

    // Analyze CPU usage
    if (metrics.cpu > 80) {
      insights.push('High CPU usage detected');
      recommendations.push('Consider load balancing');
    }

    // Analyze memory usage
    if (metrics.memory > 80) {
      insights.push('High memory usage detected');
      recommendations.push('Check for memory leaks');
    }

    // Analyze latency
    if (metrics.latency > 1000) {
      insights.push('High latency detected');
      recommendations.push('Optimize response time');
    }

    return { metrics, insights, recommendations };
  }

  async replay(
    conversationId: string,
    options: {
      speed: number;
      breakpoints?: string[];
      filters?: string[];
    }
  ): Promise<void> {
    const relevantEvents = this.events.filter(
      event => event.metadata.conversationId === conversationId
    );

    for (const event of relevantEvents) {
      if (options.filters && !options.filters.includes(event.type)) {
        continue;
      }

      if (options.breakpoints?.includes(event.type)) {
        await new Promise(resolve => {
          this.watch('continue', () => {
            this.unwatch('continue');
            resolve(null);
          });
        });
      }

      this.notifyWatchers('replay', event);
      await new Promise(resolve => 
        setTimeout(resolve, 1000 / options.speed)
      );
    }
  }
}
