import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const app = new Application();
const router = new Router();

// Configuration
const PORT = 8000;

// CORS middleware
app.use(oakCors());

// Health check endpoint
router.get("/health", (ctx) => {
  ctx.response.body = { 
    status: "ok", 
    service: "PluSO Server",
    timestamp: new Date().toISOString() 
  };
});

// Agent list endpoint
router.get("/api/agents", (ctx) => {
  ctx.response.body = {
    agents: [
      {
        id: "maia",
        name: "Maia",
        type: "general",
        status: "active"
      },
      {
        id: "petunia",
        name: "Petunia",
        type: "eco",
        status: "active"
      },
      {
        id: "legal",
        name: "Legal",
        type: "law",
        status: "active"
      }
    ]
  };
});

// Maia endpoints
router.post("/api/maia/chat", async (ctx) => {
  const body = await ctx.request.body().value;
  ctx.response.body = {
    success: true,
    message: "Maia chat endpoint",
    // Add Maia chat implementation here
  };
});

// Petunia endpoints
router.post("/api/petunia/chat", async (ctx) => {
  const body = await ctx.request.body().value;
  ctx.response.body = {
    success: true,
    message: "Petunia chat endpoint",
    // Add Petunia chat implementation here
  };
});

router.post("/api/petunia/analyze", async (ctx) => {
  const body = await ctx.request.body().value;
  ctx.response.body = {
    success: true,
    message: "Petunia environmental analysis endpoint",
    // Add environmental analysis implementation here
  };
});

// Legal endpoints
router.post("/api/legal/chat", async (ctx) => {
  const body = await ctx.request.body().value;
  ctx.response.body = {
    success: true,
    message: "Legal chat endpoint",
    // Add Legal chat implementation here
  };
});

router.post("/api/legal/review", async (ctx) => {
  const body = await ctx.request.body().value;
  ctx.response.body = {
    success: true,
    message: "Legal document review endpoint",
    // Add legal document review implementation here
  };
});

// Shared agent configuration endpoint
router.get("/api/agent/:id/config", (ctx) => {
  const agentId = ctx.params.id;
  ctx.response.body = {
    success: true,
    config: {
      id: agentId,
      modelConfig: {
        temperature: 0.7,
        topP: 0.9,
        maxTokens: 2048
      },
      // Add other agent-specific configurations
    }
  };
});

// Use router middleware
app.use(router.routes());
app.use(router.allowedMethods());

// Global error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.error(`Error: ${err.message}`);
    ctx.response.status = err.status || 500;
    ctx.response.body = {
      success: false,
      message: err.message
    };
  }
});

// Start server
console.log(`🚀 PluSO server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });