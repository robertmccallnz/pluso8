import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { AutomatedRLHF, AutomatedFeedback, FeedbackGenerationConfig } from './AutomatedRLHF';
import { JudgingCriteria } from './LLMJudge';

interface AutomatedRLHFDashboardProps {
  agentId: string;
}

export function AutomatedRLHFDashboard({ agentId }: AutomatedRLHFDashboardProps) {
  const [config, setConfig] = useState<Partial<FeedbackGenerationConfig>>({});
  const [judgingStats, setJudgingStats] = useState<any>(null);
  const [criteria, setCriteria] = useState<Record<string, JudgingCriteria>>({});
  const [pendingFeedback, setPendingFeedback] = useState<AutomatedFeedback[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const automatedRLHF = AutomatedRLHF.getInstance();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, [agentId]);

  const loadDashboardData = () => {
    setJudgingStats(automatedRLHF.getJudgingStats());
  };

  const startAutomatedTraining = async () => {
    setIsProcessing(true);
    try {
      await automatedRLHF.startAutomatedTrainingLoop(agentId, config);
    } catch (error) {
      console.error('Failed to start automated training:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const renderConfig = () => (
    <div class="bg-white rounded-lg shadow p-6 mb-6">
      <h3 class="text-lg font-semibold mb-4">Automated RLHF Configuration</h3>
      <div class="grid grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Minimum Confidence
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="1"
            value={config.minConfidence || 0.8}
            onChange={(e) =>
              setConfig({
                ...config,
                minConfidence: parseFloat((e.target as HTMLInputElement).value)
              })
            }
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Batch Size
          </label>
          <input
            type="number"
            value={config.batchSize || 50}
            onChange={(e) =>
              setConfig({
                ...config,
                batchSize: parseInt((e.target as HTMLInputElement).value)
              })
            }
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">
            Max Concurrent Batches
          </label>
          <input
            type="number"
            value={config.maxConcurrent || 5}
            onChange={(e) =>
              setConfig({
                ...config,
                maxConcurrent: parseInt((e.target as HTMLInputElement).value)
              })
            }
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          />
        </div>
        <div class="flex items-center">
          <input
            type="checkbox"
            checked={config.requireHumanReview}
            onChange={(e) =>
              setConfig({
                ...config,
                requireHumanReview: (e.target as HTMLInputElement).checked
              })
            }
            class="h-4 w-4 text-blue-600 rounded border-gray-300"
          />
          <label class="ml-2 block text-sm text-gray-700">
            Require Human Review
          </label>
        </div>
      </div>
      <button
        onClick={startAutomatedTraining}
        disabled={isProcessing}
        class={`mt-4 px-4 py-2 ${
          isProcessing
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        } text-white rounded-md`}
      >
        {isProcessing ? 'Processing...' : 'Start Automated Training'}
      </button>
    </div>
  );

  const renderJudgingStats = () => {
    if (!judgingStats) return null;

    return (
      <div class="bg-white rounded-lg shadow p-6 mb-6">
        <h3 class="text-lg font-semibold mb-4">LLM Judge Statistics</h3>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div class="text-sm text-gray-600">Total Judgements</div>
            <div class="text-2xl font-semibold">
              {judgingStats.totalJudgements}
            </div>
          </div>
          <div>
            <div class="text-sm text-gray-600">Average Confidence</div>
            <div class="text-2xl font-semibold">
              {judgingStats.averageConfidence.toFixed(2)}
            </div>
          </div>
          <div class="col-span-2">
            <div class="text-sm text-gray-600">Average Scores</div>
            <div class="grid grid-cols-2 gap-2 mt-2">
              {Object.entries(judgingStats.averageScores).map(
                ([criterion, score]) => (
                  <div key={criterion} class="flex justify-between">
                    <span class="text-sm capitalize">{criterion}:</span>
                    <span class="text-sm font-medium">
                      {(score as number).toFixed(2)}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div class="mt-6">
          <h4 class="text-sm font-medium text-gray-700 mb-2">
            Common Suggestions
          </h4>
          <div class="space-y-2">
            {judgingStats.commonSuggestions.map(
              ({ suggestion, count }, index) => (
                <div
                  key={index}
                  class="flex justify-between items-center text-sm"
                >
                  <span class="text-gray-600">{suggestion}</span>
                  <span class="text-gray-500">×{count}</span>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderPendingFeedback = () => {
    if (pendingFeedback.length === 0) return null;

    return (
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold mb-4">Pending Human Review</h3>
        <div class="space-y-4">
          {pendingFeedback.map((feedback) => (
            <div
              key={feedback.id}
              class="border rounded-lg p-4"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <div class="font-medium">
                    Interaction {feedback.interactionId}
                  </div>
                  <div class="text-sm text-gray-600">
                    Confidence: {feedback.judgement?.confidence.toFixed(2)}
                  </div>
                </div>
                <div class="text-lg font-semibold">
                  Score: {feedback.rating.toFixed(1)}
                </div>
              </div>
              <div class="grid grid-cols-2 gap-2 mb-2">
                {Object.entries(feedback.aspects).map(([aspect, score]) => (
                  <div key={aspect} class="flex justify-between text-sm">
                    <span class="capitalize">{aspect}:</span>
                    <span>{score.toFixed(1)}</span>
                  </div>
                ))}
              </div>
              <div class="text-sm text-gray-700 mb-2">
                {feedback.textFeedback}
              </div>
              <div class="flex justify-end space-x-2">
                <button class="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700">
                  Reject
                </button>
                <button class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700">
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div class="p-6">
      <h2 class="text-2xl font-bold mb-6">Automated RLHF Dashboard</h2>
      {renderConfig()}
      {renderJudgingStats()}
      {renderPendingFeedback()}
    </div>
  );
}
