// pluso/middleware/auth.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { supabaseAdmin, supabaseAnon, isInTrialPeriod } from "../core/database/supabase/client.ts";

export interface State {
  user?: {
    id: string;
    email?: string;
    role?: string;
    isTrial?: boolean;
  };
}

// List of paths that don't require authentication
const PUBLIC_PATHS = [
  '/api/models',  // Allow viewing models without auth
  '/signup',      // Sign up page
  '/login',       // Login page
  '/api/auth',    // Auth endpoints
  '/models',      // Models page
  '/metrics',     // Metrics page
];

// List of paths that allow trial access
const TRIAL_ALLOWED_PATHS = [
  '/api/playground/chat',
  '/api/metrics',
  // Add other trial-allowed paths
];

export async function authMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Allow public paths
  if (PUBLIC_PATHS.some(p => path.startsWith(p) || (p.endsWith('/*') && path.startsWith(p.slice(0, -2))))) {
    return await ctx.next();
  }

  // Accept test token in test environment
  const authHeader = req.headers.get("Authorization");
  if (Deno.env.get("DENO_ENV") === "test" && authHeader === "Bearer test-token") {
    ctx.state.user = { id: "test-user", role: "user" };
    return await ctx.next();
  }

  // Check for API key first (for service-to-service communication)
  const apiKey = req.headers.get("x-api-key");
  if (apiKey && apiKey === Deno.env.get("API_KEY")) {
    ctx.state.user = {
      id: "service",
      role: "service"
    };
    return await ctx.next();
  }

  // Check for Supabase session token
  if (!authHeader?.startsWith("Bearer ")) {
    // Create anonymous session for trial if no auth
    const { data: { user }, error } = await supabaseAnon.auth.signUp({
      email: `trial_${crypto.randomUUID()}@temporary.user`,
      password: crypto.randomUUID(),
    });

    if (error || !user) {
      return new Response("Could not create trial session", { status: 401 });
    }

    ctx.state.user = {
      id: user.id,
      role: 'trial',
      isTrial: true
    };

    // Only allow trial access to specific paths
    if (!TRIAL_ALLOWED_PATHS.some(p => path.startsWith(p))) {
      return new Response("Please sign up to access this feature", { status: 403 });
    }

    return await ctx.next();
  }

  // Handle authenticated users
  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Check if user is in trial period
  const isTrialUser = await isInTrialPeriod(user.id);

  // Set user in state
  ctx.state.user = {
    id: user.id,
    email: user.email,
    role: user.user_metadata.role || (isTrialUser ? 'trial' : 'user'),
    isTrial: isTrialUser
  };

  // If trial user, only allow access to trial paths
  if (isTrialUser && !TRIAL_ALLOWED_PATHS.some(p => path.startsWith(p))) {
    return new Response("Please sign up to access this feature", { status: 403 });
  }

  return await ctx.next();
}