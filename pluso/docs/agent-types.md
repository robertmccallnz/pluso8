# Agent Types Documentation

This document describes the type definitions used for configuring and managing agents in the Pluso system.

## Types

### ToolType

A string union type that defines the possible types of tools an agent can use:

```typescript
type ToolType = 'function' | 'retrieval' | 'action';
```

## Interfaces

### AgentTool

Defines the structure of a tool that can be used by an agent.

```typescript
interface AgentTool {
  name: string;          // Name of the tool
  type: ToolType;        // Type of the tool (function, retrieval, or action)
  description: string;   // Description of what the tool does
  icon?: string;         // Optional icon for the tool
  config?: {             // Optional configuration parameters
    [key: string]: {
      type: string;      // Type of the configuration parameter
      description: string; // Description of the parameter
      required?: boolean;  // Whether the parameter is required
      default?: any;      // Default value for the parameter
    };
  };
  metadata?: {           // Optional metadata
    [key: string]: any;
  };
}
```

### AgentConfig

Defines the configuration structure for an agent.

```typescript
interface AgentConfig {
  id: string;           // Unique identifier for the agent
  name: string;         // Name of the agent
  description?: string; // Optional description
  tools: AgentTool[];  // Array of tools available to the agent
  models: {            // AI models configuration
    chat?: string[];      // Chat models
    completion?: string[]; // Completion models
    embedding?: string[]; // Embedding models
  };
  metadata?: {         // Optional metadata
    [key: string]: any;
  };
  systemPrompt?: string; // Optional system prompt
  created: string;     // Creation timestamp
  updated: string;     // Last update timestamp
  owner: string;       // Owner identifier
  visibility: 'private' | 'public' | 'team'; // Visibility setting
  version: string;     // Version identifier
  status: 'draft' | 'published' | 'archived'; // Current status
}
```

## Usage Example

Here's an example of how to create an agent configuration:

```typescript
const agentConfig: AgentConfig = {
  id: "example-agent",
  name: "Example Agent",
  description: "An example agent configuration",
  tools: [
    {
      name: "search",
      type: "function",
      description: "Searches for information",
      config: {
        query: {
          type: "string",
          description: "Search query",
          required: true
        }
      }
    }
  ],
  models: {
    chat: ["gpt-4"],
    embedding: ["text-embedding-ada-002"]
  },
  created: new Date().toISOString(),
  updated: new Date().toISOString(),
  owner: "user-123",
  visibility: "private",
  version: "1.0.0",
  status: "draft"
};
```
