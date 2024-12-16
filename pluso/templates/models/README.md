# PluSO Model Templates

This directory contains templates and configurations for AI models used in PluSO agents.

## Model Categories

1. **Chat Models**
   - General conversation
   - Customer support
   - Task-specific dialogue

2. **Analysis Models**
   - Document analysis
   - Code review
   - Data processing

3. **Domain-Specific Models**
   - Legal analysis
   - Scientific research
   - Financial analysis

4. **Specialized Models**
   - Code generation
   - Multi-modal processing
   - Language translation

## Directory Structure

```
models/
├── configs/                    # Model configurations
│   ├── anthropic/             # Anthropic models
│   ├── openai/                # OpenAI models
│   └── custom/                # Custom fine-tuned models
├── fine-tuning/               # Fine-tuning templates
│   ├── datasets/              # Dataset templates
│   ├── configs/               # Training configurations
│   └── evaluation/            # Evaluation metrics
├── selection/                 # Model selection tools
│   ├── benchmarks/            # Performance benchmarks
│   └── comparison/            # Model comparison tools
└── deployment/                # Deployment configurations
    ├── prod/                  # Production settings
    └── staging/               # Staging settings
```

## Model Selection Guide

Choose the appropriate model based on your agent's requirements:

1. Task Complexity
2. Response Speed
3. Cost Efficiency
4. Accuracy Requirements
5. Context Window Size

See `selection/guide.md` for detailed selection criteria.
