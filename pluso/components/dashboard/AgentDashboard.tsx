import React, { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
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

export const AgentDashboard: React.FC<DashboardProps> = ({
  agents,
  tasks,
  metrics
}) => {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState('24h');
  const [view, setView] = useState<'overview' | 'details'>('overview');

  const getFilteredTasks = () => {
    const now = new Date();
    const timeRangeMs = {
      '1h': 60 * 60 * 1000,
      '24h': 24 * 60 * 60 * 1000,
      '7d': 7 * 24 * 60 * 60 * 1000
    }[timeRange];

    return tasks.filter(task => {
      const taskTime = new Date(task.updatedAt).getTime();
      return now.getTime() - taskTime <= timeRangeMs;
    });
  };

  const TaskOverview: React.FC = () => {
    const filteredTasks = getFilteredTasks();
    const statusCount = filteredTasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const pieData = Object.entries(statusCount).map(([status, count]) => ({
      name: status,
      value: count
    }));

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Task Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const AgentMetrics: React.FC = () => {
    const agentData = agents.map(agent => ({
      name: agent.name,
      ...metrics[agent.id]
    }));

    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Agent Performance</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={agentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="successRate" stroke="#82ca9d" />
              <Line type="monotone" dataKey="completionTime" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const TaskList: React.FC = () => {
    const filteredTasks = getFilteredTasks()
      .filter(task => !selectedAgent || task.assignedTo === selectedAgent);

    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium">Recent Tasks</h3>
        </div>
        <div className="border-t border-gray-200">
          <ul className="divide-y divide-gray-200">
            {filteredTasks.map(task => (
              <li key={task.id} className="px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {task.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Assigned to: {agents.find(a => a.id === task.assignedTo)?.name || 'Unassigned'}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-${
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
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Agent Dashboard</h2>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="rounded-md border-gray-300"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
          <select
            value={selectedAgent || ''}
            onChange={(e) => setSelectedAgent(e.target.value || null)}
            className="rounded-md border-gray-300"
          >
            <option value="">All Agents</option>
            {agents.map(agent => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
          <div className="flex rounded-md shadow-sm">
            <button
              onClick={() => setView('overview')}
              className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                view === 'overview'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setView('details')}
              className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                view === 'details'
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
      {view === 'overview' ? (
        <div className="grid grid-cols-2 gap-6">
          <TaskOverview />
          <AgentMetrics />
        </div>
      ) : (
        <TaskList />
      )}

      {/* Quick Actions */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => {/* Add new task */}}
          className="bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700"
        >
          <svg
            className="h-6 w-6"
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
};
