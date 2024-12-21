import { FeedbackCollector, Interaction, Feedback } from './FeedbackCollector';
import { LLMJudge, JudgementResult } from './LLMJudge';
import { RLHFTrainer } from './RLHFTrainer';

export interface AutomatedFeedback extends Feedback {
  judgement?: JudgementResult;
  isAutomated: true;
}

export interface FeedbackGenerationConfig {
  minConfidence: number;
  requireHumanReview: boolean;
  batchSize: number;
  maxConcurrent: number;
}

export class AutomatedRLHF {
  private static instance: AutomatedRLHF;
  private feedbackCollector: FeedbackCollector;
  private llmJudge: LLMJudge;
  private rlhfTrainer: RLHFTrainer;
  private processingBatches: Set<string> = new Set();

  private defaultConfig: FeedbackGenerationConfig = {
    minConfidence: 0.8,
    requireHumanReview: true,
    batchSize: 50,
    maxConcurrent: 5
  };

  private constructor() {
    this.feedbackCollector = FeedbackCollector.getInstance();
    this.llmJudge = LLMJudge.getInstance();
    this.rlhfTrainer = RLHFTrainer.getInstance();
  }

  static getInstance(): AutomatedRLHF {
    if (!this.instance) {
      this.instance = new AutomatedRLHF();
    }
    return this.instance;
  }

  private convertJudgementToFeedback(
    interaction: Interaction,
    judgement: JudgementResult
  ): AutomatedFeedback {
    return {
      id: `auto_${interaction.id}`,
      interactionId: interaction.id,
      rating: judgement.overallScore,
      aspects: {
        helpfulness: judgement.scores.helpfulness || 0,
        accuracy: judgement.scores.accuracy || 0,
        safety: judgement.scores.safety || 0,
        efficiency: judgement.scores.efficiency || 0
      },
      textFeedback: judgement.reasoning,
      labels: ['automated', 'llm-judged'],
      timestamp: new Date().toISOString(),
      judgement,
      isAutomated: true
    };
  }

  async processInteractionBatch(
    interactions: Interaction[],
    config: Partial<FeedbackGenerationConfig> = {}
  ): Promise<AutomatedFeedback[]> {
    const fullConfig = { ...this.defaultConfig, ...config };
    const batchId = `batch_${Date.now()}`;

    if (this.processingBatches.size >= fullConfig.maxConcurrent) {
      throw new Error('Maximum concurrent batch limit reached');
    }

    this.processingBatches.add(batchId);

    try {
      const judgements = await this.llmJudge.batchEvaluate(interactions);
      const automatedFeedback: AutomatedFeedback[] = [];

      for (let i = 0; i < judgements.length; i++) {
        const judgement = judgements[i];
        const interaction = interactions[i];

        if (judgement.confidence >= fullConfig.minConfidence) {
          const feedback = this.convertJudgementToFeedback(interaction, judgement);
          automatedFeedback.push(feedback);

          // Submit feedback if human review is not required
          if (!fullConfig.requireHumanReview) {
            this.feedbackCollector.submitFeedback(
              feedback.interactionId,
              feedback.rating,
              feedback.aspects,
              feedback.textFeedback,
              undefined,
              feedback.labels
            );
          }
        }
      }

      return automatedFeedback;
    } finally {
      this.processingBatches.delete(batchId);
    }
  }

  async startAutomatedTrainingLoop(
    agentId: string,
    config: Partial<FeedbackGenerationConfig> = {}
  ): Promise<void> {
    const fullConfig = { ...this.defaultConfig, ...config };
    
    // Get recent interactions without feedback
    const interactions = Array.from(this.feedbackCollector.getTrainingData(agentId))
      .filter(data => !data.feedback)
      .map(data => ({
        id: data.prompt + data.response, // This should be a proper ID in real implementation
        agentId,
        prompt: data.prompt,
        response: data.response,
        context: data.context,
        timestamp: new Date().toISOString()
      }));

    // Process in batches
    for (let i = 0; i < interactions.length; i += fullConfig.batchSize) {
      const batch = interactions.slice(i, i + fullConfig.batchSize);
      const automatedFeedback = await this.processInteractionBatch(batch, config);

      if (!fullConfig.requireHumanReview) {
        // Start training job with new feedback
        await this.rlhfTrainer.startFineTuning(agentId, {
          batchSize: 32,
          epochs: 5,
          minFeedbackScore: 4.0
        });
      }
    }
  }

  getJudgingStats() {
    return this.llmJudge.getJudgingStats();
  }

  updateJudgingCriteria(criteria: Parameters<typeof this.llmJudge.updateCriteria>[0]) {
    this.llmJudge.updateCriteria(criteria);
  }
}
