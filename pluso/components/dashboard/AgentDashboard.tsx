import { signal } from "@preact/signals";
import { useEffect, useRef } from "preact/hooks";
import { Chart } from "../../utils/chart.ts";
import { Task, TaskMetrics } from '../multi-agent/TaskRouter';
import { AgentConfig } from '../multi-agent/AgentOrchestrator';

interface DashboardProps {
  agents: AgentConfig[];
  tasks: Task[];
  metrics: Record<string, TaskMetrics>;
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const STATUS_COLORS = {
  pending: '#gray',
  assigned: '#blue',
  in_progress: '#yellow',
  completed: '#green',
  failed: '#red'
};

export function AgentDashboard({ agents, tasks, metrics }: DashboardProps) {
  const selectedAgent = signal<string | null>(null);
  const timeRange = signal('24h');
  const view = signal<'overview' | 'details'>('overview');

  const lineChartRef = useRef<HTMLCanvasElement>(null);
  const pieChartRef = useRef<HTMLCanvasElement>(null);
  const lineChartInstance = useRef<Chart | null>(null);
  const pieChartInstance = useRef<Chart | null>(null);

  const getFilteredTasks = () => {
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }[timeRange.value];

    return tasks.filter(task => {
      const taskTime = new Date(task.updatedAt).getTime();
      return now.getTime() - taskTime <= timeRangeMs;
    });
  };

  useEffect(() => {
    if (lineChartRef.current && pieChartRef.current) {
      // Cleanup previous charts
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }

      // Create line chart
      const lineCtx = lineChartRef.current.getContext('2d');
      if (lineCtx) {
        const agentData = agents.map(agent => ({
          name: agent.name,
          ...metrics[agent.id]
        }));
        lineChartInstance.current = new Chart(lineCtx, {
          type: 'line',
          data: {
            labels: agentData.map(m => m.name),
            datasets: [{
              label: 'Task Completion Rate',
              data: agentData.map(m => m.completionRate),
              borderColor: COLORS[0],
              tension: 0.1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }

      // Create pie chart
      const pieCtx = pieChartRef.current.getContext('2d');
      if (pieCtx) {
        const filteredTasks = getFilteredTasks();
        const statusCounts = filteredTasks.reduce((acc, task) => {
          acc[task.status] = (acc[task.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        pieChartInstance.current = new Chart(pieCtx, {
          type: 'pie',
          data: {
            labels: Object.keys(statusCounts),
            datasets: [{
              data: Object.values(statusCounts),
              backgroundColor: Object.keys(statusCounts).map(status => STATUS_COLORS[status] || '#gray')
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false
          }
        });
      }
    }

    return () => {
      if (lineChartInstance.current) {
        lineChartInstance.current.destroy();
      }
      if (pieChartInstance.current) {
        pieChartInstance.current.destroy();
      }
    };
  }, [metrics, tasks, timeRange.value]);

  function TaskOverview() {
    return (
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">Task Overview</h3>
        <div class="h-64">
          <canvas ref={pieChartRef}></canvas>
        </div>
      </div>
    );
  }

  function AgentMetrics() {
    return (
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-medium mb-4">Agent Performance</h3>
        <div class="h-64">
          <canvas ref={lineChartRef}></canvas>
        </div>
      </div>
    );
  }

  function TaskList() {
    const filteredTasks = getFilteredTasks()
      .filter(task => !selectedAgent.value || task.assignedTo === selectedAgent.value);

    return (
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-4 py-5 sm:px-6">
          <h3 class="text-lg font-medium">Recent Tasks</h3>
        </div>
        <div class="border-t border-gray-200">
          <ul class="divide-y divide-gray-200">
            {filteredTasks.map(task => (
              <li key={task.id} class="px-4 py-4">
                <div class="flex items-center justify-between">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {task.type}
                    </p>
                    <p class="text-sm text-gray-500">
                      Assigned to: {agents.find(a => a.id === task.assignedTo)?.name || 'Unassigned'}
                    </p>
                  </div>
                  <div>
                    <span
                      class={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${
                        STATUS_COLORS[task.status]
                      }-100 text-${STATUS_COLORS[task.status]}-800`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div class="p-6 space-y-6">
      {/* Header */}
      <div class="flex justify-between items-center">
        <h2 class="text-2xl font-bold">Agent Dashboard</h2>
        <div class="flex space-x-4">
          <select
            value={timeRange.value}
            onChange={(e) => timeRange.value = (e.target as HTMLSelectElement).value}
            class="rounded-md border-gray-300"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <select
            value={selectedAgent.value || ''}
            onChange={(e) => selectedAgent.value = (e.target as HTMLSelectElement).value || null}
            class="rounded-md border-gray-300"
          >
            <option value="">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <div class="flex rounded-md shadow-sm">
            <button
              onClick={() => view.value = 'overview'}
              class={`px-4 py-2 text-sm font-medium rounded-l-md ${
                view.value === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => view.value = 'details'}
              class={`px-4 py-2 text-sm font-medium rounded-r-md ${
                view.value === 'details'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Details
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      {view.value === 'overview' ? (
        <div class="grid grid-cols-2 gap-6">
          <TaskOverview />
          <AgentMetrics />
        </div>
      ) : (
        <TaskList />
      )}

      {/* Quick Actions */}
      <div class="fixed bottom-6 right-6">
        <button
          onClick={() => {/* Add new task */}}
          class="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
