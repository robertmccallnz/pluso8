import { useState } from "preact/hooks";

const DEFAULT_AGENT_CONFIG = `# Template for creating a new PluSO agent
name: "agent_name"
version: "1.0.0"
description: "Description of your agent's purpose"

# Model configuration
model:
  provider: "openai"
  model: "gpt-4"
  apiKey: ""

# System configuration
systemPrompt: |
  Define the agent's core behavior and role here.
  Use multiple lines to clearly specify:
  - Primary responsibilities
  - Tone and style
  - Key limitations
  - Special capabilities

# Memory configuration
memory:
  type: "buffer"
  maxMessages: 100
  maxTokens: 2048
  persistenceKey: ""

# Tools configuration
tools:
  - name: "web_search"
    description: "Perform web searches for current information"
    type: "function"
    config:
      function:
        parameters:
          query: "string"
          maxResults: "number"
    enabled: true

# Runtime defaults
runtimeDefaults:
  temperature: 0.7
  maxTokens: 2048
  stopSequences: []
  timeoutMs: 30000
  debugging: false

# Optional metadata
metadata:
  creator: ""
  createdAt: ""
  tags: []`;

export default function AgentCreationCard() {
  const [agentName, setAgentName] = useState("");
  const [yamlConfig, setYamlConfig] = useState(DEFAULT_AGENT_CONFIG);

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    // Update the YAML config with the entered agent name
    const updatedConfig = yamlConfig.replace(
      'name: "agent_name"',
      `name: "${agentName}"`
    );
    console.log("Creating agent:", { agentName, config: updatedConfig });
  };

  return (
    <div class="p-4 bg-white rounded-lg shadow">
      <h2 class="text-xl font-bold mb-4">Create New Agent</h2>
      <form onSubmit={handleSubmit}>
        <div class="mb-4">
          <label class="block text-sm font-medium mb-2" for="agentName">
            Agent Name
          </label>
          <input
            type="text"
            id="agentName"
            value={agentName}
            onChange={(e) =>
