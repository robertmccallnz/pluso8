import { Handlers } from "$fresh/server.ts";

export interface State {
  isAuthenticated: boolean;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  title?: string;
  data?: string;
}

// Helper function to check if user is authenticated
export function isAuthenticated(state: State): boolean {
  return state.isAuthenticated === true;
}

// Helper function to get user data
export function getUser(state: State) {
  return state.user;
}

// Helper function to check if route requires authentication
export function requiresAuth(pathname: string): boolean {
  return pathname.startsWith("/dashboard") || 
         pathname.startsWith("/profile") || 
         pathname.startsWith("/settings");
}

export const handler: Handlers = {
  async GET(req, ctx) {
    // Get session from cookie
    const sessionId = await ctx.cookies.get("session");
    
    if (!sessionId) {
      return new Response(null, {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // TODO: Validate session and get user data
    // This is where you'd typically check your database
    
    return new Response(
      JSON.stringify({
        isAuthenticated: true,
        user: {
          id: "1",
          name: "John Doe",
          email: "john@example.com",
        },
      }),
      {
        headers: { "content-type": "application/json" },
      }
    );
  },
};

// Middleware to check if user is authenticated
export async function authMiddleware(req: Request, ctx: any) {
  const sessionId = await ctx.cookies.get("session");
  
  if (!sessionId && req.url.includes("/dashboard")) {
    return new Response("Unauthorized", { status: 401 });
  }
  
  return await ctx.next();
}
