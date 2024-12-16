import { v4 as uuidv4 } from 'uuid';

export interface Interaction {
  id: string;
  agentId: string;
  prompt: string;
  response: string;
  context?: Record<string, any>;
  timestamp: string;
}

export interface Feedback {
  id: string;
  interactionId: string;
  rating: number;  // 1-5 scale
  aspects: {
    helpfulness: number;
    accuracy: number;
    safety: number;
    efficiency: number;
  };
  textFeedback?: string;
  preferredResponse?: string;
  labels: string[];
  timestamp: string;
}

export interface FeedbackStats {
  totalFeedback: number;
  averageRating: number;
  aspectAverages: {
    helpfulness: number;
    accuracy: number;
    safety: number;
    efficiency: number;
  };
  commonLabels: Array<{ label: string; count: number }>;
}

export class FeedbackCollector {
  private static instance: FeedbackCollector;
  private interactions: Map<string, Interaction> = new Map();
  private feedback: Map<string, Feedback[]> = new Map();

  private constructor() {}

  static getInstance(): FeedbackCollector {
    if (!this.instance) {
      this.instance = new FeedbackCollector();
    }
    return this.instance;
  }

  recordInteraction(
    agentId: string,
    prompt: string,
    response: string,
    context?: Record<string, any>
  ): string {
    const interaction: Interaction = {
      id: uuidv4(),
      agentId,
      prompt,
      response,
      context,
      timestamp: new Date().toISOString()
    };
    this.interactions.set(interaction.id, interaction);
    return interaction.id;
  }

  submitFeedback(
    interactionId: string,
    rating: number,
    aspects: Feedback['aspects'],
    textFeedback?: string,
    preferredResponse?: string,
    labels: string[] = []
  ): string {
    if (!this.interactions.has(interactionId)) {
      throw new Error('Interaction not found');
    }

    const feedback: Feedback = {
      id: uuidv4(),
      interactionId,
      rating,
      aspects,
      textFeedback,
      preferredResponse,
      labels,
      timestamp: new Date().toISOString()
    };

    const existingFeedback = this.feedback.get(interactionId) || [];
    this.feedback.set(interactionId, [...existingFeedback, feedback]);

    return feedback.id;
  }

  getFeedbackStats(agentId: string): FeedbackStats {
    const relevantFeedback: Feedback[] = [];
    
    this.interactions.forEach((interaction) => {
      if (interaction.agentId === agentId) {
        const feedbackList = this.feedback.get(interaction.id) || [];
        relevantFeedback.push(...feedbackList);
      }
    });

    if (relevantFeedback.length === 0) {
      return {
        totalFeedback: 0,
        averageRating: 0,
        aspectAverages: {
          helpfulness: 0,
          accuracy: 0,
          safety: 0,
          efficiency: 0
        },
        commonLabels: []
      };
    }

    const aspectSums = {
      helpfulness: 0,
      accuracy: 0,
      safety: 0,
      efficiency: 0
    };

    const labelCounts = new Map<string, number>();

    let totalRating = 0;

    relevantFeedback.forEach((feedback) => {
      totalRating += feedback.rating;
      
      Object.entries(feedback.aspects).forEach(([aspect, rating]) => {
        aspectSums[aspect as keyof typeof aspectSums] += rating;
      });

      feedback.labels.forEach((label) => {
        labelCounts.set(label, (labelCounts.get(label) || 0) + 1);
      });
    });

    const sortedLabels = Array.from(labelCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([label, count]) => ({ label, count }));

    return {
      totalFeedback: relevantFeedback.length,
      averageRating: totalRating / relevantFeedback.length,
      aspectAverages: {
        helpfulness: aspectSums.helpfulness / relevantFeedback.length,
        accuracy: aspectSums.accuracy / relevantFeedback.length,
        safety: aspectSums.safety / relevantFeedback.length,
        efficiency: aspectSums.efficiency / relevantFeedback.length
      },
      commonLabels: sortedLabels
    };
  }

  getTrainingData(agentId: string): Array<{
    prompt: string;
    response: string;
    feedback: Feedback;
    context?: Record<string, any>;
  }> {
    const trainingData = [];

    this.interactions.forEach((interaction) => {
      if (interaction.agentId === agentId) {
        const feedbackList = this.feedback.get(interaction.id) || [];
        feedbackList.forEach((feedback) => {
          trainingData.push({
            prompt: interaction.prompt,
            response: interaction.response,
            feedback,
            context: interaction.context
          });
        });
      }
    });

    return trainingData;
  }
}
