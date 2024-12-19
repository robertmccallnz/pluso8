// Agent system configuration
export const AgentConfig = {
  // Runtime configuration
  runtime: {
    maxConcurrentAgents: 100,
    isolateMemoryLimit: 128, // MB
    isolateTimeout: 5000,    // ms
    workerPoolSize: 4
  },

  // Storage configuration
  storage: {
    type: "kv", // or "sql"
    useCache: true,
    cacheSize: 1000,
    ttl: 3600 // seconds
  },

  // Communication configuration
  communication: {
    messageQueueSize: 1000,
    messageTimeout: 30000, // ms
    retryAttempts: 3
  },

  // Monitoring configuration
  monitoring: {
    metricsEnabled: true,
    loggingEnabled: true,
    tracingEnabled: true,
    samplingRate: 0.1
  },

  // Deployment configuration
  deployment: {
    defaultDomain: "pluso.ai",
    containerMemoryLimit: "512Mi",
    containerCPULimit: "1",
    scaling: {
      minReplicas: 1,
      maxReplicas: 10,
      targetCPUUtilization: 80
    }
  }
} as const;

// Type for the config
export type AgentSystemConfig = typeof AgentConfig;

// Helper to get config values
export function getConfig<K extends keyof AgentSystemConfig>(
  key: K
): AgentSystemConfig[K] {
  return AgentConfig[key];
}
