import { camelCase } from "../deps.ts";

export interface FormattedMessage {
  id: string;
  text: string;
  type: 'user' | 'assistant' | 'system';
  timestamp: number;
  metadata?: Record<string, unknown>;
}

export function formatChatMessage(text: string, type: FormattedMessage['type'], metadata?: Record<string, unknown>): FormattedMessage {
  try {
    // Generate a camelCase version of the text for the ID
    const baseId = text.trim() ? camelCase(text.slice(0, 50)) : 'emptyMessage';
    const id = `${baseId}_${Date.now()}`;
    const timestamp = Date.now();
    
    return {
      id,
      text,
      type,
      timestamp,
      ...(metadata && { metadata }),
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to format message: ${error.message}`);
    }
    throw new Error('Failed to format message: Unknown error');
  }
}

function generateMessageId(type: string, timestamp: number): string {
  return camelCase(`${type}-${timestamp}-${Math.random().toString(36).slice(2, 7)}`);
}

function formatMessageText(text: string, type: FormattedMessage['type']): string {
  switch (type) {
    case 'system':
      return text.trim();
    case 'assistant':
      return text.trim().replace(/\n{3,}/g, '\n\n');
    case 'user':
      return text.trim();
    default:
      return text;
  }
}

export function serializeMessage(message: FormattedMessage): string {
  try {
    return JSON.stringify(message);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to serialize message: ${error.message}`);
    }
    throw new Error('Failed to serialize message: Unknown error');
  }
}

export function parseMessage(data: string): FormattedMessage {
  try {
    const parsed = JSON.parse(data);
    if (!isValidMessage(parsed)) {
      throw new Error('Invalid message format');
    }
    return parsed;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to parse message: ${error.message}`);
    }
    throw new Error('Failed to parse message: Unknown error');
  }
}

function isValidMessage(message: unknown): message is FormattedMessage {
  if (typeof message !== 'object' || message === null) {
    return false;
  }

  const msg = message as Partial<FormattedMessage>;
  return (
    typeof msg.id === 'string' &&
    typeof msg.text === 'string' &&
    ['user', 'assistant', 'system'].includes(msg.type as string) &&
    typeof msg.timestamp === 'number'
  );
}
