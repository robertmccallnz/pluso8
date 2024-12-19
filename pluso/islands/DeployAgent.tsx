import { useEffect, useState } from "preact/hooks";
import { AgentConfig } from "../agents/types/agent.ts";

interface DeployStatus {
  status: "pending" | "in_progress" | "completed" | "failed";
  message?: string;
  error?: string;
  logs?: string[];
}

interface Props {
  agentId: string;
  config: AgentConfig;
  initialStatus?: DeployStatus;
}

export default function DeployAgent({ agentId, config, initialStatus }: Props) {
  const [status, setStatus] = useState<DeployStatus>(
    initialStatus || { status: "pending" }
  );
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    if (status.status === "pending") {
      deploy();
    }
  }, []);

  const addLog = (message: string) => {
    setLogs((prev) => [...prev, `[${new Date().toISOString()}] ${message}`]);
  };

  const deploy = async () => {
    try {
      setStatus({ status: "in_progress" });
      addLog(`Starting deployment for ${config.name} (${agentId})`);

      // Step 1: Register agent endpoints
      addLog("Registering agent endpoints...");
      await fetch(`/api/agents/${agentId}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          endpoints: config.endpoints,
          capabilities: config.capabilities,
        }),
      });

      // Step 2: Set up agent environment
      addLog("Setting up agent environment...");
      const envSetup = await fetch(`/api/agents/${agentId}/setup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          industry: config.industry,
          type: config.type,
          systemPrompt: config.systemPrompt,
        }),
      });

      if (!envSetup.ok) {
        throw new Error("Failed to set up agent environment");
      }

      // Step 3: Test agent connection
      addLog("Testing agent connection...");
      const ws = new WebSocket(
        `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${
          window.location.host
        }/api/agents/${agentId}/ws`
      );

      ws.onopen = () => {
        addLog("WebSocket connection successful");
        ws.close();
        setStatus({ 
          status: "completed",
          message: `${config.name} is ready to use` 
        });
      };

      ws.onerror = (error) => {
        throw new Error("WebSocket connection failed");
      };

    } catch (error) {
      console.error("Deployment failed:", error);
      setStatus({
        status: "failed",
        error: error.message,
      });
      addLog(`Error: ${error.message}`);
    }
  };

  return (
    <div class="space-y-4">
      <div class="flex items-center space-x-2">
        <StatusIcon status={status.status} />
        <span class="font-medium">
          {status.status === "pending" && "Ready to deploy"}
          {status.status === "in_progress" && "Deploying..."}
          {status.status === "completed" && status.message}
          {status.status === "failed" && "Deployment failed"}
        </span>
      </div>

      {status.error && (
        <div class="bg-red-50 border border-red-200 rounded p-4 text-red-700">
          {status.error}
        </div>
      )}

      <div class="bg-gray-50 rounded p-4 h-64 overflow-y-auto font-mono text-sm">
        {logs.map((log, i) => (
          <div key={i} class="whitespace-pre-wrap">
            {log}
          </div>
        ))}
      </div>

      {status.status === "failed" && (
        <button
          onClick={() => {
            setStatus({ status: "pending" });
            setLogs([]);
          }}
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry Deployment
        </button>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: DeployStatus["status"] }) {
  const colors = {
    pending: "text-blue-500",
    in_progress: "text-yellow-500",
    completed: "text-green-500",
    failed: "text-red-500",
  };

  return (
    <svg
      class={`w-5 h-5 ${colors[status]} animate-${
        status === "in_progress" ? "spin" : "none"
      }`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      {status === "completed" ? (
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={2}
          d="M5 13l4 4L19 7"
        />
      ) : status === "failed" ? (
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={2}
          d="M6 18L18 6M6 6l12 12"
        />
      ) : (
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width={2}
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      )}
    </svg>
  );
}
