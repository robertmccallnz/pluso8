import { Feedback } from './FeedbackCollector';
import { JudgementResult, LLMJudge } from './LLMJudge';
import { BiasDetector, BiasAnalysis } from './BiasDetector';

export interface CalibrationMetrics {
  id: string;
  timestamp: string;
  humanScore: number;
  llmScore: number;
  biasScore: number;
  adjustedScore: number;
  confidence: number;
  calibrationFactors: CalibrationFactors;
}

interface CalibrationFactors {
  humanBias: number;
  llmBias: number;
  timeDecay: number;
  contextualBias: number;
  domainSpecificBias: number;
}

export interface CalibrationStats {
  totalCalibrations: number;
  averageAdjustment: number;
  biasCorrection: {
    human: number;
    llm: number;
  };
  confidenceDistribution: {
    high: number;
    medium: number;
    low: number;
  };
  timeSeriesData: Array<{
    timestamp: string;
    rawScore: number;
    adjustedScore: number;
  }>;
}

export class FeedbackCalibrator {
  private static instance: FeedbackCalibrator;
  private calibrations: Map<string, CalibrationMetrics> = new Map();
  private llmJudge: LLMJudge;
  private biasDetector: BiasDetector;

  private constructor() {
    this.llmJudge = LLMJudge.getInstance();
    this.biasDetector = BiasDetector.getInstance();
  }

  static getInstance(): FeedbackCalibrator {
    if (!this.instance) {
      this.instance = new FeedbackCalibrator();
    }
    return this.instance;
  }

  private calculateTimeDecay(timestamp: string): number {
    const age = Date.now() - new Date(timestamp).getTime();
    const halfLife = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds
    return Math.exp(-Math.log(2) * age / halfLife);
  }

  private detectContextualBias(
    feedback: Feedback,
    judgement: JudgementResult,
    biasAnalysis: BiasAnalysis
  ): number {
    const contextualFactors = [
      this.analyzeTimeOfDay(feedback.timestamp),
      this.analyzeWorkload(feedback),
      this.analyzeComplexity(judgement),
      this.analyzeDomainSpecificity(feedback, judgement)
    ];

    return contextualFactors.reduce((a, b) => a + b, 0) / contextualFactors.length;
  }

  private analyzeTimeOfDay(timestamp: string): number {
    const hour = new Date(timestamp).getHours();
    // Adjust for potential fatigue during certain hours
    if (hour >= 22 || hour <= 5) return 0.8; // Late night
    if (hour >= 14 && hour <= 16) return 0.9; // Post-lunch dip
    return 1.0;
  }

  private analyzeWorkload(feedback: Feedback): number {
    // Simplified workload analysis
    const hasDetailedFeedback = feedback.textFeedback && feedback.textFeedback.length > 100;
    const hasMultipleLabels = feedback.labels && feedback.labels.length > 2;
    return hasDetailedFeedback && hasMultipleLabels ? 1.0 : 0.9;
  }

  private analyzeComplexity(judgement: JudgementResult): number {
    // Analyze response complexity
    const reasoningLength = judgement.reasoning.length;
    if (reasoningLength > 500) return 0.9; // Complex responses might need more scrutiny
    if (reasoningLength < 50) return 0.95; // Very short responses might be oversimplified
    return 1.0;
  }

  private analyzeDomainSpecificity(
    feedback: Feedback,
    judgement: JudgementResult
  ): number {
    // Check if feedback is highly domain-specific
    const domainSpecificTerms = new Set([
      'technical',
      'specialized',
      'domain-specific',
      'expert',
      'professional'
    ]);

    const containsDomainTerms =
      feedback.labels?.some(label => domainSpecificTerms.has(label)) || false;
    return containsDomainTerms ? 0.9 : 1.0;
  }

  async calibrateFeedback(
    feedback: Feedback,
    judgement: JudgementResult
  ): Promise<CalibrationMetrics> {
    // Get bias analysis
    const biasAnalysis = await this.biasDetector.analyzeBias(
      { id: feedback.interactionId } as any,
      judgement
    );

    // Calculate calibration factors
    const calibrationFactors: CalibrationFactors = {
      humanBias: 1 - (biasAnalysis.overallBiasScore * 0.5),
      llmBias: 1 - (judgement.confidence < 0.8 ? 0.2 : 0),
      timeDecay: this.calculateTimeDecay(feedback.timestamp),
      contextualBias: this.detectContextualBias(feedback, judgement, biasAnalysis),
      domainSpecificBias: this.analyzeDomainSpecificity(feedback, judgement)
    };

    // Calculate adjusted score
    const humanScore = feedback.rating;
    const llmScore = judgement.overallScore;
    const biasScore = biasAnalysis.overallBiasScore;

    const adjustedScore =
      (humanScore * calibrationFactors.humanBias +
        llmScore * calibrationFactors.llmBias) *
      calibrationFactors.timeDecay *
      calibrationFactors.contextualBias *
      calibrationFactors.domainSpecificBias;

    const confidence = Math.min(
      judgement.confidence,
      1 - biasAnalysis.overallBiasScore
    );

    const calibration: CalibrationMetrics = {
      id: `cal_${Date.now()}`,
      timestamp: new Date().toISOString(),
      humanScore,
      llmScore,
      biasScore,
      adjustedScore,
      confidence,
      calibrationFactors
    };

    this.calibrations.set(calibration.id, calibration);
    return calibration;
  }

  getCalibration(id: string): CalibrationMetrics | undefined {
    return this.calibrations.get(id);
  }

  getCalibrationStats(): CalibrationStats {
    const calibrations = Array.from(this.calibrations.values());
    const totalCalibrations = calibrations.length;

    if (totalCalibrations === 0) {
      return {
        totalCalibrations: 0,
        averageAdjustment: 0,
        biasCorrection: { human: 0, llm: 0 },
        confidenceDistribution: { high: 0, medium: 0, low: 0 },
        timeSeriesData: []
      };
    }

    let totalAdjustment = 0;
    let totalHumanBias = 0;
    let totalLLMBias = 0;
    const confidenceCounts = { high: 0, medium: 0, low: 0 };

    calibrations.forEach(cal => {
      totalAdjustment += Math.abs(cal.adjustedScore - cal.humanScore);
      totalHumanBias += 1 - cal.calibrationFactors.humanBias;
      totalLLMBias += 1 - cal.calibrationFactors.llmBias;

      if (cal.confidence > 0.8) confidenceCounts.high++;
      else if (cal.confidence > 0.5) confidenceCounts.medium++;
      else confidenceCounts.low++;
    });

    return {
      totalCalibrations,
      averageAdjustment: totalAdjustment / totalCalibrations,
      biasCorrection: {
        human: totalHumanBias / totalCalibrations,
        llm: totalLLMBias / totalCalibrations
      },
      confidenceDistribution: {
        high: confidenceCounts.high / totalCalibrations,
        medium: confidenceCounts.medium / totalCalibrations,
        low: confidenceCounts.low / totalCalibrations
      },
      timeSeriesData: calibrations
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
        .map(cal => ({
          timestamp: cal.timestamp,
          rawScore: cal.humanScore,
          adjustedScore: cal.adjustedScore
        }))
    };
  }
}
