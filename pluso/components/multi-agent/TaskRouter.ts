import { AgentConfig, AgentMessage } from './AgentOrchestrator';

export interface Task {
  id: string;
  type: string;
  priority: number;
  status: 'pending' | 'assigned' | 'in_progress' | 'completed' | 'failed';
  input: any;
  output?: any;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  metadata: {
    timeout?: number;
    retryCount?: number;
    dependencies?: string[];
    expectedDuration?: number;
  };
}

export interface TaskMetrics {
  completionTime: number;
  tokenUsage: number;
  errorRate: number;
  successRate: number;
  latency: number;
}

export class TaskRouter {
  private tasks: Map<string, Task> = new Map();
  private agentMetrics: Map<string, TaskMetrics> = new Map();
  private taskHistory: Task[] = [];

  constructor(private agents: Map<string, AgentConfig>) {}

  async routeTask(task: Task): Promise<string> {
    const availableAgents = Array.from(this.agents.values())
      .filter(agent => this.isAgentAvailable(agent.id));

    // Score agents based on performance metrics and capabilities
    const scoredAgents = availableAgents.map(agent => ({
      agent,
      score: this.calculateAgentScore(agent, task)
    }));

    // Sort by score and get the best agent
    scoredAgents.sort((a, b) => b.score - a.score);
    const bestAgent = scoredAgents[0]?.agent;

    if (!bestAgent) {
      throw new Error('No suitable agent found for task');
    }

    // Assign task to agent
    task.assignedTo = bestAgent.id;
    task.status = 'assigned';
    task.updatedAt = new Date().toISOString();
    this.tasks.set(task.id, task);

    return bestAgent.id;
  }

  private calculateAgentScore(agent: AgentConfig, task: Task): number {
    const metrics = this.agentMetrics.get(agent.id) || {
      completionTime: 0,
      tokenUsage: 0,
      errorRate: 0,
      successRate: 1,
      latency: 0
    };

    // Weighted scoring based on multiple factors
    const weights = {
      capabilities: 0.3,
      successRate: 0.3,
      completionTime: 0.2,
      latency: 0.1,
      tokenUsage: 0.1
    };

    const capabilityScore = this.calculateCapabilityMatch(agent, task);
    const performanceScore = (1 - metrics.errorRate) * metrics.successRate;
    const speedScore = 1 / (1 + metrics.completionTime + metrics.latency);
    const efficiencyScore = 1 / (1 + metrics.tokenUsage);

    return (
      capabilityScore * weights.capabilities +
      performanceScore * weights.successRate +
      speedScore * (weights.completionTime + weights.latency) +
      efficiencyScore * weights.tokenUsage
    );
  }

  private calculateCapabilityMatch(agent: AgentConfig, task: Task): number {
    // Match task requirements with agent capabilities
    const requiredCapabilities = this.getTaskRequirements(task);
    const matchedCapabilities = requiredCapabilities.filter(cap =>
      agent.capabilities.includes(cap)
    );

    return matchedCapabilities.length / requiredCapabilities.length;
  }

  private getTaskRequirements(task: Task): string[] {
    // Extract required capabilities based on task type and metadata
    const requirements: Set<string> = new Set();

    switch (task.type) {
      case 'text_generation':
        requirements.add('text_generation');
        break;
      case 'analysis':
        requirements.add('data_analysis');
        break;
      case 'coding':
        requirements.add('code_generation');
        break;
      // Add more task types as needed
    }

    return Array.from(requirements);
  }

  private isAgentAvailable(agentId: string): boolean {
    const agentTasks = Array.from(this.tasks.values())
      .filter(task => 
        task.assignedTo === agentId && 
        ['assigned', 'in_progress'].includes(task.status)
      );

    return agentTasks.length === 0;
  }

  updateTaskStatus(taskId: string, status: Task['status'], output?: any): void {
    const task = this.tasks.get(taskId);
    if (!task) return;

    task.status = status;
    if (output) task.output = output;
    task.updatedAt = new Date().toISOString();

    if (['completed', 'failed'].includes(status)) {
      this.updateMetrics(task);
      this.taskHistory.push({ ...task });
    }

    this.tasks.set(taskId, task);
  }

  private updateMetrics(task: Task): void {
    if (!task.assignedTo) return;

    const currentMetrics = this.agentMetrics.get(task.assignedTo) || {
      completionTime: 0,
      tokenUsage: 0,
      errorRate: 0,
      successRate: 1,
      latency: 0
    };

    const completionTime = 
      new Date(task.updatedAt).getTime() - 
      new Date(task.createdAt).getTime();

    const success = task.status === 'completed';

    // Update moving averages
    currentMetrics.completionTime = 
      (currentMetrics.completionTime + completionTime) / 2;
    currentMetrics.successRate = 
      (currentMetrics.successRate + (success ? 1 : 0)) / 2;
    currentMetrics.errorRate = 
      (currentMetrics.errorRate + (success ? 0 : 1)) / 2;

    this.agentMetrics.set(task.assignedTo, currentMetrics);
  }

  getAgentMetrics(agentId: string): TaskMetrics | undefined {
    return this.agentMetrics.get(agentId);
  }

  getTaskHistory(agentId?: string): Task[] {
    return agentId
      ? this.taskHistory.filter(task => task.assignedTo === agentId)
      : this.taskHistory;
  }
}
