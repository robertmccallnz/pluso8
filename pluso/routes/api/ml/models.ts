import { Handlers } from "$fresh/server.ts";
import { ModelSearchAgent } from "../../../core/agents/services/ml/model-search-agent.ts";
import { ModelSelector } from "../../../core/agents/services/ml/providers/model-selector.ts";

export const handler: Handlers = {
  async GET(req) {
    const url = new URL(req.url);
    const task = url.searchParams.get("task");
    const accuracy = parseFloat(url.searchParams.get("accuracy") || "0");
    const latency = parseInt(url.searchParams.get("latency") || "0");
    const contextSize = parseInt(url.searchParams.get("contextSize") || "0");
    const maxCost = parseFloat(url.searchParams.get("maxCost") || "0");

    const modelSearch = new ModelSearchAgent();
    const bestModel = await modelSearch.findBestModel({
      task,
      requirements: {
        accuracy,
        latency,
        contextSize
      },
      constraints: {
        maxCost,
        maxLatency: latency
      }
    });

    return new Response(JSON.stringify(bestModel), {
      headers: { "Content-Type": "application/json" }
    });
  },

  async POST(req) {
    const body = await req.json();
    const { modelId, metrics } = body;

    const modelSelector = ModelSelector.getInstance();
    await modelSelector.updateModelMetrics(modelId, metrics);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  }
};
