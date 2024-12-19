import { Handler } from "$fresh/server.ts";
import { AgentConfig } from "../types/agent.ts";
import { WebSocketHandler } from "../core/communication/websocket.ts";
import { MetricsCollector } from "../monitoring/metrics.ts";
import { AgentIndustry, AgentType, REGISTERED_AGENTS } from "../core/registry.ts";
import { ModelProvider } from "../models/config.ts";
import { AGENT_MODELS } from "../config/agent_models.ts";

const metricsCollector = MetricsCollector.getInstance();

export interface AgentRouteOptions {
  agentId: string;
}

export function createAgentHandler(agentId: string): {
  provider: ModelProvider;
  model: string;
  maxTokens: number;
  temperature: number;
  systemPrompt: string;
} {
  // Get agent definition
  const agentDef = REGISTERED_AGENTS[agentId];
  if (!agentDef) {
    throw new Error(`Agent ${agentId} not found in registry`);
  }

  // Get model configuration
  const modelConfig = AGENT_MODELS[agentId];
  if (!modelConfig) {
    throw new Error(`Model configuration for agent ${agentId} not found`);
  }

  // Initialize metrics for this agent
  const metrics = metricsCollector.createRouteMetrics(
    agentId,
    agentDef.name,
    agentDef.industry,
    agentDef.type
  );

  return {
    provider: modelConfig.provider,
    model: modelConfig.model,
    maxTokens: modelConfig.maxTokens,
    temperature: modelConfig.temperature,
    systemPrompt: agentDef.systemPrompt,
  };
}
