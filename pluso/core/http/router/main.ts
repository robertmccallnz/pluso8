// core/api/router.ts

import { Router } from "https://deno.land/x/oak/mod.ts";
import { validateRequest } from "../middleware/validation.ts";
import { rateLimit } from "../middleware/rate-limit.ts";
import { authenticate } from "../middleware/auth.ts";
import { handleError } from "../middleware/error.ts";
import { logger } from "../middleware/logger.ts";

export interface APIRoute {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  middleware?: Array<(ctx: any, next: () => Promise<void>) => Promise<void>>;
  handler: (ctx: any) => Promise<void>;
  validation?: Record<string, unknown>;
  rateLimit?: {
    points: number;
    duration: number;
  };
}

export class APIRouter {
  private router: Router;
  private routes: Map<string, APIRoute>;

  constructor() {
    this.router = new Router();
    this.routes = new Map();
    this.setupMiddleware();
  }

  private setupMiddleware() {
    // Global middleware
    this.router.use(logger);
    this.router.use(handleError);
  }

  public register(route: APIRoute) {
    const { path, method, middleware = [], handler, validation, rateLimit: rateLimitConfig } = route;
    const routeKey = `${method}:${path}`;

    // Store route configuration
    this.routes.set(routeKey, route);

    // Build middleware chain
    const middlewareChain = [
      authenticate, // Authentication check
      ...middleware // Route-specific middleware
    ];

    // Add validation if specified
    if (validation) {
      middlewareChain.push((ctx: any, next: () => Promise<void>) => 
        validateRequest(ctx, next, validation)
      );
    }

    // Add rate limiting if specified
    if (rateLimitConfig) {
      middlewareChain.push((ctx: any, next: () => Promise<void>) =>
        rateLimit(ctx, next, rateLimitConfig)
      );
    }

    // Register route with middleware chain
    this.router[method.toLowerCase()](path, ...middlewareChain, handler);
  }

  public getRouter() {
    return this.router;
  }

  public listRoutes() {
    return Array.from(this.routes.values());
  }
}