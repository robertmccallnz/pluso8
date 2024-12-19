import { MiddlewareHandlerContext } from "$fresh/server.ts";
import { verifyToken } from "../core/database/supabase/client.ts";

interface State {
  data: string;
  title: string;
  isAuthenticated: boolean;
  user: any;
}

// Public routes that don't require authentication
const publicRoutes = ['/login', '/signup', '/api/auth/login', '/api/auth/signup', '/_frsh', '/styles.css', '/favicon.ico'];

export async function handler(
  req: Request,
  ctx: MiddlewareHandlerContext<State>
) {
  const url = new URL(req.url);
  const cookies = req.headers.get('cookie');
  console.log('Middleware - Request URL:', url.pathname);
  console.log('Middleware - Cookies:', cookies);

  // Parse session from cookies
  const sessionMatch = cookies?.match(/session=([^;]+)/);
  const sessionToken = sessionMatch ? sessionMatch[1] : null;
  console.log('Middleware - Session token exists:', !!sessionToken);

  // Verify session token
  let isValidSession = false;
  let sessionError = null;

  if (sessionToken) {
    try {
      const { user, error } = await verifyToken(sessionToken);
      if (error) {
        // Only log errors for non-public routes since we expect token validation
        // to fail during login/signup
        if (!publicRoutes.some(route => url.pathname.startsWith(route))) {
          console.error('Middleware - Session validation error:', error);
        }
        sessionError = error;
      } else {
        isValidSession = !!user;
        if (isValidSession) {
          console.log('Middleware - Session validated successfully for user:', user?.email);
        }
      }
    } catch (error) {
      console.error('Middleware - Session validation exception:', error);
      sessionError = error;
    }
  }

  // Set authentication state
  ctx.state.isAuthenticated = isValidSession;
  if (isValidSession) {
    const { user } = await verifyToken(sessionToken!);
    ctx.state.user = user;
  }

  // Handle public routes and redirects
  if (publicRoutes.some(route => url.pathname.startsWith(route))) {
    // If user is authenticated and trying to access login/signup pages, redirect to dashboard
    if (isValidSession && (url.pathname === '/login' || url.pathname === '/signup')) {
      console.log('Middleware - Authenticated user trying to access login/signup, redirecting to dashboard');
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard" },
      });
    }
    // Allow access to other public routes
    return await ctx.next();
  } else if (!isValidSession) {
    // Redirect to login for protected routes when not authenticated
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/login'
      }
    });
  }

  // Continue with the request for authenticated users accessing protected routes
  return await ctx.next();
}
