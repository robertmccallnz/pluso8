import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface ModelSelectorProps {
  task: string;
  onModelSelect: (model: any) => void;
}

export default function ModelSelector({ task, onModelSelect }: ModelSelectorProps) {
  const selectedModel = useSignal(null);
  const loading = useSignal(false);
  const error = useSignal("");

  useEffect(() => {
    const fetchBestModel = async () => {
      loading.value = true;
      error.value = "";
      
      try {
        const params = new URLSearchParams({
          task,
          accuracy: "0.95",
          latency: "2000",
          contextSize: "16000",
          maxCost: "0.01"
        });

        const response = await fetch(`/api/ml/models?${params}`);
        if (!response.ok) throw new Error("Failed to fetch model");
        
        const model = await response.json();
        selectedModel.value = model;
        onModelSelect(model);
      } catch (e) {
        error.value = e.message;
      } finally {
        loading.value = false;
      }
    };

    if (task) {
      fetchBestModel();
    }
  }, [task]);

  if (loading.value) {
    return <div class="loading">Selecting best model...</div>;
  }

  if (error.value) {
    return <div class="error">{error.value}</div>;
  }

  if (!selectedModel.value) {
    return <div>No model selected</div>;
  }

  return (
    <div class="model-selector">
      <h3>Selected Model</h3>
      <div class="model-info">
        <p>Name: {selectedModel.value.name}</p>
        <p>Provider: {selectedModel.value.provider}</p>
        <p>Context Size: {selectedModel.value.contextSize}</p>
        <div class="metrics">
          <h4>Performance Metrics</h4>
          <ul>
            <li>Accuracy: {selectedModel.value.performance?.accuracy || "N/A"}</li>
            <li>Latency: {selectedModel.value.performance?.latency || "N/A"}ms</li>
            <li>Cost: ${selectedModel.value.performance?.costPer1kTokens || "N/A"}/1k tokens</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
