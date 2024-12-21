import { parse, stringify } from "npm:yaml@2.3.4";

export interface YamlValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  parsedYaml: any | null;
}

export interface YamlSchema {
  name: string;
  description: string;
  version: string;
  capabilities: string[];
  configuration: {
    language: string;
    response_format: string;
    max_tokens?: number;
    temperature?: number;
    confidence_threshold?: number;
    max_retries?: number;
    timeout_ms?: number;
    resource_limits?: {
      memory_mb: number;
      cpu_cores: number;
      storage_gb: number;
      network_bandwidth_mbps: number;
    };
    [key: string]: unknown;
  };
  security: {
    data_encryption: boolean;
    authentication_required: boolean;
    audit_logging: boolean;
    rate_limiting?: boolean;
    input_validation?: boolean;
    access_control?: {
      roles: string[];
      permissions: string[];
    };
    security_protocols?: string[];
    [key: string]: boolean | undefined | unknown;
  };
  integrations: {
    name: string;
    type: string;
    config: Record<string, unknown>;
    required: boolean;
  }[];
  models: {
    text?: string[];
    image?: string[];
    voice?: string[];
    [key: string]: string[] | undefined;
  };
  prompts: {
    system: string;
    user_input: string;
    examples?: Array<{
      user: string;
      assistant: string;
    }>;
  };
  error_handling?: {
    retry_strategy?: "exponential" | "linear" | "none";
    fallback_responses?: string[];
    error_messages?: Record<string, string>;
    max_retries?: number;
    timeout_ms?: number;
    error_reporting?: {
      enabled: boolean;
      level: "debug" | "info" | "warn" | "error";
      destinations: string[];
    };
  };
  performance?: {
    cache_enabled?: boolean;
    cache_ttl_seconds?: number;
    max_concurrent_requests?: number;
    memory_limit_mb?: number;
    cpu_limit_percentage?: number;
    scaling?: {
      min_instances: number;
      max_instances: number;
      target_cpu_utilization: number;
    };
  };
  autonomous?: {
    self_improvement: boolean;
    learning_enabled: boolean;
    feedback_collection: boolean;
    safety_protocols: string[];
    decision_threshold?: number;
    learning_config?: {
      learning_rate: number;
      batch_size: number;
      epochs: number;
      validation_split: number;
    };
    monitoring?: {
      metrics: string[];
      alert_thresholds: Record<string, number>;
      reporting_interval: number;
    };
    constraints?: {
      max_decisions_per_minute: number;
      max_resource_usage_percentage: number;
      max_learning_time_seconds: number;
    };
    meta_learning?: {
      prompt_optimization: boolean;
      strategy_adaptation: boolean;
      performance_tracking: boolean;
      optimization_metrics: string[];
      adaptation_thresholds: Record<string, number>;
    };
  };
  meta_prompting?: {
    enabled: boolean;
    strategies: {
      default_strategy: "iterative-refinement" | "zero-shot-decomposition" | "chain-of-thought" | "few-shot-learning";
      allowed_strategies: string[];
      custom_strategies?: Record<string, {
        name: string;
        description: string;
        steps: Array<{
          type: "generate" | "refine" | "evaluate" | "optimize";
          template: string;
          parameters?: Record<string, any>;
        }>;
      }>;
    };
    templates?: {
      system_templates: Record<string, string>;
      user_templates: Record<string, string>;
      evaluation_templates: Record<string, string>;
    };
    learning?: {
      store_successful_prompts: boolean;
      adapt_to_feedback: boolean;
      improvement_threshold: number;
    };
  };
  agent_communication?: {
    enabled: boolean;
    protocols: {
      synchronous: boolean;
      asynchronous: boolean;
      broadcast: boolean;
      peer_to_peer: boolean;
    };
    message_formats: {
      prompt_request: {
        required_fields: string[];
        optional_fields?: string[];
        validation_rules?: Record<string, string>;
      };
      prompt_response: {
        required_fields: string[];
        optional_fields?: string[];
        validation_rules?: Record<string, string>;
      };
    };
    routing: {
      default_route: string;
      fallback_routes?: string[];
      routing_rules?: Record<string, string>;
    };
    rate_limiting?: {
      max_requests_per_minute: number;
      max_tokens_per_request: number;
      cooldown_period_ms: number;
    };
  };
}

const SUPPORTED_LANGUAGES = ["en", "es", "fr", "de", "it", "pt", "ru", "zh", "ja", "ko"];
const SUPPORTED_RESPONSE_FORMATS = ["text", "json", "markdown", "html", "structured"];
const SUPPORTED_CAPABILITIES = [
  "text_generation",
  "image_generation",
  "voice_synthesis",
  "translation",
  "summarization",
  "question_answering",
  "code_generation",
  "sentiment_analysis",
  "meta_prompting",
  "autonomous_learning",
  "agent_communication"
];

const SUPPORTED_META_PROMPT_STRATEGIES = [
  "iterative-refinement",
  "zero-shot-decomposition",
  "chain-of-thought",
  "few-shot-learning"
];

const SUPPORTED_COMMUNICATION_PROTOCOLS = [
  "synchronous",
  "asynchronous",
  "broadcast",
  "peer_to_peer"
];

const MIN_DESCRIPTION_LENGTH = 20;
const MAX_DESCRIPTION_LENGTH = 500;
const MIN_PROMPT_LENGTH = 10;
const MAX_PROMPT_LENGTH = 2000;

export function validateYaml(yamlContent: string): YamlValidationResult {
  const result: YamlValidationResult = {
    isValid: false,
    errors: [],
    warnings: [],
    parsedYaml: null,
  };

  try {
    const parsed = parse(yamlContent);
    result.parsedYaml = parsed;

    // Required fields validation
    const requiredFields = [
      "name",
      "description",
      "version",
      "capabilities",
      "configuration",
      "security",
      "integrations",
      "models",
      "prompts",
    ];

    for (const field of requiredFields) {
      if (!parsed[field]) {
        result.errors.push(`Missing required field: ${field}`);
      }
    }

    // Name validation
    if (typeof parsed.name !== "string") {
      result.errors.push("name must be a string");
    } else if (parsed.name.length < 3 || parsed.name.length > 50) {
      result.errors.push("name length must be between 3 and 50 characters");
    }

    // Description validation
    if (typeof parsed.description !== "string") {
      result.errors.push("description must be a string");
    } else {
      if (parsed.description.length < MIN_DESCRIPTION_LENGTH) {
        result.errors.push(`description must be at least ${MIN_DESCRIPTION_LENGTH} characters`);
      }
      if (parsed.description.length > MAX_DESCRIPTION_LENGTH) {
        result.errors.push(`description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`);
      }
    }

    // Version validation
    if (typeof parsed.version !== "string") {
      result.errors.push("version must be a string");
    } else if (!/^\d+\.\d+\.\d+$/.test(parsed.version)) {
      result.errors.push("version must follow semantic versioning (e.g., 1.0.0)");
    }

    // Capabilities validation
    if (!Array.isArray(parsed.capabilities)) {
      result.errors.push("capabilities must be an array");
    } else {
      parsed.capabilities.forEach((capability: string) => {
        if (!SUPPORTED_CAPABILITIES.includes(capability)) {
          result.warnings.push(`Unsupported capability: ${capability}`);
        }
      });
    }

    // Configuration validation
    if (parsed.configuration) {
      if (!SUPPORTED_LANGUAGES.includes(parsed.configuration.language)) {
        result.errors.push(`Unsupported language: ${parsed.configuration.language}`);
      }
      if (!SUPPORTED_RESPONSE_FORMATS.includes(parsed.configuration.response_format)) {
        result.errors.push(`Unsupported response format: ${parsed.configuration.response_format}`);
      }
      if (parsed.configuration.max_tokens && typeof parsed.configuration.max_tokens !== "number") {
        result.errors.push("max_tokens must be a number");
      }
      if (parsed.configuration.temperature && 
          (typeof parsed.configuration.temperature !== "number" || 
           parsed.configuration.temperature < 0 || 
           parsed.configuration.temperature > 1)) {
        result.errors.push("temperature must be a number between 0 and 1");
      }

      // Resource limits validation
      if (parsed.configuration.resource_limits) {
        const limits = parsed.configuration.resource_limits;
        if (typeof limits.memory_mb !== "number" || limits.memory_mb <= 0) {
          result.errors.push("resource_limits.memory_mb must be a positive number");
        }
        if (typeof limits.cpu_cores !== "number" || limits.cpu_cores <= 0) {
          result.errors.push("resource_limits.cpu_cores must be a positive number");
        }
        if (typeof limits.storage_gb !== "number" || limits.storage_gb <= 0) {
          result.errors.push("resource_limits.storage_gb must be a positive number");
        }
        if (typeof limits.network_bandwidth_mbps !== "number" || limits.network_bandwidth_mbps <= 0) {
          result.errors.push("resource_limits.network_bandwidth_mbps must be a positive number");
        }
      }
    }

    // Security validation
    if (parsed.security) {
      const requiredSecurityFields = ["data_encryption", "authentication_required", "audit_logging"];
      requiredSecurityFields.forEach(field => {
        if (typeof parsed.security[field] !== "boolean") {
          result.errors.push(`security.${field} must be a boolean`);
        }
      });

      if (parsed.security.security_protocols) {
        if (!Array.isArray(parsed.security.security_protocols)) {
          result.errors.push("security.security_protocols must be an array");
        } else {
          parsed.security.security_protocols.forEach((protocol: string) => {
            if (!SUPPORTED_SECURITY_PROTOCOLS.includes(protocol)) {
              result.warnings.push(`Unsupported security protocol: ${protocol}`);
            }
          });
        }
      }

      if (parsed.security.access_control) {
        if (!Array.isArray(parsed.security.access_control.roles)) {
          result.errors.push("security.access_control.roles must be an array");
        }
        if (!Array.isArray(parsed.security.access_control.permissions)) {
          result.errors.push("security.access_control.permissions must be an array");
        }
      }
    }

    // Integrations validation
    if (Array.isArray(parsed.integrations)) {
      parsed.integrations.forEach((integration: any, index: number) => {
        if (!integration.name || typeof integration.name !== "string") {
          result.errors.push(`Integration at index ${index} must have a name string`);
        }
        if (!integration.type || typeof integration.type !== "string") {
          result.errors.push(`Integration at index ${index} must have a type string`);
        }
        if (!integration.config || typeof integration.config !== "object") {
          result.errors.push(`Integration at index ${index} must have a config object`);
        }
        if (typeof integration.required !== "boolean") {
          result.errors.push(`Integration at index ${index} must specify if it is required (boolean)`);
        }
      });
    } else {
      result.errors.push("integrations must be an array");
    }

    // Models validation
    if (parsed.models) {
      const validModelTypes = ["text", "image", "voice"];
      Object.keys(parsed.models).forEach(modelType => {
        if (!validModelTypes.includes(modelType)) {
          result.warnings.push(`Unsupported model type: ${modelType}`);
        }
        if (!Array.isArray(parsed.models[modelType])) {
          result.errors.push(`models.${modelType} must be an array`);
        }
      });
    }

    // Prompts validation
    if (parsed.prompts) {
      if (typeof parsed.prompts.system !== "string") {
        result.errors.push("prompts.system must be a string");
      } else if (parsed.prompts.system.length < MIN_PROMPT_LENGTH || 
                 parsed.prompts.system.length > MAX_PROMPT_LENGTH) {
        result.errors.push(`prompts.system length must be between ${MIN_PROMPT_LENGTH} and ${MAX_PROMPT_LENGTH}`);
      }

      if (typeof parsed.prompts.user_input !== "string") {
        result.errors.push("prompts.user_input must be a string");
      }

      if (parsed.prompts.examples) {
        if (!Array.isArray(parsed.prompts.examples)) {
          result.errors.push("prompts.examples must be an array");
        } else {
          parsed.prompts.examples.forEach((example: any, index: number) => {
            if (!example.user || !example.assistant) {
              result.errors.push(`Invalid example at index ${index}: must have user and assistant fields`);
            }
          });
        }
      }
    }

    // Error handling validation
    if (parsed.error_handling) {
      if (parsed.error_handling.error_reporting) {
        const reporting = parsed.error_handling.error_reporting;
        if (typeof reporting.enabled !== "boolean") {
          result.errors.push("error_handling.error_reporting.enabled must be a boolean");
        }
        if (!["debug", "info", "warn", "error"].includes(reporting.level)) {
          result.errors.push("error_handling.error_reporting.level must be one of: debug, info, warn, error");
        }
        if (!Array.isArray(reporting.destinations)) {
          result.errors.push("error_handling.error_reporting.destinations must be an array");
        }
      }
    }

    // Performance validation
    if (parsed.performance) {
      if (parsed.performance.scaling) {
        const scaling = parsed.performance.scaling;
        if (typeof scaling.min_instances !== "number" || scaling.min_instances < 1) {
          result.errors.push("performance.scaling.min_instances must be a positive number");
        }
        if (typeof scaling.max_instances !== "number" || scaling.max_instances < scaling.min_instances) {
          result.errors.push("performance.scaling.max_instances must be greater than min_instances");
        }
        if (typeof scaling.target_cpu_utilization !== "number" || 
            scaling.target_cpu_utilization <= 0 || 
            scaling.target_cpu_utilization > 100) {
          result.errors.push("performance.scaling.target_cpu_utilization must be between 0 and 100");
        }
      }
    }

    // Autonomous validation
    if (parsed.autonomous) {
      const requiredAutonomousFields = ["self_improvement", "learning_enabled", "feedback_collection", "safety_protocols"];
      requiredAutonomousFields.forEach(field => {
        if (field === "safety_protocols") {
          if (!Array.isArray(parsed.autonomous[field])) {
            result.errors.push("autonomous.safety_protocols must be an array");
          }
        } else if (typeof parsed.autonomous[field] !== "boolean") {
          result.errors.push(`autonomous.${field} must be a boolean`);
        }
      });

      if (parsed.autonomous.decision_threshold !== undefined) {
        if (typeof parsed.autonomous.decision_threshold !== "number" || 
            parsed.autonomous.decision_threshold < 0 || 
            parsed.autonomous.decision_threshold > 1) {
          result.errors.push("autonomous.decision_threshold must be a number between 0 and 1");
        }
      }

      // Learning configuration validation
      if (parsed.autonomous.learning_config) {
        const config = parsed.autonomous.learning_config;
        if (typeof config.learning_rate !== "number" || config.learning_rate <= 0 || config.learning_rate > 1) {
          result.errors.push("autonomous.learning_config.learning_rate must be a number between 0 and 1");
        }
        if (typeof config.batch_size !== "number" || config.batch_size < 1) {
          result.errors.push("autonomous.learning_config.batch_size must be a positive number");
        }
        if (typeof config.epochs !== "number" || config.epochs < 1) {
          result.errors.push("autonomous.learning_config.epochs must be a positive number");
        }
        if (typeof config.validation_split !== "number" || 
            config.validation_split <= 0 || 
            config.validation_split >= 1) {
          result.errors.push("autonomous.learning_config.validation_split must be a number between 0 and 1");
        }
      }

      // Monitoring validation
      if (parsed.autonomous.monitoring) {
        const monitoring = parsed.autonomous.monitoring;
        if (!Array.isArray(monitoring.metrics)) {
          result.errors.push("autonomous.monitoring.metrics must be an array");
        } else {
          monitoring.metrics.forEach((metric: string) => {
            if (!SUPPORTED_MONITORING_METRICS.includes(metric)) {
              result.warnings.push(`Unsupported monitoring metric: ${metric}`);
            }
          });
        }

        if (typeof monitoring.reporting_interval !== "number" || monitoring.reporting_interval <= 0) {
          result.errors.push("autonomous.monitoring.reporting_interval must be a positive number");
        }

        if (typeof monitoring.alert_thresholds !== "object") {
          result.errors.push("autonomous.monitoring.alert_thresholds must be an object");
        }
      }

      // Constraints validation
      if (parsed.autonomous.constraints) {
        const constraints = parsed.autonomous.constraints;
        if (typeof constraints.max_decisions_per_minute !== "number" || constraints.max_decisions_per_minute <= 0) {
          result.errors.push("autonomous.constraints.max_decisions_per_minute must be a positive number");
        }
        if (typeof constraints.max_resource_usage_percentage !== "number" || 
            constraints.max_resource_usage_percentage <= 0 || 
            constraints.max_resource_usage_percentage > 100) {
          result.errors.push("autonomous.constraints.max_resource_usage_percentage must be between 0 and 100");
        }
        if (typeof constraints.max_learning_time_seconds !== "number" || constraints.max_learning_time_seconds <= 0) {
          result.errors.push("autonomous.constraints.max_learning_time_seconds must be a positive number");
        }
      }

      // Meta-learning validation
      if (parsed.autonomous.meta_learning) {
        const metaLearning = parsed.autonomous.meta_learning;
        if (typeof metaLearning.prompt_optimization !== "boolean") {
          result.errors.push("autonomous.meta_learning.prompt_optimization must be a boolean");
        }
        if (typeof metaLearning.strategy_adaptation !== "boolean") {
          result.errors.push("autonomous.meta_learning.strategy_adaptation must be a boolean");
        }
        if (typeof metaLearning.performance_tracking !== "boolean") {
          result.errors.push("autonomous.meta_learning.performance_tracking must be a boolean");
        }
        if (!Array.isArray(metaLearning.optimization_metrics)) {
          result.errors.push("autonomous.meta_learning.optimization_metrics must be an array");
        }
        if (typeof metaLearning.adaptation_thresholds !== "object") {
          result.errors.push("autonomous.meta_learning.adaptation_thresholds must be an object");
        }
      }
    }

    // Meta-prompting validation
    if (parsed.meta_prompting) {
      if (typeof parsed.meta_prompting.enabled !== "boolean") {
        result.errors.push("meta_prompting.enabled must be a boolean");
      }

      if (parsed.meta_prompting.strategies) {
        if (!SUPPORTED_META_PROMPT_STRATEGIES.includes(parsed.meta_prompting.strategies.default_strategy)) {
          result.errors.push(`meta_prompting.strategies.default_strategy must be one of: ${SUPPORTED_META_PROMPT_STRATEGIES.join(', ')}`);
        }

        if (parsed.meta_prompting.strategies.custom_strategies) {
          for (const [name, strategy] of Object.entries(parsed.meta_prompting.strategies.custom_strategies)) {
            if (!strategy.steps || !Array.isArray(strategy.steps)) {
              result.errors.push(`Custom strategy ${name} must have an array of steps`);
            }
          }
        }
      }
    }

    // Agent communication validation
    if (parsed.agent_communication) {
      if (typeof parsed.agent_communication.enabled !== "boolean") {
        result.errors.push("agent_communication.enabled must be a boolean");
      }

      if (parsed.agent_communication.protocols) {
        for (const protocol of Object.keys(parsed.agent_communication.protocols)) {
          if (!SUPPORTED_COMMUNICATION_PROTOCOLS.includes(protocol)) {
            result.errors.push(`Unsupported communication protocol: ${protocol}`);
          }
        }
      }

      if (parsed.agent_communication.rate_limiting) {
        const rateLimiting = parsed.agent_communication.rate_limiting;
        if (rateLimiting.max_requests_per_minute <= 0) {
          result.errors.push("max_requests_per_minute must be positive");
        }
        if (rateLimiting.max_tokens_per_request <= 0) {
          result.errors.push("max_tokens_per_request must be positive");
        }
      }
    }

    // Set validation result
    result.isValid = result.errors.length === 0;
  } catch (error) {
    result.errors.push(`Invalid YAML syntax: ${error.message}`);
    result.isValid = false;
  }

  return result;
}

export function formatYaml(yamlContent: string): string {
  try {
    const parsed = parse(yamlContent);
    return stringify(parsed, { indent: 2 });
  } catch (error) {
    throw new Error(`Invalid YAML syntax: ${error.message}`);
  }
}
