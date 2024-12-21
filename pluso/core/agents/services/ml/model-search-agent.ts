import { ServiceAgent, ServiceAgentType } from "../types.ts";
import { ModelSelector } from "./providers/model-selector.ts";
import { AIProvider, ModelType, ModelCapability, ModelMetrics } from "./providers/types.ts";
import { ModelRequirements } from "../../../../types/ml.ts";
import { EventEmitter } from "../../../../events/emitter.ts";
import { db } from "../../../../utils/db.ts";

interface ModelSearchCriteria {
  task: string;
  requirements: {
    accuracy?: number;
    latency?: number;
    costPerToken?: number;
    contextSize?: number;
    specialFeatures?: string[];
  };
  constraints: {
    maxCost?: number;
    maxLatency?: number;
    minAccuracy?: number;
  };
}

interface ModelEvaluation {
  modelId: string;
  provider: AIProvider;
  score: number;
  metrics: ModelMetrics;
  suitabilityScore: number;
  costEfficiencyScore: number;
  reliabilityScore: number;
  timestamp: Date;
}

export class ModelSearchAgent implements ServiceAgent {
  id: string;
  type: typeof ServiceAgentType.MODEL_SEARCH;
  status: "active" | "inactive" | "error";
  lastHeartbeat: Date;
  metrics: {
    requestsHandled: number;
    successRate: number;
    averageResponseTime: number;
  };
  private modelSelector: ModelSelector;
  private events: EventEmitter;
  private evaluationCache: Map<string, ModelEvaluation>;
  private activeSearches: Set<string>;
  private modelRegistry: Map<string, ModelCapability>;

  constructor() {
    this.id = crypto.randomUUID();
    this.type = ServiceAgentType.MODEL_SEARCH;
    this.status = "active";
    this.lastHeartbeat = new Date();
    this.metrics = {
      requestsHandled: 0,
      successRate: 1,
      averageResponseTime: 0
    };
    this.modelSelector = ModelSelector.getInstance();
    this.events = new EventEmitter();
    this.evaluationCache = new Map();
    this.activeSearches = new Set();
    this.modelRegistry = new Map();
    this.initialize();
  }

  private async initialize() {
    await this.loadModelRegistry();
    this.setupEventListeners();
    this.startContinuousEvaluation();
  }

  private async loadModelRegistry() {
    // Load models from database
    const models = await db.query(
      "SELECT * FROM model_registry WHERE status = 'active'"
    );

    for (const model of models.rows as Array<ModelCapability>) {
      this.modelRegistry.set(model.id, {
        id: model.id,
        name: model.name,
        provider: model.provider as AIProvider,
        type: model.type as ModelType,
        contextSize: model.contextSize,
        specialties: model.specialties,
        performance: model.performance as { latency: number; costPer1kTokens: number; qualityScore: number; },
        requirements: {
          minTokens: model.requirements.minTokens ?? 0,
          maxTokens: model.requirements.maxTokens ?? 1000,
          apiKey: model.requirements.apiKey ?? true,
          ...model.requirements
        }
      });
    }
  }

  private setupEventListeners() {
    this.events.on("model:performance_update", async ({ modelId, metrics }) => {
      await this.updateModelEvaluation(modelId, metrics);
    });

    this.events.on("task:requirements_changed", async ({ taskId, requirements }) => {
      await this.reevaluateModelForTask(taskId, requirements);
    });

    this.events.on("model:new_available", async ({ model }) => {
      await this.evaluateNewModel(model);
    });
  }

  private startContinuousEvaluation() {
    setInterval(async () => {
      await this.evaluateAllModels();
    }, 3600000); // Every hour
  }

  async findBestModel(criteria: ModelSearchCriteria): Promise<ModelCapability | null> {
    const searchId = crypto.randomUUID();
    this.activeSearches.add(searchId);

    try {
      // Check cache first
      const cachedResult = this.checkCache(criteria);
      if (cachedResult) {
        return this.modelRegistry.get(cachedResult.modelId) || null;
      }

      // Perform new search
      const candidates = await this.findCandidateModels(criteria);
      const evaluations = await this.evaluateModels(candidates, criteria);
      const bestModel = this.selectBestModel(evaluations);

      // Cache the result
      if (bestModel) {
        this.cacheEvaluation(criteria, bestModel);
      }

      return bestModel;
    } finally {
      this.activeSearches.delete(searchId);
    }
  }

  private checkCache(criteria: ModelSearchCriteria): ModelEvaluation | null {
    const cacheKey = this.generateCacheKey(criteria);
    const cached = this.evaluationCache.get(cacheKey);

    if (cached && this.isCacheValid(cached)) {
      return cached;
    }

    return null;
  }

  private async findCandidateModels(criteria: ModelSearchCriteria): Promise<ModelCapability[]> {
    const candidates: ModelCapability[] = [];

    for (const model of this.modelRegistry.values()) {
      if (await this.meetsBasicRequirements(model, criteria)) {
        candidates.push(model);
      }
    }

    return candidates;
  }

  private async meetsBasicRequirements(model: ModelCapability, criteria: ModelSearchCriteria): Promise<boolean> {
    const { requirements, constraints } = criteria;

    // Check basic requirements
    if (requirements.contextSize && model.contextSize < requirements.contextSize) {
      return false;
    }

    // Check performance constraints
    if (constraints.maxLatency && model.performance.latency > constraints.maxLatency) {
      return false;
    }

    // Check cost constraints
    if (constraints.maxCost && model.performance.costPer1kTokens > constraints.maxCost) {
      return false;
    }

    // Check accuracy requirements
    const metrics = await this.getModelMetrics(model.name);
    if (constraints.minAccuracy && metrics.accuracy < constraints.minAccuracy) {
      return false;
    }

    return true;
  }

  private async evaluateModels(candidates: ModelCapability[], criteria: ModelSearchCriteria): Promise<ModelEvaluation[]> {
    const evaluations: ModelEvaluation[] = [];

    for (const model of candidates) {
      const evaluation = await this.evaluateModel(model, criteria);
      evaluations.push(evaluation);
    }

    return evaluations;
  }

  private async evaluateModel(model: ModelCapability, criteria: ModelSearchCriteria): Promise<ModelEvaluation> {
    const metrics = await this.getModelMetrics(model.name);
    
    // Calculate scores
    const suitabilityScore = this.calculateSuitabilityScore(model, criteria);
    const costEfficiencyScore = this.calculateCostEfficiencyScore(model, criteria);
    const reliabilityScore = this.calculateReliabilityScore(metrics);

    // Calculate overall score
    const score = (
      suitabilityScore * 0.4 +
      costEfficiencyScore * 0.3 +
      reliabilityScore * 0.3
    );

    return {
      modelId: model.id,
      provider: model.provider,
      score,
      metrics,
      suitabilityScore,
      costEfficiencyScore,
      reliabilityScore,
      timestamp: new Date()
    };
  }

  private calculateSuitabilityScore(model: ModelCapability, criteria: ModelSearchCriteria): number {
    let score = 0;
    const { requirements } = criteria;

    // Score based on context size
    if (requirements.contextSize) {
      score += (model.contextSize >= requirements.contextSize) ? 1 : 0;
    }

    // Score based on special features
    if (requirements.specialFeatures) {
      const featureScore = requirements.specialFeatures.filter(
        feature => model.specialties.includes(feature)
      ).length / requirements.specialFeatures.length;
      score += featureScore;
    }

    return score / 2; // Normalize to 0-1
  }

  private calculateCostEfficiencyScore(model: ModelCapability, criteria: ModelSearchCriteria): number {
    const { constraints } = criteria;
    if (!constraints.maxCost) return 1;

    return 1 - (model.performance.costPer1kTokens / constraints.maxCost);
  }

  private calculateReliabilityScore(metrics: ModelMetrics): number {
    return metrics.reliability;
  }

  private selectBestModel(evaluations: ModelEvaluation[]): ModelCapability | null {
    if (evaluations.length === 0) return null;

    // Sort by score
    evaluations.sort((a, b) => b.score - a.score);
    const bestEvaluation = evaluations[0];

    return this.modelRegistry.get(bestEvaluation.modelId) || null;
  }

  private async getModelMetrics(modelName: string): Promise<ModelMetrics> {
    // Get metrics from database or monitoring system
    const metrics = await db.query(
      "SELECT * FROM model_metrics WHERE model_name = ? ORDER BY timestamp DESC LIMIT 1",
      [modelName]
    );

    return metrics[0] || {
      accuracy: 0,
      latency: 0,
      costEfficiency: 0,
      reliability: 0,
      lastUpdated: new Date()
    };
  }

  private generateCacheKey(criteria: ModelSearchCriteria): string {
    return JSON.stringify({
      task: criteria.task,
      requirements: criteria.requirements,
      constraints: criteria.constraints
    });
  }

  private isCacheValid(evaluation: ModelEvaluation): boolean {
    const cacheTimeout = 3600000; // 1 hour
    return Date.now() - evaluation.timestamp.getTime() < cacheTimeout;
  }

  private cacheEvaluation(criteria: ModelSearchCriteria, model: ModelCapability) {
    const cacheKey = this.generateCacheKey(criteria);
    this.evaluationCache.set(cacheKey, {
      modelId: model.id,
      provider: model.provider,
      score: 1,
      metrics: {
        accuracy: 1,
        latency: 0,
        costEfficiency: 1,
        reliability: 1,
        lastUpdated: new Date()
      },
      suitabilityScore: 1,
      costEfficiencyScore: 1,
      reliabilityScore: 1,
      timestamp: new Date()
    });
  }

  async evaluateAllModels() {
    for (const model of this.modelRegistry.values()) {
      await this.evaluateModelPerformance(model);
    }
  }

  private async evaluateModelPerformance(model: ModelCapability) {
    // Implement model performance evaluation
    const metrics = await this.collectModelMetrics(model);
    await this.updateModelMetrics(model.id, metrics);
  }

  private async collectModelMetrics(model: ModelCapability): Promise<ModelMetrics> {
    // Collect real metrics from model usage
    return {
      accuracy: 0,
      latency: 0,
      costEfficiency: 0,
      reliability: 0,
      lastUpdated: new Date()
    };
  }

  private async updateModelMetrics(modelName: string, metrics: ModelMetrics) {
    await db.query(
      "INSERT INTO model_metrics (model_name, metrics, timestamp) VALUES (?, ?, ?)",
      [modelName, JSON.stringify(metrics), new Date()]
    );
  }

  async reevaluateModelForTask(taskId: string, requirements: any) {
    // Implement task-specific model reevaluation
  }

  async evaluateNewModel(model: ModelCapability) {
    // Implement new model evaluation
  }

  async updateModelEvaluation(modelId: string, metrics: any) {
    // Implement logic to update model evaluation
  }
}
