// core/api/handlers.ts

import { Context } from "https://deno.land/x/oak/mod.ts";
import { WorkerPool } from "../workers/worker-pool.ts";
import { ChatAgentWorker } from "../workers/chat-agent-worker.ts";
import { z } from "https://deno.land/x/zod/mod.ts";

// Validation schemas
export const messageSchema = z.object({
  content: z.string().min(1).max(32000),
  role: z.enum(["user", "assistant", "system"]),
  metadata: z.record(z.unknown()).optional()
});

export const chatRequestSchema = z.object({
  messages: z.array(messageSchema),
  agentId: z.string().uuid(),
  context: z.string().optional(),
  streaming: z.boolean().optional()
});

export class APIHandlers {
  private workerPool: WorkerPool;
  
  constructor() {
    this.workerPool = new WorkerPool({
      maxWorkers: 4,
      taskTimeout: 30000
    });
  }

  // Chat completion handler
  public async handleChatCompletion(ctx: Context) {
    const { messages, agentId, streaming = true } = await ctx.request.body().value;

    if (streaming) {
      // Set up SSE
      ctx.response.headers.set("Content-Type", "text/event-stream");
      ctx.response.headers.set("Cache-Control", "no-cache");
      ctx.response.headers.set("Connection", "keep-alive");

      const stream = new TransformStream();
      const writer = stream.writable.getWriter();
      const encoder = new TextEncoder();

      // Add task to worker pool
      await this.workerPool.addTask({
        id: crypto.randomUUID(),
        type: "agentProcessing",
        payload: {
          type: "generate",
          messages,
          agentId
        },
        priority: 1,
        onChunk: async (chunk: string) => {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        },
        onComplete: async () => {
          await writer.write(encoder.encode("data: [DONE]\n\n"));
          await writer.close();
        },
        onError: async (error: Error) => {
          await writer.write(encoder.encode(`data: ${JSON.stringify({ error: error.message })}\n\n`));
          await writer.close();
        }
      });

      ctx.response.body = stream.readable;
    } else {
      // Non-streaming response
      const response = await new Promise((resolve, reject) => {
        this.workerPool.addTask({
          id: crypto.randomUUID(),
          type: "agentProcessing",
          payload: {
            type: "generate",
            messages,
            agentId
          },
          priority: 1,
          onComplete: resolve,
          onError: reject
        });
      });

      ctx.response.body = response;
    }
  }

  // Agent management handlers
  public async handleAgentCreation(ctx: Context) {
    const data = await ctx.request.body().value;
    // Implement agent creation logic
    ctx.response.body = { success: true, agentId: crypto.randomUUID() };
  }

  public async handleAgentUpdate(ctx: Context) {
    const { agentId } = ctx.params;
    const data = await ctx.request.body().value;
    // Implement agent update logic
    ctx.response.body = { success: true };
  }

  public async handleAgentDeletion(ctx: Context) {
    const { agentId } = ctx.params;
    // Implement agent deletion logic
    ctx.response.body = { success: true };
  }
}

// Export route configuration
export const routes: APIRoute[] = [
  {
    path: "/api/chat",
    method: "POST",
    validation: chatRequestSchema,
    rateLimit: {
      points: 60,
      duration: 60
    },
    handler: (ctx) => new APIHandlers().handleChatCompletion(ctx)
  },
  {
    path: "/api/agents",
    method: "POST",
    handler: (ctx) => new APIHandlers().handleAgentCreation(ctx)
  },
  {
    path: "/api/agents/:agentId",
    method: "PUT",
    handler: (ctx) => new APIHandlers().handleAgentUpdate(ctx)
  },
  {
    path: "/api/agents/:agentId",
    method: "DELETE",
    handler: (ctx) => new APIHandlers().handleAgentDeletion(ctx)
  }
];