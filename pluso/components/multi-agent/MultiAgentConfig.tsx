import React, { useState, useEffect } from 'react';
import { AgentConfig, INTERACTION_PATTERNS, DEFAULT_AGENT_ROLES } from './AgentOrchestrator';
import { DEFAULT_PERMISSION_CONFIGS } from './AgentPermissions';

interface MultiAgentConfigProps {
  onConfigurationComplete: (config: AgentGroupConfig) => void;
  initialConfig?: AgentGroupConfig;
}

interface AgentGroupConfig {
  agents: AgentConfig[];
  interactionPattern: string;
  permissions: Record<string, string[]>;
}

export const MultiAgentConfig: React.FC<MultiAgentConfigProps> = ({
  onConfigurationComplete,
  initialConfig
}) => {
  const [agents, setAgents] = useState<AgentConfig[]>(initialConfig?.agents || []);
  const [pattern, setPattern] = useState(initialConfig?.interactionPattern || INTERACTION_PATTERNS.CHAIN);
  const [permissions, setPermissions] = useState<Record<string, string[]>>(
    initialConfig?.permissions || {}
  );

  const addAgent = () => {
    const newAgent: AgentConfig = {
      id: `agent_${Date.now()}`,
      name: `Agent ${agents.length + 1}`,
      role: DEFAULT_AGENT_ROLES.WORKER,
      capabilities: [],
      model: '',
      systemPrompt: ''
    };
    setAgents([...agents, newAgent]);
  };

  const updateAgent = (index: number, updates: Partial<AgentConfig>) => {
    const updatedAgents = [...agents];
    updatedAgents[index] = { ...updatedAgents[index], ...updates };
    setAgents(updatedAgents);
  };

  const updatePermissions = (agentId: string, role: string) => {
    const roleConfig = DEFAULT_PERMISSION_CONFIGS[role];
    if (roleConfig) {
      setPermissions({
        ...permissions,
        [agentId]: Object.keys(roleConfig.permissions)
      });
    }
  };

  const handleSubmit = () => {
    onConfigurationComplete({
      agents,
      interactionPattern: pattern,
      permissions
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Multi-Agent Configuration</h2>
        
        {/* Interaction Pattern Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Interaction Pattern
          </label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
          >
            {Object.entries(INTERACTION_PATTERNS).map(([key, value]) => (
              <option key={key} value={value}>
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Agent List */}
        <div className="space-y-4">
          {agents.map((agent, index) => (
            <div key={agent.id} className="border p-4 rounded">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Agent Name
                  </label>
                  <input
                    type="text"
                    value={agent.name}
                    onChange={(e) => updateAgent(index, { name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Role
                  </label>
                  <select
                    value={agent.role}
                    onChange={(e) => {
                      updateAgent(index, { role: e.target.value });
                      updatePermissions(agent.id, e.target.value);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    {Object.entries(DEFAULT_AGENT_ROLES).map(([key, value]) => (
                      <option key={key} value={value}>
                        {key}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Permissions Display */}
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700">Permissions</h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {permissions[agent.id]?.map((permission) => (
                    <span
                      key={permission}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Agent Button */}
        <button
          onClick={addAgent}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          Add Agent
        </button>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="mt-6 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700"
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
};
