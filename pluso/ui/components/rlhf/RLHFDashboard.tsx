import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { FeedbackCollector, FeedbackStats } from './FeedbackCollector';
import { RLHFTrainer, FineTuningJob, TrainingConfig } from './RLHFTrainer';

interface RLHFDashboardProps {
  agentId: string;
}

export function RLHFDashboard({ agentId }: RLHFDashboardProps) {
  const [feedbackStats, setFeedbackStats] = useState<FeedbackStats | null>(null);
  const [activeJobs, setActiveJobs] = useState<FineTuningJob[]>([]);
  const [customConfig, setCustomConfig] = useState<Partial<TrainingConfig>>({});
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

  const feedbackCollector = FeedbackCollector.getInstance();
  const rlhfTrainer = RLHFTrainer.getInstance();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, [agentId]);

  const loadDashboardData = () => {
    setFeedbackStats(feedbackCollector.getFeedbackStats(agentId));
    setActiveJobs(rlhfTrainer.getActiveJobs(agentId));
  };

  const startTraining = async () => {
    try {
      const jobId = await rlhfTrainer.startFineTuning(agentId, customConfig);
      setSelectedJobId(jobId);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to start training:', error);
    }
  };

  const stopTraining = async (jobId: string) => {
    try {
      await rlhfTrainer.stopFineTuning(jobId);
      loadDashboardData();
    } catch (error) {
      console.error('Failed to stop training:', error);
    }
  };

  const renderFeedbackStats = () => {
    if (!feedbackStats) return null;

    return (
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">Feedback Statistics</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div class="text-sm text-gray-600">Total Feedback</div>
            <div class="text-2xl font-semibold">{feedbackStats.totalFeedback}</div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Average Rating</div>
            <div class="text-2xl font-semibold">
              {feedbackStats.averageRating.toFixed(2)}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Top Aspects</div>
            <div class="text-sm">
              {Object.entries(feedbackStats.aspectAverages)
                .sort(([, a], [, b]) => b - a)
                .map(([aspect, score]) => (
                  <div key={aspect} class="flex justify-between">
                    <span class="capitalize">{aspect}:</span>
                    <span>{score.toFixed(2)}</span>
                  </div>
                ))}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Common Labels</div>
            <div class="text-sm">
              {feedbackStats.commonLabels.slice(0, 3).map(({ label, count }) => (
                <div key={label} class="flex justify-between">
                  <span>{label}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTrainingConfig = () => (
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Training Configuration</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Batch Size
          </label>
          <input
            type="number"
            value={customConfig.batchSize || 32}
            onChange={(e) =>
              setCustomConfig({
                ...customConfig,
                batchSize: parseInt((e.target as HTMLInputElement).value)
              })
            }
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Learning Rate
          </label>
          <input
            type="number"
            step="0.0001"
            value={customConfig.learningRate || 0.0001}
            onChange={(e) =>
              setCustomConfig({
                ...customConfig,
                learningRate: parseFloat((e.target as HTMLInputElement).value)
              })
            }
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Epochs
          </label>
          <input
            type="number"
            value={customConfig.epochs || 10}
            onChange={(e) =>
              setCustomConfig({
                ...customConfig,
                epochs: parseInt((e.target as HTMLInputElement).value)
              })
            }
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Min Feedback Score
          </label>
          <input
            type="number"
            step="0.1"
            value={customConfig.minFeedbackScore || 4.0}
            onChange={(e) =>
              setCustomConfig({
                ...customConfig,
                minFeedbackScore: parseFloat((e.target as HTMLInputElement).value)
              })
            }
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
      </div>
      <button
        onClick={startTraining}
        class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Start Training
      </button>
    </div>
  );

  const renderJobStatus = (job: FineTuningJob) => {
    const isSelected = job.id === selectedJobId;

    return (
      <div
        key={job.id}
        class={`bg-white rounded-lg shadow p-6 mb-4 ${
          isSelected ? 'border-2 border-blue-500' : ''
        }`}
        onClick={() => setSelectedJobId(job.id)}
      >
        <div class="flex justify-between items-center mb-4">
          <div>
            <h4 class="text-lg font-semibold">Job {job.id}</h4>
            <div class="text-sm text-gray-600">
              Status: <span class="capitalize">{job.status}</span>
            </div>
          </div>
          {job.status === 'running' && (
            <button
              onClick={() => stopTraining(job.id)}
              class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Stop
            </button>
          )}
        </div>

        <div class="mb-4">
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-blue-600 h-2 rounded-full"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <div class="text-sm text-gray-600 mt-1">
            Progress: {job.progress.toFixed(1)}%
          </div>
        </div>

        {isSelected && job.metrics.length > 0 && (
          <div class="mt-4">
            <h5 class="font-medium mb-2">Latest Metrics</h5>
            <div class="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div class="text-gray-600">Loss</div>
                <div>{job.metrics[job.metrics.length - 1].loss.toFixed(4)}</div>
              </div>
              <div>
                <div class="text-gray-600">Accuracy</div>
                <div>
                  {job.metrics[job.metrics.length - 1].accuracy.toFixed(4)}
                </div>
              </div>
              <div>
                <div class="text-gray-600">Validation Loss</div>
                <div>
                  {job.metrics[job.metrics.length - 1].validationLoss.toFixed(4)}
                </div>
              </div>
              <div>
                <div class="text-gray-600">Validation Accuracy</div>
                <div>
                  {job.metrics[job.metrics.length - 1].validationAccuracy.toFixed(4)}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">RLHF Dashboard</h2>
      {renderFeedbackStats()}
      {renderTrainingConfig()}
      
      <div class="mt-8">
        <h3 class="text-lg font-semibold mb-4">Training Jobs</h3>
        {activeJobs.length === 0 ? (
          <div class="text-gray-600">No active training jobs</div>
        ) : (
          activeJobs.map(renderJobStatus)
        )}
      </div>
    </div>
  );
}
