import { MiddlewareHandler } from "$fresh/server.ts";
import { ErrorInterceptor } from "../services/error-interceptor.ts";

export const errorHandler: MiddlewareHandler = async (req, ctx) => {
  const requestId = crypto.randomUUID();
  const route = new URL(req.url).pathname;
  
  try {
    const resp = await ctx.next();
    // Check for error status codes
    if (resp.status >= 400) {
      const errorBody = await resp.clone().json().catch(() => ({}));
      throw new Error(errorBody.message || `HTTP ${resp.status}`);
    }
    return resp;
  } catch (error) {
    // Get user context if available
    const userId = await getUserId(req);
    
    // Intercept and analyze error
    await ErrorInterceptor.getInstance().handleError(error, {
      timestamp: new Date(),
      component: 'api',
      userId,
      route,
      requestId,
      severity: getSeverity(error, resp?.status),
      tags: ['api', route.split('/')[1], `status-${resp?.status || 500}`]
    });

    // Return appropriate error response
    return new Response(
      JSON.stringify({
        error: error.message,
        requestId
      }),
      {
        status: resp?.status || 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};

async function getUserId(req: Request): Promise<string | undefined> {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return undefined;
    
    // Extract user ID from auth token
    const token = authHeader.split(' ')[1];
    const payload = await verifyToken(token);
    return payload.userId;
  } catch {
    return undefined;
  }
}

function getSeverity(error: Error, status?: number): "low" | "medium" | "high" | "critical" {
  if (status) {
    if (status >= 500) return "critical";
    if (status >= 400) return "high";
    return "medium";
  }

  // Check error types
  if (error instanceof TypeError) return "high";
  if (error instanceof ReferenceError) return "high";
  if (error instanceof SyntaxError) return "critical";
  
  return "medium";
}

async function verifyToken(token: string): Promise<any> {
  // Implement your token verification logic here
  return { userId: 'unknown' };
}
