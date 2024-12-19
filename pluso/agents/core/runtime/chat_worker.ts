// core/workers/chat-agent-worker.ts

import { LLMProvider } from "../models/providers/base.ts";
import { ChatMessage, AgentState } from "../types/agent.ts";

interface AgentTask {
  type: 'generate' | 'analyze' | 'embed' | 'moderate';
  messages: ChatMessage[];
  context?: string;
  state?: AgentState;
}

interface AgentWorkerConfig {
  provider: LLMProvider;
  maxTokens: number;
  temperature: number;
  maxConcurrentTasks: number;
}

export class ChatAgentWorker {
  private provider: LLMProvider;
  private taskQueue: Map<string, AgentTask>;
  private activeTasks: Set<string>;
  private messageCache: Map<string, ChatMessage[]>;
  
  constructor(private config: AgentWorkerConfig) {
    this.provider = config.provider;
    this.taskQueue = new Map();
    this.activeTasks = new Set();
    this.messageCache = new Map();
    
    // Set up message handler
    self.onmessage = async (event) => {
      await this.handleMessage(event.data);
    };
  }

  private async handleMessage(message: any): Promise<void> {
    switch (message.type) {
      case 'generate':
        await this.handleGeneration(message);
        break;
      case 'analyze':
        await this.handleAnalysis(message);
        break;
      case 'embed':
        await this.handleEmbedding(message);
        break;
      case 'moderate':
        await this.handleModeration(message);
        break;
    }
  }

  private async handleGeneration(message: { id: string; messages: ChatMessage[]; state?: AgentState }): Promise<void> {
    try {
      // Check if we can process more tasks
      if (this.activeTasks.size >= this.config.maxConcurrentTasks) {
        this.taskQueue.set(message.id, {
          type: 'generate',
          messages: message.messages,
          state: message.state
        });
        return;
      }

      this.activeTasks.add(message.id);

      // Prepare the context and messages
      const context = this.prepareContext(message.messages, message.state);
      
      // Stream the response
      const stream = await this.provider.generateStream({
        messages: message.messages,
        maxTokens: this.config.maxTokens,
        temperature: this.config.temperature,
        context
      });

      // Process the stream
      for await (const chunk of stream) {
        self.postMessage({
          type: 'chunk',
          id: message.id,
          data: chunk
        });
      }

      // Cache the conversation
      this.updateMessageCache(message.id, message.messages);

      self.postMessage({
        type: 'complete',
        id: message.id
      });

    } catch (error) {
      self.postMessage({
        type: 'error',
        id: message.id,
        error: error.message
      });
    } finally {
      this.activeTasks.delete(message.id);
      this.processNextTask();
    }
  }

  private async handleAnalysis(message: { id: string; messages: ChatMessage[] }): Promise<void> {
    try {
      const analysis = await this.provider.analyze(message.messages);
      
      self.postMessage({
        type: 'analysis',
        id: message.id,
        data: analysis
      });
    } catch (error) {
      self.postMessage({
        type: 'error',
        id: message.id,
        error: error.message
      });
    }
  }

  private async handleEmbedding(message: { id: string; text: string }): Promise<void> {
    try {
      const embedding = await this.provider.embed(message.text);
      
      self.postMessage({
        type: 'embedding',
        id: message.id,
        data: embedding
      });
    } catch (error) {
      self.postMessage({
        type: 'error',
        id: message.id,
        error: error.message
      });
    }
  }

  private async handleModeration(message: { id: string; text: string }): Promise<void> {
    try {
      const result = await this.provider.moderate(message.text);
      
      self.postMessage({
        type: 'moderation',
        id: message.id,
        data: result
      });
    } catch (error) {
      self.postMessage({
        type: 'error',
        id: message.id,
        error: error.message
      });
    }
  }

  private prepareContext(messages: ChatMessage[], state?: AgentState): string {
    let context = '';
    
    // Add relevant conversation history
    if (messages.length > 0) {
      context += 'Previous conversation:\n';
      messages.slice(-5).forEach(msg => {
        context += `${msg.role}: ${msg.content}\n`;
      });
    }

    // Add agent state if available
    if (state) {
      context += '\nAgent state:\n';
      context += JSON.stringify(state, null, 2);
    }

    return context;
  }

  private updateMessageCache(id: string, messages: ChatMessage[]): void {
    // Keep only last N messages to manage memory
    const recentMessages = messages.slice(-20);
    this.messageCache.set(id, recentMessages);
    
    // Clean up old cache entries
    if (this.messageCache.size > 100) {
      const oldestKey = this.messageCache.keys().next().value;
      this.messageCache.delete(oldestKey);
    }
  }

  private processNextTask(): void {
    if (this.taskQueue.size === 0 || this.activeTasks.size >= this.config.maxConcurrentTasks) {
      return;
    }

    const [nextId, nextTask] = this.taskQueue.entries().next().value;
    this.taskQueue.delete(nextId);

    // Process the next task
    switch (nextTask.type) {
      case 'generate':
        this.handleGeneration({ 
          id: nextId, 
          messages: nextTask.messages, 
          state: nextTask.state 
        });
        break;
      // Handle other task types...
    }
  }
}