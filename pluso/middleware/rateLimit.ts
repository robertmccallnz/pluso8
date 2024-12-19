import { MiddlewareHandlerContext } from "$fresh/server.ts";

interface RateLimitOptions {
  windowMs: number;
  max: number;
}

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

export function rateLimit(options: RateLimitOptions = { windowMs: 15 * 60 * 1000, max: 100 }) {
  return async function rateLimitMiddleware(
    req: Request,
    ctx: MiddlewareHandlerContext
  ) {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const now = Date.now();

    // Initialize or reset if window has passed
    if (!store[ip] || now > store[ip].resetTime) {
      store[ip] = {
        count: 0,
        resetTime: now + options.windowMs,
      };
    }

    // Increment request count
    store[ip].count++;

    // Check if over limit
    if (store[ip].count > options.max) {
      return new Response("Too many requests", {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil((store[ip].resetTime - now) / 1000)),
        },
      });
    }

    // Add rate limit headers
    const response = await ctx.next();
    const headers = new Headers(response.headers);
    headers.set("X-RateLimit-Limit", String(options.max));
    headers.set("X-RateLimit-Remaining", String(Math.max(0, options.max - store[ip].count)));
    headers.set("X-RateLimit-Reset", String(Math.ceil(store[ip].resetTime / 1000)));

    return new Response(response.body, {
      status: response.status,
      headers,
    });
  };
}
