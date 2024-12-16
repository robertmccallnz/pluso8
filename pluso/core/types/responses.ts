// core/types/responses.ts

export interface AgentResponse {
  content: string;
  metadata?: {
    formatOptions?: {
      formatCode?: boolean;
      formatLinks?: boolean;
      formatMaori?: boolean;
      formatLists?: boolean;
      addTimestamp?: boolean;
    };
    sourceLinks?: string[];
    confidence?: number;
    processingTime?: number;
    usedContext?: boolean;
  };
}

export interface FormattedAgentResponse extends AgentResponse {
  formattedContent: string;
}
