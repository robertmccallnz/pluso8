interface ModelLimits {
  maxTemperature: number;
  maxTokens: number;
  contextWindow: number;
  supportedFeatures: string[];
}

export const modelLimits: Record<string, ModelLimits> = {
  "GPT-4 Turbo": {
    maxTemperature: 2.0,
    maxTokens: 4096,
    contextWindow: 128000,
    supportedFeatures: ["function_calling", "vision", "json_mode"],
  },
  "Claude 3 Opus": {
    maxTemperature: 1.0,
    maxTokens: 4096,
    contextWindow: 200000,
    supportedFeatures: ["vision", "code", "analysis"],
  },
  "Gemini Pro Vision": {
    maxTemperature: 1.0,
    maxTokens: 2048,
    contextWindow: 32000,
    supportedFeatures: ["vision", "code"],
  },
  "Llama 3 Vision": {
    maxTemperature: 2.0,
    maxTokens: 4096,
    contextWindow: 128000,
    supportedFeatures: ["vision"],
  },
};

export interface ValidationError {
  field: string;
  message: string;
}

export function validateModelConfig(
  model: string,
  config: {
    temperature: number;
    maxTokens: number;
    topP: number;
    frequencyPenalty: number;
    presencePenalty: number;
  }
): ValidationError[] {
  const errors: ValidationError[] = [];
  const limits = modelLimits[model];

  if (!limits) {
    return [{ field: "model", message: "Unknown model" }];
  }

  if (config.temperature > limits.maxTemperature) {
    errors.push({
      field: "temperature",
      message: `Temperature must be <= ${limits.maxTemperature} for ${model}`,
    });
  }

  if (config.maxTokens > limits.maxTokens) {
    errors.push({
      field: "maxTokens",
      message: `Max tokens must be <= ${limits.maxTokens} for ${model}`,
    });
  }

  if (config.topP < 0 || config.topP > 1) {
    errors.push({
      field: "topP",
      message: "Top P must be between 0 and 1",
    });
  }

  if (config.frequencyPenalty < -2 || config.frequencyPenalty > 2) {
    errors.push({
      field: "frequencyPenalty",
      message: "Frequency penalty must be between -2 and 2",
    });
  }

  if (config.presencePenalty < -2 || config.presencePenalty > 2) {
    errors.push({
      field: "presencePenalty",
      message: "Presence penalty must be between -2 and 2",
    });
  }

  return errors;
}
