// pluso/middleware/auth.ts
import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { supabase } from "../utils/supabase.ts";

export interface State {
  user?: {
    id: string;
    email?: string;
    role?: string;
  };
}

export async function authMiddleware(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
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
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Set user in state
  ctx.state.user = {
    id: user.id,
    email: user.email,
    role: user.user_metadata.role
  };

  return await ctx.next();
}