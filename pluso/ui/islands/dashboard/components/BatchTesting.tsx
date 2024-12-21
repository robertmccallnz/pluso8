import { JSX } from "preact";
import { useState } from "preact/hooks";
import { ModelConfig } from "./types";

interface BatchTestResult {
  prompt: string;
  response: string;
  tokens: number;
  cost: number;
  latency: number;
}

interface BatchTestingProps {
  model: string;
  config: ModelConfig;
  costPerToken: number;
}

export function BatchTesting({ model, config, costPerToken }: BatchTestingProps): JSX.Element {
  const [prompts, setPrompts] = useState<string[]>([""]);
  const [results, setResults] = useState<BatchTestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [averageLatency, setAverageLatency] = useState(0);

  const addPrompt = () => {
    setPrompts([...prompts, ""]);
  };

  const removePrompt = (index: number) => {
    const newPrompts = prompts.filter((_, i) => i !== index);
    setPrompts(newPrompts);
  };

  const updatePrompt = (index: number, value: string) => {
    const newPrompts = [...prompts];
    newPrompts[index] = value;
    setPrompts(newPrompts);
  };

  const runBatchTest = async () => {
    setIsRunning(true);
    const testResults: BatchTestResult[] = [];
    let totalLatency = 0;
    let totalCost = 0;

    for (const prompt of prompts) {
      const startTime = Date.now();
      try {
        // Replace with actual API call
        const response = await fetch("/api/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model, config, prompt }),
        });

        const data = await response.json();
        const latency = Date.now() - startTime;
        const tokens = data.usage.total_tokens;
        const cost = tokens * costPerToken;

        testResults.push({
          prompt,
          response: data.response,
          tokens,
          cost,
          latency,
        });

        totalLatency += latency;
        totalCost += cost;
      } catch (error) {
        testResults.push({
          prompt,
          response: "Error: " + error.message,
          tokens: 0,
          cost: 0,
          latency: Date.now() - startTime,
        });
      }
    }

    setResults(testResults);
    setTotalCost(totalCost);
    setAverageLatency(totalLatency / prompts.length);
    setIsRunning(false);
  };

  return (
    <div class="space-y-6">
      <div class="space-y-4">
        <h3 class="text-lg font-medium">Batch Testing</h3>
        
        {prompts.map((prompt, index) => (
          <div key={index} class="flex gap-2">
            <textarea
              value={prompt}
              onInput={(e) => updatePrompt(index, (e.target as HTMLTextAreaElement).value)}
              placeholder="Enter test prompt..."
              class="flex-1 p-2 border rounded-md"
              rows={2}
            />
            <button
              onClick={() => removePrompt(index)}
              class="px-3 py-1 text-red-600 hover:text-red-700"
              disabled={prompts.length === 1}
            >
              Remove
            </button>
          </div>
        ))}

        <div class="flex justify-between">
          <button
            onClick={addPrompt}
            class="text-blue-600 hover:text-blue-700"
          >
            Add Prompt
          </button>
          <button
            onClick={runBatchTest}
            disabled={isRunning || prompts.some(p => !p.trim())}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {isRunning ? "Running..." : "Run Tests"}
          </button>
        </div>
      </div>

      {results.length > 0 && (
        <div class="space-y-4">
          <div class="flex justify-between text-sm text-gray-600">
            <span>Total Cost: ${totalCost.toFixed(4)}</span>
            <span>Average Latency: {averageLatency.toFixed(0)}ms</span>
          </div>

          <div class="space-y-4">
            {results.map((result, index) => (
              <div key={index} class="border rounded-md p-4 space-y-2">
                <div class="font-medium">Test {index + 1}</div>
                <div class="text-sm text-gray-600">Prompt: {result.prompt}</div>
                <div class="text-sm">Response: {result.response}</div>
                <div class="text-sm text-gray-600">
                  Tokens: {result.tokens} | Cost: ${result.cost.toFixed(4)} | 
                  Latency: {result.latency}ms
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
