import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { signal } from "@preact/signals";

interface RateLimitConfig {
  windowMs: number;
  maxRequests: number;
}

const rateLimits: Record<string, RateLimitConfig> = {
  "/api/agents/chat": { windowMs: 60 * 1000, maxRequests: 60 },
  "/api/agents/*/chat": { windowMs: 60 * 1000, maxRequests: 30 },
  "/api/agents/*/completions": { windowMs: 60 * 1000, maxRequests: 30 },
  "/api/agents/*/stream": { windowMs: 60 * 1000, maxRequests: 10 }
};

const rateLimitStore = signal<Map<string, { count: number; resetAt: number }>>(new Map());

setInterval(() => {
  const now = Date.now();
  const store = rateLimitStore.value;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
  rateLimitStore.value = new Map(store);
}, 60000);

export function rateLimiterMiddleware(req: Request, ctx: MiddlewareHandlerContext) {
  const ip = req.headers.get("x-forwarded-for") || "unknown";
  const path = new URL(req.url).pathname;
  const config = rateLimits[path] || { windowMs: 15 * 60 * 1000, maxRequests: 100 };
  const now = Date.now();

  const store = rateLimitStore.value;
  if (!store.has(ip) || now > store.get(ip)!.resetAt) {
    store.set(ip, { count: 0, resetAt: now + config.windowMs });
  }

  const entry = store.get(ip)!;
  entry.count++;

  if (entry.count > config.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000);
    return new Response("Too many requests", {
      status: 429,
      headers: {
        "Retry-After": String(retryAfter),
      },
    });
  }

  rateLimitStore.value = new Map(store);
  const response = ctx.next();
  const headers = new Headers(response.headers);
  headers.set("X-RateLimit-Limit", String(config.maxRequests));
  headers.set("X-RateLimit-Remaining", String(Math.max(0, config.maxRequests - entry.count)));
  headers.set("X-RateLimit-Reset", String(Math.ceil(entry.resetAt / 1000)));

  return new Response(response.body, {
    status: response.status,
    headers,
  });
}
