export interface PromptStrategy {
  name: string;
  description: string;
  steps: PromptStep[];
  metadata?: {
    complexity: number;
    targetModels?: string[];
    recommendedTasks?: string[];
  };
}

export interface PromptStep {
  type: "generate" | "refine" | "evaluate" | "optimize";
  template: string;
  parameters?: Record<string, any>;
  metadata?: {
    importance: number;
    estimatedTokens: number;
  };
}

export const META_PROMPTING_STRATEGIES: Record<string, PromptStrategy> = {
  "iterative-refinement": {
    name: "iterative-refinement",
    description: "Gradually improves prompt through multiple iterations",
    steps: [
      {
        type: "generate",
        template: `Given the task: {task}

Generate an initial prompt that:
1. Clearly states the objective
2. Provides necessary context
3. Specifies expected output format
4. Includes any relevant constraints

Your prompt should be clear, specific, and actionable.`,
        metadata: {
          importance: 1,
          estimatedTokens: 150
        }
      },
      {
        type: "evaluate",
        template: `Evaluate this prompt for the task:
{task}

Prompt to evaluate:
{prompt}

Evaluate based on:
1. Clarity: Is it unambiguous and easy to understand?
2. Completeness: Does it include all necessary information?
3. Specificity: Is it detailed enough for the task?
4. Constraints: Are all requirements clearly stated?
5. Output format: Is the expected response format clear?

Provide a score (1-10) for each criterion and specific feedback for improvement.`,
        metadata: {
          importance: 0.8,
          estimatedTokens: 200
        }
      },
      {
        type: "refine",
        template: `Refine the following prompt based on the evaluation:

Original Prompt:
{prompt}

Evaluation:
{evaluation}

Task: {task}

Improve the prompt by:
1. Addressing the evaluation feedback
2. Enhancing clarity and specificity
3. Optimizing structure and flow
4. Adding any missing elements

Provide the refined prompt.`,
        metadata: {
          importance: 0.9,
          estimatedTokens: 250
        }
      }
    ],
    metadata: {
      complexity: 0.8,
      targetModels: ["gpt-4", "gpt-3.5-turbo"],
      recommendedTasks: ["complex-reasoning", "analysis", "creative"]
    }
  },

  "zero-shot-decomposition": {
    name: "zero-shot-decomposition",
    description: "Breaks down complex tasks without examples",
    steps: [
      {
        type: "generate",
        template: `Decompose the following task into clear subtasks:
Task: {task}

For each subtask:
1. Define its specific objective
2. Identify required inputs
3. Specify expected outputs
4. Note any dependencies on other subtasks

Present the decomposition in a clear, sequential format.`,
        metadata: {
          importance: 1,
          estimatedTokens: 200
        }
      },
      {
        type: "generate",
        template: `For each subtask in the decomposition:
{subtasks}

Generate a specific prompt that:
1. Focuses on the subtask's objective
2. Includes necessary context from parent task
3. Specifies input/output requirements
4. Maintains consistency with other subtasks

Create prompts that work together cohesively.`,
        metadata: {
          importance: 0.9,
          estimatedTokens: 300
        }
      },
      {
        type: "optimize",
        template: `Optimize the subtask prompts into a unified prompt:

Subtask Prompts:
{prompts}

Task: {task}

Create a unified prompt that:
1. Maintains the logical flow of subtasks
2. Eliminates redundancy
3. Ensures clear transitions
4. Preserves all requirements

The final prompt should be cohesive and efficient.`,
        metadata: {
          importance: 0.8,
          estimatedTokens: 250
        }
      }
    ],
    metadata: {
      complexity: 0.9,
      targetModels: ["gpt-4"],
      recommendedTasks: ["complex-planning", "system-design", "multi-step-reasoning"]
    }
  },

  "chain-of-thought": {
    name: "chain-of-thought",
    description: "Promotes explicit step-by-step reasoning",
    steps: [
      {
        type: "generate",
        template: `Create a chain-of-thought prompt for:
Task: {task}

The prompt should:
1. Break down the reasoning process
2. Make implicit steps explicit
3. Include verification steps
4. Encourage showing work

Structure the prompt to guide through each step.`,
        metadata: {
          importance: 1,
          estimatedTokens: 200
        }
      },
      {
        type: "refine",
        template: `Enhance the chain-of-thought prompt:

Original Prompt:
{prompt}

Improve by:
1. Adding explicit reasoning markers
2. Including self-verification steps
3. Encouraging alternative approaches
4. Adding meta-cognitive elements

The prompt should guide comprehensive reasoning.`,
        metadata: {
          importance: 0.9,
          estimatedTokens: 250
        }
      }
    ],
    metadata: {
      complexity: 0.7,
      targetModels: ["gpt-4", "gpt-3.5-turbo"],
      recommendedTasks: ["problem-solving", "mathematical-reasoning", "logical-analysis"]
    }
  },

  "few-shot-learning": {
    name: "few-shot-learning",
    description: "Uses examples to guide the model's responses",
    steps: [
      {
        type: "generate",
        template: `Generate exemplar pairs for:
Task: {task}

For each example:
1. Create a diverse input scenario
2. Provide ideal output
3. Highlight key patterns
4. Include edge cases

Generate 2-3 high-quality examples.`,
        metadata: {
          importance: 1,
          estimatedTokens: 300
        }
      },
      {
        type: "optimize",
        template: `Create a few-shot prompt using the examples:

Examples:
{examples}

Task: {task}

Structure the prompt to:
1. Introduce the task clearly
2. Present examples effectively
3. Highlight pattern matching
4. Specify new input format

Make the example-following pattern clear.`,
        metadata: {
          importance: 0.9,
          estimatedTokens: 400
        }
      }
    ],
    metadata: {
      complexity: 0.6,
      targetModels: ["gpt-4", "gpt-3.5-turbo"],
      recommendedTasks: ["classification", "formatting", "pattern-matching"]
    }
  }
};
