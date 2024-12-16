import { h } from 'preact';
import { useState, useEffect } from 'preact/hooks';
import { ABTestingSystem, ABTest, ABComparison } from './ABTesting';
import { BiasDetector, BiasMetrics } from './BiasDetector';
import { FeedbackCalibrator, CalibrationStats } from './FeedbackCalibrator';

interface EnhancedRLHFDashboardProps {
  agentId: string;
}

export function EnhancedRLHFDashboard({ agentId }: EnhancedRLHFDashboardProps) {
  const [activeTab, setActiveTab] = useState<'ab' | 'bias' | 'calibration'>('ab');
  const [abTests, setABTests] = useState<ABTest[]>([]);
  const [selectedTest, setSelectedTest] = useState<string | null>(null);
  const [biasMetrics, setBiasMetrics] = useState<BiasMetrics | null>(null);
  const [calibrationStats, setCalibrationStats] = useState<CalibrationStats | null>(null);

  const abTestingSystem = ABTestingSystem.getInstance();
  const biasDetector = BiasDetector.getInstance();
  const feedbackCalibrator = FeedbackCalibrator.getInstance();

  useEffect(() => {
    loadDashboardData();
    const interval = setInterval(loadDashboardData, 5000);
    return () => clearInterval(interval);
  }, [agentId]);

  const loadDashboardData = () => {
    setABTests(abTestingSystem.getAllTests());
    setBiasMetrics(biasDetector.getBiasMetrics());
    setCalibrationStats(feedbackCalibrator.getCalibrationStats());
  };

  const createNewTest = async () => {
    const test = await abTestingSystem.createTest(
      'New A/B Test',
      'Testing model variations',
      'model_a',
      'model_b',
      100
    );
    setSelectedTest(test.id);
    loadDashboardData();
  };

  const renderABTestingTab = () => (
    <div class="space-y-6">
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">A/B Testing</h3>
        <button
          onClick={createNewTest}
          class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          New Test
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {abTests.map(test => (
          <div
            key={test.id}
            class={`bg-white rounded-lg shadow p-6 ${
              selectedTest === test.id ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSelectedTest(test.id)}
          >
            <div class="flex justify-between items-start mb-4">
              <div>
                <h4 class="font-medium">{test.name}</h4>
                <div class="text-sm text-gray-600">
                  Status: <span class="capitalize">{test.status}</span>
                </div>
              </div>
              <div class="text-sm text-gray-600">
                {test.completedSamples} / {test.sampleSize} samples
              </div>
            </div>

            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span>Model A Score:</span>
                <span>{test.metrics.modelAScore.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Model B Score:</span>
                <span>{test.metrics.modelBScore.toFixed(2)}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span>Significant Difference:</span>
                <span>{test.metrics.significantDifference ? 'Yes' : 'No'}</span>
              </div>
            </div>

            {selectedTest === test.id && (
              <div class="mt-4 pt-4 border-t">
                <h5 class="font-medium mb-2">Win Rate Distribution</h5>
                <div class="h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-blue-500"
                    style={{ width: `${test.metrics.winRate.modelA * 100}%` }}
                  />
                  <div
                    class="h-full bg-green-500"
                    style={{ width: `${test.metrics.winRate.modelB * 100}%` }}
                  />
                </div>
                <div class="flex justify-between text-xs mt-1">
                  <span>Model A: {(test.metrics.winRate.modelA * 100).toFixed(1)}%</span>
                  <span>Tie: {(test.metrics.winRate.tie * 100).toFixed(1)}%</span>
                  <span>Model B: {(test.metrics.winRate.modelB * 100).toFixed(1)}%</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderBiasDetectionTab = () => {
    if (!biasMetrics) return null;

    return (
      <div class="space-y-6">
        <h3 class="text-lg font-semibold">Bias Detection</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-medium mb-4">Overall Metrics</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Total Analyzed:</span>
                <span>{biasMetrics.totalAnalyzed}</span>
              </div>
              <div class="flex justify-between">
                <span>Average Bias Score:</span>
                <span>{biasMetrics.averageBiasScore.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-medium mb-4">Bias Distribution</h4>
            <div class="space-y-2">
              {Object.entries(biasMetrics.biasDistribution).map(([category, count]) => (
                <div key={category} class="flex justify-between">
                  <span class="capitalize">{category}:</span>
                  <span>{count}</span>
                </div>
              ))}
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-medium mb-4">Common Patterns</h4>
            <div class="space-y-2">
              {biasMetrics.commonPatterns.slice(0, 5).map((pattern, index) => (
                <div key={index} class="text-sm">
                  <div class="font-medium">{pattern.pattern}</div>
                  <div class="text-gray-600">
                    Found {pattern.count} times in {pattern.categories.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h4 class="font-medium mb-4">Bias Trends</h4>
          <div class="h-64">
            {/* Add a chart component here to visualize biasMetrics.timeSeriesData */}
          </div>
        </div>
      </div>
    );
  };

  const renderCalibrationTab = () => {
    if (!calibrationStats) return null;

    return (
      <div class="space-y-6">
        <h3 class="text-lg font-semibold">Feedback Calibration</h3>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-medium mb-4">Calibration Overview</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Total Calibrations:</span>
                <span>{calibrationStats.totalCalibrations}</span>
              </div>
              <div class="flex justify-between">
                <span>Average Adjustment:</span>
                <span>{calibrationStats.averageAdjustment.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-medium mb-4">Bias Correction</h4>
            <div class="space-y-2">
              <div class="flex justify-between">
                <span>Human Bias:</span>
                <span>{calibrationStats.biasCorrection.human.toFixed(2)}</span>
              </div>
              <div class="flex justify-between">
                <span>LLM Bias:</span>
                <span>{calibrationStats.biasCorrection.llm.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <h4 class="font-medium mb-4">Confidence Distribution</h4>
            <div class="space-y-2">
              {Object.entries(calibrationStats.confidenceDistribution).map(
                ([level, ratio]) => (
                  <div key={level} class="flex justify-between">
                    <span class="capitalize">{level}:</span>
                    <span>{(ratio * 100).toFixed(1)}%</span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        <div class="bg-white rounded-lg shadow p-6">
          <h4 class="font-medium mb-4">Score Calibration Trends</h4>
          <div class="h-64">
            {/* Add a chart component here to visualize calibrationStats.timeSeriesData */}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div class="p-6">
      <div class="mb-6">
        <div class="border-b border-gray-200">
          <nav class="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('ab')}
              class={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'ab'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              A/B Testing
            </button>
            <button
              onClick={() => setActiveTab('bias')}
              class={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'bias'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Bias Detection
            </button>
            <button
              onClick={() => setActiveTab('calibration')}
              class={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'calibration'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Calibration
            </button>
          </nav>
        </div>
      </div>

      <div class="mt-6">
        {activeTab === 'ab' && renderABTestingTab()}
        {activeTab === 'bias' && renderBiasDetectionTab()}
        {activeTab === 'calibration' && renderCalibrationTab()}
      </div>
    </div>
  );
}
