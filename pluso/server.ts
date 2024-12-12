// /Users/robertmccall/pluso8/server.ts
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const app = new Application();
const router = new Router();

// Configuration
const PORT = 8000;
const MAIA_SERVER_URL = "http://localhost:8001"; // Maia's dedicated server

app.use(oakCors());

// Middleware to proxy requests to Maia's server
const proxyToMaia = async (ctx: any) => {
  if (ctx.request.url.pathname.startsWith("/api/maia")) {
    const response = await fetch(`${MAIA_SERVER_URL}${ctx.request.url.pathname.replace('/api/maia', '')}`, {
      method: ctx.request.method,
      headers: ctx.request.headers,
      body: ctx.request.method !== "GET" ? await ctx.request.body().value : undefined
    });
    
    ctx.response.status = response.status;
    ctx.response.body = await response.json();
    return;
  }
};

// Global health check
router.get("/health", (ctx) => {
  ctx.response.body = { 
    status: "ok", 
    service: "PluSO Root Server",
    timestamp: new Date().toISOString() 
  };
});

// Main API routes
router.get("/api/agents", (ctx) => {
  ctx.response.body = {
    agents: [
      {
        id: "maia",
        name: "Maia",
        endpoint: "/api/maia",
        status: "active"
      }
      // Add other agents here
    ]
  };
});

// Use middleware and router
app.use(proxyToMaia);
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

console.log(`🚀 Root server running on http://localhost:${PORT}`);
await app.listen({ port: PORT });