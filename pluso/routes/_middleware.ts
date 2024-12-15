import { FreshContext } from "$fresh/server.ts";

interface State {
  data: string;
}

export async function handler(
  req: Request,
  ctx: FreshContext<State>,
) {
  const url = new URL(req.url);
  console.log(`🌐 [Middleware] Request to ${url.pathname}`);
  
  // Check if it's a WebSocket upgrade request
  const upgrade = req.headers.get("upgrade");
  console.log(`🔌 [Middleware] Upgrade header:`, upgrade);
  console.log(`📝 [Middleware] Headers:`, Object.fromEntries(req.headers));

  if (upgrade?.toLowerCase() === "websocket") {
    console.log(`🎯 [Middleware] WebSocket request to ${url.pathname}`);
    // Allow WebSocket upgrade for chat endpoint
    if (url.pathname === "/api/agents/ws-chat") {
      console.log(`✅ [Middleware] Allowing WebSocket upgrade`);
      return await ctx.next();
    }
    console.log(`❌ [Middleware] Blocked WebSocket for ${url.pathname}`);
    return new Response("WebSocket not allowed for this endpoint", { status: 400 });
  }

  // For non-WebSocket requests, proceed normally
  console.log(`➡️ [Middleware] Proceeding with regular request`);
  return await ctx.next();
}
