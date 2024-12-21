import { useEffect, useState } from "preact/hooks";
import { AgentConfig } from "../agents/types/agent.ts";

interface DeploymentStatus {
  status: "pending" | "in_progress" | "completed" | "failed";
  message?: string;
  error?: string;
  logs?: string[];
}

interface DeploymentIslandProps {
  agentId: string;
  config: AgentConfig;
  initialStatus?: DeploymentStatus;
}

export default function DeploymentIsland({ 
  agentId, 
  config, 
  initialStatus 
}: DeploymentIslandProps) {
  const [status, setStatus] = useState<DeploymentStatus>(
    initialStatus || { status: "pending" }
  );
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (status.status === "pending") {
      startDeployment();
    }
  }, []);

  const startDeployment = async () => {
    try {
      setStatus({ status: "in_progress" });
      addLog("Starting deployment process...");

      // Step 1: Generate YAML config
      addLog("Generating YAML configuration...");
      await generateYamlConfig();

      // Step 2: Create agent directory and files
      addLog("Creating agent files...");
      await createAgentFiles();

      // Step 3: Install dependencies
      addLog("Installing dependencies...");
      await installDependencies();

      // Step 4: Start the agent
      addLog("Starting agent...");
      await startAgent();

      setStatus({ 
        status: "completed",
        message: "Agent deployed successfully!" 
      });
      addLog("Deployment completed successfully!");
    } catch (error) {
      setStatus({ 
        status: "failed",
        error: error.message 
      });
      addLog(`Deployment failed: ${error.message}`);
    }
  };

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const generateYamlConfig = async () => {
    const response = await fetch("/api/agents/generate-yaml", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, config }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate YAML configuration");
    }
  };

  const createAgentFiles = async () => {
    const response = await fetch("/api/agents/create-files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId, config }),
    });

    if (!response.ok) {
      throw new Error("Failed to create agent files");
    }
  };

  const installDependencies = async () => {
    const response = await fetch("/api/agents/install", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      throw new Error("Failed to install dependencies");
    }
  };

  const startAgent = async () => {
    const response = await fetch("/api/agents/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agentId }),
    });

    if (!response.ok) {
      throw new Error("Failed to start agent");
    }
  };

  const getStatusColor = () => {
    switch (status.status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div class="p-6 space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-semibold text-gray-900">
            Deploying Agent: {config.name}
          </h1>
          <p class="mt-1 text-sm text-gray-500">
            Agent ID: {agentId}
          </p>
        </div>
        <div class={`px-3 py-1 rounded-full text-sm ${getStatusColor()}`}>
          {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
        </div>
      </div>

      {/* Progress Steps */}
      <div class="space-y-4">
        <div class="relative">
          {["Generating Config", "Creating Files", "Installing Dependencies", "Starting Agent"].map((step, index) => (
            <div key={step} class="flex items-center mb-4">
              <div class={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < logs.length 
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {index < logs.length ? "✓" : index + 1}
              </div>
              <div class="ml-4">
                <p class={`font-medium ${
                  index < logs.length ? "text-blue-600" : "text-gray-500"
                }`}>
                  {step}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deployment Logs */}
      <div class="mt-6">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Deployment Logs</h3>
        <div class="bg-gray-900 text-gray-100 rounded-lg p-4 font-mono text-sm h-64 overflow-y-auto">
          {logs.map((log, index) => (
            <div key={index} class="whitespace-pre-wrap">
              {log}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div class="flex justify-between items-center pt-6 border-t border-gray-200">
        <div class="flex items-center space-x-4">
          <button
            onClick={() => window.location.href = `/agents/${agentId}`}
            class={`px-4 py-2 rounded-lg ${
              status.status === "completed"
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
            disabled={status.status !== "completed"}
          >
            View Agent
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            class="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Copy Deployment URL
          </button>
        </div>
        {status.status === "failed" && (
          <button
            onClick={startDeployment}
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry Deployment
          </button>
        )}
      </div>
    </div>
  );
}
