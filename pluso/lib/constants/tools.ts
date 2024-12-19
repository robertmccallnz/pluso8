import { AgentTool, ToolType } from "../../agents/types/agent.ts";

export const TOOL_TYPE_LABELS: Record<ToolType, string> = {
  'function': 'Function Tools',
  'retrieval': 'Retrieval Tools',
  'action': 'Action Tools'
};

export const AVAILABLE_TOOLS: AgentTool[] = [
  {
    name: "web-search",
    description: "Search the internet for up-to-date information",
    type: "function",
    config: {
      function: {
        parameters: {
          apiKey: {
            type: "string",
            description: "Google Custom Search API Key",
            required: true,
            secret: true
          },
          searchEngineId: {
            type: "string",
            description: "Google Custom Search Engine ID",
            required: true
          }
        },
        returns: {
          results: {
            type: "array",
            items: {
              type: "object",
              properties: {
                title: { type: "string" },
                link: { type: "string" },
                snippet: { type: "string" }
              }
            }
          }
        }
      }
    },
    enabled: false
  },
  {
    name: "document-qa",
    description: "Answer questions based on uploaded documents",
    type: "retrieval",
    config: {
      retrieval: {
        sources: ["documents"],
        maxResults: 5
      }
    },
    enabled: false
  },
  {
    name: "email",
    description: "Send and analyze emails",
    type: "action",
    config: {
      action: {
        permissions: ["send_email"],
        timeout: 30000
      }
    },
    enabled: false
  }
];
