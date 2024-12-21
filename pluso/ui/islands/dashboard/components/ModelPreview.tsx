import { JSX } from "preact";
import { useState } from "preact/hooks";

interface ModelPreviewProps {
  model: string;
  config: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
    systemPrompt: string;
  };
}

export function ModelPreview({ model, config }: ModelPreviewProps): JSX.Element {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const testPrompts = [
    "Write a short story about a robot learning to paint",
    "Explain quantum computing in simple terms",
    "Create a Python function to sort a list",
    "Analyze the sentiment of this text: 'I love sunny days!'",
    "Generate a creative tagline for a coffee shop",
  ];

  const handleTest = async (testPrompt?: string) => {
    const inputPrompt = testPrompt || prompt;
    if (!inputPrompt) {
      setError("Please enter a prompt");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/models/preview", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          config,
          prompt: inputPrompt,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate preview");
      }

      const data = await response.json();
      setResponse(data.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div class="space-y-6">
      {/* Test Prompts */}
      <div>
        <h3 class="text-sm font-medium text-gray-700 mb-3">Try with Sample Prompts</h3>
        <div class="flex flex-wrap gap-2">
          {testPrompts.map((testPrompt) => (
            <button
              key={testPrompt}
              onClick={() => handleTest(testPrompt)}
              class="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
            >
              {testPrompt.length > 30 ? testPrompt.slice(0, 30) + "..." : testPrompt}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Prompt Input */}
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Custom Test Prompt
        </label>
        <div class="flex space-x-2">
          <input
            type="text"
            value={prompt}
            onInput={(e) => setPrompt((e.target as HTMLInputElement).value)}
            class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your test prompt..."
          />
          <button
            onClick={() => handleTest()}
            disabled={isLoading}
            class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? "Testing..." : "Test"}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div class="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Response Display */}
      {response && (
        <div class="border rounded-md p-4">
          <h3 class="text-sm font-medium text-gray-700 mb-2">Model Response:</h3>
          <div class="prose max-w-none">
            <pre class="whitespace-pre-wrap text-sm">{response}</pre>
          </div>
        </div>
      )}

      {/* Model Configuration Display */}
      <div class="border rounded-md p-4 bg-gray-50">
        <h3 class="text-sm font-medium text-gray-700 mb-2">Current Configuration:</h3>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div>Temperature: {config.temperature}</div>
          <div>Max Tokens: {config.maxTokens}</div>
          <div>Top P: {config.topP}</div>
          <div>Frequency Penalty: {config.frequencyPenalty}</div>
          <div>Presence Penalty: {config.presencePenalty}</div>
        </div>
      </div>
    </div>
  );
}
