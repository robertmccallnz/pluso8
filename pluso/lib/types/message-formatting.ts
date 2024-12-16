// lib/types/message-formatting.ts

export interface MessageFormatting {
  // Basic markdown elements
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  
  // List types
  listType?: 'bullet' | 'numbered' | 'none';
  listLevel?: number;
  
  // Paragraph styling
  paragraphSpacing?: 'normal' | 'compact' | 'wide';
  
  // Visual emphasis
  emphasis?: {
    type: 'info' | 'warning' | 'success' | 'error';
    level: 'subtle' | 'moderate' | 'strong';
  };
  
  // Custom colors (using our brand colors)
  colorAccent?: 'blue' | 'cyan' | 'orange' | 'none';
}

export interface FormattedMessage {
  content: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: number;
  formatting: MessageFormatting;
}
