import { Interaction } from './FeedbackCollector';
import { JudgementResult, LLMJudge } from './LLMJudge';

export interface ABTest {
  id: string;
  name: string;
  description: string;
  modelA: string;
  modelB: string;
  startDate: string;
  endDate?: string;
  status: 'running' | 'completed' | 'stopped';
  sampleSize: number;
  completedSamples: number;
  metrics: ABTestMetrics;
}

export interface ABTestMetrics {
  modelAScore: number;
  modelBScore: number;
  winRate: {
    modelA: number;
    modelB: number;
    tie: number;
  };
  confidenceInterval: {
    lower: number;
    upper: number;
  };
  pValue: number;
  significantDifference: boolean;
}

export interface ABComparison {
  testId: string;
  interactionA: Interaction;
  interactionB: Interaction;
  judgementA?: JudgementResult;
  judgementB?: JudgementResult;
  winner?: 'A' | 'B' | 'tie';
  confidence: number;
  reasoning: string;
}

export class ABTestingSystem {
  private static instance: ABTestingSystem;
  private tests: Map<string, ABTest> = new Map();
  private comparisons: Map<string, ABComparison[]> = new Map();
  private llmJudge: LLMJudge;

  private constructor() {
    this.llmJudge = LLMJudge.getInstance();
  }

  static getInstance(): ABTestingSystem {
    if (!this.instance) {
      this.instance = new ABTestingSystem();
    }
    return this.instance;
  }

  private calculateStatistics(comparisons: ABComparison[]): ABTestMetrics {
    const totalComparisons = comparisons.length;
    let modelAWins = 0;
    let modelBWins = 0;
    let ties = 0;
    let modelATotal = 0;
    let modelBTotal = 0;

    comparisons.forEach(comparison => {
      if (comparison.winner === 'A') modelAWins++;
      else if (comparison.winner === 'B') modelBWins++;
      else ties++;

      if (comparison.judgementA) modelATotal += comparison.judgementA.overallScore;
      if (comparison.judgementB) modelBTotal += comparison.judgementB.overallScore;
    });

    const modelAScore = modelATotal / totalComparisons;
    const modelBScore = modelBTotal / totalComparisons;
    
    // Calculate confidence interval and p-value
    const standardError = Math.sqrt((modelAScore * (1 - modelAScore)) / totalComparisons);
    const zScore = 1.96; // 95% confidence interval
    
    return {
      modelAScore,
      modelBScore,
      winRate: {
        modelA: modelAWins / totalComparisons,
        modelB: modelBWins / totalComparisons,
        tie: ties / totalComparisons
      },
      confidenceInterval: {
        lower: modelAScore - zScore * standardError,
        upper: modelAScore + zScore * standardError
      },
      pValue: this.calculatePValue(modelAWins, modelBWins, totalComparisons),
      significantDifference: false // Will be set based on p-value
    };
  }

  private calculatePValue(winsA: number, winsB: number, total: number): number {
    // Simple binomial test
    const observed = Math.abs(winsA - winsB);
    const expected = total / 2;
    const standardDev = Math.sqrt(total * 0.25);
    const zScore = Math.abs(observed - expected) / standardDev;
    
    // Approximate p-value from z-score
    return 2 * (1 - this.normalCDF(zScore));
  }

  private normalCDF(x: number): number {
    // Approximation of the normal cumulative distribution function
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989423 * Math.exp(-x * x / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return x > 0 ? 1 - prob : prob;
  }

  async createTest(
    name: string,
    description: string,
    modelA: string,
    modelB: string,
    sampleSize: number
  ): Promise<ABTest> {
    const test: ABTest = {
      id: `abtest_${Date.now()}`,
      name,
      description,
      modelA,
      modelB,
      startDate: new Date().toISOString(),
      status: 'running',
      sampleSize,
      completedSamples: 0,
      metrics: {
        modelAScore: 0,
        modelBScore: 0,
        winRate: { modelA: 0, modelB: 0, tie: 0 },
        confidenceInterval: { lower: 0, upper: 0 },
        pValue: 1,
        significantDifference: false
      }
    };

    this.tests.set(test.id, test);
    this.comparisons.set(test.id, []);
    return test;
  }

  async compareResponses(
    testId: string,
    interactionA: Interaction,
    interactionB: Interaction
  ): Promise<ABComparison> {
    const test = this.tests.get(testId);
    if (!test) throw new Error('Test not found');

    const judgementA = await this.llmJudge.evaluateInteraction(interactionA);
    const judgementB = await this.llmJudge.evaluateInteraction(interactionB);

    const comparison: ABComparison = {
      testId,
      interactionA,
      interactionB,
      judgementA,
      judgementB,
      confidence: Math.min(judgementA.confidence, judgementB.confidence),
      reasoning: '',
      winner: this.determineWinner(judgementA, judgementB)
    };

    const comparisons = this.comparisons.get(testId) || [];
    comparisons.push(comparison);
    this.comparisons.set(testId, comparisons);

    // Update test metrics
    test.completedSamples = comparisons.length;
    test.metrics = this.calculateStatistics(comparisons);
    
    if (test.completedSamples >= test.sampleSize) {
      test.status = 'completed';
      test.endDate = new Date().toISOString();
    }

    this.tests.set(testId, test);
    return comparison;
  }

  private determineWinner(
    judgementA: JudgementResult,
    judgementB: JudgementResult
  ): 'A' | 'B' | 'tie' {
    const threshold = 0.1; // Minimum difference to declare a winner
    const scoreDiff = judgementA.overallScore - judgementB.overallScore;
    
    if (Math.abs(scoreDiff) < threshold) return 'tie';
    return scoreDiff > 0 ? 'A' : 'B';
  }

  getTest(testId: string): ABTest | undefined {
    return this.tests.get(testId);
  }

  getTestComparisons(testId: string): ABComparison[] {
    return this.comparisons.get(testId) || [];
  }

  getAllTests(): ABTest[] {
    return Array.from(this.tests.values());
  }

  stopTest(testId: string): void {
    const test = this.tests.get(testId);
    if (!test) throw new Error('Test not found');
    
    test.status = 'stopped';
    test.endDate = new Date().toISOString();
    this.tests.set(testId, test);
  }
}
