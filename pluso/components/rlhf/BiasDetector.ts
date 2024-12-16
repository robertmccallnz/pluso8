import { JudgementResult } from './LLMJudge';
import { Interaction } from './FeedbackCollector';

export interface BiasCategory {
  name: string;
  description: string;
  keywords: string[];
  patterns: RegExp[];
}

export interface BiasAnalysis {
  id: string;
  timestamp: string;
  interactionId: string;
  detectedBiases: Array<{
    category: string;
    confidence: number;
    evidence: string[];
    impact: 'high' | 'medium' | 'low';
  }>;
  overallBiasScore: number;
  recommendations: string[];
}

export interface BiasMetrics {
  totalAnalyzed: number;
  biasDistribution: Record<string, number>;
  averageBiasScore: number;
  commonPatterns: Array<{
    pattern: string;
    count: number;
    categories: string[];
  }>;
  timeSeriesData: Array<{
    timestamp: string;
    biasScore: number;
    categories: string[];
  }>;
}

export class BiasDetector {
  private static instance: BiasDetector;
  private biasCategories: BiasCategory[] = [
    {
      name: 'demographic',
      description: 'Bias related to age, gender, race, ethnicity, etc.',
      keywords: ['male', 'female', 'young', 'old', 'race', 'ethnic'],
      patterns: [
        /\b(men|women)\s+are\s+(\w+)/i,
        /\b(age|gender|race)\s+determines\b/i
      ]
    },
    {
      name: 'cultural',
      description: 'Bias related to cultural backgrounds and practices',
      keywords: ['culture', 'tradition', 'custom', 'belief'],
      patterns: [
        /\b(culture|tradition)\s+is\s+(better|worse)\b/i,
        /\b(they|these people)\s+always\b/i
      ]
    },
    {
      name: 'socioeconomic',
      description: 'Bias related to social or economic status',
      keywords: ['rich', 'poor', 'wealthy', 'class', 'education'],
      patterns: [
        /\b(rich|poor)\s+people\s+(\w+)\b/i,
        /\b(class|education)\s+determines\b/i
      ]
    },
    {
      name: 'confirmation',
      description: 'Tendency to favor information confirming existing beliefs',
      keywords: ['always', 'never', 'everyone', 'nobody'],
      patterns: [
        /\b(always|never)\s+(\w+)\b/i,
        /\b(everyone|nobody)\s+(\w+)\b/i
      ]
    },
    {
      name: 'authority',
      description: 'Excessive deference to authority or expertise',
      keywords: ['expert', 'authority', 'obviously', 'clearly'],
      patterns: [
        /\b(expert|authority)\s+says\b/i,
        /\b(obviously|clearly)\s+(\w+)\b/i
      ]
    }
  ];

  private analyses: Map<string, BiasAnalysis> = new Map();
  private timeSeriesData: Array<{
    timestamp: string;
    biasScore: number;
    categories: string[];
  }> = [];

  private constructor() {}

  static getInstance(): BiasDetector {
    if (!this.instance) {
      this.instance = new BiasDetector();
    }
    return this.instance;
  }

  private detectBiasInText(text: string, category: BiasCategory): {
    detected: boolean;
    confidence: number;
    evidence: string[];
  } {
    const evidence: string[] = [];
    let confidenceScore = 0;

    // Check for keywords
    category.keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) {
        evidence.push(`Keyword "${keyword}" found ${matches.length} times`);
        confidenceScore += 0.1 * matches.length;
      }
    });

    // Check for patterns
    category.patterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        evidence.push(`Pattern "${pattern}" matched: "${matches[0]}"`);
        confidenceScore += 0.2 * matches.length;
      }
    });

    return {
      detected: evidence.length > 0,
      confidence: Math.min(confidenceScore, 1),
      evidence
    };
  }

  async analyzeBias(
    interaction: Interaction,
    judgement: JudgementResult
  ): Promise<BiasAnalysis> {
    const detectedBiases = [];
    const combinedText = `${interaction.prompt} ${interaction.response} ${judgement.reasoning}`;

    for (const category of this.biasCategories) {
      const result = this.detectBiasInText(combinedText, category);
      if (result.detected) {
        detectedBiases.push({
          category: category.name,
          confidence: result.confidence,
          evidence: result.evidence,
          impact: this.determineImpact(result.confidence)
        });
      }
    }

    const overallBiasScore = this.calculateOverallBiasScore(detectedBiases);
    const recommendations = this.generateRecommendations(detectedBiases);

    const analysis: BiasAnalysis = {
      id: `bias_${Date.now()}`,
      timestamp: new Date().toISOString(),
      interactionId: interaction.id,
      detectedBiases,
      overallBiasScore,
      recommendations
    };

    this.analyses.set(analysis.id, analysis);
    this.updateTimeSeriesData(analysis);

    return analysis;
  }

  private determineImpact(confidence: number): 'high' | 'medium' | 'low' {
    if (confidence > 0.7) return 'high';
    if (confidence > 0.4) return 'medium';
    return 'low';
  }

  private calculateOverallBiasScore(
    detectedBiases: BiasAnalysis['detectedBiases']
  ): number {
    if (detectedBiases.length === 0) return 0;

    const weightedSum = detectedBiases.reduce(
      (sum, bias) => sum + bias.confidence * this.getImpactWeight(bias.impact),
      0
    );

    return weightedSum / detectedBiases.length;
  }

  private getImpactWeight(impact: 'high' | 'medium' | 'low'): number {
    switch (impact) {
      case 'high':
        return 1.0;
      case 'medium':
        return 0.6;
      case 'low':
        return 0.3;
    }
  }

  private generateRecommendations(
    detectedBiases: BiasAnalysis['detectedBiases']
  ): string[] {
    const recommendations: string[] = [];

    if (detectedBiases.length === 0) {
      recommendations.push('No significant biases detected.');
      return recommendations;
    }

    const highImpactBiases = detectedBiases.filter(b => b.impact === 'high');
    if (highImpactBiases.length > 0) {
      recommendations.push(
        `Priority: Address ${highImpactBiases
          .map(b => b.category)
          .join(', ')} biases`
      );
    }

    detectedBiases.forEach(bias => {
      const category = this.biasCategories.find(c => c.name === bias.category);
      if (category) {
        recommendations.push(
          `For ${bias.category} bias: Review and revise language related to ${category.keywords.join(
            ', '
          )}`
        );
      }
    });

    return recommendations;
  }

  private updateTimeSeriesData(analysis: BiasAnalysis): void {
    this.timeSeriesData.push({
      timestamp: analysis.timestamp,
      biasScore: analysis.overallBiasScore,
      categories: analysis.detectedBiases.map(b => b.category)
    });

    // Keep only last 1000 data points
    if (this.timeSeriesData.length > 1000) {
      this.timeSeriesData.shift();
    }
  }

  getAnalysis(analysisId: string): BiasAnalysis | undefined {
    return this.analyses.get(analysisId);
  }

  getBiasMetrics(): BiasMetrics {
    const analyses = Array.from(this.analyses.values());
    const biasDistribution: Record<string, number> = {};
    let totalBiasScore = 0;

    analyses.forEach(analysis => {
      totalBiasScore += analysis.overallBiasScore;
      analysis.detectedBiases.forEach(bias => {
        biasDistribution[bias.category] =
          (biasDistribution[bias.category] || 0) + 1;
      });
    });

    return {
      totalAnalyzed: analyses.length,
      biasDistribution,
      averageBiasScore: analyses.length > 0 ? totalBiasScore / analyses.length : 0,
      commonPatterns: this.getCommonPatterns(),
      timeSeriesData: this.timeSeriesData
    };
  }

  private getCommonPatterns(): Array<{
    pattern: string;
    count: number;
    categories: string[];
  }> {
    const patternCounts = new Map<string, {
      count: number;
      categories: Set<string>;
    }>();

    Array.from(this.analyses.values()).forEach(analysis => {
      analysis.detectedBiases.forEach(bias => {
        bias.evidence.forEach(evidence => {
          if (!patternCounts.has(evidence)) {
            patternCounts.set(evidence, {
              count: 0,
              categories: new Set()
            });
          }
          const entry = patternCounts.get(evidence)!;
          entry.count++;
          entry.categories.add(bias.category);
        });
      });
    });

    return Array.from(patternCounts.entries())
      .map(([pattern, { count, categories }]) => ({
        pattern,
        count,
        categories: Array.from(categories)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }
}
