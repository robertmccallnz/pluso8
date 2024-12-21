import { FeedbackCollector } from './FeedbackCollector';

export interface TrainingConfig {
  batchSize: number;
  learningRate: number;
  epochs: number;
  validationSplit: number;
  minFeedbackScore: number;
  aspectWeights: {
    helpfulness: number;
    accuracy: number;
    safety: number;
    efficiency: number;
  };
}

export interface TrainingMetrics {
  epoch: number;
  loss: number;
  accuracy: number;
  validationLoss: number;
  validationAccuracy: number;
}

export interface FineTuningJob {
  id: string;
  agentId: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  progress: number;
  metrics: TrainingMetrics[];
  config: TrainingConfig;
  startTime: string;
  endTime?: string;
  error?: string;
}

export class RLHFTrainer {
  private static instance: RLHFTrainer;
  private feedbackCollector: FeedbackCollector;
  private activeJobs: Map<string, FineTuningJob> = new Map();
  private defaultConfig: TrainingConfig = {
    batchSize: 32,
    learningRate: 0.0001,
    epochs: 10,
    validationSplit: 0.2,
    minFeedbackScore: 4.0,
    aspectWeights: {
      helpfulness: 0.3,
      accuracy: 0.3,
      safety: 0.2,
      efficiency: 0.2
    }
  };

  private constructor() {
    this.feedbackCollector = FeedbackCollector.getInstance();
  }

  static getInstance(): RLHFTrainer {
    if (!this.instance) {
      this.instance = new RLHFTrainer();
    }
    return this.instance;
  }

  private calculateReward(feedback: any): number {
    const { rating, aspects } = feedback;
    const weights = this.defaultConfig.aspectWeights;
    
    const aspectScore = Object.entries(aspects).reduce((score, [aspect, value]) => {
      return score + (value as number) * weights[aspect as keyof typeof weights];
    }, 0);

    return (rating * 0.5 + aspectScore * 0.5) / 5;
  }

  private async preprocessTrainingData(agentId: string): Promise<{
    inputs: any[];
    rewards: number[];
  }> {
    const trainingData = this.feedbackCollector.getTrainingData(agentId);
    const processedData = trainingData
      .filter(data => data.feedback.rating >= this.defaultConfig.minFeedbackScore)
      .map(data => ({
        input: {
          prompt: data.prompt,
          context: data.context || {},
        },
        reward: this.calculateReward(data.feedback)
      }));

    return {
      inputs: processedData.map(d => d.input),
      rewards: processedData.map(d => d.reward)
    };
  }

  async startFineTuning(
    agentId: string,
    customConfig?: Partial<TrainingConfig>
  ): Promise<string> {
    const config = { ...this.defaultConfig, ...customConfig };
    const jobId = `ft_${Date.now()}_${agentId}`;

    const job: FineTuningJob = {
      id: jobId,
      agentId,
      status: 'pending',
      progress: 0,
      metrics: [],
      config,
      startTime: new Date().toISOString()
    };

    this.activeJobs.set(jobId, job);

    try {
      // Start training process
      this.runTraining(jobId);
      return jobId;
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;
      throw error;
    }
  }

  private async runTraining(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) throw new Error('Job not found');

    job.status = 'running';
    
    try {
      const { inputs, rewards } = await this.preprocessTrainingData(job.agentId);
      
      // Simulate training epochs
      for (let epoch = 0; epoch < job.config.epochs; epoch++) {
        // In a real implementation, this would be replaced with actual model training
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const metrics: TrainingMetrics = {
          epoch,
          loss: Math.random() * 0.5,
          accuracy: 0.7 + Math.random() * 0.2,
          validationLoss: Math.random() * 0.5,
          validationAccuracy: 0.7 + Math.random() * 0.2
        };

        job.metrics.push(metrics);
        job.progress = (epoch + 1) / job.config.epochs * 100;
        
        // Update job in storage
        this.activeJobs.set(jobId, job);
      }

      job.status = 'completed';
      job.endTime = new Date().toISOString();
    } catch (error) {
      job.status = 'failed';
      job.error = error.message;
      job.endTime = new Date().toISOString();
    }

    // Update final job status
    this.activeJobs.set(jobId, job);
  }

  getJobStatus(jobId: string): FineTuningJob | null {
    return this.activeJobs.get(jobId) || null;
  }

  async stopFineTuning(jobId: string): Promise<void> {
    const job = this.activeJobs.get(jobId);
    if (!job) throw new Error('Job not found');
    if (job.status !== 'running') throw new Error('Job is not running');

    job.status = 'failed';
    job.error = 'Training stopped by user';
    job.endTime = new Date().toISOString();
    
    this.activeJobs.set(jobId, job);
  }

  getActiveJobs(agentId?: string): FineTuningJob[] {
    const jobs = Array.from(this.activeJobs.values());
    return agentId 
      ? jobs.filter(job => job.agentId === agentId)
      : jobs;
  }
}
