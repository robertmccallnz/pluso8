import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { signal } from "@preact/signals";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

interface RateLimitConfig {
  windowMs: number;    // Time window in milliseconds
  maxRequests: number; // Maximum number of requests allowed in the window
}

// Rate limit configurations for different agent endpoints
const rateLimits: Record<string, RateLimitConfig> = {
  "/api/agents/chat": {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 60       // 60 requests per minute
  },
  "/api/agents/*/chat": {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 30       // 30 requests per minute per agent
  },
  "/api/agents/*/completions": {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 30       // 30 requests per minute per agent
  },
  "/api/agents/*/stream": {
    windowMs: 60 * 1000,  // 1 minute
    maxRequests: 10       // 10 streaming requests per minute per agent
  }
};

// Store rate limit data in memory using signals
const rateLimitStore = signal<Map<string, RateLimitEntry>>(new Map());

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  const store = rateLimitStore.value;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) {
      store.delete(key);
    }
  }
  rateLimitStore.value = new Map(store);
}, 60000); // Clean up every minute

function getRateLimitConfig(path: string): RateLimitConfig | null {
  // Check for exact match first
  if (rateLimits[path]) {
    return rateLimits[path];
  }
  
  // Check for wildcard matches
  for (const [pattern, config] of Object.entries(rateLimits)) {
    if (pattern.includes("*")) {
      const regex = new RegExp(pattern.replace("*", "[^/]+"));
      if (regex.test(path)) {
        return config;
      }
    }
  }
  
  return null;
}

function extractAgentId(path: string): string | null {
  const match = path.match(/\/api\/agents\/([^/]+)/);
  return match ? match[1] : null;
}

export async function rateLimiterMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext
) {
  const url = new URL(req.url);
  const path = url.pathname;
  const config = getRateLimitConfig(path);

  // If no rate limit config exists for this path, proceed
  if (!config) {
    return await ctx.next();
  }

  // Extract agent ID from path if available
  const agentId = extractAgentId(path);
  
  // Create a unique key based on agent ID and path pattern
  const key = agentId 
    ? `agent:${agentId}:${path.replace(agentId, '*')}`
    : path;

  const now = Date.now();
  const store = rateLimitStore.value;
  
  let entry = store.get(key);
  
  if (!entry || entry.resetAt <= now) {
    // Create new entry
    entry = {
      count: 1,
      resetAt: now + config.windowMs
    };
  } else {
    // Increment existing entry
    entry.count++;
  }
  
  store.set(key, entry);
  rateLimitStore.value = new Map(store);

  // Set rate limit headers
  const headers = new Headers({
    "X-RateLimit-Limit": config.maxRequests.toString(),
    "X-RateLimit-Remaining": Math.max(0, config.maxRequests - entry.count).toString(),
    "X-RateLimit-Reset": entry.resetAt.toString()
  });

  // Check if rate limit exceeded
  if (entry.count > config.maxRequests) {
    return new Response("Rate limit exceeded for this agent", {
      status: 429,
      headers: {
        ...Object.fromEntries(headers.entries()),
        "Retry-After": Math.ceil((entry.resetAt - now) / 1000).toString()
      }
    });
  }

  // Add headers to the response
  const response = await ctx.next();
  const newResponse = new Response(response.body, response);
  headers.forEach((value, key) => {
    newResponse.headers.set(key, value);
  });
  
  return newResponse;
}
