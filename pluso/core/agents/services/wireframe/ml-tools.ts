import { MLModelType, MLModelConfig, AgentWireframe } from "./types.ts";

export const ML_TOOLS = {
  // Natural Language Processing
  NLP: {
    frameworks: [
      {
        name: "Hugging Face Transformers",
        capabilities: [
          "text_classification",
          "named_entity_recognition",
          "question_answering",
          "summarization",
          "translation"
        ],
        models: [
          "GPT-2",
          "BERT",
          "RoBERTa",
          "T5",
          "BART"
        ]
      },
      {
        name: "spaCy",
        capabilities: [
          "tokenization",
          "pos_tagging",
          "dependency_parsing",
          "entity_recognition"
        ]
      }
    ]
  },

  // Computer Vision
  VISION: {
    frameworks: [
      {
        name: "TensorFlow",
        capabilities: [
          "image_classification",
          "object_detection",
          "image_segmentation",
          "face_recognition"
        ],
        models: [
          "EfficientNet",
          "ResNet",
          "YOLO",
          "Mask R-CNN"
        ]
      },
      {
        name: "PyTorch Vision",
        capabilities: [
          "transfer_learning",
          "feature_extraction",
          "image_generation"
        ]
      }
    ]
  },

  // Recommendation Systems
  RECOMMENDATION: {
    frameworks: [
      {
        name: "Surprise",
        capabilities: [
          "collaborative_filtering",
          "matrix_factorization",
          "neighborhood_methods"
        ]
      },
      {
        name: "LightFM",
        capabilities: [
          "hybrid_recommendations",
          "content_based_filtering",
          "implicit_feedback"
        ]
      }
    ]
  },

  // Time Series Analysis
  TIME_SERIES: {
    frameworks: [
      {
        name: "Prophet",
        capabilities: [
          "forecasting",
          "trend_analysis",
          "seasonality_detection"
        ]
      },
      {
        name: "statsmodels",
        capabilities: [
          "arima",
          "var",
          "state_space_models"
        ]
      }
    ]
  },

  // AutoML
  AUTOML: {
    frameworks: [
      {
        name: "AutoKeras",
        capabilities: [
          "neural_architecture_search",
          "hyperparameter_optimization",
          "model_selection"
        ]
      },
      {
        name: "H2O AutoML",
        capabilities: [
          "automated_feature_engineering",
          "model_stacking",
          "ensemble_learning"
        ]
      }
    ]
  }
};

export class MLToolSelector {
  static selectToolsForAgent(wireframe: AgentWireframe): MLModelConfig[] {
    const configs: MLModelConfig[] = [];

    for (const capability of wireframe.mlCapabilities) {
      const config = this.generateMLConfig(capability.type, wireframe.domain);
      if (config) {
        configs.push(config);
      }
    }

    return configs;
  }

  private static generateMLConfig(type: MLModelType, domain: string): MLModelConfig | null {
    switch (type) {
      case MLModelType.NLP:
        return {
          type: MLModelType.NLP,
          framework: "huggingface",
          modelName: "GPT-2",
          parameters: {
            maxLength: 512,
            temperature: 0.7,
            topK: 50
          },
          trainingConfig: {
            epochs: 3,
            batchSize: 16,
            optimizer: "AdamW",
            learningRate: 2e-5
          }
        };

      case MLModelType.COMPUTER_VISION:
        return {
          type: MLModelType.COMPUTER_VISION,
          framework: "pytorch",
          modelName: "ResNet50",
          parameters: {
            pretrained: true,
            finetuning: true
          },
          trainingConfig: {
            epochs: 10,
            batchSize: 32,
            optimizer: "Adam",
            learningRate: 1e-4
          }
        };

      case MLModelType.RECOMMENDATION:
        return {
          type: MLModelType.RECOMMENDATION,
          framework: "tensorflow",
          modelName: "DeepFM",
          parameters: {
            embedDim: 128,
            hiddenUnits: [64, 32]
          },
          trainingConfig: {
            epochs: 5,
            batchSize: 256,
            optimizer: "Adam",
            learningRate: 1e-3
          }
        };

      default:
        return null;
    }
  }
}
